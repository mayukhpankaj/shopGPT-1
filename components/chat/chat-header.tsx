"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Trash2, MessageSquarePlus } from "lucide-react"
import Image from "next/image"
import { Drawer } from "@/components/ui/drawer"
import { ThreadList } from "./thread-list"
import type { Thread } from "@/types/chat"

interface ChatHeaderProps {
  onClearChat: () => void
  onRetry: () => void
  hasMessages: boolean
  isLoading: boolean
  threads: Thread[]
  currentThreadId: string
  onThreadSelect: (threadId: string) => void
  onThreadDelete: (threadId: string) => void
  onNewThread: () => void
}



export function ChatHeader({ 
  onClearChat, 
  onRetry, 
  hasMessages, 
  isLoading, 
  threads, 
  currentThreadId, 
  onThreadSelect, 
  onThreadDelete, 
  onNewThread 
}: ChatHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-100 flex items-center justify-between p-4 bg-transparent backdrop-blur-xm">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Image 
            src="/shopGPT.png" 
            alt="shopGPT Logo" 
            width={32} 
            height={32}
            className="object-contain"
            onContextMenu={(e) => e.preventDefault()}
          />
          {!hasMessages && (
            <h6 className="text-xl text-gray-700">ShopGPT</h6>
          )}
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

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <ThreadList
          threads={threads}
          currentThreadId={currentThreadId}
          onThreadSelect={onThreadSelect}
          onThreadDelete={onThreadDelete}
          onNewThread={onNewThread}
          onDrawerClose={() => setIsDrawerOpen(false)}
        />
      </Drawer>
    </>
  )
}
