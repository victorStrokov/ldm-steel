'use server';

import { prisma } from '@/prisma/prisma-client';
import { CheckoutFormValues, PayOrderTemplate } from '@/shared/components';
import { sendEmail } from '@/shared/lib';
import { OrderStatus } from '@prisma/client';
import { cookies } from 'next/headers';
import React from 'react';

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
            ingredients: true,
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

    /* Если корзина не нашлась — бросаем ошибку */
    if (!userCart) {
      throw new Error('User cart not found');
    }
    /* Если корзина пустая — бросаем ошибку */
    if (userCart?.totalAmount === 0) {
      throw new Error('Cart is empty');
    }

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
        items: JSON.stringify(userCart.items), // нужен для понимания что в заказе какие товары
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

    // TODO: сделать оплату

    await sendEmail(
      data.email,
      'Next Steel / Оплатите заказ #' + order.id,
      React.createElement(PayOrderTemplate, {
        orderId: String(order.id),
        totalAmount: order.totalAmount,
        paymentUrl: 'https://dodopizza.ru/peterburg',
      }),
    );
  } catch (error) {
    console.error('[Create Order] Server Error', error);
  }
}
