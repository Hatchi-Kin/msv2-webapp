# MSV2 Music Library WebApp

A beautiful, modern music library web application with a coffee-inspired "Mocha Beats" theme. Built with React, TypeScript, and Tailwind CSS.

## 🎵 Features

- **User Authentication** - Secure JWT-based login/register with refresh tokens
- **Music Library Browser** - Browse artists, albums, and tracks
- **Responsive Pagination** - 25 items on desktop, 15 on mobile
- **Interactive UI** - Floating music notes with hover effects
- **Modern Design** - Glassmorphism effects with warm coffee-themed colors

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Backend**: FastAPI (Python) with PostgreSQL

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components (Button, Input, Card)
│   ├── AuthPageLayout.tsx    # Shared layout for login/register
│   ├── FormInput.tsx         # Form input with icon and label
│   ├── SubmitButton.tsx      # Submit button with loading state
│   ├── MediaCard.tsx         # Generic card for artists/albums
│   ├── ArtistCard.tsx        # Artist display card
│   ├── AlbumCard.tsx         # Album display card
│   ├── TrackItem.tsx         # Track list item
│   ├── FloatingMusicNotes.tsx # Animated background notes
│   ├── LoadingSpinner.tsx    # Loading state component
│   ├── ErrorMessage.tsx      # Error display component
│   └── Layout.tsx            # Main app layout with header
│
├── pages/              # Page components
│   ├── LandingPage.tsx       # Login page
│   ├── RegisterPage.tsx      # Registration page
│   └── MusicLibraryPage.tsx  # Main music browser
│
├── context/            # React Context providers
│   └── AuthContext.tsx       # Authentication state management
│
├── hooks/              # Custom React hooks
│   ├── useThemeHover.ts      # Consistent hover effects
│   └── usePagination.ts      # Pagination logic
│
├── constants/          # App-wide constants
│   ├── theme.ts              # Mocha Beats color palette
│   └── pagination.ts         # Pagination configuration
│
├── lib/                # Utilities and API client
│   ├── api.ts                # Backend API client
│   └── utils.ts              # Helper functions
│
├── types/              # TypeScript type definitions
│   └── api.ts                # API response types
│
├── App.tsx             # Root component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles and animations
```

## 🎨 Theme System

The app uses a centralized theme system defined in `src/constants/theme.ts`:

### Mocha Beats Color Palette

```typescript
MOCHA_THEME = {
  colors: {
    primary: '#8B5E3C',      // Dark roast coffee
    secondary: '#CE9A6A',    // Caramel latte
    background: '#F6F2EE',   // Cream
    border: '#EDE5DF',       // Soft cream border
    borderHover: '#C2B0A3',  // Darker cream
    text: '#3B2F28',         // Espresso dark
    gradient: {
      start: '#D8C8B8',      // Light mocha
      end: '#C2B0A3',        // Medium mocha
    }
  },
  shadows: { sm, md, lg, xl },
  opacity: { subtle, light, medium, semiTransparent, visible }
}
```

### Helper Functions

- `getGradientBackground()` - Returns the main background gradient
- `getPrimaryGradient()` - Returns the primary color gradient for text/buttons

## 🔐 Authentication Flow

1. **Login/Register** - User submits credentials
2. **JWT Tokens** - Backend returns access token + httpOnly refresh token cookie
3. **Token Storage** - Access token stored in localStorage
4. **Auto-Refresh** - Refresh token automatically renews access token
5. **Protected Routes** - Music library requires authentication
6. **Logout** - Clears tokens and redirects to login

### AuthContext API

```typescript
const { 
  user,              // Current user object
  accessToken,       // JWT access token
  isAuthenticated,   // Boolean auth status
  loading,           // Loading state
  error,             // Error message
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  refreshAccessToken // Refresh token function
} = useAuth();
```

## 🎯 Custom Hooks

### `useThemeHover()`

Provides consistent hover effects across the app:

```typescript
const {
  handleInputFocus,      // Input focus effect
  handleInputBlur,       // Input blur effect
  handleCardMouseEnter,  // Card hover effect
  handleCardMouseLeave,  // Card leave effect
  handleButtonMouseEnter,// Button hover effect
  handleButtonMouseLeave,// Button leave effect
  handleLinkMouseEnter,  // Link hover effect
  handleLinkMouseLeave   // Link leave effect
} = useThemeHover();
```

### `usePagination(items)`

Handles pagination logic with responsive items per page:

```typescript
const {
  currentPage,      // Current page number
  totalPages,       // Total number of pages
  itemsPerPage,     // Items per page (responsive)
  startIndex,       // Start index for current page
  endIndex,         // End index for current page
  paginatedItems,   // Items for current page
  goToPage,         // Navigate to specific page
  resetPage         // Reset to page 1
} = usePagination(artists);
```

## 📦 Component Patterns

### Reusable Components

All components follow these principles:

1. **Single Responsibility** - Each component does one thing well
2. **Props Interface** - Clear TypeScript interfaces
3. **Theme Constants** - Use `MOCHA_THEME` instead of hardcoded colors
4. **Custom Hooks** - Use `useThemeHover()` for consistent interactions
5. **Composition** - Build complex UIs from simple components

### Example: Creating a New Card Component

```typescript
import MediaCard from '@/components/MediaCard';
import { MOCHA_THEME } from '@/constants/theme';
import { Icon } from 'lucide-react';

