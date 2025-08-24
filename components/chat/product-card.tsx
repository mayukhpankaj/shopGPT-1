"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "@/types/chat"

interface ProductCardProps {
  product: Product
  onViewProduct?: (product: Product) => void
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onViewProduct, onAddToCart }: ProductCardProps) {
  const handleViewProduct = () => {
    onViewProduct?.(product)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.(product)
  }

  console.log(product)
  return (
    <div
      className="bg-card rounded-lg p-5 border hover:shadow-lg transition-all duration-200 cursor-pointer group min-h-[320px] flex flex-col"
      onClick={handleViewProduct}
    >
      <div className="relative overflow-hidden rounded-md mb-4">
        <img
          src={product.image || "/placeholder.svg?height=160&width=240&query=product"}
          alt={product.name}
          className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
        {product.category && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">{product.category}</Badge>
        )}
      </div>

      <div className="flex flex-col flex-1 space-y-3">
        <h3 className="font-medium text-card-foreground line-clamp-2 group-hover:text-accent transition-colors text-base leading-tight">
          {product.name}
        </h3>

        {/* <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed flex-1">{product.description}</p> */}

        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.rating})</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex flex-col">
            <span className="font-semibold text-card-foreground text-lg">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCart}
              className="hover:bg-accent hover:text-accent-foreground transition-colors bg-transparent px-2"
            >
              <ShoppingCart className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-3"
              onClick={handleViewProduct}
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
