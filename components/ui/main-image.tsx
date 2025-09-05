"use client"

import React from 'react';
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MainImageProps {
  src: string;
  alt: string;
  className?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
  currentIndex?: number;
  totalImages?: number;
}

export function MainImage({ 
  src, 
  alt, 
  className = "", 
  onPrevious, 
  onNext, 
  showNavigation = false,
  currentIndex = 0,
  totalImages = 1
}: MainImageProps) {
  return (
    <div className={`relative aspect-[4/3] w-full max-w-md rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center group ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Navigation Buttons */}
      {showNavigation && totalImages > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={onPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 glass-button p-2 rounded-full 
                     opacity-0 group-hover:opacity-100 transition-all duration-300
                     hover:bg-purple-400/20 hover:border-purple-400/40 hover:scale-110
                     shadow-lg hover:shadow-xl"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400 hover:text-white transition-colors duration-300" />
          </button>
          
          {/* Right Arrow */}
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 glass-button p-2 rounded-full 
                     opacity-0 group-hover:opacity-100 transition-all duration-300
                     hover:bg-purple-400/20 hover:border-purple-400/40 hover:scale-110
                     shadow-lg hover:shadow-xl"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-gray-400 hover:text-white transition-colors duration-300" />
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-2 right-2 glass-card px-2 py-1 rounded-md
                        opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-xs text-white font-medium">
              {currentIndex + 1} / {totalImages}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
