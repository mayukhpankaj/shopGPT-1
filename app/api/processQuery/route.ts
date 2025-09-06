import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/types/chat"
import { geminiAgent } from "@/app/agent/gemini"

const SERP_API_KEY = process.env.SERP_API_KEY || '4ebd18e6add84db097c27a3a85511bbf5c2cc7ddc6f493a51cdb6e4472feb260';

interface SerpShoppingResult {
  position?: number;
  title?: string;
  product_link?: string;
  product_id?: string;
  serpapi_product_api?: string;
  immersive_product_page_token?: string;
  serpapi_immersive_product_api?: string;
  source?: string;
  source_icon?: string;
  multiple_sources?: boolean;
  price?: string;
  extracted_price?: number;
  old_price?: string;
  extracted_old_price?: number;
  rating?: number;
  reviews?: number;
  thumbnail?: string;
  serpapi_thumbnail?: string;
  delivery?: string;
}

async function SERP(query: string): Promise<SerpShoppingResult[]> {
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
    const results: SerpShoppingResult[] = data.shopping_results || [];
  
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
  type: "text" | "products" | "options"
  products?: Product[]
  options?: string[]
  stage?: 'NEW' | 'ASK' | 'PRODUCTS'
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

NEW INTENT,-> ASK Question ->  Product Search Query Text for Google Search and Show Products

you help the User in shopping journey by answering in short helpful answers, asking short questions to understand user's need, quick suggestions and finally finding user the right product. 
Ask only 1 or 2 questions at max !

keep track of user's conversation history to understand user's need, user's Idea of the product and Product Category , Specification. Give user a list of specification or category or budget.

keep track Your Position / Stage in Customer shopping journey.

when you have finally asked questions and Understood User needs and Intent and constructed Product Search Query  and ready to search for Products.

Enum for customer Journey in the following Order Strictly: 

1. "NEW" - User has a Intent or a question. 
2. "ASK" - You ask quick short question to better undersand Product category, Specification and generate a list , array of options of specification, category or budget ranges, choices, filters depending on the product depending on the product.
3. "PRODUCTS" -  You Create Product Search Query for Google Search and ready to show for Products.

in case user asks new question move back to NEW stage and ask new question.

Analyze the user's INTENT/QUERY and respond with a JSON object containing:
- type: Either "text" for general conversation  OR || "options" for short questions with list of Product category, specification, budget, choices, filters depending on the product OR || "products" if you for ready to show products. 
- content: Your response text for User
- stage: Enum for customer Journey either "NEW" OR ||  "ASK" OR || "PRODUCTS"
- options: If stage is ASK then ALWAYS. REQUIRED!! List of options of specification, category or budget ranges, choices, filters depending on the product.
- products: If stage is PRODUCTS then You are Ready to show products and formed  Product Search Query Text for Google Search


Example conversation:
User Query: "Hi" 

{"type": "text", "content": "Hello! How can I assist you with your shopping today?", "stage": "NEW"}

User Query: "I am looking for a Laptop" 
{"type": "options", "content": "Whats your use case ? Gaming , Work , College ?", "stage": "ASK", "options": ["Gaming", "Work", "College"]}

User Query: "I am looking for a Laptop for Gaming" 
{"type": "options", "content": "Whats your Budget ?", "stage": "ASK", "options": ["50000", "100000", "150000"]}

User Query: "my budget is 50000" 
{"type": "products", "content": "Here are some great laptops I found!", "stage": "PRODUCTS", "products": "laptop for gaming under 50000"}

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
    
    // Trim conversation history if it gets too long
    // Keep system message + last 16 messages (8 user-AI pairs)
    if (messages.length > 18) {
      const systemMessage = messages.find(m => m.role === 'system')
      const nonSystemMessages = messages.filter(m => m.role !== 'system')
      
      // Remove the oldest 2 messages (first user + first AI response)
      const trimmedMessages = nonSystemMessages.slice(2)
      
      // Reconstruct with system message first
      messages.length = 0
      if (systemMessage) {
        messages.push(systemMessage)
      }
      messages.push(...trimmedMessages)
    }
    
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
    let parsedResponse: { 
      type: 'text' | 'products' | 'options', 
      content: string, 
      stage: 'NEW' | 'ASK' | 'PRODUCTS',
      products?: string,
      options?: string[]
    }
    
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
            content: geminiResponse,
            stage: 'NEW'
          }
        }
      }

      // Set default stage if not provided
      if (!parsedResponse.stage) {
        parsedResponse.stage = parsedResponse.type === 'products' ? 'PRODUCTS' : 'NEW';
      }
      
      // Validate the parsed response
      if (!parsedResponse.type || !['text', 'products', 'options'].includes(parsedResponse.type)) {
        parsedResponse.type = 'text';
      }
      
      if (!parsedResponse.content) {
        parsedResponse.content = 'I received an empty response.';
      }
      
      // Ensure options is an array if type is 'options'
      if (parsedResponse.type === 'options' && !Array.isArray(parsedResponse.options)) {
        parsedResponse.options = [];
      }
    } catch (error) {
      console.error('Error processing Gemini response:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        responsePreview: geminiResponse.substring(0, 200)
      })
      
      // Fallback to a text response if parsing fails
      parsedResponse = {
        type: 'text',
        content: 'I had trouble understanding that. Could you please rephrase your request?',
        stage: 'NEW'
      }
    }

    let response: any;

    if (parsedResponse.type === 'products' && parsedResponse.products) {
      // Handle products response
      const searchQuery = Array.isArray(parsedResponse.products) 
        ? parsedResponse.products[0] 
        : parsedResponse.products;
        
      const searchResults = await SERP(searchQuery);
      response = {
        content: parsedResponse.content,
        type: "products",
        products: searchResults as unknown as Product[],
        stage: parsedResponse.stage
      }
    } else if (parsedResponse.type === 'options' && parsedResponse.options) {
      // Handle options response
      response = {
        content: parsedResponse.content,
        type: "options",
        options: parsedResponse.options,
        stage: parsedResponse.stage
      }
    } else {
      // Default to text response
      response = {
        content: parsedResponse.content,
        type: "text",
        stage: parsedResponse.stage || 'NEW'  
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
