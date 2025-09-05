"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";
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
import Image from "next/image";
import { Star } from "lucide-react";

interface ProductModalProps {
  product: (Product | SerpProduct) | null;
  onClose: () => void;
  isOpen: boolean;
}

export function ProductModal({ product, onClose, isOpen }: ProductModalProps) {
  if (!product) return null;

  // Format product data based on its source
  const isSerpProduct = 'title' in product && 'product_link' in product;
  const formattedProduct: FormattedProduct = isSerpProduct 
    ? {
        ...product as SerpProduct,
        name: (product as any).title || 'Unknown Product',
        price: (product as any).extracted_price || 0,
        originalPrice: (product as any).extracted_old_price,
        image: (product as any).thumbnail || "/placeholder.svg?height=160&width=240&query=product",
        description: `Available from ${(product as any).source || 'Unknown Source'}. ${(product as any).delivery || ''}`,
        category: (product as any).source || 'Unknown',
        url: (product as any).product_link,
      }
    : product as Product;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="flex flex-col h-[90vh] max-h-[90vh] w-[90vw] max-w-[625px] p-0 overflow-hidden">
        {/* <DialogHeader className="flex-shrink-0 p-6 pb-0">
          <DialogTitle className="text-2xl font-bold line-clamp-2 pr-8">{product.name}</DialogTitle>
        </DialogHeader> */}
        <div className="flex-1 overflow-y-auto p-6 pt-4 -mx-6 px-6">
          <div className="relative aspect-square w-full max-w-[500px] mx-auto rounded-lg overflow-hidden mb-4">
            <Image
              src={formattedProduct.image}
              alt={formattedProduct.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 90vw, 600px"
            />
          </div>
          <DialogHeader className="flex-shrink-0 p-6 pb-0">
            <DialogTitle className="text-2xl font-bold line-clamp-2 pr-8">{formattedProduct.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Product details for {formattedProduct.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">₹{formattedProduct.price?.toLocaleString('en-IN')}</span>
              {formattedProduct.originalPrice && formattedProduct.originalPrice > (formattedProduct.price || 0) && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{formattedProduct.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {formattedProduct.rating && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        formattedProduct.rating && i < Math.floor(formattedProduct.rating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-1">
                  ({formattedProduct.rating?.toFixed(1)})
                  {formattedProduct.reviews !== undefined && formattedProduct.reviews > 0 && (
                    <span> · {formattedProduct.reviews.toLocaleString()}</span>
                  )}
                </span>
              </div>
            )}
            <div className="pt-2">
              <h3 className="font-medium text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
                {formattedProduct.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
