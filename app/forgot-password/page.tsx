"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset request
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, you will receive a password reset link.",
      })
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was an error sending the reset link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border rounded-lg p-8 shadow-sm"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-gray-500 mt-2">Enter your email to receive a password reset link</p>
          </div>

          {isSubmitted ? (
            <div className="text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-6">
                <p className="text-emerald-600 dark:text-emerald-400">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please check your email and follow the instructions to reset your password.
                </p>
              </div>

              <Button asChild variant="outline" className="mt-4">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-emerald-600 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
