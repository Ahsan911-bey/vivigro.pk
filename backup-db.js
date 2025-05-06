const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    // Create backups directory if it doesn't exist
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    // Get current timestamp for backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

    // Fetch all data from each table
    const [
      users,
      products,
      orders,
      orderItems,
      cartItems,
      productImages,
      productVideos
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.product.findMany(),
      prisma.order.findMany({
        include: {
          items: true,
          user: true
        }
      }),
      prisma.orderItem.findMany({
        include: {
          product: true
        }
      }),
      prisma.cartItem.findMany({
        include: {
          product: true
        }
      }),
      prisma.productImage.findMany(),
      prisma.productVideo.findMany()
    ]);

    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      schema: {
        version: '1.0',
        includesStockUpdated: true
      },
      data: {
        users,
        products,
        orders,
        orderItems,
        cartItems,
        productImages,
        productVideos
      }
    };

    // Write backup to file
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`Backup created successfully at: ${backupFile}`);

  } catch (error) {
    console.error('Error creating backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase(); 