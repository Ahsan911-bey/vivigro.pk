"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { createOrder, getCartItems, clearCart } from "@/app/actions";
import { useSession } from "next-auth/react";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "PAYFAST">(
    "STRIPE"
  );

  useEffect(() => {
    async function loadCartItems(userId: string) {
      const result = await getCartItems(userId);
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
        return;
      }
      setItems(result.data || []);
      setIsLoadingCart(false);

      // If cart is empty, redirect to cart page
      if (!result.data || result.data.length === 0) {
        router.push("/cart");
      }
    }

    if (!session?.user?.id) {
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    loadCartItems(session.user.id);
  }, [session, router, toast]);

  // Show loading state while checking cart
  if (isLoadingCart) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading checkout...</p>
      </div>
    );
  }

  // If no items or no session, don't render the form
  if (items.length === 0 || !session?.user) {
    return null;
  }

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const shippingData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
    };

    const subtotal = getTotalPrice();
    const shipping = 500;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    try {
      // Create the order
      const result = await createOrder({
        userId: session.user.id,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: total,
        paymentMethod: paymentMethod,
        first_name: shippingData.firstName,
        last_name: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Handle payment processing here based on payment method
      if (paymentMethod === "STRIPE") {
        // Implement Stripe payment processing
        // For now, we'll just simulate success
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        // Implement PayFast redirect
        // For now, we'll just simulate success
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Clear the cart after successful order
      await clearCart(session.user.id);

      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });

      router.push("/");
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: "Order failed",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = 500;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input name="firstName" id="firstName" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input name="lastName" id="lastName" required />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" id="email" type="email" required />
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="phone">Phone</Label>
                  <Input name="phone" id="phone" type="tel" required />
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="address">Address</Label>
                  <Input name="address" id="address" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input name="city" id="city" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input name="state" id="state" required />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as "STRIPE" | "PAYFAST")
                  }
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="STRIPE" id="stripe" />
                    <Label htmlFor="stripe" className="flex items-center">
                      <span className="ml-2">Credit Card (Stripe)</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PAYFAST" id="payfast" />
                    <Label htmlFor="payfast" className="flex items-center">
                      <span className="ml-2">PayFast</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "STRIPE" && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" name="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "PAYFAST" && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      You will be redirected to PayFast to complete your payment
                      after placing your order.
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 sticky top-20">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-gray-500 block text-sm">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span>
                    PKR {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>PKR {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>PKR {tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>PKR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
