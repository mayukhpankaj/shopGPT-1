import { ProductGrid } from "./product-grid"
import { OptionsGrid } from "./options-grid"
import type { Message } from "@/types/chat"

interface MessageBubbleProps {
  message: Message
  onOptionClick?: (option: string) => void
}

export function MessageBubble({ message, onOptionClick }: MessageBubbleProps) {
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
  const isOptionsMessage = message.type === "options" && message.options && message.options.length > 0

  // Debug logging
  if (!isUser) {
    console.log("AI Message:", {
      type: message.type,
      hasOptions: !!message.options,
      optionsLength: message.options?.length,
      options: message.options,
      isOptionsMessage
    })
  }

  const handleOptionClick = (option: string) => {
    if (onOptionClick) {
      onOptionClick(option)
    }
  }

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`} data-message-id={message.id}>
      <div
        className={`max-w-[80%] rounded-xl p-4 ${
          isUser 
            ? "glass-message text-card-foreground" 
            : "glass-message text-card-foreground"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>

        {!isUser && isProductMessage && message.products && (
          <div className="mt-4">
            <ProductGrid products={message.products} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} />
          </div>
        )}
      </div>

      {!isUser && isOptionsMessage && message.options && (
        <div className="mt-3 max-w-[80%]">
          <OptionsGrid options={message.options} onOptionClick={handleOptionClick} />
        </div>
      )}
    </div>
  )
}
