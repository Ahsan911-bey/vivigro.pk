// export type Category = "TEXTILE" | "FERTILIZER";

export type ProductImage = {
  id: string;
  url: string;
  productId: string;
};

export type ProductVideo = {
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
  category: "TEXTILE" | "FERTILIZER";
  videoUrl?: string | null;
  images: ProductImage[];
  videos?: ProductVideo[];
  createdAt: Date;
  updatedAt: Date;
};
