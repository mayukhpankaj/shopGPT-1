"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Trash2, MessageSquarePlus } from "lucide-react"
import { AuthSection } from "@/components/auth/auth-section"
import type { Thread } from "@/types/chat"

interface ThreadListProps {
  threads: Thread[]
  currentThreadId: string
  onThreadSelect: (threadId: string) => void
  onThreadDelete: (threadId: string) => void
  onNewThread: () => void
  onDrawerClose: () => void
}

export function ThreadList({ 
  threads, 
  currentThreadId, 
  onThreadSelect, 
  onThreadDelete, 
  onNewThread,
  onDrawerClose 
}: ThreadListProps) {
  const handleThreadSelect = (threadId: string) => {
    onThreadSelect(threadId)
    onDrawerClose()
  }

  const handleNewThread = () => {
    onNewThread()
    onDrawerClose()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  // Sort threads by updatedAt (most recent first)
  const sortedThreads = [...threads].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <>
      {/* Main Content */}
      <div className="space-y-4 pb-20">
        {/* New Chat Button */}
        <Button
          variant="outline"
          className="w-full justify-start glass-button border-purple-400/30 hover:border-purple-400/50 hover:bg-purple-400/10"
          onClick={handleNewThread}
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          New Chat
        </Button>

        {/* Thread List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-2">
            Recent Conversations
          </h3>
          
          <div className="space-y-1">
            {sortedThreads.map((thread) => (
              <div
                key={thread.id}
                className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 glass-option ${
                  thread.id === currentThreadId
                    ? 'bg-purple-400/20 border-purple-400/40'
                    : 'hover:bg-purple-400/10 hover:border-purple-400/30'
                }`}
                onClick={() => handleThreadSelect(thread.id)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {thread.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(thread.updatedAt)}
                    </p>
                  </div>
                </div>
                
                {/* Delete Button */}
                {threads.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-400/20 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      onThreadDelete(thread.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            
            {sortedThreads.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs">Start a new chat to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Section Fixed at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-400/20 bg-background/80 backdrop-blur-sm">
        <AuthSection onDrawerClose={onDrawerClose} />
      </div>
    </>
  )
}
