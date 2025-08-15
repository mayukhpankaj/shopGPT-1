"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Message } from "@/types/chat"
import { processQuery } from "@/lib/api-utils"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat-messages")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed)
      } catch (error) {
        console.error("Failed to load saved messages:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        content: query.trim(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputValue("")
      setIsLoading(true)
      setError(null)

      try {
        const result = await processQuery(userMessage.content)

        if (result.error) {
          throw new Error(result.error)
        }

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          type: "ai",
          content: result.data!.content,
          aiType: result.data!.type,
          products: result.data!.products,
        }

        setMessages((prev) => [...prev, aiMessage])
      } catch (error) {
        console.error("Error processing query:", error)
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          aiType: "text",
        }
        setMessages((prev) => [...prev, errorMessage])
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const clearChat = useCallback(() => {
    setMessages([])
    localStorage.removeItem("chat-messages")
    setError(null)
  }, [])

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find((msg) => msg.type === "user")
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content)
    }
  }, [messages, sendMessage])

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    clearChat,
    retryLastMessage,
    isNewThread: messages.length === 0,
  }
}
