import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || '';

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    take: 5,
    include: {
      items: true, // <-- подтягиваем варианты
      ingredients: true, // <-- если нужны ингредиенты
    },
  });

  return NextResponse.json(products);
}
