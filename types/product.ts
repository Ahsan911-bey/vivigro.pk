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

export type Review = {
  id: string;
  reviewerName: string;
  reviewText: string;
  starRating: number;
  createdAt: Date;
  updatedAt: Date;
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
  sizeOptions: string[];
  packagingType: string | null;
  type: string | null;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
};
