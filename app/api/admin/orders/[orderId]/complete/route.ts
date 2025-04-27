import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { completeOrder } from "@/app/actions/admin";
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

    const result = await completeOrder(session.user.id, params.orderId);

    if (result.error) {
      return new NextResponse(result.error, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[ADMIN_ORDER_COMPLETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 