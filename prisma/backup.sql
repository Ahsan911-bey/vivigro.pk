-- Drop existing tables if they exist
DROP TABLE IF EXISTS "ProductVideo";
DROP TABLE IF EXISTS "ProductImage";
DROP TABLE IF EXISTS "OrderItem";
DROP TABLE IF EXISTS "CartItem";
DROP TABLE IF EXISTS "Order";
DROP TABLE IF EXISTS "Product";
DROP TABLE IF EXISTS "User";

-- Create User table
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Product table
CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "quantity" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "videoUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Create ProductImage table
CREATE TABLE "ProductImage" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "productId" TEXT NOT NULL,

  CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- Create ProductVideo table
CREATE TABLE "ProductVideo" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "productId" TEXT NOT NULL,

  CONSTRAINT "ProductVideo_pkey" PRIMARY KEY ("id")
);

-- Create CartItem table
CREATE TABLE "CartItem" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,

  CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- Create Order table
CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "totalAmount" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "stock_updated" BOOLEAN NOT NULL DEFAULT false,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "paymentMethod" TEXT NOT NULL,

  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create OrderItem table
CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,

  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductVideo" ADD CONSTRAINT "ProductVideo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- Insert sample data
INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt", "updatedAt") VALUES
('user_1', 'Admin User', 'admin@example.com', '$2a$10$example_hash', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user_2', 'Regular User', 'user@example.com', '$2a$10$example_hash', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Product" ("id", "name", "description", "price", "quantity", "category", "createdAt", "updatedAt") VALUES
('prod_1', 'Cotton T-Shirt', 'Comfortable cotton t-shirt', 29.99, 100, 'TEXTILE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod_2', 'Organic Fertilizer', 'Natural plant food', 19.99, 50, 'FERTILIZER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "ProductImage" ("id", "url", "productId") VALUES
('img_1', 'https://example.com/tshirt1.jpg', 'prod_1'),
('img_2', 'https://example.com/fertilizer1.jpg', 'prod_2');

INSERT INTO "Order" ("id", "userId", "totalAmount", "status", "stock_updated", "first_name", "last_name", "email", "phone", "address", "city", "state", "paymentMethod", "createdAt", "updatedAt") VALUES
('order_1', 'user_2', 29.99, 'COMPLETED', false, 'John', 'Doe', 'john@example.com', '1234567890', '123 Main St', 'New York', 'NY', 'STRIPE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "OrderItem" ("id", "orderId", "productId", "quantity", "price") VALUES
('item_1', 'order_1', 'prod_1', 1, 29.99); 