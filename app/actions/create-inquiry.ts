'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues, InquiryCreatedTemplate, InquiryManagerNotificationTemplate } from '@/shared/components';
import { sendEmail } from '@/shared/lib';
import { logger } from '@/shared/lib/logger';
import { InquiryStatus } from '@prisma/client';
import { resolveInquiryRoutes } from '@/shared/lib/resolve-inquiry-routes';
import { cookies } from 'next/headers';
import React from 'react';

const log = logger.child({ module: 'create-inquiry' });

function buildInquiryComment(address: string, comment?: string): string {
  const safeComment = comment?.trim();
  const raw = safeComment ? `Адрес: ${address}\n\nКомментарий: ${safeComment}` : `Адрес: ${address}`;
  return raw.slice(0, 1000);
}

export async function createInquiry(data: CheckoutFormValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }

    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    if (!userCart) {
      throw new Error('User cart not found');
    }

    if (userCart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const tenantId = userCart.user?.tenantId ?? userCart.items[0]?.productItem.product.tenantId;

    if (!tenantId) {
      throw new Error('Tenant ID not found');
    }

    // Build routing items with fulfillmentTenantId
    const routingItems = userCart.items.map((item) => ({
      productId: item.productItem.product.id,
      categoryId: item.productItem.product.categoryId,
      fulfillmentTenantId: item.productItem.product.fulfillmentTenantId ?? item.productItem.product.tenantId,
    }));

    // Resolve multi-route: groups by fulfillmentTenantId
    const routes = await resolveInquiryRoutes(routingItems);

    // Create inquiry with routes snapshot
    const inquiry = await prisma.inquiry.create({
      data: {
        token: cartToken,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        comment: buildInquiryComment(data.address, data.comment),
        status: InquiryStatus.NEW,
        // Set primary manager to first route's manager (for backward compat)
        managerId: routes[0]?.managerId ?? null,
        routeModeSnapshot: routes[0]?.managerMode ?? 'UNASSIGNED',
        routeCoveredCategoryIds: routes[0]?.coveredCategoryIds ?? [],
        routeMissingCategoryIds: routes[0]?.missingCategoryIds ?? [],
        routesSnapshot: routes.map((route) => ({
          tenantId: route.tenantId,
          managerId: route.managerId,
          managerMode: route.managerMode,
          coveredCategoryIds: route.coveredCategoryIds,
          missingCategoryIds: route.missingCategoryIds,
          itemCount: route.items.length,
        })),
        tenantId,
        items: {
          create: userCart.items.map((item) => ({
            productItemId: item.productItemId,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Create InquiryManagerTask for each route that has an assigned manager
    const tasksToCreate = routes
      .filter((route) => route.managerId !== null)
      .map((route) => ({
        inquiryId: inquiry.id,
        managerId: route.managerId as number,
        tenantId: route.tenantId,
        status: 'NEW' as const,
      }));

    if (tasksToCreate.length > 0) {
      await prisma.inquiryManagerTask.createMany({ data: tasksToCreate });
    }

    await prisma.cart.update({
      where: {
        token: cartToken,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          token: cartToken,
        },
      },
    });

    try {
      await sendEmail(
        data.email,
        'Next Steel / Заявка #' + inquiry.id + ' принята',
        React.createElement(InquiryCreatedTemplate, {
          inquiryId: inquiry.id,
          fullName: inquiry.fullName,
          phone: inquiry.phone,
          address: data.address,
          itemsCount: userCart.items.length,
        }),
      );
    } catch (emailError) {
      log.warn({ err: emailError, inquiryId: inquiry.id }, 'client inquiry email failed');
    }

    // Send notifications to managers for each route
    for (const route of routes) {
      if (route.managerId) {
        const manager = await prisma.user.findUnique({
          where: { id: route.managerId },
          select: { email: true },
        });

        if (manager?.email) {
          try {
            await sendEmail(
              manager.email,
              'Next Steel / Новая заявка #' + inquiry.id,
              React.createElement(InquiryManagerNotificationTemplate, {
                inquiryId: inquiry.id,
                clientName: inquiry.fullName,
                clientPhone: inquiry.phone,
                clientEmail: inquiry.email,
                address: data.address,
                itemsCount: route.items.length,
              }),
            );
          } catch (emailError) {
            log.warn(
              { err: emailError, inquiryId: inquiry.id, managerId: route.managerId },
              'manager inquiry email failed',
            );
          }
        }
      }
    }

    // Send corporate copy to all notification emails for each tenant involved
    for (const route of routes) {
      try {
        const tenantSettings = await prisma.tenantSettings.findUnique({
          where: { tenantId: route.tenantId },
          select: { notificationEmails: true },
        });

        if (tenantSettings?.notificationEmails && tenantSettings.notificationEmails.length > 0) {
          for (const corpEmail of tenantSettings.notificationEmails) {
            try {
              await sendEmail(
                corpEmail,
                'Next Steel / Новая заявка #' + inquiry.id + ' (копия)',
                React.createElement(InquiryManagerNotificationTemplate, {
                  inquiryId: inquiry.id,
                  clientName: inquiry.fullName,
                  clientPhone: inquiry.phone,
                  clientEmail: inquiry.email,
                  address: data.address,
                  itemsCount: route.items.length,
                }),
              );
            } catch (emailError) {
              log.warn({ err: emailError, inquiryId: inquiry.id, corpEmail }, 'corporate copy email failed');
            }
          }
        }
      } catch (err) {
        log.warn({ err, inquiryId: inquiry.id, tenantId: route.tenantId }, 'failed to fetch tenant settings');
      }
    }

    return inquiry.id;
  } catch (error) {
    log.error({ err: error }, 'createInquiry failed');
  }
}
