"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from 'uuid'
import type { Message } from "@/types/chat"
import { processQuery } from "@/lib/api-utils"

type Thread = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

interface UseChatReturn {
  // Message state
  messages: Message[]
  inputValue: string
  setInputValue: (value: string) => void
  isLoading: boolean
  error: string | null
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  
  // Message actions
  sendMessage: (message: string) => Promise<void>
  clearChat: () => void
  retryLastMessage: () => void
  
  // Thread state
  threads: Thread[]
  currentThreadId: string
  
  // Thread actions
  createNewThread: (title?: string) => string
  switchThread: (threadId: string) => void
  deleteThread: (threadId: string) => void
  
  // UI state
  isNewThread: boolean
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [currentThreadId, setCurrentThreadId] = useState<string>('')
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  // Load threads and messages from localStorage on mount
  useEffect(() => {
    if (isInitialized.current) return
    
    try {
      // Load threads
      const savedThreads = localStorage.getItem("chat-threads")
      if (savedThreads) {
        const parsedThreads = JSON.parse(savedThreads)
        setThreads(parsedThreads)
        
        // Set the most recent thread as current if available
        if (parsedThreads.length > 0) {
          const latestThread = [...parsedThreads].sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0]
          setCurrentThreadId(latestThread.id)
          
          // Load messages for the current thread
          const savedMessages = localStorage.getItem(`chat-messages-${latestThread.id}`)
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages))
          }
        }
      }
      
      isInitialized.current = true
    } catch (error) {
      console.error("Failed to load chat data:", error)
    }
  }, [])

  // Save threads to localStorage whenever they change
  useEffect(() => {
    if (threads.length > 0) {
      localStorage.setItem('chat-threads', JSON.stringify(threads))
    }
  }, [threads])

  // Save messages to localStorage whenever messages or currentThreadId changes
  useEffect(() => {
    if (messages.length > 0 && currentThreadId) {
      localStorage.setItem(`chat-messages-${currentThreadId}`, JSON.stringify(messages))
    }
  }, [messages, currentThreadId])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const scrollToLastMessage = useCallback(() => {
    // Get the last message
    const lastMessage = messages[messages.length - 1]
    
    // If it's a product message, scroll to the message bubble (not the very bottom)
    if (lastMessage?.type === 'products') {
      // Use a slight delay to ensure the DOM has updated
      setTimeout(() => {
        const messageElements = document.querySelectorAll('[data-message-id]')
        const lastMessageElement = messageElements[messageElements.length - 1]
        if (lastMessageElement) {
          lastMessageElement.scrollIntoView({ behavior: "smooth", block: "start" })
        } else {
          // Fallback to normal scroll
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } else {
      // For non-product messages, scroll to bottom as usual
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    scrollToLastMessage()
  }, [messages, scrollToLastMessage])

  const createNewThread = useCallback((title: string = 'New Chat') => {
    const newThread: Thread = {
      id: uuidv4(),
      title: title.length > 30 ? `${title.substring(0, 30)}...` : title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Update threads state
    setThreads(prev => {
      const updatedThreads = [newThread, ...prev]
      // Save to localStorage immediately
      localStorage.setItem('chat-threads', JSON.stringify(updatedThreads))
      return updatedThreads
    })
    
    // Set as current thread and clear messages
    setCurrentThreadId(newThread.id)
    setMessages([])
    
    return newThread.id
  }, [])

  const switchThread = useCallback((threadId: string) => {
    // Update the current thread ID
    setCurrentThreadId(threadId)
    
    // Update the thread's updatedAt timestamp
    setThreads(prev => 
      prev.map(t => 
        t.id === threadId 
          ? { ...t, updatedAt: new Date().toISOString() } 
          : t
      )
    )
    
    // Load messages for this thread
    const savedMessages = localStorage.getItem(`chat-messages-${threadId}`)
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        setMessages(parsedMessages)
        
        // If no messages found, create a welcome message
        if (parsedMessages.length === 0) {
          const welcomeMessage: Message = {
            id: `msg-${Date.now()}`,
            threadId,
            role: 'model',
            content: 'How can I help you today?',
            type: 'text',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          setMessages([welcomeMessage])
        }
      } catch (error) {
        console.error("Failed to load thread messages:", error)
        setMessages([])
      }
    } else {
      // Create a welcome message for new threads
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        threadId,
        role: 'model',
        content: 'How can I help you today?',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setMessages([welcomeMessage])
    }
  }, [])

  const deleteThread = useCallback((threadId: string) => {
    // Don't delete the last thread
    if (threads.length <= 1) return
    
    // Find the index of the thread to delete
    const threadIndex = threads.findIndex(t => t.id === threadId)
    if (threadIndex === -1) return
    
    // Determine which thread to switch to after deletion
    let newCurrentThreadId = currentThreadId
    if (currentThreadId === threadId) {
      // If we're deleting the current thread, switch to the previous one or the next one
      if (threadIndex > 0) {
        newCurrentThreadId = threads[threadIndex - 1].id
      } else {
        newCurrentThreadId = threads[threadIndex + 1].id
      }
    }
    
    // Update state
    setThreads(prev => {
      const updatedThreads = prev.filter(t => t.id !== threadId)
      // Save to localStorage immediately
      localStorage.setItem('chat-threads', JSON.stringify(updatedThreads))
      return updatedThreads
    })
    
    // Switch to another thread if we deleted the current one
    if (currentThreadId === threadId) {
      switchThread(newCurrentThreadId)
    }
    
    // Remove the thread's messages from localStorage
    localStorage.removeItem(`chat-messages-${threadId}`)
  }, [threads, currentThreadId, switchThread])

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return

      // Create a new thread if this is the first message
      const threadId = currentThreadId || createNewThread()
      const now = new Date().toISOString()

      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        threadId,
        role: "user",
        content: query.trim(),
        type: "text",
        createdAt: now,
        updatedAt: now
      }

      setMessages(prev => [...prev, userMessage])
      setInputValue("")
      setIsLoading(true)
      setError(null)

      try {
        // Update thread title if this is the first message
        if (messages.length === 0) {
          const title = query.length > 30 ? `${query.substring(0, 30)}...` : query
          setThreads(prev => 
            prev.map(t => 
              t.id === threadId 
                ? { ...t, title, updatedAt: now } 
                : t
            )
          )
        }

        // Get conversation history for context
        const conversationHistory = [
          { role: 'system' as const, content: 'You are a helpful shopping assistant.' },
          ...messages
            .filter(msg => msg.threadId === threadId)
            .map(({ role, content }) => ({ role, content }))
        ]

        // Process the query with conversation history
        const result = await processQuery({
          query: userMessage.content,
          threadId,
          messages: conversationHistory
        })

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to process query')
        }

        // Create AI response message
        const aiMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          threadId,
          role: "model",
          content: result.data.content,
          type: result.data.type,
          products: result.data.products,
          options: result.data.options,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        setMessages(prev => [...prev, aiMessage])
        
        // Update thread's updatedAt
        setThreads(prev => 
          prev.map(t => 
            t.id === threadId 
              ? { ...t, updatedAt: new Date().toISOString() } 
              : t
          )
        )
      } catch (error) {
        console.error("Error processing query:", error)
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          threadId: threadId || '',
          role: "model",
          content: "Sorry, I encountered an error. Please try again.",
          type: "text",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setMessages(prev => [...prev, errorMessage])
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, currentThreadId, messages, createNewThread],
  )

  const clearChat = useCallback(() => {
    if (!currentThreadId) return
    
    setMessages([])
    localStorage.removeItem(`chat-messages-${currentThreadId}`)
    setError(null)
    
    // Update the thread's title to indicate it's an empty chat
    setThreads(prev => 
      prev.map(t => 
        t.id === currentThreadId 
          ? { 
              ...t, 
              title: 'New Chat',
              updatedAt: new Date().toISOString() 
            } 
          : t
      )
    )
  }, [currentThreadId])

  const retryLastMessage = useCallback(() => {
    if (!currentThreadId) return
    
    // Find the last user message in the current thread
    const lastUserMessage = [...messages]
      .filter(msg => msg.threadId === currentThreadId)
      .reverse()
      .find(msg => msg.role === "user")
      
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content)
    }
  }, [messages, sendMessage, currentThreadId])

  return {
    // Message state
    messages: messages.filter(msg => msg.threadId === currentThreadId),
    inputValue,
    setInputValue,
    isLoading,
    error,
    messagesEndRef,
    
    // Message actions
    sendMessage,
    clearChat,
    retryLastMessage,
    
    // Thread state
    threads,
    currentThreadId,
    
    // Thread actions
    createNewThread: (title?: string) => createNewThread(title),
    switchThread,
    deleteThread,
    
    // UI state
    isNewThread: messages.filter(msg => msg.threadId === currentThreadId).length === 0,
  }
}
