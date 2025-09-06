"use client"

import React from "react"
import { PanelLeft } from "lucide-react"
import { Button } from "./button"
import Image from "next/image"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-140 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-[22%] min-w-[300px] bg-background border-r shadow-lg z-150 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Image 
            src="/shopGPT.png" 
            alt="shopGPT Logo" 
            width={32} 
            height={32}
            className="object-contain"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <PanelLeft className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  )
}
