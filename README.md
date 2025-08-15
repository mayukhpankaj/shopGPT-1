# Conversational Chat App with Product Recommendations

A modern, responsive chat application built with Next.js that provides both conversational AI responses and intelligent product recommendations. Features a ChatGPT-like interface with dynamic input positioning and beautiful product card displays.

## ✨ Features

### Core Functionality
- **Conversational Interface**: ChatGPT-style chat experience with smooth animations
- **Dynamic Input Positioning**: Input centers on screen for new threads, moves to bottom for active conversations
- **Dual Response Types**: Handles both text responses and product recommendation grids
- **Real-time Typing Indicators**: Visual feedback during AI processing
- **Message Persistence**: Conversations persist in browser session storage
- **Error Handling**: Comprehensive error states with retry functionality

### Product Recommendations
- **Intelligent Product Display**: Responsive grid layout for product cards
- **Rich Product Information**: Images, ratings, pricing, categories, and descriptions
- **Interactive Cards**: Hover effects, view details, and add-to-cart actions
- **Smart Query Processing**: Automatically detects product-related queries

### UI/UX
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Modern Aesthetics**: Clean design with purple accent colors and smooth transitions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Loading States**: Skeleton loaders and progress indicators

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with shadcn/ui foundation
- **Icons**: Lucide React
- **State Management**: React hooks with custom useChat hook
- **API**: Next.js API routes with intelligent response logic

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   └── processQuery/
│   │       └── route.ts          # Main API endpoint
│   ├── globals.css               # Global styles and design tokens
│   ├── layout.tsx               # Root layout with fonts
│   └── page.tsx                 # Main chat interface
├── components/
│   └── chat/
│       ├── chat-header.tsx      # App header with logo
│       ├── chat-input.tsx       # Message input component
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
