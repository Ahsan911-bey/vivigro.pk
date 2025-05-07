import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string; reviewId: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const review = await prisma.review.delete({
      where: {
        id: params.reviewId,
        productId: params.productId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[REVIEW_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 