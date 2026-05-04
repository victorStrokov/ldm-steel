'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues, PayOrderTemplate } from '@/shared/components';
import { createPayment, sendEmail } from '@/shared/lib';
import { logger } from '@/shared/lib/logger';
import { OrderStatus, Prisma } from '@prisma/client';
import { cookies } from 'next/headers';
import React from 'react';
import { OrderSnapshotItem } from '@/shared/services/dto/cart.dto';

const log = logger.child({ module: 'create-order' });

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }
    /* Находим корзину по токену */
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            productItem: {
              include: {
                product: {
                  include: {
                    images: true,
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

    /* Если заявка не нашлась — бросаем ошибку */
    if (!userCart) {
      throw new Error('User cart not found');
    }
    /* Если заявка пустая — бросаем ошибку */
    if (userCart?.totalAmount === 0) {
      throw new Error('Cart is empty');
    }
    const tenantId = userCart.user?.tenantId ?? userCart.items[0]?.productItem.product.tenantId;

    if (!tenantId) {
      throw new Error('Tenant ID not found');
    }

    const orderItemsSnapshot: OrderSnapshotItem[] = userCart.items.map((item) => {
      const unitPrice = item.productItem.price ?? 0;

      return {
        id: item.id,
        cartItemId: item.id,
        quantity: item.quantity,
        productItemId: item.productItemId,
        productId: item.productItem.product.id,
        productName: item.productItem.product.name,
        sku: item.productItem.sku,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        imageUrl: item.productItem.product.images?.[0]?.url ?? null,
        sizeDisplay: item.productItem.sizeDisplay ?? null,
        thicknessDisplay: item.productItem.thicknessDisplay ?? null,
      };
    });

    /* Создаем  заказ */
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + ' ' + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: userCart.totalAmount, // нужен для понимания сколько стоил заказ в админку
        status: OrderStatus.PENDING,
        items: orderItemsSnapshot as unknown as Prisma.InputJsonValue,
        tenantId,
      },
    });
    /* Очищаем корзину */
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

    const paymentData = await createPayment({
      amount: order.totalAmount,
      orderId: order.id,
      description: 'Оплата заказа #' + order.id,
    });

    if (!paymentData) {
      throw new Error('Payment data not found');
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: paymentData.id,
      },
    });

    const paymentUrl = paymentData.confirmation.confirmation_url;

    await sendEmail(
      data.email,
      'Next Steel / Оплатите заказ #' + order.id,
      React.createElement(PayOrderTemplate, {
        orderId: String(order.id),
        totalAmount: order.totalAmount,
        paymentUrl,
      }),
    );

    return paymentUrl;
  } catch (error) {
    log.error({ err: error }, 'createOrder failed');
  }
}
