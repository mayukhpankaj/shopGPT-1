import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/types/chat"
import { geminiAgent } from "@/app/agent/gemini"

const SERP_API_KEY = process.env.SERP_API_KEY || '4ebd18e6add84db097c27a3a85511bbf5c2cc7ddc6f493a51cdb6e4472feb260';

async function SERP(query: string): Promise<any[]> {
  try {
    const baseUrl = 'https://serpapi.com/search.json';
    const params = new URLSearchParams({
      engine: 'google_shopping',
      q: query,
      location: 'India',
      google_domain: 'google.co.in',
      gl: 'in',
      hl: 'en',
      num: '9',
      api_key: SERP_API_KEY
    });

    console.log('Fetching products with query:', query);
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`SerpAPI request failed with status ${response.status}`);
    }

    const data = await response.json();
    const results = data.shopping_results || [];
  
    // Return only the first 9 products
    return results.slice(0, 9);
    
  } catch (error) {
    console.error('Error in SERP function:', error);
    return [];
  }
}

interface ProcessQueryRequest {
  query: string
  // Optional conversation history
  messages?: Array<{
    role: 'user' | 'model' | 'system'
    content: string
  }>
}

interface ProcessQueryResponse {
  content: string
  type: "text" | "products"
  products?: Product[]
  messages?: Array<{
    role: 'user' | 'model' | 'system'
    content: string
  }>
}

// System prompt for Gemini
// const SYSTEM_PROMPT = `You are a helpful shopping assistant. 

// Analyze the user's query and respond with a JSON object containing:
// - type: Either "products" if the user is looking to buy something, or "text" for general conversation
// - content: Your response text
// - products: (only if type is "products") An array of relevant product IDs from the available products

// Available products (format: [id] - [name] - [category]):
// 1 - Wireless Bluetooth Headphones - Electronics
// 2 - Smart Fitness Watch - Wearables
// 3 - Portable Phone Charger - Accessories
// 4 - Ergonomic Office Chair - Furniture
// 5 - 4K Webcam - Electronics
// 6 - Mechanical Keyboard - Electronics

// Example responses:
// {"type": "products", "content": "Here are some great headphones I found!", "products": ["1"]}
// {"type": "text", "content": "Hello! How can I assist you with your shopping today?"}`


const SYSTEM_PROMPT = `You are a helpful conversational shopping assistant.

Your role is similar to a shop assistant, who asks customer questions, Understand need , product fit and finally show the right product to the customer.

3 steps

Query-> Ask Question ->  Product Search Query Text for Google Search and Show Products

you help the User in shopping journey by answering in short helpful answers, asking short questions to understand user's need, quick suggestions and finally finding user the right product. 
Ask only 1 or 2 questions at max !

keep track of user's conversation history to understand user's need, user's Idea of the product and Product Category , Specification. 

keep track Your Position / Stage in Customer shopping journey.

when you have finally asked questions and Understood User needs and Intent and constructed Product Search Query  and ready to search for Products.

Enum for customer Journey in the following Order Strictly: 

1. "query" - User has a query , a Intent or a question. 
2. "ask" - You ask quick short question to better undersand Product category, Specification and construct Google Search query text.
3. "products" -  You Create Product Search Query for Google Search and ready to show for Products.


Analyze the user's query and respond with a JSON object containing:
- type: Either "products" if You are ready to show Products, or "text" for general conversation, short questions
- content: Your response text for User
- stage: Enum for customer Journey either "query" or "ask" or "products"
- products: You are Ready to show products and formed  Product Search Query Text for Google Search


Example conversation:
User Query: "Hi" 

{"type": "text", "content": "Hello! How can I assist you with your shopping today?", "stage": "query"}

User Query: "I am looking for a Laptop" 
{"type": "text", "content": "Whats your use case ? Gaming , Work , College ?", "stage": "ask"}

User Query: "I am looking for a Laptop for Gaming" 
{"type": "text", "content": "Whats your Budget ?", "stage": "ask"}

User Query: "my budget is 50000" 

{"type": "products", "content": "Here are some great laptops I found!", "products": "laptop for gaming under 50000"}

`


export async function POST(request: NextRequest) {
  try {
    const body: ProcessQueryRequest = await request.json()

    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json({ error: "Query is required and must be a string" }, { status: 400 })
    }

    const query = body.query.trim()
    
    // Start with system message if this is a new conversation
    const messages = body.messages || [
      { role: 'system' as const, content: SYSTEM_PROMPT }
    ]
    
    // Add the new user message
    messages.push({ role: 'user' as const, content: query })
    
    // Filter out system messages as Gemini only accepts 'user' and 'model' roles
    const geminiMessages = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role as 'user' | 'model',
        content: msg.content
      }))
    
    // Include system prompt in the first user message if this is a new conversation
    if (messages.some(m => m.role === 'system')) {
      geminiMessages[0] = {
        role: 'user' as const,
        content: `System Instructions: ${SYSTEM_PROMPT}\n\nUser Query: ${geminiMessages[0]?.content || ''}`
      }
    }
    
    // Get response from Gemini with conversation history
    const geminiResponse = await geminiAgent.generateChatResponse(geminiMessages)
    
    // Add the model's response to the conversation history
    messages.push({ role: 'model' as const, content: geminiResponse })
    
    // Parse Gemini's response
    let parsedResponse: { type: 'text' | 'products', content: string, products?: string[] }
    
    try {
      // First, try to parse the entire response as JSON
      try {
        parsedResponse = JSON.parse(geminiResponse)
      } catch (e) {
        // If direct parse fails, try to extract JSON from the response
        const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0])
        } else {
          // If no JSON found, treat it as a text response
          parsedResponse = {
            type: 'text',
            content: geminiResponse
          }
        }
      }

      // Validate the parsed response
      if (!parsedResponse.type || !['text', 'products'].includes(parsedResponse.type)) {
        parsedResponse.type = 'text'
      }
      if (!parsedResponse.content) {
        parsedResponse.content = 'I received an empty response.'
      }
    } catch (error) {
      console.error('Error processing Gemini response:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        responsePreview: geminiResponse.substring(0, 200)
      })
      
      // Fallback to a text response if parsing fails
      parsedResponse = {
        type: 'text',
        content: 'I had trouble understanding that. Could you please rephrase your request?'
      }
    }

    let response: ProcessQueryResponse

    if (parsedResponse.type === 'products' && parsedResponse.products) {
      // Ensure we have a string for the search query
      const searchQuery = Array.isArray(parsedResponse.products) 
        ? parsedResponse.products[0] 
        : parsedResponse.products;
        
      // Get the actual product objects using the search query
      const searchResults = await SERP(searchQuery);
      // console.log('Search results:', searchResults);
      response = {
        content: parsedResponse.content,
        type: "products",
        products: searchResults as unknown as Product[], // Type assertion to match expected type
      }
    } else {
      // Return text response
      response = {
        content: parsedResponse.content,
        type: "text",
      }
    }

    // Return the response along with the updated conversation history
    return NextResponse.json({
      ...response,
      messages // Return the updated conversation history
    })
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST instead." }, { status: 405 })
}
