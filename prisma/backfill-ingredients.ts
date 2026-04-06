/**
 * PR-A5: Backfill Ingredient → Product
 *
 * Converts every Ingredient record to a proper Product+ProductItem in the
 * "Комплектующие" category and creates ProductRelatedProduct links for every
 * Product that previously referenced the ingredient via the M2M relation.
 *
 * Safe to run multiple times (idempotent: skips already-migrated ingredients).
 *
 * Usage:
 *   npm run backfill
 */

import { prisma } from './prisma-client';

function slugify(text: string): string {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };
  return text
    .toLowerCase()
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base || 'accessory';
  let attempt = 0;
  while (await prisma.product.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${base}-${attempt}`;
  }
  return slug;
}

async function main() {
  console.log('=== Backfill: Ingredient → Product ===\n');

  const tenant = await prisma.tenant.findFirst({ select: { id: true, name: true } });
  if (!tenant) throw new Error('No tenant found');

  const category = await prisma.category.findFirst({
    where: { name: 'Комплектующие', tenantId: tenant.id },
    select: { id: true },
  });
  if (!category) throw new Error('Category "Комплектующие" not found for tenant ' + tenant.id);

  console.log(`Tenant: "${tenant.name}" (id=${tenant.id})`);
  console.log(`Category: "Комплектующие" (id=${category.id})\n`);

  const ingredients = await prisma.ingredient.findMany({
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      products: { select: { id: true, name: true } },
    },
    orderBy: { id: 'asc' },
  });

  console.log(`Found ${ingredients.length} ingredients.\n`);

  let created = 0;
  let skipped = 0;
  let linked = 0;

  for (const ingredient of ingredients) {
    const sku = `ING-${ingredient.id}`;

    const existingItem = await prisma.productItem.findUnique({
      where: { sku },
      select: { id: true, productId: true },
    });

    if (existingItem) {
      console.log(`  ⏭  [${sku}] "${ingredient.name}" — already migrated (ProductItem ${existingItem.id})`);
      skipped += 1;

      // Still ensure ProductRelatedProduct links exist for source products
      for (const srcProduct of ingredient.products) {
        const alreadyLinked = await prisma.productRelatedProduct.findUnique({
          where: {
            productId_relatedProductId: {
              productId: srcProduct.id,
              relatedProductId: existingItem.productId,
            },
          },
        });
        if (!alreadyLinked) {
          await prisma.productRelatedProduct.create({
            data: {
              productId: srcProduct.id,
              relatedProductId: existingItem.productId,
              tenantId: tenant.id,
              kind: 'ACCESSORY',
              sortOrder: 0,
            },
          });
          console.log(`     🔗 Linked product ${srcProduct.id} → accessory ${existingItem.productId}`);
          linked += 1;
        }
      }
      continue;
    }

    const slug = await uniqueSlug(slugify(ingredient.name));
    const imageUrl = ingredient.images[0]?.url ?? null;

    const newProduct = await prisma.product.create({
      data: {
        name: ingredient.name,
        slug,
        categoryId: category.id,
        tenantId: tenant.id,
        status: 'ACTIVE',
        images: imageUrl ? { create: [{ url: imageUrl, sortOrder: 0 }] } : undefined,
        items: {
          create: [{ price: ingredient.price, sku }],
        },
      },
      select: { id: true },
    });

    console.log(`  ✅ [${sku}] "${ingredient.name}" → Product ${newProduct.id} (slug="${slug}")`);
    created += 1;

    for (const srcProduct of ingredient.products) {
      await prisma.productRelatedProduct.create({
        data: {
          productId: srcProduct.id,
          relatedProductId: newProduct.id,
          tenantId: tenant.id,
          kind: 'ACCESSORY',
          sortOrder: 0,
        },
      });
      console.log(`     🔗 Linked product ${srcProduct.id} ("${srcProduct.name}") → accessory ${newProduct.id}`);
      linked += 1;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Created : ${created}`);
  console.log(`  Skipped : ${skipped}`);
  console.log(`  Links   : ${linked}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
