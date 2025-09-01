export interface Message {
  id: string
  threadId: string
  role: "user" | "model" | "system"
  content: string
  type?: "text" | "products"
  products?: Product[]
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  category?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  url?: string
}
