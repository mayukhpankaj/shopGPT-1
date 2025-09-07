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
    <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-xl flex items-center justify-center z-20">
      <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
    </div>
  );
}
