import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Category, OrderStatus, Role } from "@prisma/client";

// Admin authorization middleware
async function authorizeAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin access required");
  }
}

// Product Management
export async function getAdminProducts(userId: string) {
  try {
    await authorizeAdmin(userId);
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { data: products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: null, error: "Failed to fetch products" };
  }
}

export async function createAdminProduct(
  userId: string,
  data: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: Category;
    images: { url: string }[];
  }
) {
  try {
    await authorizeAdmin(userId);
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        images: {
          create: data.images,
        },
      },
      include: {
        images: true,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    return { data: product, error: null };
  } catch (error) {
    console.error("Error creating product:", error);
    return { data: null, error: "Failed to create product" };
  }
}

export async function updateAdminProduct(
  userId: string,
  productId: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: Category;
    images: { url: string }[];
  }>
) {
  try {
    await authorizeAdmin(userId);

    // Handle images separately to avoid type issues
    const { images, ...productData } = data;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...productData,
        ...(images && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
      },
      include: {
        images: true,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    return { data: product, error: null };
  } catch (error) {
    console.error("Error updating product:", error);
    return { data: null, error: "Failed to update product" };
  }
}

export async function deleteAdminProduct(userId: string, productId: string) {
  try {
    await authorizeAdmin(userId);
    
    // Use a transaction to delete images and product
    await prisma.$transaction(async (tx) => {
      // First delete all images associated with the product
      await tx.productImage.deleteMany({
        where: { productId }
      });
      
      // Update the product to clear the videoUrl
      await tx.product.update({
        where: { id: productId },
        data: { videoUrl: null }
      });
      
      // Then delete the product
      await tx.product.delete({
        where: { id: productId }
      });
    });

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    return { error: null };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Failed to delete product" };
  }
}

// User Management
export async function getAdminUsers(userId: string) {
  try {
    await authorizeAdmin(userId);
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            cartItems: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { data: users, error: null };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: null, error: "Failed to fetch users" };
  }
}

// Order Management
export async function getAdminOrders(userId: string) {
  try {
    await authorizeAdmin(userId);
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { data: orders, error: null };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { data: null, error: "Failed to fetch orders" };
  }
}

export async function updateAdminOrderStatus(
  userId: string,
  orderId: string,
  status: OrderStatus
) {
  try {
    await authorizeAdmin(userId);
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    revalidatePath("/admin/orders");
    return { data: order, error: null };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { data: null, error: "Failed to update order status" };
  }
}

// Dashboard Statistics
export async function getAdminDashboardStats(userId: string) {
  try {
    await authorizeAdmin(userId);
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      recentOrders,
      productsByCategory,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.product.groupBy({
        by: ["category"],
        _count: true,
      }),
    ]);

    return {
      data: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalUsers,
        totalProducts,
        recentOrders,
        productsByCategory,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { data: null, error: "Failed to fetch dashboard statistics" };
  }
}

export async function deleteOrderAndMaybeReduceStock(userId: string, orderId: string, reduceStock: boolean) {
  try {
    await authorizeAdmin(userId);
    // Get the order with its items and related products
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return { error: "Order not found" };
    }

    // Start a transaction to update product quantities (if needed) and delete the order
    await prisma.$transaction(async (tx) => {
      // Stock decrease logic removed as per new requirements
      // Only delete the order
      await tx.order.delete({
        where: { id: orderId }
      });
    });

    revalidatePath("/admin");
    return { data: "Order deleted successfully", error: null };
  } catch (error) {
    console.error("Error deleting order:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete order"
    };
  }
}

export async function updateStockForOrder(orderId: string) {
  try {
    // Get the order and its items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
      },
    });
    if (!order) {
      return { error: "Order not found" };
    }
    if (order.status !== "COMPLETED") {
      return { error: "Stock can only be updated for COMPLETED orders." };
    }
    // Check for negative stock
    for (const item of order.items) {
      if (item.product.quantity < item.quantity) {
        return { error: `Insufficient stock for product: ${item.product.name}` };
      }
    }
    // Update stock in a transaction
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: item.product.quantity - item.quantity }
        });
      }
    });
    revalidatePath("/admin");
    return { data: "Stock updated successfully", error: null };
  } catch (error) {
    console.error("Error updating stock for order:", error);
    return { error: error instanceof Error ? error.message : "Failed to update stock" };
  }
}
