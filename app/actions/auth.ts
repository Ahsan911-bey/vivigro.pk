"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUserAction(data: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    // Input validation
    if (!data.email || !data.password || !data.name) {
      return { error: "All fields are required" };
    }

    if (data.password.length < 6) {
      return { error: "Password must be at least 6 characters long" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existingUser) {
      return { error: "Email already exists" };
    }

    // Hash password and create user
    const hashedPassword = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: "USER", // Default role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to register user",
    };
  }
}

export async function getUserByEmailAction(email: string) {
  try {
    if (!email) {
      return { error: "Email is required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return { user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}
