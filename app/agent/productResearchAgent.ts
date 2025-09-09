import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export interface ProductResearchParams {
  product_link: string;
  product_name: string;
}

export interface ProductResearchResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export async function researchProduct({ product_link, product_name }: ProductResearchParams): Promise<ProductResearchResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ` You are a Research agent for Shopping app. Always send text in markdown format.
        Your task is to Summarise the product, its features, its best price and Rating where the product stands in rating on scale of 1 to 5,
         also summarise the feedback by customers.

         Example: Use proper Heading and Subheading, lists and proper formatting
         
         here is the product Link for url context ${product_link}`,
      ],
      config: {
        tools: [{urlContext: {}}],
      },
    });

    const responseText = response.text;
    console.log('Product Research Response:', responseText);
    console.log('Full Response Metadata:', response);

    return {
      success: true,
      data: responseText
    };
  } catch (error) {
    console.error('Error in product research:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
