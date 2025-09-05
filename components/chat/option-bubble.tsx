"use client"

import { Button } from "@/components/ui/button"

interface OptionBubbleProps {
  option: string
  onClick: (option: string) => void
  className?: string
}

export function OptionBubble({ option, onClick, className = "" }: OptionBubbleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick(option)}
      className={`
        glass-option text-card-foreground transition-all duration-200 
        rounded-full px-4 py-2 text-sm font-medium hover:scale-105
        shadow-lg hover:shadow-xl hover:bg-purple-400/20 hover:border-purple-400/40 hover:text-purple-300
        ${className}
      `}
    >
      {option}
    </Button>
  )
}
