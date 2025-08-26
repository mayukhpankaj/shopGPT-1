"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Product } from "@/types/chat";
import Image from "next/image";
import { Star } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isOpen: boolean;
}

export function ProductModal({ product, onClose, isOpen }: ProductModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="flex flex-col h-[90vh] max-h-[90vh] w-[90vw] max-w-[625px] p-0 overflow-hidden">
        {/* <DialogHeader className="flex-shrink-0 p-6 pb-0">
          <DialogTitle className="text-2xl font-bold line-clamp-2 pr-8">{product.name}</DialogTitle>
        </DialogHeader> */}
        <div className="flex-1 overflow-y-auto p-6 pt-4 -mx-6 px-6">
          <div className="relative aspect-square w-full max-w-[500px] mx-auto rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 90vw, 600px"
            />
          </div>
          <DialogHeader className="flex-shrink-0 p-6 pb-0">
          <DialogTitle className="text-2xl font-bold line-clamp-2 pr-8">{product.name}</DialogTitle>
        </DialogHeader>
          <div className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        product.rating && i < Math.floor(product.rating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.rating?.toFixed(1)})
                </span>
              </div>
            )}
            <div className="pt-2">
              <h3 className="font-medium text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
