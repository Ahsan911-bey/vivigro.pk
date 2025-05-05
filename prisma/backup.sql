-- Drop existing tables if they exist
DROP TABLE IF EXISTS "ProductVideo";
DROP TABLE IF EXISTS "Product";
DROP TABLE IF EXISTS "Category";

-- Create Category table
CREATE TABLE "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Create Product table
CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "images" TEXT[] NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Create ProductVideo table
CREATE TABLE "ProductVideo" (
  "id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProductVideo_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductVideo" ADD CONSTRAINT "ProductVideo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert sample categories
INSERT INTO "Category" ("id", "name", "description", "createdAt", "updatedAt") VALUES
('cat_1', 'Indoor Plants', 'Beautiful plants for your home', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_2', 'Outdoor Plants', 'Perfect for your garden', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat_3', 'Succulents', 'Low maintenance plants', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample products
INSERT INTO "Product" ("id", "name", "description", "price", "images", "categoryId", "createdAt", "updatedAt") VALUES
('prod_1', 'Monstera Deliciosa', 'Beautiful indoor plant with large leaves', 49.99, ARRAY['monstera1.jpg', 'monstera2.jpg'], 'cat_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod_2', 'Snake Plant', 'Perfect for beginners', 29.99, ARRAY['snake1.jpg', 'snake2.jpg'], 'cat_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod_3', 'Aloe Vera', 'Medicinal succulent plant', 19.99, ARRAY['aloe1.jpg', 'aloe2.jpg'], 'cat_3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample product videos
INSERT INTO "ProductVideo" ("id", "url", "productId", "createdAt", "updatedAt") VALUES
('vid_1', 'https://www.youtube.com/watch?v=example1', 'prod_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vid_2', 'https://www.facebook.com/watch?v=example2', 'prod_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vid_3', 'https://www.youtube.com/watch?v=example3', 'prod_2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 