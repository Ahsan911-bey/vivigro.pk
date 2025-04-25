"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Example: Get all products
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
    });
    return { data: products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: null, error: "Failed to fetch products" };
  }
}

// Example: Get product by ID
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
    return { data: product, error: null };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { data: null, error: "Failed to fetch product" };
  }
}

// Example: Create a new product
export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: "TEXTILE" | "FERTILIZER";
  images: { url: string }[];
}) {
  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        images: {
          create: data.images,
        },
      },
      include: {
        images: true,
      },
    });
    revalidatePath("/catalog");
    return { data: product, error: null };
  } catch (error) {
    console.error("Error creating product:", error);
    return { data: null, error: "Failed to create product" };
  }
}

// Example: Update product
export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: "TEXTILE" | "FERTILIZER";
  }>
) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
      },
    });
    revalidatePath("/catalog");
    return { data: product, error: null };
  } catch (error) {
    console.error("Error updating product:", error);
    return { data: null, error: "Failed to update product" };
  }
}

// Example: Delete product
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/catalog");
    return { error: null };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Failed to delete product" };
  }
}

// Create a new order
export async function createOrder(data: {
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: "STRIPE" | "PAYFAST";
}) {
  try {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return { data: order, error: null };
  } catch (error) {
    console.error("Error creating order:", error);
    return { data: null, error: "Failed to create order" };
  }
}

// Cart Actions
export async function getCartItems(userId: string) {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
    return { data: cartItems, error: null };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { data: null, error: "Failed to fetch cart items" };
  }
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number
) {
  try {
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      });
      return { data: updatedItem, error: null };
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
    return { data: newItem, error: null };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return { data: null, error: "Failed to add item to cart" };
  }
}

export async function updateCartItemQuantity(id: string, quantity: number) {
  try {
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
    return { data: updatedItem, error: null };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { data: null, error: "Failed to update cart item" };
  }
}

export async function removeFromCart(id: string) {
  try {
    await prisma.cartItem.delete({
      where: { id },
    });
    return { error: null };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return { error: "Failed to remove item from cart" };
  }
}

export async function clearCart(userId: string) {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
    return { error: null };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { error: "Failed to clear cart" };
  }
}
