import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

async function getStats() {
  const [totalRevenue, totalOrders, totalProducts, totalCustomers, completedOrders, failedOrders, pendingOrders] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: "COMPLETED",
        },
      }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.order.count({ where: { status: "FAILED" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);

  return {
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    totalOrders,
    totalProducts,
    totalCustomers,
    completedOrders,
    failedOrders,
    pendingOrders,
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
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
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
