const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreDatabase(backupFile) {
  try {
    // Read backup file
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    const { data, schema } = backup;

    // Verify schema version
    if (!schema || !schema.includesStockUpdated) {
      console.warn('Warning: Backup file does not include stock_updated field. Some data may be lost.');
    }

    // Clear existing data
    await prisma.$transaction([
      prisma.cartItem.deleteMany(),
      prisma.orderItem.deleteMany(),
      prisma.order.deleteMany(),
      prisma.productVideo.deleteMany(),
      prisma.productImage.deleteMany(),
      prisma.product.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Restore data in correct order
    await prisma.$transaction([
      // First restore users
      ...data.users.map(user => 
        prisma.user.create({ 
          data: {
            ...user,
            role: user.role || 'USER' // Ensure role is set
          }
        })
      ),
      // Then products
      ...data.products.map(product => 
        prisma.product.create({ 
          data: {
            ...product,
            category: product.category || 'TEXTILE' // Ensure category is set
          }
        })
      ),
      // Then product images
      ...data.productImages.map(image => 
        prisma.productImage.create({ data: image })
      ),
      // Then product videos
      ...data.productVideos.map(video => 
        prisma.productVideo.create({ data: video })
      ),
      // Then orders
      ...data.orders.map(order => 
        prisma.order.create({ 
          data: {
            ...order,
            stock_updated: order.stock_updated || false, // Ensure stock_updated is set
            status: order.status || 'PENDING' // Ensure status is set
          }
        })
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