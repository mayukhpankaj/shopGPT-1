import type { Product } from "@/types/chat"
import { ProductCard } from "./product-card"
import { v4 as uuidv4 } from 'uuid'

// Re-export the SerpProduct type from product-card to ensure consistency
import type { SerpProduct } from "./product-card";

type ProductType = Product | SerpProduct;

interface ProductGridProps {
  products: ProductType[]
  onViewProduct?: (product: ProductType) => void
  onAddToCart?: (product: ProductType) => void
  onSendMessage?: (message: string) => void
  onAddDirectMessage?: (content: string, role: "user" | "model") => void
  onSetResearchLoading?: (loading: boolean) => void
  className?: string
}

export function ProductGrid({ products, onViewProduct, onAddToCart, onSendMessage, onAddDirectMessage, onSetResearchLoading, className = "" }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No products found</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {products.map((product, index) => (
        <ProductCard 
          key={uuidv4()} 
          product={product} 
          onViewProduct={onViewProduct} 
          onAddToCart={onAddToCart}
          onSendMessage={onSendMessage}
          onAddDirectMessage={onAddDirectMessage}
          onSetResearchLoading={onSetResearchLoading}
        />
      ))}
    </div>
  )
}
