import { Category } from "@prisma/client";

export type ProductImage = {
  id: string;
  url: string;
  productId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: Category;
  videoUrl?: string | null;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
};
