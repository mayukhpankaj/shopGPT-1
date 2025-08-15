"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle } from "lucide-react"

interface ChatInputProps {
  inputValue: string
  setInputValue: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  isNewThread: boolean
}

export function ChatInput({ inputValue, setInputValue, onSubmit, isLoading, isNewThread }: ChatInputProps) {
  const inputContainerClass = isNewThread
    ? "fixed inset-0 flex items-center justify-center p-4"
    : "sticky bottom-0 bg-background/80 backdrop-blur-sm border-t p-4"

  return (
    <div className={inputContainerClass}>
      <div className="w-full max-w-2xl">
        {isNewThread && (
          <div className="text-center mb-6">
            <MessageCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground">Ask me anything or request product recommendations</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-input border-border focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
