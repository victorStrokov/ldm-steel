'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues, InquiryCreatedTemplate, InquiryManagerNotificationTemplate } from '@/shared/components';
import { signInquiryFeedbackToken } from '@/shared/lib';
import { sendEmail } from '@/shared/lib/sendEmail';
import { getAdminApiUrl } from '@/shared/lib/get-admin-api-url';
import { logger } from '@/shared/lib/logger';
import { InquiryStatus } from '@prisma/client';
import { resolveInquiryRoutes } from '@/shared/lib/resolve-inquiry-routes';
import { cookies } from 'next/headers';
import React from 'react';

const log = logger.child({ module: 'create-inquiry' });

function normalizeEmail(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function buildInquiryComment(address: string, comment?: string): string {
  const safeComment = comment?.trim();
  const raw = safeComment ? `Адрес: ${address}\n\nКомментарий: ${safeComment}` : `Адрес: ${address}`;
  return raw.slice(0, 1000);
}

function getEmailMessageId(result: unknown): string | null {
  if (!result || typeof result !== 'object') return null;
  const withMessageId = result as { messageId?: unknown };
  return typeof withMessageId.messageId === 'string' ? withMessageId.messageId : null;
}

function getEmailProvider(result: unknown): string {
  if (!result || typeof result !== 'object') return 'unknown';
  const withProvider = result as { provider?: unknown };
  return typeof withProvider.provider === 'string' ? withProvider.provider : 'unknown';
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
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
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
      productItemId: item.productItemId,
      categoryId: item.productItem.product.categoryId,
      categoryName: item.productItem.product.category?.name,
      productName: item.productItem.product.name,
      quantity: item.quantity,
      sku: item.productItem.sku,
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
    const managerRoutes = routes.filter(
      (route): route is (typeof routes)[number] & { managerId: number } => route.managerId !== null,
    );

    const createdTasks = managerRoutes.length
      ? await prisma.$transaction(
          managerRoutes.map((route) =>
            prisma.inquiryManagerTask.create({
              data: {
                inquiryId: inquiry.id,
                managerId: route.managerId,
                tenantId: route.tenantId,
                status: 'NEW',
              },
              select: {
                id: true,
                managerId: true,
                tenantId: true,
              },
            }),
          ),
        )
      : [];

    const taskByManagerRouteKey = new Map(createdTasks.map((task) => [`${task.managerId}:${task.tenantId}`, task]));

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
      const delivery = await sendEmail(
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
      log.info(
        {
          inquiryId: inquiry.id,
          recipientType: 'client',
          email: normalizeEmail(data.email),
          provider: getEmailProvider(delivery),
          messageId: getEmailMessageId(delivery),
        },
        'email sent',
      );
    } catch (emailError) {
      log.warn({ err: emailError, inquiryId: inquiry.id }, 'client inquiry email failed');
    }

    const inquiryItemsForEmail = userCart.items.map((item) => ({
      name: item.productItem.product.name,
      sku: item.productItem.sku,
      quantity: item.quantity,
      categoryName: item.productItem.product.category?.name,
    }));
    const adminBaseUrl = getAdminApiUrl(3001).replace(/\/+$/, '');
    const inquiryAdminUrl = `${adminBaseUrl}/admin/inquiries/${inquiry.id}`;

    // Send notifications to managers for each route
    for (const route of managerRoutes) {
      if (route.managerId) {
        const routeSummary = {
          managerMode: route.managerMode,
          itemsCount: route.items.length,
          totalQuantity: route.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
          categories: [
            ...new Set(route.items.map((item) => item.categoryName).filter((name): name is string => !!name)),
          ],
          itemPreview: route.items.slice(0, 10).map((item) => ({
            productId: item.productId,
            productItemId: item.productItemId ?? null,
            sku: item.sku ?? null,
            name: item.productName ?? null,
            quantity: item.quantity ?? 1,
            category: item.categoryName ?? null,
          })),
        };

        const manager = await prisma.user.findUnique({
          where: { id: route.managerId },
          select: { email: true },
        });
        const task = taskByManagerRouteKey.get(`${route.managerId}:${route.tenantId}`);
        const managerEmail = normalizeEmail(manager?.email);

        if (!managerEmail) {
          log.warn(
            { inquiryId: inquiry.id, managerId: route.managerId, tenantId: route.tenantId, routeSummary },
            'manager inquiry email skipped: manager email is empty',
          );
          continue;
        }

        if (!task) {
          log.warn(
            { inquiryId: inquiry.id, managerId: route.managerId, tenantId: route.tenantId, routeSummary },
            'manager inquiry email skipped: task not found',
          );
          continue;
        }

        if (managerEmail && task) {
          const token = signInquiryFeedbackToken({
            taskId: task.id,
            inquiryId: inquiry.id,
            managerId: route.managerId,
            tenantId: route.tenantId,
          });
          const feedbackBaseUrl = `${adminBaseUrl}/inquiry-feedback?token=${encodeURIComponent(token)}`;

          try {
            const delivery = await sendEmail(
              managerEmail,
              'Next Steel / Новая заявка #' + inquiry.id,
              React.createElement(InquiryManagerNotificationTemplate, {
                inquiryId: inquiry.id,
                clientName: inquiry.fullName,
                clientPhone: inquiry.phone,
                clientEmail: inquiry.email,
                address: data.address,
                items: route.items.map((item) => ({
                  name: item.productName ?? `Товар #${item.productId}`,
                  sku: item.sku ?? `ITEM-${item.productItemId ?? item.productId}`,
                  quantity: item.quantity ?? 1,
                  categoryName: item.categoryName,
                })),
                inquiryUrl: inquiryAdminUrl,
                feedbackLinks: {
                  accept: `${feedbackBaseUrl}&intent=accept`,
                  complete: `${feedbackBaseUrl}&intent=complete`,
                  cancel: `${feedbackBaseUrl}&intent=cancel`,
                },
              }),
            );
            log.info(
              {
                inquiryId: inquiry.id,
                recipientType: 'manager',
                managerId: route.managerId,
                tenantId: route.tenantId,
                taskId: task.id,
                email: managerEmail,
                provider: getEmailProvider(delivery),
                messageId: getEmailMessageId(delivery),
                routeSummary,
              },
              'email sent',
            );
          } catch (emailError) {
            log.warn(
              { err: emailError, inquiryId: inquiry.id, managerId: route.managerId, routeSummary },
              'manager inquiry email failed',
            );
          }
        }
      }
    }

    // Send full corporate copy to all notification emails for involved tenants
    const corporateEmails = new Set<string>();
    for (const route of routes) {
      try {
        const tenantSettings = await prisma.tenantSettings.findUnique({
          where: { tenantId: route.tenantId },
          select: { notificationEmails: true },
        });

        if (tenantSettings?.notificationEmails && tenantSettings.notificationEmails.length > 0) {
          for (const corpEmail of tenantSettings.notificationEmails) {
            const normalizedCorpEmail = normalizeEmail(corpEmail);
            if (normalizedCorpEmail) {
              corporateEmails.add(normalizedCorpEmail);
            }
          }
        }
      } catch (err) {
        log.warn({ err, inquiryId: inquiry.id, tenantId: route.tenantId }, 'failed to fetch tenant settings');
      }
    }

    for (const corpEmail of corporateEmails) {
      try {
        const delivery = await sendEmail(
          corpEmail,
          'Next Steel / Новая заявка #' + inquiry.id + ' (полная копия)',
          React.createElement(InquiryManagerNotificationTemplate, {
            inquiryId: inquiry.id,
            clientName: inquiry.fullName,
            clientPhone: inquiry.phone,
            clientEmail: inquiry.email,
            address: data.address,
            items: inquiryItemsForEmail,
            inquiryUrl: inquiryAdminUrl,
            introText: 'Полная копия заявки для корпоративной почты. Ниже весь состав заявки целиком.',
          }),
        );
        log.info(
          {
            inquiryId: inquiry.id,
            recipientType: 'corporate',
            email: corpEmail,
            provider: getEmailProvider(delivery),
            messageId: getEmailMessageId(delivery),
          },
          'email sent',
        );
      } catch (emailError) {
        log.warn({ err: emailError, inquiryId: inquiry.id, corpEmail }, 'corporate copy email failed');
      }
    }

    return inquiry.id;
  } catch (error) {
    log.error({ err: error }, 'createInquiry failed');
  }
}
