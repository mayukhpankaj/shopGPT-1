import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/types/chat"

interface ProcessQueryRequest {
  query: string
}

interface ProcessQueryResponse {
  content: string
  type: "text" | "products"
  products?: Product[]
}

// Sample products for demonstration
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    category: "Electronics",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "Track your health and fitness with GPS, heart rate monitoring, and sleep tracking.",
    category: "Wearables",
    rating: 4.3,
    inStock: true,
  },
  {
    id: "3",
    name: "Portable Phone Charger",
    price: 29.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "10,000mAh power bank with fast charging and multiple USB ports.",
    category: "Accessories",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "4",
    name: "Ergonomic Office Chair",
    price: 299.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "Comfortable office chair with lumbar support and adjustable height.",
    category: "Furniture",
    rating: 4.2,
    inStock: true,
  },
  {
    id: "5",
    name: "4K Webcam",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "Ultra HD webcam with auto-focus and built-in microphone for video calls.",
    category: "Electronics",
    rating: 4.4,
    inStock: true,
  },
  {
    id: "6",
    name: "Mechanical Keyboard",
    price: 149.99,
    image: "/placeholder.svg?height=200&width=200",
    description: "RGB backlit mechanical keyboard with tactile switches and programmable keys.",
    category: "Electronics",
    rating: 4.6,
    inStock: true,
  },
]

// Keywords that trigger product recommendations
const productKeywords = [
  "product",
  "products",
  "buy",
  "purchase",
  "shop",
  "shopping",
  "recommend",
  "recommendation",
  "headphones",
  "watch",
  "charger",
  "chair",
  "webcam",
  "keyboard",
  "electronics",
  "gadget",
  "tech",
  "technology",
  "accessories",
  "furniture",
  "wearable",
  "device",
]

// Sample text responses
const textResponses = [
  "I'm here to help you with any questions you have! Feel free to ask me about products, recommendations, or anything else.",
  "That's an interesting question! I'd be happy to provide more information or help you find what you're looking for.",
  "I understand what you're asking. Let me know if you'd like me to show you some product recommendations or if you have other questions.",
  "Thanks for your message! I can help you with product searches, recommendations, or answer general questions.",
  "I'm ready to assist you! Whether you're looking for products or just want to chat, I'm here to help.",
]

function containsProductKeywords(query: string): boolean {
  const lowerQuery = query.toLowerCase()
  return productKeywords.some((keyword) => lowerQuery.includes(keyword))
}

function getRandomProducts(count = 3): Product[] {
  const shuffled = [...sampleProducts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getRandomTextResponse(): string {
  return textResponses[Math.floor(Math.random() * textResponses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessQueryRequest = await request.json()

    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json({ error: "Query is required and must be a string" }, { status: 400 })
    }

    const query = body.query.trim()

    // Determine response type based on query content
    const shouldShowProducts = containsProductKeywords(query)

    let response: ProcessQueryResponse

    if (shouldShowProducts) {
      // Return product recommendations
      const productCount = Math.floor(Math.random() * 4) + 3 // 3-6 products
      const products = getRandomProducts(productCount)

      response = {
        content: `Here are some great product recommendations based on your request:`,
        type: "products",
        products: products,
      }
    } else {
      // Return text response
      response = {
        content: getRandomTextResponse(),
        type: "text",
      }
    }

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST instead." }, { status: 405 })
}
