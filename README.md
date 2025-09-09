# ShopGPT - AI-Powered Shopping Assistant

![ShopGPT Banner](public/shopGPT.png)

ShopGPT is an intelligent shopping assistant that combines the power of conversational AI with product discovery. Built with Next.js and powered by Gemini AI, it provides a seamless shopping experience through natural language interactions.

## ✨ Features

### 🤖 AI-Powered Shopping Assistant
- Natural language product search and recommendations
- Context-aware conversations with shopping intent recognition
- Markdown-formatted responses with rich product information
- Multi-turn conversations for refined product searches

### 🛍️ Product Discovery
- Intelligent product research using web search capabilities
- Detailed product analysis with features, pricing, and ratings
- Side-by-side product comparisons
- Personalized recommendations based on user preferences

### 🎨 Modern UI/UX
- Clean, responsive interface that works on all devices
- Real-time typing indicators and message streaming
- Interactive product cards with images and key details
- Dark/light theme support
- Smooth animations and transitions

### 🔧 Technical Highlights
- Built with Next.js 14 App Router for optimal performance
- Type-safe development with TypeScript
- Modern UI components with shadcn/ui and Tailwind CSS v4
- Serverless API routes for scalable backend operations
- Efficient state management with React hooks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Google Gemini API key
- (Optional) SerpAPI key for enhanced product search

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shopgpt.git
   cd shopgpt
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SERPAPI_KEY=your_serpapi_key  # Optional
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS v4, CSS Modules
- **UI Components**: shadcn/ui, Radix UI Primitives
- **Icons**: Lucide React
- **AI/ML**: Google Gemini API
- **Product Data**: SerpAPI (for product search)
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
├── app/                          # Next.js 14 app directory
│   ├── api/                      # API routes
│   │   ├── processQuery/        # Main chat endpoint
│   │   ├── productDetails/      # Product details endpoint
│   │   └── productResearch/     # Product research endpoint
│   ├── agent/                   # AI agent implementations
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                  # Reusable components
│   ├── chat/                    # Chat interface components
│   ├── ui/                      # UI primitives
│   └── theme/                   # Theme provider
├── lib/                         # Utility functions
├── public/                      # Static assets
└── styles/                      # Global styles
```

## 🌟 Getting Started with Development

1. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Add your API keys
   - Run `pnpm install` to install dependencies

2. **Development Commands**
   ```bash
   # Start development server
   pnpm dev

   # Build for production
   pnpm build

   # Run production build
   pnpm start

   # Run linter
   pnpm lint

   # Run type checker
   pnpm type-check
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Gemini AI](https://ai.google.dev/) for the powerful AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for the deployment platform

---

Made with ❤️ by [Your Name] | [GitHub](https://github.com/yourusername) | [Twitter](https://twitter.com/yourhandle)
│       ├── error-banner.tsx     # Error display component
│       ├── loading-indicator.tsx # Typing animation
│       ├── message-bubble.tsx   # Individual message display
│       ├── product-card.tsx     # Product recommendation cards
│       └── product-grid.tsx     # Product grid container
├── hooks/
│   └── use-chat.ts             # Custom chat state management
├── lib/
│   └── api-utils.ts            # API utility functions
└── types/
    └── chat.ts                 # TypeScript interfaces
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone or download the project**
   \`\`\`bash
   # If using git
   git clone <repository-url>
   cd chat-app
   
   # Or extract from ZIP download
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## 🔧 API Documentation

### POST /api/processQuery

Processes user queries and returns either text responses or product recommendations.

**Request Body:**
\`\`\`json
{
  "query": "string - The user's message/question"
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "type": "text" | "products",
  "content": "string (for text)" | "Product[] (for products)",
  "processingTime": "number - milliseconds"
}
\`\`\`

**Product Object Structure:**
\`\`\`typescript
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  inStock: boolean;
}
\`\`\`

### Query Processing Logic

The API intelligently determines response type based on keywords:
- **Product queries**: "buy", "purchase", "product", "shop", "price", "recommend"
- **Text queries**: All other queries receive conversational responses

## 🎨 Customization

### Design Tokens
Modify design tokens in `app/globals.css`:
\`\`\`css
@theme inline {
  --color-primary: 147 51 234;      /* Purple primary */
  --color-primary-foreground: 255 255 255;
  --color-secondary: 241 245 249;   /* Light gray */
  /* ... other tokens */
}
\`\`\`

### Sample Data
Update sample products in `lib/api-utils.ts`:
\`\`\`typescript
const sampleProducts: Product[] = [
  // Add your products here
];
\`\`\`

### Styling
- Components use Tailwind CSS classes
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Custom animations defined in globals.css

## 🔌 Integration Points

### Backend Integration
Replace the sample API logic in `app/api/processQuery/route.ts` with your actual:
- AI/LLM service integration
- Product database queries
- User authentication
- Analytics tracking

### External Services
The app is ready to integrate with:
- OpenAI/Anthropic for AI responses
- E-commerce APIs for real product data
- Authentication providers
- Analytics platforms

## 🧩 Component Architecture

### Core Components
- **ChatInterface** (`page.tsx`): Main container with state management
- **MessageBubble**: Handles different message types and animations
- **ProductGrid**: Responsive product display with cards
- **ChatInput**: Dynamic positioning and submission handling

### Custom Hooks
- **useChat**: Manages conversation state, API calls, and persistence
- Handles loading states, error recovery, and message history

### State Management
- Session-based message persistence
- Optimistic UI updates
- Error boundary patterns
- Loading state coordination

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Configure build command as `npm run build`
- **Railway**: Use provided Dockerfile or buildpacks
- **Docker**: Standard Next.js containerization

## 🔮 Future Enhancements

### Planned Features
- [ ] User authentication and profiles
- [ ] Conversation history persistence
- [ ] Real-time chat with WebSockets
- [ ] Voice input/output capabilities
- [ ] Advanced product filtering
- [ ] Shopping cart integration
- [ ] Multi-language support

### Technical Improvements
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Redis caching for responses
- [ ] Rate limiting and security
- [ ] Comprehensive testing suite
- [ ] Performance monitoring
- [ ] SEO optimization

## 📝 Development Notes

### Key Design Decisions
- **Component Composition**: Modular architecture for maintainability
- **TypeScript**: Full type safety across components and API
- **Responsive First**: Mobile-optimized with desktop enhancements
- **Performance**: Optimized re-renders and lazy loading

### Code Patterns
- Custom hooks for complex state logic
- Compound components for flexible UI composition
- Error boundaries for graceful failure handling
- Consistent naming conventions and file organization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
