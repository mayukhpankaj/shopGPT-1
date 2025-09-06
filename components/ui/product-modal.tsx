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
  const displayRatings = detailedProduct?.ratings || [];
  const displayUserReviews = detailedProduct?.user_reviews || [];
  const displayMoreOptions = detailedProduct?.more_options || [];

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
      <DialogContent className="flex flex-col h-[90vh] max-h-[90vh] w-[70vw] p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-gray-100/20">
          <DialogTitle className="text-2xl font-bold line-clamp-2 pr-8 text-gray-700">
            {displayTitle}
            {displayBrand && <span className="text-lg font-medium text-gray-500 ml-2">by {displayBrand}</span>}
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

          {/* Main Content: Responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
            {/* Left Column: Product Images */}
            <div className="col-span-1 lg:col-span-3">
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

            {/* Right Column: Stores */}
            <div className="col-span-1 lg:col-span-2">
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
                          <span className="font-medium text-xs text-foreground truncate">
                            {store.name.length > 15 ? store.name.substring(0, 15) + '...' : store.name}
                          </span>
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

          {/* Horizontal Separator */}
          {displayRating && displayRatings.length > 0 && (
            <div className="border-t border-gray-200 my-6"></div>
          )}

          {/* Row 2: Rating Section */}
          {displayRating && displayRatings.length > 0 && (
            <div className="w-full">
              <h3 className="font-semibold text-foreground mb-4 text-lg">Reviews</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
                {/* Left Column: Rating Summary */}
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Overall Rating */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                      {displayRating?.toFixed(1)}
                    </div>
                    <div className="flex items-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.floor(displayRating || 0) 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {displayReviews?.toLocaleString()} reviews
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="flex-1 min-w-0">
                    {[5, 4, 3, 2, 1].map((starLevel) => {
                      const ratingData = displayRatings.find((r: any) => r.stars === starLevel);
                      const amount = ratingData?.amount || 0;
                      const percentage = displayReviews ? (amount / displayReviews) * 100 : 0;
                      
                      return (
                        <div key={starLevel} className="flex items-center gap-3 mb-2 group">
                          <div className="flex items-center gap-1 w-8 relative flex-shrink-0">
                            <span className="text-sm text-gray-600 font-medium group-hover:opacity-0 transition-opacity duration-300">
                              {starLevel}
                            </span>
                            <span className="text-sm text-purple-600 font-medium absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {amount.toLocaleString()}
                            </span>
                            <Star className="h-3 w-3 fill-gray-600 text-gray-600 group-hover:opacity-0 transition-opacity duration-300" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-0">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: User Reviews */}
                <div className="max-h-80 overflow-y-auto">
                  {displayUserReviews.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {displayUserReviews.slice(0, 5).map((review: any, index: number) => (
                        <div key={index} className="glass-card p-3 sm:p-4 rounded-lg border border-gray-100/20">
                          {/* Star Rating & Date */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= review.rating 
                                      ? "fill-yellow-400 text-yellow-400" 
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">{review.date}</span>
                          </div>

                          {/* Review Text */}
                          <p className="text-sm text-foreground mb-3 line-clamp-3">
                            {review.text}
                          </p>

                          {/* User Name & Source */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              {review.icon && (
                                <img 
                                  src={review.icon} 
                                  alt={`${review.user_name} avatar`}
                                  className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                                />
                              )}
                              <span className="text-sm font-medium text-foreground truncate">{review.user_name}</span>
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{review.source}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-4 rounded-lg border border-gray-100/20">
                      <div className="text-sm text-muted-foreground text-center">
                        No user reviews available yet.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Horizontal Separator */}
          {displayMoreOptions.length > 0 && (
            <div className="border-t border-gray-200 my-6"></div>
          )}

          {/* You May Like Section */}
          {displayMoreOptions.length > 0 && (
            <div className="w-full">
              <h3 className="font-semibold text-foreground mb-4 text-lg">You may like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayMoreOptions.slice(0, 8).map((suggestion: any, index: number) => (
                  <div 
                    key={index} 
                    className="glass-card p-4 rounded-lg border border-gray-100/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    onClick={() => suggestion.serpapi_link && window.open(suggestion.serpapi_link, '_blank', 'noopener,noreferrer')}
                  >
                    {/* Title */}
                    <h4 className="font-medium text-sm text-foreground mb-3 line-clamp-2 leading-tight">
                      {suggestion.title}
                    </h4>

                    {/* Thumbnail */}
                    <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={suggestion.thumbnail}
                        alt={suggestion.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=128&width=200&query=product";
                        }}
                      />
                    </div>

                    {/* Rating Stars */}
                    {suggestion.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= Math.floor(suggestion.rating) 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({suggestion.rating?.toFixed(1)})
                        </span>
                        {suggestion.reviews && suggestion.reviews > 0 && (
                          <span className="text-xs text-gray-400">
                            · {suggestion.reviews.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {suggestion.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
