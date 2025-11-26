import { PaymentCallbackData } from '@/@types/youkassa';
import { prisma } from '@/prisma/prisma-client';
import { OrderSuccessTemplate } from '@/shared/components/shared/email-templates/order-success';
import { sendEmail } from '@/shared/lib';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaymentCallbackData;
    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id),
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isSucceeded = body.object.status === 'succeeded';
    if (!isSucceeded) {
      return NextResponse.json({ error: 'Order not succeeded' }, { status: 404 });
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      },
    });

    const items = order?.items as unknown as CartItemDTO[];

    if (!items) {
      return NextResponse.json({ error: 'Order items not found' }, { status: 404 });
    }

    await sendEmail(
      order.email,
      'Next Steel / Ваш заказ успешно оплачен',
      React.createElement(OrderSuccessTemplate, {
        orderId: order.id,
        totalAmount: order.totalAmount,
        items,
      }),
    );
  } catch (error) {
    console.log('[ChtckoutCallback] Error.', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
