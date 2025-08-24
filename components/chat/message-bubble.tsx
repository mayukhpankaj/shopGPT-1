import { ProductGrid } from "./product-grid"
import type { Message } from "@/types/chat"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const handleViewProduct = (product: any) => {
    console.log("View product:", product)
    // TODO: Implement product view functionality
  }

  const handleAddToCart = (product: any) => {
    console.log("Add to cart:", product)
    // TODO: Implement add to cart functionality
  }

  return (
    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          message.type === "user" ? "bg-secondary text-secondary-foreground" : "bg-card text-card-foreground border border-border"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>

        {message.type === "ai" && message.aiType === "products" && message.products && (
          <div className="mt-4">
            <ProductGrid products={message.products} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} />
          </div>
        )}
      </div>
    </div>
  )
}
