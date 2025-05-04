const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create fertilizer products
  const fertilizers = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Organic Compost',
        description: 'Premium organic compost for enhanced soil fertility',
        price: 49.99,
        quantity: 200,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1581985673473-0784a7a44e39' },
            { url: 'https://images.unsplash.com/photo-1581985673473-0784a7a44e40' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Seaweed Extract',
        description: 'Natural seaweed extract for plant growth stimulation',
        price: 79.99,
        quantity: 150,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1590332763476-5b42fb72a6bf' },
            { url: 'https://images.unsplash.com/photo-1590332763476-5b42fb72a6c0' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dr. Earth Organic Tomato & Vegetable Fertilizer',
        description: 'Premium organic fertilizer specially formulated for tomatoes and vegetables with beneficial microbes and mycorrhizae',
        price: 29.99,
        quantity: 100,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1582131503261-fca1d1c0589f' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Espoma Garden-Tone Organic Fertilizer',
        description: 'All-purpose organic fertilizer made from natural ingredients like bone meal and alfalfa meal',
        price: 24.99,
        quantity: 150,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1589928964725-7ccb0b86c565' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Jobe\'s Organics Vegetable Fertilizer Spikes',
        description: 'Convenient organic fertilizer spikes for continuous feeding of vegetable plants',
        price: 19.99,
        quantity: 200,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1585902516095-c8cc173dc091' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Miracle-Gro Performance Organics',
        description: 'OMRI-listed organic plant food granules for vegetables, flowers, and herbs',
        price: 34.99,
        quantity: 120,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1589928964725-7ccb0b86c565' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'FoxFarm Ocean Forest Organic Fertilizer',
        description: 'Premium organic fertilizer blend with aged forest products and earthworm castings',
        price: 39.99,
        quantity: 80,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1582131503261-fca1d1c0589f' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Down to Earth Organic Acid Mix',
        description: 'Specialized organic fertilizer for acid-loving plants like azaleas and blueberries',
        price: 27.99,
        quantity: 90,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1585902516095-c8cc173dc091' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Espoma Holly-Tone Organic Fertilizer',
        description: 'Natural plant food enriched with bio-tone microbes for acid-loving plants',
        price: 29.99,
        quantity: 110,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1582131503261-fca1d1c0589f' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Neptune\'s Harvest Fish & Seaweed Blend',
        description: 'Organic liquid fertilizer combining fish hydrolysate and seaweed',
        price: 44.99,
        quantity: 70,
        category: 'FERTILIZER',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1590332763476-5b42fb72a6bf' },
          ],
        },
      },
    }),
  ]);

  // Create textile products
  const textiles = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Organic Cotton Bundle',
        description: 'Premium organic cotton fabric bundle for sustainable fashion',
        price: 199.99,
        quantity: 50,
        category: 'TEXTILE',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1619627826693-8b56017ae767' },
            { url: 'https://images.unsplash.com/photo-1619627826765-2e9b66c7e0b9' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Organic Linen Bundle',
        description: 'Premium organic linen fabric bundle for sustainable fashion',
        price: 299.99,
        quantity: 30,
        category: 'TEXTILE',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1619627826693-8b56017ae767' },
            { url: 'https://images.unsplash.com/photo-1619627826765-2e9b66c7e0b9' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Organic Cotton Lawn Fabric',
        description: 'Luxurious lightweight organic cotton lawn fabric, perfect for summer garments',
        price: 24.99,
        quantity: 100,
        category: 'TEXTILE',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Hemp/Organic Cotton Blend',
        description: 'Sustainable hemp and organic cotton blend fabric for durable garments',
        price: 32.95,
        quantity: 80,
        category: 'TEXTILE',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9bc3' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Organic Cotton Jersey Knit',
        description: 'Soft and stretchy organic cotton jersey knit fabric for comfortable clothing',
        price: 19.99,
        quantity: 120,
        category: 'TEXTILE',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bamboo/Cotton Blend Fabric',
        description: 'Eco-friendly bamboo and cotton blend fabric with natural antibacterial properties',
        price: 27.99,
        quantity: 90,
        category: 'TEXTILE',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9bc3' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Organic Cotton Canvas',
        description: 'Heavy-duty organic cotton canvas fabric for bags and upholstery',
        price: 34.99,
        quantity: 70,
        category: 'TEXTILE',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633' },
          ],
        },
      },
    }),
  ]);

  console.log({ admin, user, fertilizers, textiles });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 