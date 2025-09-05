"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";
import { Star, Loader2, ExternalLink, Truck, ShoppingCart } from "lucide-react";
import { MainImage } from "./main-image";
import type { Product } from "@/types/chat";
import type { SerpProduct } from "@/components/chat/product-card";

type FormattedProduct = Product & {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
};

interface ProductModalProps {
  product: (Product | SerpProduct) | null;
  onClose: () => void;
  isOpen: boolean;
  detailedProduct?: any;
  isLoadingDetails?: boolean;
}

export function ProductModal({ product, onClose, isOpen, detailedProduct, isLoadingDetails }: ProductModalProps) {
  if (!product) return null;

  // Format product data based on its source
  const isSerpProduct = 'title' in product && 'product_link' in product;
  const formattedProduct: FormattedProduct = isSerpProduct 
    ? {
        ...product as SerpProduct,
        name: (product as any).title || 'Unknown Product',
        price: (product as any).extracted_price || 0,
        originalPrice: (product as any).extracted_old_price,
        image: (product as any).thumbnail || '/placeholder.jpg',
        description: (product as any).snippet || 'No description available',
        rating: (product as any).rating,
        reviews: (product as any).reviews,
        id: (product as any).product_id || (product as any).product_link || 'unknown',
        source: (product as any).source || 'Unknown',
        product_id: (product as any).product_id,
        product_link: (product as any).product_link,
        serpapi_immersive_product_api: (product as any).serpapi_immersive_product_api,
        source_icon: (product as any).source_icon,
        multiple_sources: (product as any).multiple_sources,
        extracted_price: (product as any).extracted_price,
        old_price: (product as any).old_price,
        extracted_old_price: (product as any).extracted_old_price,
        thumbnail: (product as any).thumbnail,
        serpapi_thumbnail: (product as any).serpapi_thumbnail,
        delivery: (product as any).delivery,
      } as FormattedProduct
    : {
        ...product as Product,
        name: (product as Product).name || 'Unknown Product',
        price: (product as Product).price || 0,
        image: (product as Product).image || '/placeholder.jpg',
        description: (product as Product).description || 'No description available',
      } as FormattedProduct;

  // Use detailed product data if available, otherwise fall back to basic product data
  const displayTitle = detailedProduct?.title || formattedProduct.name;
  const displayBrand = detailedProduct?.brand;
  const displayThumbnails = detailedProduct?.thumbnails || [formattedProduct.image];
  const displayStores = detailedProduct?.stores || [];
  const displayRating = detailedProduct?.rating || formattedProduct.rating;
  const displayReviews = detailedProduct?.reviews || formattedProduct.reviews;

  // State for selected main image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = displayThumbnails[selectedImageIndex] || formattedProduct.image;

  // Navigation handlers with circular navigation
  const handlePreviousImage = () => {
    if (selectedImageIndex === 0) {
      setSelectedImageIndex(displayThumbnails.length - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex === displayThumbnails.length - 1) {
      setSelectedImageIndex(0);
    } else {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || displayThumbnails.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePreviousImage();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedImageIndex, displayThumbnails.length]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="flex flex-col h-[90vh] max-h-[90vh] w-[90vw] p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-gray-100/20">
          <DialogTitle className="text-2xl font-bold line-clamp-2 pr-8">
            {displayTitle}
            {displayBrand && <span className="text-lg font-medium text-muted-foreground ml-2">by {displayBrand}</span>}
          </DialogTitle>
          <DialogDescription className="sr-only">Product details modal</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400" style={{maxHeight: 'calc(90vh - 120px)'}}>
          {/* Loading state for detailed product info */}
          {isLoadingDetails && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading detailed information...</span>
              </div>
            </div>
          )}

          {/* Main Content: 2-column layout */}
          <div className="grid grid-cols-5 gap-6">
            {/* Left Column: Product Images (80% width) */}
            <div className="col-span-4">
              {/* Main Product Image */}
              <MainImage
                src={selectedImage}
                alt={displayTitle}
                className="mb-4"
                onPrevious={handlePreviousImage}
                onNext={handleNextImage}
                showNavigation={displayThumbnails.length > 1}
                currentIndex={selectedImageIndex}
                totalImages={displayThumbnails.length}
              />
              {/* Thumbnail Images Row */}
              {displayThumbnails.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {displayThumbnails.map((thumbnail: string, index: number) => (
                    <div 
                      key={index} 
                      className={`flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden bg-gray-50 cursor-pointer transition-all ${
                        selectedImageIndex === index 
                          ? 'ring-2 ring-purple-400 ring-offset-2' 
                          : 'hover:opacity-80'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={thumbnail}
                        alt={`${displayTitle} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Stores (20% width) */}
            <div className="col-span-1">
              <h3 className="font-semibold text-foreground mb-3">Available at</h3>
              
              {displayStores.length > 0 ? (
                <div className="space-y-1">
                  {displayStores.slice(0, 4).map((store: any, index: number) => (
                    <div 
                      key={index} 
                      className="glass-card p-1.5 rounded-lg border border-gray-100/20 cursor-pointer hover:bg-purple-400/10 transition-colors"
                      onClick={() => store.link && window.open(store.link, '_blank', 'noopener,noreferrer')}
                    >
                      {/* Store Header & Price */}
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5">
                          {store.logo && (
                            <img 
                              src={store.logo} 
                              alt={`${store.name} logo`}
                              className="w-3 h-3 object-contain"
                            />
                          )}
                          <span className="font-medium text-xs text-foreground truncate">{store.name}</span>
                        </div>
                        <span className="font-semibold text-xs text-purple-400">{store.price}</span>
                      </div>

                      {/* Shipping & Rating */}
                      <div className="flex items-center justify-between text-xs">
                        {store.shipping && (
                          <div className="flex items-center gap-1">
                            <Truck className="h-2.5 w-2.5 text-black" />
                            <span className="text-black">{store.shipping}</span>
                          </div>
                        )}
                        
                        {store.rating && (
                          <div className="flex items-center gap-0.5">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-2.5 w-2.5 ${
                                    i < Math.floor(parseFloat(store.rating)) 
                                      ? "fill-yellow-400 text-yellow-400" 
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-muted-foreground">{store.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-3 rounded-lg border border-gray-100/20">
                  <div className="text-sm text-muted-foreground">
                    Price information will be available once detailed data loads.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
