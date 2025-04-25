import { NextResponse } from "next/server";
import { seedProducts } from "@/lib/seed-data";

export async function POST() {
  try {
    const result = await seedProducts();

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to seed products", error },
      { status: 500 }
    );
  }
}
