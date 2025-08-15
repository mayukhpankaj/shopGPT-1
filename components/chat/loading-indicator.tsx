export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-primary text-primary-foreground rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
          <span className="text-sm">Thinking...</span>
        </div>
      </div>
    </div>
  )
}
