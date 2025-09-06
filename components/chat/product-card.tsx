"use client"

import React, { useState, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ExternalLink } from "lucide-react"
import type { Product } from "@/types/chat"
import { ProductModal } from "@/components/ui/product-modal"
import { ProductLoadingOverlay } from "@/components/ui/product-loading-overlay"

export interface SerpProduct extends Omit<Product, 'price' | 'originalPrice' | 'image' | 'description' | 'name'> {
  position?: number;
  title?: string;
  product_link?: string;
  product_id?: string;
  serpapi_product_api?: string;
  immersive_product_page_token?: string;
  serpapi_immersive_product_api?: string;
  source?: string;
  source_icon?: string;
  multiple_sources?: boolean;
  price?: string;
  extracted_price?: number;
  old_price?: string;
  extracted_old_price?: number;
  rating?: number;
  reviews?: number;
  thumbnail?: string;
  serpapi_thumbnail?: string;
  delivery?: string;
}

interface ProductCardProps {
  product: Product | SerpProduct;
  onViewProduct?: (product: Product | SerpProduct) => void;
  onAddToCart?: (product: Product | SerpProduct) => void;
}

export function ProductCard({ product, onViewProduct, onAddToCart }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isShowingLoadingOverlay, setIsShowingLoadingOverlay] = useState(false)
  const [detailedProduct, setDetailedProduct] = useState<any>(null)
  const productDetailsCache = useRef<{ [key: string]: any }>({})

  // Check if the product is from SerpAPI
  const isSerpProduct = 'title' in product && 'product_link' in product;

  // Format product data based on its source
  const formattedProduct = useMemo(() => {
    if (!isSerpProduct) return product as Product;
    
    const serpProduct = product as SerpProduct;
    return {
      id: serpProduct.product_id || serpProduct.product_link || String((serpProduct.extracted_price || 0) + Math.random() * 1000),
      name: serpProduct.title || 'Unknown Product',
      price: serpProduct.extracted_price || 0,
      originalPrice: serpProduct.extracted_old_price,
      image: serpProduct.thumbnail || "/placeholder.svg?height=160&width=240&query=product",
      description: `Available from ${serpProduct.source || 'Unknown Source'}. ${serpProduct.delivery || ''}`,
      source: (serpProduct.source || 'Unknown').length > 15 ? (serpProduct.source || 'Unknown').substring(0, 15) + '..' : (serpProduct.source || 'Unknown'),
      rating: serpProduct.rating,
      inStock: true,
      url: serpProduct.product_link,
      reviews: serpProduct.reviews,
      position: serpProduct.position,
      title: serpProduct.title,
      product_link: serpProduct.product_link,
      product_id: serpProduct.product_id,
      serpapi_product_api: serpProduct.serpapi_product_api,
      immersive_product_page_token: serpProduct.immersive_product_page_token,
      serpapi_immersive_product_api: serpProduct.serpapi_immersive_product_api,
      source_icon: serpProduct.source_icon,
      multiple_sources: serpProduct.multiple_sources,
      extracted_price: serpProduct.extracted_price,
      old_price: serpProduct.old_price,
      extracted_old_price: serpProduct.extracted_old_price,
      thumbnail: serpProduct.thumbnail,
      serpapi_thumbnail: serpProduct.serpapi_thumbnail,
      delivery: serpProduct.delivery,
    };
  }, [product, isSerpProduct]);

  const handleViewProduct = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onViewProduct?.(product);
    
    // Use product_id as cache key
    const productId = formattedProduct.product_id || formattedProduct.id;
    
    // Check if we already have cached details for this product
    if (productDetailsCache.current[productId]) {
      console.log('Using cached product details for:', productId);
      setDetailedProduct(productDetailsCache.current[productId]);
      setIsModalOpen(true);
      return;
    }
    
    // For non-SERP products or products without API URL, open modal immediately
    if (!isSerpProduct || !formattedProduct.serpapi_immersive_product_api) {
      setIsModalOpen(true);
      return;
    }
    
    // Show loading overlay for SERP products that need API call
    setIsShowingLoadingOverlay(true);
    setIsLoadingDetails(true);
    
    try {
      const response = await fetch('/api/productDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serpapi_immersive_product_api: formattedProduct.serpapi_immersive_product_api
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched product details for:', productId, data);
        
        // Cache the detailed product data using product_id as key
        productDetailsCache.current[productId] = data.product_results;
        setDetailedProduct(data.product_results);
      } else {
        console.error('Failed to fetch product details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setIsLoadingDetails(false);
      setIsShowingLoadingOverlay(false);
      // Open modal after loading is complete (whether successful or not)
      setIsModalOpen(true);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);  
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
        <div className="relative overflow-hidden rounded-md mb-4 h-40 bg-gray-50 flex items-center justify-center">
          <img
            src={formattedProduct.image}
            alt={formattedProduct.name}
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg?height=160&width=240&query=product";
            }}
          />
        </div>

        <div className="flex flex-col flex-1">
          {/* Fixed 2 lines for product title */}
          <div className="h-12 mb-2">
            <h3 className="font-medium text-card-foreground line-clamp-2 group-hover:text-accent transition-colors text-base leading-6">
              {formattedProduct.name}
            </h3>
          </div>

          {/* Fixed 1 line for rating and reviews */}
          <div className="h-5 mb-2">
            {formattedProduct.rating !== null && (
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
          </div>

          {/* Source badge */}
          {formattedProduct.source && (
            <div className="mb-2">
              <Badge className="bg-gray-100 text-gray-foreground text-xs flex items-center gap-1">
                {formattedProduct.source_icon && (
                  <img 
                    src={formattedProduct.source_icon} 
                    alt={`${formattedProduct.source} icon`}
                    className="w-3 h-3 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                {formattedProduct.source}
              </Badge>
            </div>
          )} 

          {/* Spacer to push price/buttons to bottom */}
          <div className="flex-1"></div>

          {/* Fixed bottom line for price and buttons with proper spacing */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100/20">
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
      
      <ProductLoadingOverlay 
        isOpen={isShowingLoadingOverlay}
        productName={formattedProduct.name}
      />
      
      <ProductModal
        product={isSerpProduct ? product : formattedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        detailedProduct={detailedProduct}
        isLoadingDetails={isLoadingDetails}
      />
    </>
  );
}
