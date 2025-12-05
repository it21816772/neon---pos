import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
  const rawPassword = process.env.SEED_ADMIN_PASS ?? 'password123';
  const hashed = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashed,
      name: 'Admin',
      role: 'MANAGER',
    },
    create: {
      email,
      passwordHash: hashed,
      name: 'Admin',
      role: 'MANAGER',
    },
  });

  console.log('Seeded user:', { id: user.id, email: user.email });
  
  // Create a default category and some example products
  let category = await prisma.category.findFirst({ where: { name: 'General' } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'General',
        description: 'Default product category',
      },
    });
  }

  const productsData = [
    {
      name: 'Plain Coffee',
      description: 'Freshly brewed black coffee',
      priceCents: 250,
      barcode: 'COF-0001',
      imageUrl: '',
    },
    {
      name: 'Blueberry Muffin',
      description: 'House baked muffin with blueberries',
      priceCents: 350,
      barcode: 'MUF-0001',
      imageUrl: '',
    },
    {
      name: 'Bottled Water',
      description: '500ml spring water',
      priceCents: 150,
      barcode: 'WTR-0001',
      imageUrl: '',
    },
  ];

  for (const p of productsData) {
    const prod = await prisma.product.upsert({
      where: { barcode: p.barcode ?? '' },
      update: {
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        imageUrl: p.imageUrl,
        categoryId: category.id,
      },
      create: {
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        barcode: p.barcode,
        imageUrl: p.imageUrl,
        categoryId: category.id,
        inventory: {
          create: {
            quantity: 50,
            minStock: 5,
          },
        },
      },
    });

    console.log('Upserted product:', prod.name, prod.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
