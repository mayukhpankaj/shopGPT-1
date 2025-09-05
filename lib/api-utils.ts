import type { Product } from "@/types/chat"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

export interface ProcessQueryParams {
  query: string
  threadId: string
  messages: Array<{
    role: 'user' | 'model' | 'system'
    content: string
  }>
}

export async function processQuery(params: ProcessQueryParams): Promise<
  ApiResponse<{
    content: string
    type: "text" | "products" | "options"
    products?: Product[]
    options?: string[]
    stage?: 'query' | 'ask' | 'products'
  }>
> {
  try {
    const response = await fetch("/api/processQuery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to process query",
        status: response.status,
      }
    }

    return {
      success: true,
      data: data.data || data, // Handle both formats for backward compatibility
      status: response.status,
    }
  } catch (error) {
    console.error("API call failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
      status: 500,
    }
  }
}
