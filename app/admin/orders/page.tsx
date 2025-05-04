"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { updateOrderStatus } from "@/app/actions";

type Order = {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  first_name: string;
  last_name: string;
  email: string;
  items: {
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.isAdmin) {
      router.push("/");
      return;
    }

    fetchOrders();
  }, [session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: "COMPLETED" | "FAILED") => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, orderStatus: newStatus }
          : order
      ));

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusCounts = () => {
    return {
      completed: orders.filter(order => order.orderStatus === "COMPLETED").length,
      failed: orders.filter(order => order.orderStatus === "FAILED").length,
      pending: orders.filter(order => order.orderStatus === "PENDING").length,
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {/* Status Counts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-green-600 dark:text-green-400">Completed Orders</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{statusCounts.completed}</p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center gap-3">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-sm text-red-600 dark:text-red-400">Failed Orders</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{statusCounts.failed}</p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-center gap-3">
          <Clock className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending Orders</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{statusCounts.pending}</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-semibold">
                  Order #{order.id.slice(-6)} - {order.first_name} {order.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">{order.email}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold">PKR {order.totalAmount.toFixed(2)}</p>
                <div className="flex gap-2">
                  {order.orderStatus === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleStatusUpdate(order.id, "COMPLETED")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleStatusUpdate(order.id, "FAILED")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark Failed
                      </Button>
                    </>
                  )}
                  {order.orderStatus === "COMPLETED" && (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Completed
                    </span>
                  )}
                  {order.orderStatus === "FAILED" && (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      Failed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>PKR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 