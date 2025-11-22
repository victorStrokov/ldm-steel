import { prisma } from '@/prisma/prisma-client';
import { updateCartTotalAmount } from '@/shared/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const data = (await req.json()) as { quantity: number };
    const token = req.cookies.get('cartToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'cartToken не найден' }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(id),
        cart: { token },
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'cartItem не найден' }, { status: 404 });
    }

    await prisma.cartItem.update({
      where: {
        id: Number(id),
      },
      data: {
        quantity: data.quantity,
      },
    });

    return NextResponse.json(await updateCartTotalAmount(token));
  } catch (error) {
    console.error('[ CART_PATCH ] Server Error', error);
    return NextResponse.json({ message: 'Произошла ошибка. Корзина не обновлена' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'cartToken не найден' }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(id),
        cart: { token },
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'cartItem не найден' }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        id: Number(id),
      },
    });

    const updatedUserCart = await updateCartTotalAmount(token);

    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Произошла ошибка. Корзина не Удалена' }, { status: 500 });
  }
}
