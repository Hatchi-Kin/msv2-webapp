# Developer Guide - MSV2 WebApp

## 📁 Project Structure

The project follows a **feature-based architecture** for better organization and maintainability:

```
src/
├── features/              # Feature modules (self-contained)
│   ├── auth/             # Authentication (login, register)
│   ├── library/          # Music library browsing
│   ├── player/           # Music player
│   └── visualization/    # 3D visualization
├── components/           # Shared components
│   ├── ui/              # Reusable UI components (buttons, cards, etc.)
│   └── layout/          # Layout components (header, error boundary)
├── context/             # React Context for global state
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and API clients
├── pages/               # Page exports (thin routing layer)
└── types/               # TypeScript type definitions
```

### Why Feature-Based?

- **Easy to find code**: Everything related to a feature is in one place
- **Clear boundaries**: Features are self-contained
- **Scalable**: Easy to add new features without cluttering the codebase

## 🧩 Component Organization

### Naming Conventions

- **`*Page.tsx`**: Full page components (e.g., `LibraryPage.tsx`)
- **`*Card.tsx`**: Grid item components (e.g., `ArtistCard.tsx`)
- **`*Item.tsx`**: List item components (e.g., `TrackItem.tsx`)
- **`*Layout.tsx`**: Layout wrapper components (e.g., `MainLayout.tsx`)

### Component Location Rules

1. **Feature-specific components** → `src/features/{feature}/`
   - Example: `TrackItem.tsx` → `src/features/library/`

2. **Shared UI components** → `src/components/ui/`
   - Example: `Button.tsx`, `LoadingSpinner.tsx`

3. **Layout components** → `src/components/layout/`
   - Example: `MainLayout.tsx`, `ErrorBoundary.tsx`

## 🎨 Styling with Tailwind CSS

### Semantic Color Tokens

**Always use semantic tokens instead of hardcoded colors:**

✅ **Good:**
```tsx
<div className="bg-primary text-primary-foreground">
<p className="text-destructive">Error message</p>
<button className="hover:bg-accent">Click me</button>
```

❌ **Bad:**
```tsx
<div className="bg-blue-500 text-white">
<p className="text-red-600">Error message</p>
<button className="hover:bg-gray-100">Click me</button>
```

### Available Semantic Tokens

| Token | Usage |
|-------|-------|
| `bg-background` / `text-foreground` | Main background and text |
| `bg-primary` / `text-primary` | Primary brand color |
| `bg-secondary` / `text-secondary` | Secondary elements |
| `bg-accent` / `text-accent` | Hover states, highlights |
| `bg-muted` / `text-muted-foreground` | Subtle backgrounds, secondary text |
| `bg-destructive` / `text-destructive` | Errors, delete actions |
| `border-border` | Borders |

### Responsive Design

Use Tailwind's breakpoint prefixes for responsive layouts:

```tsx
<div className="
  p-2 md:p-4           // Padding: 2 on mobile, 4 on desktop
  grid-cols-1 md:grid-cols-3  // 1 column on mobile, 3 on desktop
  hidden md:block      // Hidden on mobile, visible on desktop
">
```

**Breakpoints:**
- `sm:` - 640px and up (small tablets)
- `md:` - 768px and up (tablets)
- `lg:` - 1024px and up (laptops)
- `xl:` - 1280px and up (desktops)

### Complex Conditional Classes

Use the `cn()` utility for conditional classes:

✅ **Good:**
```tsx
import { cn } from "@/lib/utils";

<button className={cn(
  "px-4 py-2 rounded-lg",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
```

❌ **Bad:**
```tsx
<button className={`px-4 py-2 rounded-lg ${isActive ? "bg-primary text-primary-foreground" : ""} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
```

## ⚛️ React Patterns

### State Management

1. **Local state** → `useState`
   ```tsx
   const [isOpen, setIsOpen] = useState(false);
   ```

2. **Global state** → React Context
   - `AuthContext` - User authentication
   - `PlayerContext` - Music player state
   - `LibraryContext` - Library data (playlists, favorites)

3. **Server state** → Direct API calls with loading/error states
   ```tsx
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   ```

### Custom Hooks

Reusable logic is extracted into custom hooks:

```tsx
// hooks/useFavoriteToggle.ts
export const useFavoriteToggle = (trackId: number) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = async () => {
    // Toggle logic here
  };
  
  return { isFavorite, toggleFavorite };
};

// Usage in component
const { isFavorite, toggleFavorite } = useFavoriteToggle(track.id);
```

### Component Props

Always define TypeScript interfaces for props:

```tsx
interface TrackItemProps {
  track: MegasetTrack;
  onFindSimilar?: (trackId: number) => void;  // Optional prop
}

const TrackItem: React.FC<TrackItemProps> = ({ track, onFindSimilar }) => {
  // Component logic
};
```

## 🔌 API Integration

API calls are centralized in `src/lib/api/`:

```tsx
import { api } from "@/lib/api";

// In component
const fetchData = async () => {
  try {
    const response = await api.music.getFavorites(accessToken);
    setData(response.tracks);
  } catch (error) {
    console.error("Failed to fetch:", error);
  }
};
```

## 🛠️ Common Development Tasks

### Adding a New Feature

1. Create feature directory: `src/features/my-feature/`
2. Add components: `MyFeaturePage.tsx`, supporting components
3. Export from `src/pages/index.ts`
4. Add route in `App.tsx`

### Creating a New Component

1. Decide location (feature-specific or shared)
2. Create TypeScript interface for props
3. Use semantic color tokens
4. Make it responsive with Tailwind breakpoints
5. Extract reusable logic into custom hooks

### Debugging Tips

1. **Check the browser console** for errors
2. **Use React DevTools** to inspect component state
3. **Check network tab** for API call failures
4. **Verify TypeScript errors** in your IDE

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component with routing |
| `src/main.tsx` | App entry point |
| `src/index.css` | Global styles and CSS variables |
| `tailwind.config.js` | Tailwind configuration |
| `src/lib/api/index.ts` | API client |
| `src/context/*` | Global state management |

## 🚀 Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## 💡 Best Practices

1. **Keep components small** - If a component is >200 lines, consider splitting it
2. **Use TypeScript** - Define types for props, state, and API responses
3. **Semantic tokens** - Always use `bg-primary` instead of `bg-blue-500`
4. **Responsive first** - Test on mobile, tablet, and desktop
5. **Reuse components** - Check `components/ui/` before creating new ones
6. **Extract logic** - Move complex logic to custom hooks
7. **Handle errors** - Always have loading and error states

## 🎓 Learning Resources

- **React**: [react.dev](https://react.dev)
- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React Router**: [reactrouter.com](https://reactrouter.com)

---
