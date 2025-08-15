import type { Product } from "@/types/chat"

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

export async function processQuery(query: string): Promise<
  ApiResponse<{
    content: string
    type: "text" | "products"
    products?: Product[]
  }>
> {
  try {
    const response = await fetch("/api/processQuery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.error || "Failed to process query",
        status: response.status,
      }
    }

    return {
      data,
      status: response.status,
    }
  } catch (error) {
    console.error("API call failed:", error)
    return {
      error: "Network error occurred",
      status: 500,
    }
  }
}
