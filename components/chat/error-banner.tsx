"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, X, RotateCcw } from "lucide-react"

interface ErrorBannerProps {
  error: string
  onDismiss: () => void
  onRetry: () => void
}

export function ErrorBanner({ error, onDismiss, onRetry }: ErrorBannerProps) {
  return (
    <div className="p-4">
      <Alert variant="destructive" className="relative">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="pr-8">{error}</AlertDescription>
        <div className="absolute right-2 top-2 flex gap-1">
          <Button variant="ghost" size="sm" onClick={onRetry} className="h-6 w-6 p-0">
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDismiss} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </Alert>
    </div>
  )
}
