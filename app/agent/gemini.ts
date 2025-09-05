import { GoogleGenAI } from "@google/genai"

type Message = {
  role: 'user' | 'model' | 'system' | 'function' | 'assistant'
  content: string
  parts?: Array<{ text: string }>
}

class GeminiAgent {
  private client: GoogleGenAI
  private modelName: string

  constructor() {
    this.client = new GoogleGenAI({})
    this.modelName = "gemini-2.5-flash"
  }

  /**
   * Generate a response for a single message
   */
//   async generateResponse(content: string): Promise<string> {
//     console.log('Sending request to Gemini with content:', {
//       model: this.modelName,
//       contentLength: content.length,
//       contentPreview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
//     });
    
//     try {
//       // Add JSON response instructions to the content
//       const jsonPrompt = `Please respond with a valid JSON object that includes:
// - type: Either "text" for general conversation or "products" if recommending products
// - content: Your response text
// - products: (if type is "products") Array of product IDs

// ${content}`

//       const response = await this.client.models.generateContent({
//         model: this.modelName,
//         contents: [{ role: 'user', parts: [{ text: jsonPrompt }] }],
//         generationConfig: {
//           responseMimeType: 'application/json',
//           temperature: 0.2, // Lower temperature for more consistent responses
//           topP: 0.8,
//           topK: 40
//         }
//       } as any);
      
//       let responseText = response.text || "";
      
//       // Clean up the response if needed
//       responseText = responseText.trim();
      
//       // Remove markdown code block markers if present
//       if (responseText.startsWith('```json')) {
//         responseText = responseText.replace(/^```json\n?|\n?```$/g, '');
//       } else if (responseText.startsWith('```')) {
//         responseText = responseText.replace(/^```\n?|\n?```$/g, '');
//       }
      
//       // Ensure we have a valid response
//       if (!responseText) {
//         throw new Error('Empty response from Gemini');
//       }
      
//       console.log('Received response from Gemini:', {
//         responseLength: responseText.length,
//         responsePreview: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
//         fullResponseAvailable: responseText.length <= 200
//       });
      
//       return responseText;
//     } catch (error) {
//       console.error('Error generating response:', {
//         error: error instanceof Error ? error.message : 'Unknown error',
//         errorDetails: error,
//         contentLength: content.length,
//         contentPreview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
//       });
//       throw new Error('Failed to generate response: ' + (error instanceof Error ? error.message : 'Unknown error'));
//     }
//   }

  /**
   * Generate a response based on conversation history
   */
  async generateChatResponse(messages: Message[]): Promise<string> {
    try {
      // Define the response schema
      const assistantResponseSchema = {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['text', 'products', 'options'],
            description: 'Use "text" for general conversation and responses without choices. Use "options" when providing multiple choice buttons for user selection (specifications, categories, budget ranges, etc.) - MUST include options array. Use "products" when ready to show product search results.',
          },
          content: {
            type: 'string',
            description: "response text for User",
          },
          stage: {
            type: 'string',
            enum: ['NEW', 'ASK', 'PRODUCTS'],
            description: 'Enum for customer Journey, in the following Order Strictly: 1. "NEW" - User has a Intent/question/Query , a Intent or a question. 2. "ASK" - You ask quick short question to better undersand Product category, Specification and construct Google Search query text. 3. "PRODUCTS" -  You Create Product Search Query for Google Search and ready to show for Products.',
          },
          options: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: "List of option for ASK stage, ALWAYS Required !! when type is 'options' and stage is 'ASK'. for example - specifications, -product categories, -budget ranges, - FILTERS - any multiple choice scenarios.",
          },
          products: {
            type: 'string',
            description: "Product Search Query Text for Google Search",
          },
        },
        required: ['type', 'content', 'stage','options','products'],
      };

      // Prepare system message
      const systemMessage: Message = {
        role: 'system',
        content: `You are a helpful shopping assistant. Always respond with a valid JSON object that matches the provided schema.`
      };

      // Format messages for the API
      const formattedMessages = [
        {
          role: 'user' as const,
          parts: [{ text: systemMessage.content }]
        },
        ...messages.map(msg => ({
          role: (msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
          parts: [{ text: msg.content }]
        }))
      ];

      console.log('Sending chat request to Gemini with messages:', {
        model: this.modelName,
        messageCount: formattedMessages.length,
        lastMessage: formattedMessages[formattedMessages.length - 1]?.parts[0]?.text?.substring(0, 100) + '...'
      });

      // Make the API call with response schema
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: formattedMessages,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: assistantResponseSchema,
          thinkingConfig: {
            thinkingBudget: -1,
            // Turn off thinking:
            // thinkingBudget: 0 or 0 to 24576
            // Turn on dynamic thinking:
            // thinkingBudget: -1
          },
          temperature: 0.2,
          topP: 0.8,
          topK: 40
        }
      } as any);

      // Get and clean the response text
      let responseText = response.text?.trim() || '';
      
      // Remove markdown code block markers if present
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json\n?|\n?```$/g, '');
      } else if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```\n?|\n?```$/g, '');
      }
      
      try {
        // Parse and validate the response
        const json = JSON.parse(responseText);
        if (!json.type || !json.content) {
          console.error('Invalid response format:', json);
          throw new Error('Invalid response format: missing required fields');
        }
        // Return the cleaned and validated JSON as a string
        return JSON.stringify(json);
      } catch (e) {
        console.error('Invalid response from Gemini:', e);
        // Return a safe fallback response
        return JSON.stringify({
          type: 'text',
          content: 'I had trouble understanding that. Could you please rephrase?'
        });
      }
    } catch (error) {
      console.error('Error in generateChatResponse:', error);
      return JSON.stringify({
        type: 'text',
        content: 'I encountered an error processing your request. Please try again.'
      });
    }
  }
}

// Export a singleton instance
export const geminiAgent = new GeminiAgent();
