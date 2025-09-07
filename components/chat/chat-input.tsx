"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle } from "lucide-react"
import Image from "next/image"

interface ChatInputProps {
  inputValue: string
  setInputValue: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  isNewThread: boolean
}

export function ChatInput({ inputValue, setInputValue, onSubmit, isLoading, isNewThread }: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const inputContainerClass = isNewThread
    ? "fixed inset-0 flex items-center justify-center p-4 z-50"
    : "sticky bottom-0 glass-message border-t p-4 flex justify-center z-50"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setIsTyping(false)
  }

  return (
    <div className={inputContainerClass}>
      <div className="w-full max-w-2xl">
        {isNewThread && (
          <div className="text-center mb-6">
            <Image 
              src="/shopGPT.png" 
              alt="shopGPT Logo" 
              width={64} 
              height={64}
              className="mx-auto mb-4 object-contain"
            />
            <h2 className="text-2xl font-semibold text-foreground mb-2">What are you shopping today ?</h2>
            {/* <p className="text-muted-foreground">Ask me anything or request product recommendations</p> */}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex gap-2">
          <div className="flex gap-2 w-full max-w-xl mx-auto">
            <div className="relative flex-1">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="what are you shopping today ?"
                className="w-full glass-button placeholder:text-muted-foreground border-2 border-purple-400/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-300/20 text-card-foreground"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              className="glass-button hover:bg-purple-400/20 text-card-foreground border-2 border-purple-400/30 hover:border-purple-500/50 bg-transparent transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
