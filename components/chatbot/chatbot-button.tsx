"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import { ChatbotPanel } from "./chatbot-panel"
import { motion, AnimatePresence } from "framer-motion"

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-background border rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Vivigro Assistant</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ChatbotPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
