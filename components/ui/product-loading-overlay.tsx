"use client"

import React from 'react';
import { Loader2 } from "lucide-react";

interface ProductLoadingOverlayProps {
  isOpen: boolean;
  productName?: string;
}

export function ProductLoadingOverlay({ isOpen, productName }: ProductLoadingOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20 max-w-sm mx-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">Loading Product Details</h3>
            {productName && (
              <p className="text-sm text-muted-foreground line-clamp-2">{productName}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
