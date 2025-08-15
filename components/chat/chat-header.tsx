"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, RotateCcw, Trash2 } from "lucide-react"

interface ChatHeaderProps {
  onClearChat: () => void
  onRetry: () => void
  hasMessages: boolean
  isLoading: boolean
}

export function ChatHeader({ onClearChat, onRetry, hasMessages, isLoading }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card/50">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-8 w-8 text-accent" />
        <h1 className="text-xl font-semibold text-foreground">ChatBot</h1>
      </div>

      {hasMessages && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isLoading}
            className="hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Retry
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearChat}
            disabled={isLoading}
            className="hover:bg-destructive hover:text-destructive-foreground bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </header>
  )
}
