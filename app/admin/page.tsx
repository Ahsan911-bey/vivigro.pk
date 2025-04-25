import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

async function getStats() {
  const [totalRevenue, totalOrders, totalProducts, totalCustomers] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: "PAID",
        },
      }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
    ]);

  return {
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    totalOrders,
    totalProducts,
    totalCustomers,
  };
}

async function getProducts() {
  return prisma.product.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getOrders() {
  return prisma.order.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getUsers() {
  return prisma.user.findMany({
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
}

export default async function AdminDashboardPage() {
  const [stats, products, orders, users] = await Promise.all([
    getStats(),
    getProducts(),
    getOrders(),
    getUsers(),
  ]);

  return (
    <AdminDashboardClient
      stats={stats}
      products={products}
      orders={orders}
      users={users}
    />
  );
}
