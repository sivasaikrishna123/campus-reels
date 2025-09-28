# CampusReels

An Instagram-style student app where students share short reels, browse a helpful feed with pointers, gather in a common course hub, and use an AI homework chat.

## 🚀 Live Demo

**Live URL**: https://campus-reels.vercel.app *(Update after first deployment)*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/campus-reels)

## 📱 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/campus-reels.git
cd campus-reels

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Deploy to Production

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

📖 **[Full Deployment Guide](./docs/deploy/vercel.md)**

## Features

- 📱 **Feed**: Browse reels, posts, and helpful pointers with tabs for All, My Courses, and Pointers
- 🎥 **Reels**: Upload and watch short video content with autoplay, pause on scroll, and interactive controls
- 📝 **Posts**: Share text content with markdown support and mark as helpful pointers
- 🎓 **Courses**: Course-specific feeds with pinned pointers and filtered content
- 🤖 **AI Chat**: Get homework help with step-by-step guidance (mock mode included)
- 📤 **Upload**: Easy content creation with file validation and preview
- 👤 **Profiles**: User profiles with content stats and course enrollment

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: TailwindCSS with custom blue/white theme
- **Animations**: Framer Motion for smooth transitions
- **Routing**: React Router for navigation
- **Storage**: LocalStorage for demo data persistence
- **AI**: Gemini 1.5 Flash API (with mock fallback)

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

## Environment Setup

The app works out of the box with intelligent mock AI responses. For real Google AI assistance:

### 🤖 **Google AI (Gemini) Integration**

1. **Get a FREE API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key" 
   - Copy your API key

2. **Setup Environment**:
   ```bash
   # Copy the example file
   cp env.example .env.local
   
   # Edit .env.local and add your API key
   VITE_GEMINI_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Restart the Server**:
   ```bash
   npm run dev
   ```

4. **Verify Integration**:
   - Go to "Ask AI" in the app
   - You should see a green banner: "Connected to Google AI (Gemini 1.5 Flash)"
   - Ask any question to test the real AI responses

### 🎯 **AI Features**

- **Real-time Responses**: Powered by Google's Gemini 1.5 Flash model
- **Course Context**: AI understands your enrolled courses
- **Mathematical Support**: LaTeX rendering for complex equations
- **Code Examples**: Syntax-highlighted code snippets
- **Study Strategies**: Personalized learning tips and techniques
- **Follow-up Questions**: Contextual suggestions for deeper learning

## Demo Data

The app comes with seeded demo data including:
- 3 demo users with different course enrollments
- 5 courses (CSE310, MAT265, ENG108, PHY121, HST100)
- 12 sample reels with video placeholders
- 8 posts with study guides and tips
- 10 helpful pointers for quick reference

Data is automatically seeded on first load and persisted in localStorage.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Card, Button, etc.)
│   ├── feed/           # Feed-specific components
│   ├── TopNav.tsx      # Top navigation
│   └── BottomBar.tsx   # Mobile bottom navigation
├── pages/              # Route components
│   ├── Feed.tsx        # Main feed with tabs
│   ├── ReelDetail.tsx  # Individual reel view
│   ├── Courses.tsx     # Course grid
│   ├── CourseFeed.tsx  # Course-specific content
│   ├── Ask.tsx         # AI homework chat
│   ├── Upload.tsx      # Content upload form
│   └── Profile.tsx     # User profile
├── data/               # Demo data
├── lib/                # Utilities
│   ├── storage.ts      # LocalStorage helpers
│   └── ai.ts           # AI chat integration
└── types.ts            # TypeScript definitions
```

## Key Features

### Feed System
- Tabbed interface (All, My Courses, Pointers)
- Infinite scroll simulation
- Real-time like/comment counts
- Course filtering

### Reel Player
- Intersection Observer for pause on scroll
- Hover/tap to play controls
- Caption overlay with actions
- Course badges and tags

### AI Homework Helper
- Mock responses for demo mode
- Real Gemini API integration
- Course context awareness
- Copy and save functionality
- LaTeX support for math

### Upload Flow
- Reel/Post toggle
- File validation (25MB limit)
- Thumbnail preview
- Tag management
- Course association
- Pointer marking

## Color Theme

- **Primary**: #2563EB (blue-600)
- **Accent**: #1E3A8A (blue-900)
- **Light**: #E0F2FE (sky-100)
- **Background**: Light gradient from #EBF3FF to #FFFFFF
- **Text**: #0B1020 (dark), #FFFFFF (light)

## Animations

- Route transitions: 220ms fade + slide
- Hover effects: Scale and shadow changes
- Button interactions: Gentle bounce
- Modal: Spring pop animation
- List items: Staggered entrance

## Accessibility

- Keyboard navigation support
- Focus rings for interactive elements
- ARIA labels where needed
- High contrast color ratios
- Responsive design for all screen sizes

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Screenshots

The app includes:
- **Feed**: Tabbed interface with reels, posts, and pointers
- **Course Hub**: Grid of enrolled courses with stats
- **AI Chat**: Homework assistance with mock/real AI responses
- **Upload**: Content creation with file preview and validation
- **Profile**: User stats and content showcase

## Contributing

This is a demo project showcasing modern React development practices with:
- TypeScript for type safety
- TailwindCSS for utility-first styling
- Framer Motion for smooth animations
- Local storage for data persistence
- Responsive design principles

## License

MIT License - feel free to use this as a starting point for your own projects!
