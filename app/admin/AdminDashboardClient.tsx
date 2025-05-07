"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Define string literal types for client-side usage
export type Category = "TEXTILE" | "FERTILIZER";
export type OrderStatus = "PENDING" | "COMPLETED" | "FAILED";
export type Role = "USER" | "ADMIN";

// Add formatPrice utility
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

interface AdminDashboardClientProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    completedOrders: number;
    failedOrders: number;
    pendingOrders: number;
  };
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: Category;
    images: { url: string }[];
    sizeOptions: string[];
    packagingType: string | null;
    type: string | null;
    reviews: {
      id: string;
      reviewerName: string;
      reviewText: string;
      starRating: number;
    }[];
  }[];
  orders: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    items: {
      id: string;
      productId: string;
      orderId: string;
      quantity: number;
      price: number;
      product: {
        name: string;
        price: number;
      };
    }[];
    stock_updated: boolean;
  }[];
  users: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
    _count: {
      orders: number;
      cartItems: number;
    };
  }[];
}

export default function AdminDashboardClient({
  stats,
  products,
  orders,
  users,
}: AdminDashboardClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "TEXTILE" as Category,
    images: [] as string[],
    videos: [] as string[],
    sizeOptions: [] as string[],
    packagingType: "",
    type: "",
  });

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    reviewerName: "",
    reviewText: "",
    starRating: 5,
  });

  // Add state for editing
  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: Category;
    images: { url: string }[];
    videos: { url: string }[];
    sizeOptions: string[];
    packagingType: string | null;
    type: string | null;
  } | null>(null);

  // Order Status Update State
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");

  // Order Statuses for each order
  const [orderStatuses, setOrderStatuses] = useState<
    Record<string, OrderStatus>
  >({});

  // Reset product form after submission
  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "TEXTILE" as Category,
      images: [],
      videos: [],
      sizeOptions: [],
      packagingType: "",
      type: "",
    });
    setEditingProduct(null);
  };

  // Reset review form
  const resetReviewForm = () => {
    setReviewForm({
      reviewerName: "",
      reviewText: "",
      starRating: 5,
    });
  };

  // Handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      
      const response = await fetch(url, {
        method: editingProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          images: productForm.images,
          videos: productForm.videos,
          sizeOptions: productForm.sizeOptions,
          packagingType: productForm.packagingType,
          type: productForm.type,
        }),
      });
      if (!response.ok) throw new Error(editingProduct ? "Failed to update product" : "Failed to create product");
      router.refresh();
      resetProductForm();
      toast({
        title: "Success",
        description: editingProduct ? "Product updated successfully" : "Product created successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReview = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });

      if (!response.ok) throw new Error("Failed to add review");

      router.refresh();
      resetReviewForm();
      toast({
        title: "Success",
        description: "Review added successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add review",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (productId: string, reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete review");

      router.refresh();
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete review",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllReviews = async (productId: string) => {
    if (!confirm("Are you sure you want to delete ALL reviews for this product?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/reviews`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete all reviews");
      router.refresh();
      toast({
        title: "Success",
        description: "All reviews deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete all reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      images: product.images.map((img: any) => img.url),
      videos: product.videos?.map((vid: any) => vid.url) || [],
      sizeOptions: product.sizeOptions,
      packagingType: product.packagingType,
      type: product.type,
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete product");
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update order status");
      setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderComplete = async (orderId: string) => {
    if (!confirm("Are you sure you want to mark this order as finished? This will remove the order and update product stock.")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "Order marked as finished and stock updated.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async (orderId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      toast({
        title: "Success",
        description: "Stock updated for this order.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update stock",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto min-h-[48px] gap-1 p-1">
          <TabsTrigger value="overview" className="px-3 py-2.5 text-xs sm:text-sm whitespace-nowrap">Overview</TabsTrigger>
          <TabsTrigger value="products" className="px-3 py-2.5 text-xs sm:text-sm whitespace-nowrap">Products</TabsTrigger>
          <TabsTrigger value="orders" className="px-3 py-2.5 text-xs sm:text-sm whitespace-nowrap">Orders</TabsTrigger>
          <TabsTrigger value="users" className="px-3 py-2.5 text-xs sm:text-sm whitespace-nowrap">Users</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Revenue"
              value={stats.totalRevenue}
              icon={DollarSign}
              color="blue"
              formatter={formatPrice}
            />
           <Card className="flex items-center gap-4 p-6">
              <ShoppingCart className="h-10 w-10 text-green-500 bg-green-100 rounded-full p-2" />
              <div className="w-full">
                <div className="text-muted-foreground text-sm">Total Orders</div>
                <div className="flex items-center justify-between w-full mt-2">
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <div className="flex gap-2 items-center">
                    <span className="flex items-center text-green-600 text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> {stats.completedOrders}
                    </span>
                    <span className="flex items-center text-yellow-600 text-sm font-semibold">
                      <Clock className="h-4 w-4 mr-1" /> {stats.pendingOrders}
                    </span>
                    <span className="flex items-center text-red-600 text-sm font-semibold">
                      <XCircle className="h-4 w-4 mr-1" /> {stats.failedOrders}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              color="purple"
            />
            <StatsCard
              title="Total Customers"
              value={stats.totalCustomers}
              icon={Users}
              color="orange"
            />
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Products</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Product</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={productForm.quantity}
                        onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value: Category) => setProductForm({ ...productForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEXTILE">Textile</SelectItem>
                          <SelectItem value="FERTILIZER">Fertilizer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sizeOptions">Size Options (comma-separated)</Label>
                    <Input
                      id="sizeOptions"
                      value={productForm.sizeOptions.join(", ")}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        sizeOptions: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="e.g., 1kg, 5kg, 10kg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="packagingType">Packaging Type</Label>
                      <Input
                        id="packagingType"
                        value={productForm.packagingType}
                        onChange={(e) => setProductForm({ ...productForm, packagingType: e.target.value })}
                        placeholder="e.g., Bag, Bottle, Box"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        value={productForm.type}
                        onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                        placeholder="e.g., Organic, Chemical, Liquid"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Image URLs</Label>
                    {productForm.images.map((url, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input
                          type="text"
                          value={url}
                          onChange={e => {
                            const newImages = [...productForm.images];
                            newImages[idx] = e.target.value;
                            setProductForm({ ...productForm, images: newImages });
                          }}
                          placeholder="Enter image URL"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setProductForm({
                              ...productForm,
                              images: productForm.images.filter((_, i) => i !== idx),
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ""] })}
                    >
                      Add Image URL
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Video URLs</Label>
                    {productForm.videos.map((url, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input
                          type="text"
                          value={url}
                          onChange={e => {
                            const newVideos = [...productForm.videos];
                            newVideos[idx] = e.target.value;
                            setProductForm({ ...productForm, videos: newVideos });
                          }}
                          placeholder="Enter video URL"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setProductForm({
                              ...productForm,
                              videos: productForm.videos.filter((_, i) => i !== idx),
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setProductForm({ ...productForm, videos: [...productForm.videos, ""] })}
                    >
                      Add Video URL
                    </Button>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="space-y-4">
                  {product.images[0] && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <p className="font-bold mt-2">{formatPrice(product.price)}</p>
                    <div className="mt-2">
                      <Badge variant="outline">{product.category}</Badge>
                      {product.type && <Badge variant="outline" className="ml-2">{product.type}</Badge>}
                      {product.packagingType && <Badge variant="outline" className="ml-2">{product.packagingType}</Badge>}
                    </div>
                    {product.sizeOptions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Size Options:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.sizeOptions.map((size, index) => (
                            <Badge key={index} variant="secondary">{size}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Reviews</h4>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAllReviews(product.id)}
                        disabled={isLoading}
                        className="mb-2"
                      >
                        Remove All Reviews
                      </Button>
                      {product.reviews?.map((review) => (
                        <div key={review.id} className="border rounded p-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{review.reviewerName}</p>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < review.starRating ? "text-yellow-400" : "text-gray-300"}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <p className="text-sm mt-1">{review.reviewText}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(product.id, review.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Add Review</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Review</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={(e) => { e.preventDefault(); handleAddReview(product.id); }} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="reviewerName">Reviewer Name</Label>
                              <Input
                                id="reviewerName"
                                value={reviewForm.reviewerName}
                                onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reviewText">Review Text</Label>
                              <Textarea
                                id="reviewText"
                                value={reviewForm.reviewText}
                                onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="starRating">Star Rating</Label>
                              <Select
                                value={reviewForm.starRating.toString()}
                                onValueChange={(value) => setReviewForm({ ...reviewForm, starRating: parseInt(value) })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <SelectItem key={rating} value={rating.toString()}>
                                      {rating} {rating === 1 ? "Star" : "Stars"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button type="submit" disabled={isLoading}>
                              {isLoading ? "Adding..." : "Add Review"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <h2 className="text-2xl font-bold">Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.user.name}</td>
                    <td className="px-4 py-2">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        className={
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Select
                          value={orderStatuses[order.id] || order.status}
                          onValueChange={(value: OrderStatus) => {
                            handleOrderStatusUpdate(order.id, value);
                          }}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="whitespace-nowrap min-w-[80px]">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] w-[90vw]">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <h3 className="font-semibold text-lg">Customer Information</h3>
                                  <div className="space-y-2">
                                    <p><span className="font-medium">Name:</span> {order.first_name} {order.last_name}</p>
                                    <p className="break-all"><span className="font-medium">Email:</span> {order.email}</p>
                                    <p><span className="font-medium">Phone:</span> {order.phone}</p>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <h3 className="font-semibold text-lg">Shipping Address</h3>
                                  <div className="space-y-2">
                                    <p className="break-words">{order.address}</p>
                                    <p>{order.city}, {order.state}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                                <div className="space-y-3">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                      <div>
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                      </div>
                                      <p>{formatPrice(item.product.price * item.quantity)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total Amount:</span>
                                  <span>{formatPrice(order.totalAmount)}</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="default"
                          size="sm"
                          className="whitespace-nowrap min-w-[80px] bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleOrderComplete(order.id)}
                          disabled={isLoading || order.status === "PENDING" || order.status === "COMPLETED"}
                        >
                          Remove Order
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="whitespace-nowrap min-w-[80px] bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleUpdateStock(order.id)}
                          disabled={isLoading || order.status !== "COMPLETED" || order.stock_updated}
                        >
                          {order.stock_updated ? "Stock Updated" : "Update Stock"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Orders</th>
                  <th className="px-4 py-2 text-left">Cart Items</th>
                  <th className="px-4 py-2 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <Badge
                        className={
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">{user._count.orders}</td>
                    <td className="px-4 py-2">{user._count.cartItems}</td>
                    <td className="px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  formatter = (val: number) => val.toString(),
}: {
  title: string;
  value: number;
  icon: any;
  color: "blue" | "green" | "purple" | "orange";
  formatter?: (val: number) => string;
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  const [bgColor, textColor] = colorClasses[color].split(" ", 2);

  return (
    <Card className="p-6">
      <div className="flex items-center">
        <div className={`rounded-full ${bgColor} p-3`}>
          <Icon className={`h-8 w-8 ${textColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{formatter(value)}</p>
        </div>
      </div>
    </Card>
  );
}
