import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
  const ingredients = await prisma.ingredient.findMany({
    include: {
      images: true,
    },
  });
  return NextResponse.json(ingredients);
}
