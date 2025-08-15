import type { Product } from "@/types/chat"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Product[]
  onViewProduct?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductGrid({ products, onViewProduct, onAddToCart, className = "" }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No products found</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
