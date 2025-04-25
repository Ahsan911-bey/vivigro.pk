import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
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
