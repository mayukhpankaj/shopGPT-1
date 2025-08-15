export interface Message {
  id: string
  type: "user" | "ai"
  content: string
  aiType?: "text" | "products"
  products?: Product[]
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
  inStock?: boolean
}
