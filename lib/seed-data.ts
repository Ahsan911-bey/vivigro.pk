import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

const mockProducts = [
  // TEXTILE Category
  {
    name: "Organic Cotton T-Shirt",
    description:
      "100% organic cotton t-shirt made with sustainable farming practices",
    price: 29.99,
    quantity: 100,
    category: Category.TEXTILE,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
    ],
  },
  {
    name: "Hemp Fabric Roll",
    description:
      "Eco-friendly hemp fabric roll, perfect for sustainable clothing production",
    price: 199.99,
    quantity: 50,
    category: Category.TEXTILE,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
      "https://images.unsplash.com/photo-1617713964959-d9a36bbc7b52",
    ],
  },
  {
    name: "Bamboo Fiber Sheets",
    description:
      "Luxurious bamboo fiber sheets for eco-conscious manufacturers",
    price: 149.99,
    quantity: 75,
    category: Category.TEXTILE,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
      "https://images.unsplash.com/photo-1584100936713-5840c0586309",
    ],
  },
  {
    name: "Recycled Polyester Fabric",
    description:
      "High-quality recycled polyester fabric made from plastic bottles",
    price: 89.99,
    quantity: 120,
    category: Category.TEXTILE,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1606513542745-97629752a13b",
      "https://images.unsplash.com/photo-1606513542831-6aa46d5d7214",
    ],
  },
  {
    name: "Organic Linen Bundle",
    description: "Premium organic linen fabric bundle for sustainable fashion",
    price: 299.99,
    quantity: 30,
    category: Category.TEXTILE,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1619627826693-8b56017ae767",
      "https://images.unsplash.com/photo-1619627826765-2e9b66c7e0b9",
    ],
  },

  // FERTILIZER Category
  {
    name: "Organic Compost",
    description: "Premium organic compost for enhanced soil fertility",
    price: 49.99,
    quantity: 200,
    category: Category.FERTILIZER,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1581985673473-0784a7a44e39",
      "https://images.unsplash.com/photo-1581985673473-0784a7a44e40",
    ],
  },
  {
    name: "Seaweed Extract",
    description: "Natural seaweed extract for plant growth stimulation",
    price: 79.99,
    quantity: 150,
    category: Category.FERTILIZER,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1590332763476-5b42fb72a6bf",
      "https://images.unsplash.com/photo-1590332763476-5b42fb72a6c0",
    ],
  },
  {
    name: "Bone Meal Fertilizer",
    description: "High-phosphorus bone meal fertilizer for flowering plants",
    price: 39.99,
    quantity: 180,
    category: Category.FERTILIZER,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d",
      "https://images.unsplash.com/photo-1585314062604-1a4cc6e2e7cf",
    ],
  },
  {
    name: "Worm Castings",
    description: "Premium worm castings for organic gardening",
    price: 29.99,
    quantity: 250,
    category: Category.FERTILIZER,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1584589167171-541ce45f1eea",
      "https://images.unsplash.com/photo-1584589167171-541ce45f1eeb",
    ],
  },
  {
    name: "Fish Emulsion",
    description: "Liquid fish emulsion fertilizer for rapid nutrient uptake",
    price: 59.99,
    quantity: 160,
    category: Category.FERTILIZER,
    videoUrl: "https://www.youtube.com/watch?v=NNjTFXk_UC4",
    images: [
      "https://images.unsplash.com/photo-1585314614250-d5f6b2f91c7b",
      "https://images.unsplash.com/photo-1585314614250-d5f6b2f91c7c",
    ],
  },
];

export async function seedProducts() {
  try {
    // Clear existing products and their images
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    // Create new products
    for (const mockProduct of mockProducts) {
      const { images, ...productData } = mockProduct;

      // Create the product
      const product = await prisma.product.create({
        data: productData,
      });

      // Create the product images
      for (const imageUrl of images) {
        await prisma.productImage.create({
          data: {
            url: imageUrl,
            productId: product.id,
          },
        });
      }
    }

    console.log("Seed completed successfully");
    return { success: true, message: "Products seeded successfully" };
  } catch (error) {
    console.error("Seed error:", error);
    return { success: false, message: "Error seeding products", error };
  } finally {
    await prisma.$disconnect();
  }
}