const MyCard = ({ title, onClick }) => (
  <MediaCard
    title={title}
    icon={<Icon className="h-6 w-6" style={{ color: MOCHA_THEME.colors.primary }} />}
    onClick={onClick}
  />
);
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐳 Docker

### Build and Run Locally

```bash
# Build the Docker image
docker build -t msv2-webapp .

# Run with custom API URL (same port as dev server)
docker run -p 5173:80 -e VITE_API_BASE_URL=http://localhost:8000 msv2-webapp

# Open http://localhost:5173
```

### Environment Variables

The app supports runtime configuration via environment variables:

- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:8000`)

**Priority order:**
1. Runtime env var (Docker/k8s)
2. Build-time env var (`.env.production`)
3. Default fallback (`http://localhost:8000`)

### Production Deployment

The Docker image is optimized for production:
- Multi-stage build (Node builder → nginx)
- Gzip compression enabled
- Static asset caching (1 year)
- Security headers configured
- Health check endpoint at `/health`
- Final image size: ~25MB

## 🎨 Styling Guidelines

### Use Theme Constants

❌ **Don't:**
```typescript
style={{ color: '#8B5E3C' }}
```

✅ **Do:**
```typescript
style={{ color: MOCHA_THEME.colors.primary }}
```

### Use Custom Hooks

❌ **Don't:**
```typescript
onMouseEnter={(e) => {
  e.target.style.borderColor = '#8B5E3C';
}}
```

✅ **Do:**
```typescript
const { handleInputFocus } = useThemeHover();
onFocus={handleInputFocus}
```

### Use Reusable Components

❌ **Don't:**
```typescript
<div className="p-4 rounded-xl">
  <input type="email" ... />
</div>
```

✅ **Do:**
```typescript
<FormInput
  id="email"
  label="Email"
  type="email"
  icon={<Mail />}
  ...
/>
```

## 📱 Responsive Design

The app is fully responsive with breakpoints:

- **Mobile**: < 1024px (15 items per page)
- **Desktop**: ≥ 1024px (25 items per page)

Responsive utilities are handled automatically by:
- Tailwind CSS responsive classes
- `usePagination()` hook for dynamic items per page
- CSS media queries in `index.css`

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: Tailwind classes not working
- **Solution**: Ensure `tailwind.config.js` includes all source files
- Check that `@tailwind` directives are in `index.css`

**Issue**: Authentication not persisting
- **Solution**: Check that cookies are enabled
- Verify `VITE_API_BASE_URL` is correct
- Check browser console for CORS errors

**Issue**: Music notes not animating
- **Solution**: Check that CSS animations are defined in `index.css`
- Verify browser supports CSS animations

## 📝 Code Quality

The codebase follows these principles:

- **DRY** - Don't Repeat Yourself
- **SOLID** - Single responsibility, Open/closed, etc.
- **Type Safety** - Full TypeScript coverage
- **Consistent Styling** - Centralized theme system
- **Reusable Components** - Modular, composable UI
- **Clean Code** - Readable, maintainable, well-documented

## 🤝 Contributing

1. Follow the existing code style
2. Use theme constants for all colors
3. Create reusable components when possible
4. Add TypeScript types for all props
5. Test on both mobile and desktop

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Clean, consistent icons
- **FastAPI** - Modern Python backend framework
