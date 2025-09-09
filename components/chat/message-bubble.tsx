import { ProductGrid } from "./product-grid"
import { OptionsGrid } from "./options-grid"
import type { Message } from "@/types/chat"
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  message: Message
  onOptionClick?: (option: string) => void
  onSendMessage?: (message: string) => void
  onAddDirectMessage?: (content: string, role: "user" | "model") => void
  onSetResearchLoading?: (loading: boolean) => void
}

export function MessageBubble({ message, onOptionClick, onSendMessage, onAddDirectMessage, onSetResearchLoading }: MessageBubbleProps) {
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
    // console.log("AI Message:", {
    //   type: message.type,
    //   hasOptions: !!message.options,
    //   optionsLength: message.options?.length,
    //   options: message.options,
    //   isOptionsMessage
    // })
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
            ? "glass-message text-card-foreground shadow-lg shadow-sky-500/30" 
            : "glass-message text-card-foreground"
        }`}
      >
        <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {!isUser && isProductMessage && message.products && (
          <div className="mt-4">
            <ProductGrid products={message.products} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} onSendMessage={onSendMessage} onAddDirectMessage={onAddDirectMessage} onSetResearchLoading={onSetResearchLoading} />
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
