import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Category, OrderStatus, PaymentMethod, Role } from "@prisma/client";

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
    await prisma.product.delete({
      where: { id: productId },
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
