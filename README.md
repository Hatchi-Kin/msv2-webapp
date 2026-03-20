# MSV2 Music Library WebApp

A beautiful, modern music library web application with a coffee-inspired "Mocha Beats" theme. Built with React, TypeScript, and Tailwind CSS.

## 🎵 Features

- **User Authentication** - Secure JWT-based login/register with refresh tokens
- **Music Library Browser** - Browse artists, albums, and tracks with intuitive navigation
- **Smart Recommendations** - Find similar tracks based on audio features
- **Personal Library** - Save favorite tracks and create custom playlists (max 20 tracks each)
- **Music Player** - Built-in audio player with playback controls
- **Deep Linking** - Share links to specific albums or artists
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
│   ├── player/         # Music player components
│   ├── library/        # Library-specific components
│   │   ├── views/      # Sub-views (Artists, Albums, Tracks)
│   │   ├── LibraryHeader.tsx # Standard header for library pages
│   │   └── LibraryLayout.tsx # Layout wrapper for library pages
│   ├── ...             # Other shared components
│   └── Layout.tsx      # Main app layout with header
│
├── pages/              # Page components
│   ├── library/        # Library pages
│   │   ├── LibraryArtistsPage.tsx
│   │   ├── LibraryAlbumsPage.tsx
│   │   ├── LibraryTracksPage.tsx
│   │   └── LibrarySimilarPage.tsx
│   ├── LandingPage.tsx
│   ├── RegisterPage.tsx
│   └── UserLibraryPage.tsx
│
├── context/            # React Context providers
│   ├── AuthContext.tsx       # Authentication state management
│   ├── LibraryContext.tsx    # Favorites & playlists state
│   └── PlayerContext.tsx     # Music player state
│
├── hooks/              # Custom React hooks
│   ├── useArtists.ts         # Fetch artist list
│   ├── useAlbums.ts          # Fetch albums
│   ├── useTracks.ts          # Fetch tracks
│   ├── useSimilarTracks.ts   # Fetch recommendations
│   ├── usePagination.ts      # Client-side pagination logic
│   └── ...                   # Other utility hooks
│
├── lib/                # Utilities and API client
│   ├── api/                  # API client modules
│   └── config.ts             # App configuration
│
├── types/              # TypeScript type definitions
├── App.tsx             # Root component with routing
└── main.tsx            # App entry point
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
For nip io
```env
VITE_API_BASE_URL=http://localhost:8000
```
There is also a domain name

## 📝 Code Quality & Philosophy

This project follows a **"Simplicity > All"** philosophy. We prioritize clear, readable code over complex abstractions.

### Key Principles

1.  **Small, Focused Components**: We avoid "God Components". For example, the music library is split into:
    -   `LibraryArtistsPage`
    -   `LibraryAlbumsPage`
    -   `LibraryTracksPage`
    -   `LibrarySimilarPage`

2.  **Custom Hooks for Data**: We don't fetch data inside UI components. We use custom hooks:
    -   ❌ `useEffect(() => { fetch('/api/artists')... })` inside a component.
    -   ✅ `const { artists, loading } = useArtists();`

3.  **Routing over State**: We use URLs to drive navigation, not internal state.
    -   ❌ `setState('albums')` to show albums.
    -   ✅ `navigate('/library/artists/Adele')` to show albums.
    -   **Benefit**: Users can bookmark and share links!

### For New Developers

If you want to add a new feature:

1.  **Add the API call** in `src/lib/api/`.
2.  **Create a Custom Hook** in `src/hooks/` to handle the data fetching and loading state.
3.  **Create a Page Component** in `src/pages/` that uses the hook.
4.  **Add the Route** in `src/App.tsx`.

## 🎨 Theme System

The app uses a centralized theme system defined in `src/index.css` using CSS variables and Tailwind configuration.

### Mocha Beats Color Palette

The theme uses HSL values to allow for easy opacity manipulation.

```css
:root {
  /* Mocha Theme Colors */
  --primary: 25 40% 39%;              /* #8B5E3C - Dark roast coffee */
  --secondary: 30 48% 61%;            /* #CE9A6A - Caramel latte */
  --background: 30 43% 95%;           /* #F6F2EE - Cream */
  --foreground: 20 24% 20%;           /* #3B2F28 - Espresso dark */
  --muted: 30 33% 90%;                /* #EDE5DF - Soft cream */
}
```

To use these colors in Tailwind:
- `bg-primary`
- `text-secondary`
- `border-muted`




# For local development
## you might port-forward the k3s postgres services:
```sh
kubectl port-forward service/postgres-service 5432:5432 -n glasgow-prod
```
and
```sh
kubectl port-forward -n glasgow-prod svc/minio-service 9000:9000
```

# or maybe just port forward the prod api directly
```sh
kubectl port-forward -n glasgow-prod svc/fastapi-msv2-api-service 8000:8010
```


# Then start the app
```sh
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```



