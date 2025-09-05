export interface Message {
  id: string
  threadId: string
  role: "user" | "model" | "system"
  content: string
  type?: "text" | "products" | "options"
  products?: Product[]
  options?: string[]
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
  source?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  url?: string
  // SERP-specific properties
  position?: number
  title?: string
  product_link?: string
  product_id?: string
  serpapi_product_api?: string
  immersive_product_page_token?: string
  serpapi_immersive_product_api?: string
  source_icon?: string
  multiple_sources?: boolean
  extracted_price?: number
  old_price?: string
  extracted_old_price?: number
  thumbnail?: string
  serpapi_thumbnail?: string
  delivery?: string
}
