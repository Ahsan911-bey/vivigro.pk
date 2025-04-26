import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import HomeClient from "./HomeClient";

async function getFeaturedProducts() {
  const [fertilizers, textiles] = await Promise.all([
    prisma.product.findMany({
      where: { category: Category.FERTILIZER },
      take: 8,
      include: { images: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { category: Category.TEXTILE },
      take: 4,
      include: { images: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { fertilizers, textiles };
}

export default async function Home() {
  const { fertilizers, textiles } = await getFeaturedProducts();
  return <HomeClient fertilizers={fertilizers} textiles={textiles} />;
}
