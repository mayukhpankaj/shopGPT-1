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

  const isUser = message.role === "user"
  const isProductMessage = message.type === "products" && message.products && message.products.length > 0

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser 
            ? "bg-card text-card-foreground border border-border ml-auto" 
            : "bg-card text-card-foreground border border-border mr-auto"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>

        {!isUser && isProductMessage && message.products && (
          <div className="mt-4">
            <ProductGrid products={message.products} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} />
          </div>
        )}
      </div>
    </div>
  )
}
