"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
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
import { Category, OrderStatus, Role } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

// Add formatPrice utility
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

interface AdminDashboardClientProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
  };
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: Category;
    images: { url: string }[];
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
    zip: string;
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
    videoUrl: "",
  });

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
      videoUrl: "",
    });
  };

  // Handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      if (!response.ok) throw new Error("Failed to create product");
      router.refresh();
      resetProductForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              color="green"
            />
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
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          quantity: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value: Category) =>
                        setProductForm({ ...productForm, category: value })
                      }
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

                  {/* Video URL input */}
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      type="text"
                      value={productForm.videoUrl}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          videoUrl: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Images input (multiple URLs) */}
                  <div className="space-y-2">
                    <Label>Image URLs</Label>
                    {productForm.images.map((url, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input
                          type="text"
                          value={url}
                          onChange={(e) => {
                            const newImages = [...productForm.images];
                            newImages[idx] = e.target.value;
                            setProductForm({ ...productForm, images: newImages });
                          }}
                          placeholder={`Image URL #${idx + 1}`}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newImages = productForm.images.filter((_, i) => i !== idx);
                            setProductForm({ ...productForm, images: newImages });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setProductForm({
                          ...productForm,
                          images: [...productForm.images, ""],
                        })
                      }
                    >
                      Add Image URL
                    </Button>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Product"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {/* Grouped Product Display */}
<div className="space-y-10">
  {/* Fertilizers Section */}
  <div className="mt-10">
    <h3 className="text-2xl text-center font-semibold mb-2 text-green-400">Fertilizers</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products
        .filter((product) => product.category === "FERTILIZER")
        .map((product) => (
          <Card key={product.id} className="p-4">
            {product.images[0] && (
              <div className="relative h-48 mb-4">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-2 flex justify-between items-center">
              <p className="font-bold">{formatPrice(product.price)}</p>
              <Badge>{product.category}</Badge>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm">Stock: {product.quantity}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
    </div>
  </div>

  {/* Textiles Section */}
  <div>
    <h3 className="text-2xl text-center font-semibold text-blue-300 mb-2">Textiles</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products
        .filter((product) => product.category === "TEXTILE")
        .map((product) => (
          <Card key={product.id} className="p-4">
            {product.images[0] && (
              <div className="relative h-48 mb-4">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-2 flex justify-between items-center">
              <p className="font-bold">{formatPrice(product.price)}</p>
              <Badge>{product.category}</Badge>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm">Stock: {product.quantity}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
    </div>
  </div>
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
                          order.status === "PAID"
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
                            <SelectItem value="PAID">Paid</SelectItem>
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
                                    <p>{order.city}, {order.state} {order.zip}</p>
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
                          disabled={isLoading || order.status == "PENDING"}
                        >
                          Remove Order
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
