"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ExternalLink } from "lucide-react"
import type { Product } from "@/types/chat"
import { ProductModal } from "@/components/ui/product-modal"

export interface SerpProduct extends Omit<Product, 'price' | 'originalPrice' | 'image' | 'description' | 'name'> {
  title: string;
  price: string;
  extracted_price: number;
  originalPrice?: string;
  extracted_old_price?: number;
  thumbnail: string;
  product_link: string;
  source: string;
  rating?: number;
  reviews?: number;
  delivery?: string;
  // Add other SerpAPI specific fields as needed
}

interface ProductCardProps {
  product: Product | SerpProduct;
  onViewProduct?: (product: Product | SerpProduct) => void;
  onAddToCart?: (product: Product | SerpProduct) => void;
}

export function ProductCard({ product, onViewProduct, onAddToCart }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check if the product is from SerpAPI
  const isSerpProduct = 'title' in product && 'product_link' in product;

  // Format product data based on its source
  const formattedProduct = useMemo(() => {
    if (!isSerpProduct) return product as Product;
    
    const serpProduct = product as SerpProduct;
    return {
      id: serpProduct.product_link || String(serpProduct.extracted_price + Math.random() * 1000),
      name: serpProduct.title,
      price: serpProduct.extracted_price,
      originalPrice: serpProduct.extracted_old_price,
      image: serpProduct.thumbnail || "/placeholder.svg?height=160&width=240&query=product",
      description: `Available from ${serpProduct.source}. ${serpProduct.delivery || ''}`,
      category: serpProduct.source,
      rating: serpProduct.rating,
      inStock: true,
      url: serpProduct.product_link,
      reviews: serpProduct.reviews,
    };
  }, [product, isSerpProduct]);

  const handleViewProduct = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsModalOpen(true);
    onViewProduct?.(isSerpProduct ? product : formattedProduct);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(formattedProduct);  
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSerpProduct) {
      window.open((product as SerpProduct).product_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div
        className="glass-gradient rounded-xl p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer min-h-[320px] flex flex-col group"
        onClick={(e) => {
          e.stopPropagation();
          handleViewProduct();
        }}
      >
        <div className="relative overflow-hidden rounded-md mb-4 flex-1">
          <img
            src={formattedProduct.image}
            alt={formattedProduct.name}
            className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg?height=160&width=240&query=product";
            }}
          />
          {formattedProduct.category && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">
              {formattedProduct.category}
            </Badge>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-medium text-card-foreground line-clamp-2 group-hover:text-accent transition-colors text-base leading-tight">
            {formattedProduct.name}
          </h3>

          {formattedProduct.rating !== undefined && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.floor(formattedProduct.rating || 0) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                ({formattedProduct.rating?.toFixed(1)})
                {formattedProduct.reviews !== undefined && formattedProduct.reviews > 0 && (
                  <span> · {formattedProduct.reviews.toLocaleString()}</span>
                )}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="font-semibold text-card-foreground text-lg">
                ₹{formattedProduct.price?.toLocaleString('en-IN')}
              </span>
              {formattedProduct.originalPrice && formattedProduct.originalPrice > (formattedProduct.price || 0) && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{formattedProduct.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                className="glass-button hover:bg-pink-400/20 hover:border-pink-400/40 text-card-foreground px-2 border-0"
              >
                <Heart className="h-3 w-3" />
              </Button>
              {!isSerpProduct && (
                <Button
                  size="sm"
                  className="glass-button hover:glass-option text-card-foreground px-3 border-0"
                  onClick={handleViewProduct}
                >
                  View
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ProductModal
        product={isSerpProduct ? product : formattedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
