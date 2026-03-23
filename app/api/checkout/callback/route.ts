import { PaymentCallbackData } from '@/@types/youkassa';
import { prisma } from '@/prisma/prisma-client';
import { OrderFailedTemplate } from '@/shared/components/shared/email-templates/order-failed';
import { OrderSuccessTemplate } from '@/shared/components/shared/email-templates/order-success';
import { sendEmail } from '@/shared/lib';
import { logger } from '@/shared/lib/logger';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';

const log = logger.child({ module: 'api/checkout/callback' });
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

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      },
    });

    const items = JSON.parse(order.items as string) as CartItemDTO[];

    if (!items) {
      return NextResponse.json({ error: 'Order items not found' }, { status: 404 });
    }

    if (isSucceeded) {
      await sendEmail(
        order.email,
        'Next Steel / Ваш заказ успешно оплачен',
        React.createElement(OrderSuccessTemplate, {
          orderId: order.id,
          totalAmount: order.totalAmount,
          items,
        }),
      );
    } else {
      await sendEmail(
        order.email,
        'Next Steel / Платёж не прошёл',
        React.createElement(OrderFailedTemplate, {
          orderId: order.id,
          totalAmount: order.totalAmount,
        }),
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    log.error({ err: error }, 'POST /api/checkout/callback failed');

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
