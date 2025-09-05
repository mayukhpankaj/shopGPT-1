import { type NextRequest, NextResponse } from "next/server"

const SERP_API_KEY = process.env.SERP_API_KEY || '4ebd18e6add84db097c27a3a85511bbf5c2cc7ddc6f493a51cdb6e4472feb260';

interface ProductDetailsRequest {
  serpapi_immersive_product_api: string
}

interface ProductDetailsResponse {
  product_results?: any
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductDetailsRequest = await request.json()

    if (!body.serpapi_immersive_product_api || typeof body.serpapi_immersive_product_api !== "string") {
      return NextResponse.json({ error: "serpapi_immersive_product_api is required and must be a string" }, { status: 400 })
    }

    // Append API key to the SERP API URL
    const apiUrl = `${body.serpapi_immersive_product_api}&api_key=${SERP_API_KEY}`;

    console.log('Fetching product details from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`SERP API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract product_results from the response
    const productResults = data.product_results;
    
    if (!productResults) {
      return NextResponse.json({ error: "No product results found in API response" }, { status: 404 });
    }

    return NextResponse.json({
      product_results: productResults
    });

  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST instead." }, { status: 405 })
}
