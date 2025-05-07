import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";

export async function POST(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { reviewerName, reviewText, starRating } = body;

    if (!reviewerName || !reviewText || !starRating) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (starRating < 1 || starRating > 5) {
      return new NextResponse("Star rating must be between 1 and 5", { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        reviewerName,
        reviewText,
        starRating,
        productId: params.productId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[ADMIN_REVIEW_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string; reviewId?: string } }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If reviewId is provided, delete a single review
    if (params.reviewId) {
      await prisma.review.delete({
        where: {
          id: params.reviewId,
          productId: params.productId,
        },
      });
      return new NextResponse(null, { status: 204 });
    }

    // If no reviewId, delete all reviews for the product
    await prisma.review.deleteMany({
      where: {
        productId: params.productId,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADMIN_REVIEW_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: params.productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[REVIEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 