import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { updateStockForOrder } from "@/app/actions/admin";

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const order = await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ADMIN_ORDER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const result = await updateStockForOrder(params.orderId);
    if (result.error) {
      return new NextResponse(result.error, { status: 400 });
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[ADMIN_ORDER_UPDATE_STOCK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
