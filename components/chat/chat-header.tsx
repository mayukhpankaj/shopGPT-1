"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, Trash2 } from "lucide-react"
import Image from "next/image"

interface ChatHeaderProps {
  onClearChat: () => void
  onRetry: () => void
  hasMessages: boolean
  isLoading: boolean
}



export function ChatHeader({ onClearChat, onRetry, hasMessages, isLoading }: ChatHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-0 flex items-center justify-between p-4 bg-transparent backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Image 
          src="/shopGPT.png" 
          alt="shopGPT Logo" 
          width={32} 
          height={32}
          className="object-contain"
        />
        <h6 className="text-xl text-gray-700">ShopGPT</h6>
      </div>

      {hasMessages && (
        <div className="flex items-center gap-2">
          {/* <Button
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
          </Button> */}
        </div>
      )}
    </header>
  )
}
