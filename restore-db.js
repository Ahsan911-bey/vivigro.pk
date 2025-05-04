const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreDatabase(backupFile) {
  try {
    // Read backup file
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    const { data } = backup;

    // Clear existing data
    await prisma.$transaction([
      prisma.cartItem.deleteMany(),
      prisma.orderItem.deleteMany(),
      prisma.order.deleteMany(),
      prisma.productImage.deleteMany(),
      prisma.product.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Restore data in correct order
    await prisma.$transaction([
      // First restore users
      ...data.users.map(user => 
        prisma.user.create({ data: user })
      ),
      // Then products
      ...data.products.map(product => 
        prisma.product.create({ data: product })
      ),
      // Then product images
      ...data.productImages.map(image => 
        prisma.productImage.create({ data: image })
      ),
      // Then orders
      ...data.orders.map(order => 
        prisma.order.create({ data: order })
      ),
      // Then order items
      ...data.orderItems.map(item => 
        prisma.orderItem.create({ data: item })
      ),
      // Finally cart items
      ...data.cartItems.map(item => 
        prisma.cartItem.create({ data: item })
      ),
    ]);

    console.log('Database restored successfully!');

  } catch (error) {
    console.error('Error restoring backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get backup file from command line argument
const backupFile = process.argv[2];
if (!backupFile) {
  console.error('Please provide a backup file path');
  process.exit(1);
}

restoreDatabase(backupFile); 