'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues, InquiryCreatedTemplate, InquiryManagerNotificationTemplate } from '@/shared/components';
import { sendEmail } from '@/shared/lib';
import { logger } from '@/shared/lib/logger';
import { InquiryStatus } from '@prisma/client';
import { resolveInquiryManagerId } from '@/shared/lib/resolve-inquiry-manager';
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

    const routingItems = userCart.items.map((item) => ({
      productId: item.productItem.product.id,
      categoryId: item.productItem.product.categoryId,
    }));
    const managerResolution = await resolveInquiryManagerId(tenantId, routingItems);

    const inquiry = await prisma.inquiry.create({
      data: {
        token: cartToken,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        comment: buildInquiryComment(data.address, data.comment),
        status: InquiryStatus.NEW,
        managerId: managerResolution.managerId,
        routeModeSnapshot: managerResolution.mode,
        routeCoveredCategoryIds: managerResolution.coveredCategoryIds,
        routeMissingCategoryIds: managerResolution.missingCategoryIds,
        tenantId,
        items: {
          create: userCart.items.map((item) => ({
            productItemId: item.productItemId,
            quantity: item.quantity,
          })),
        },
      },
    });

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

    if (managerResolution.managerId) {
      const manager = await prisma.user.findUnique({
        where: { id: managerResolution.managerId },
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
              itemsCount: userCart.items.length,
            }),
          );
        } catch (emailError) {
          log.warn(
            { err: emailError, inquiryId: inquiry.id, managerId: managerResolution.managerId },
            'manager inquiry email failed',
          );
        }
      }
    }

    return inquiry.id;
  } catch (error) {
    log.error({ err: error }, 'createInquiry failed');
  }
}
