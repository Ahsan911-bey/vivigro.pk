import type { CartItem } from "./cart"

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  paymentMethod: "Stripe" | "PayFast"
  status: "pending" | "paid" | "failed"
}
