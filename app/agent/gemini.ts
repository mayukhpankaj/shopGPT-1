import { GoogleGenAI } from "@google/genai"

type Message = {
  role: 'user' | 'model'
  content: string
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
  async generateResponse(content: string): Promise<string> {
    console.log('Sending request to Gemini with content:', {
      model: this.modelName,
      contentLength: content.length,
      contentPreview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
    });
    
    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: content,
      });
      
      const responseText = response.text || "I'm sorry, I couldn't generate a response.";
      
      console.log('Received response from Gemini:', {
        responseLength: responseText.length,
        responsePreview: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
        fullResponseAvailable: responseText.length <= 200
      });
      
      return responseText;
    } catch (error) {
      console.error('Error generating response:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorDetails: error,
        contentLength: content.length,
        contentPreview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
      });
      throw new Error('Failed to generate response: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Generate a response in a chat-like format with conversation history
   */
  async generateChatResponse(messages: Message[]): Promise<string> {
    try {
      // Format the conversation history
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))

      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: formattedMessages,
      })

      return response.text || "I'm sorry, I couldn't generate a response."
    } catch (error) {
      console.error('Error in chat generation:', error)
      throw new Error('Failed to generate chat response')
    }
  }
}

// Export a singleton instance
export const geminiAgent = new GeminiAgent()
