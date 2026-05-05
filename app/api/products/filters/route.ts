import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { mapProductColor, mapProductMaterial } from '@/shared/constants/profile';

export async function GET(req: NextRequest) {
  const categoryIdParam = req.nextUrl.searchParams.get('categoryId');
  const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

  const where = categoryId ? { product: { categoryId } } : {};

  const items = await prisma.productItem.findMany({
    where,
    select: {
      productMaterials: true,
      materialDisplay: true,
      productColors: true,
      sizeDisplay: true,
      lengthDisplay: true,
      thicknessDisplay: true,
      widthDisplay: true,
      heightDisplay: true,
    },
  });

  // Materials
  const materialSet = new Set<string>();
  for (const item of items) {
    if (item.materialDisplay) {
      materialSet.add(item.materialDisplay);
    } else if (item.productMaterials) {
      materialSet.add(
        mapProductMaterial[item.productMaterials as keyof typeof mapProductMaterial] ?? item.productMaterials,
      );
    }
  }
  const materials = Array.from(materialSet).map((value) => ({
    value,
    text: value,
  }));

  // Colors from productColors[] (format: "id" or "id:RAL")
  const colorSet = new Set<string>();
  for (const item of items) {
    for (const entry of item.productColors ?? []) {
      const idx = entry.indexOf(':');
      colorSet.add(idx !== -1 ? entry.slice(0, idx) : entry);
    }
  }
  const colors = Array.from(colorSet)
    .sort((a, b) => Number(a) - Number(b))
    .map((value) => ({
      value,
      text: mapProductColor[Number(value) as keyof typeof mapProductColor] ?? value,
    }));

  // Sizes (width×height preferred, fallback to sizeDisplay)
  const sizeSet = new Set<string>();
  for (const item of items) {
    const wh = [item.widthDisplay, item.heightDisplay].filter(Boolean).join('×');
    if (wh) {
      sizeSet.add(wh);
    } else if (item.sizeDisplay) {
      sizeSet.add(item.sizeDisplay);
    }
  }
  const sizes = Array.from(sizeSet)
    .filter(Boolean)
    .map((value) => ({ value, text: value }));

  // Lengths from lengthDisplay
  const lengthSet = new Set<string>();
  for (const item of items) {
    if (item.lengthDisplay) {
      lengthSet.add(item.lengthDisplay);
    }
  }
  const lengths = Array.from(lengthSet)
    .filter(Boolean)
    .map((value) => ({ value, text: value }));

  // Thicknesses from thicknessDisplay
  const thicknessSet = new Set<string>();
  for (const item of items) {
    if (item.thicknessDisplay) {
      thicknessSet.add(item.thicknessDisplay);
    }
  }
  const thicknesses = Array.from(thicknessSet)
    .filter(Boolean)
    .map((value) => ({ value, text: value }));

  return NextResponse.json({ materials, colors, sizes, lengths, thicknesses });
}
