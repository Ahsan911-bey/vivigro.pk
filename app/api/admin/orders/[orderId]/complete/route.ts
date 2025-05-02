import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { deleteOrderAndMaybeReduceStock } from "@/app/actions/admin";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the order to check its status
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      select: { status: true }
    });
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    if (order.status === "PENDING") {
      return new NextResponse("Cannot remove a pending order", { status: 400 });
    }

    const reduceStock = order.status === "PAID";
    const result = await deleteOrderAndMaybeReduceStock(session.user.id, params.orderId, reduceStock);

    if (result.error) {
      return new NextResponse(result.error, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[ADMIN_ORDER_COMPLETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 