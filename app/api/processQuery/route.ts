import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/types/chat"
import { geminiAgent } from "@/app/agent"

interface ProcessQueryRequest {
  query: string
}

interface ProcessQueryResponse {
  content: string
  type: "text" | "products"
  products?: Product[]
}

// System prompt for Gemini
const SYSTEM_PROMPT = `You are a helpful shopping assistant. Analyze the user's query and respond with a JSON object containing:
- type: Either "products" if the user is looking to buy something, or "text" for general conversation
- content: Your response text
- products: (only if type is "products") An array of relevant product IDs from the available products

Available products (format: [id] - [name] - [category]):
1 - Wireless Bluetooth Headphones - Electronics
2 - Smart Fitness Watch - Wearables
3 - Portable Phone Charger - Accessories
4 - Ergonomic Office Chair - Furniture
5 - 4K Webcam - Electronics
6 - Mechanical Keyboard - Electronics

Example responses:
{"type": "products", "content": "Here are some great headphones I found!", "products": ["1"]}
{"type": "text", "content": "Hello! How can I assist you with your shopping today?"}`

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

// Helper function to find products by IDs
function getProductsByIds(ids: string[]): Product[] {
  return sampleProducts.filter(product => ids.includes(product.id))
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessQueryRequest = await request.json()

    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json({ error: "Query is required and must be a string" }, { status: 400 })
    }

    const query = body.query.trim()
    
    // Get response from Gemini
    const prompt = `${SYSTEM_PROMPT}\n\nUser query: ${query}\n\nRespond with a valid JSON object only.`
    const geminiResponse = await geminiAgent.generateResponse(prompt)
    
    // Parse Gemini's response
    let parsedResponse: { type: 'text' | 'products', content: string, products?: string[] }
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in response')
      parsedResponse = JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error parsing Gemini response:', error)
      throw new Error('Failed to parse AI response')
    }

    let response: ProcessQueryResponse

    if (parsedResponse.type === 'products' && parsedResponse.products?.length) {
      // Get the actual product objects for the recommended IDs
      const products = getProductsByIds(parsedResponse.products)
      response = {
        content: parsedResponse.content,
        type: "products",
        products: products,
      }
    } else {
      // Return text response
      response = {
        content: parsedResponse.content,
        type: "text",
      }
    }

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
