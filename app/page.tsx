"use client"

import type React from "react"
import { MessageBubble } from "@/components/chat/message-bubble"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatHeader } from "@/components/chat/chat-header"
import { LoadingIndicator } from "@/components/chat/loading-indicator"
import { ErrorBanner } from "@/components/chat/error-banner"
import { useChat } from "@/hooks/use-chat"

export default function ChatInterface() {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    clearChat,
    retryLastMessage,
    isNewThread,
  } = useChat()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleDismissError = () => {
    // Error will be cleared on next successful message
  }

  const handleOptionClick = (option: string) => {
    // Send the selected option as a new user message
    sendMessage(option)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader
        onClearChat={clearChat}
        onRetry={retryLastMessage}
        hasMessages={messages.length > 0}
        isLoading={isLoading}
      />

      {error && <ErrorBanner error={error} onDismiss={handleDismissError} onRetry={retryLastMessage} />}

      <div className="flex-1 overflow-y-auto relative z-10">
        {messages.length > 0 && (
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} onOptionClick={handleOptionClick} />
            ))}

            {isLoading && <LoadingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isNewThread={isNewThread}
      />
    </div>
  )
}
