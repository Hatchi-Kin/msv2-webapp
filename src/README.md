# MSV2 Webapp - Source Code Structure

## 📁 Project Organization

### `/components`

Reusable UI components organized by function:

- **`/player`** - Music player components (bottom bar, controls)
- **`/ui`** - Base UI components (buttons, cards, etc.)
- **Track components** - `TrackItem`, `SimilarTrackCard`, `ArtistCard`, etc.

### `/context`

React Context providers for global state:

- **`AuthContext`** - User authentication & session management
- **`PlayerContext`** - Music playback state & controls
- **`LibraryContext`** - Favorites & playlists management

### `/pages`

Top-level page components (routes):

- **`LandingPage`** - Login page
- **`RegisterPage`** - User registration
- **`MusicLibraryPage`** - Browse artists/albums/tracks
- **`UserLibraryPage`** - View favorites & playlists

### `/lib`

Utility libraries and helpers:

- **`/api`** - API client (organized by domain)
  - `auth.ts` - Authentication endpoints
  - `music.ts` - Music browsing endpoints
  - `favorites.ts` - Favorites management
  - `playlists.ts` - Playlist management
  - `client.ts` - Base HTTP client & error handling
- **`config.ts`** - App configuration

### `/types`

TypeScript type definitions:

- **`api.ts`** - API request/response types

### `/constants`

Application constants:

- **`limits.ts`** - User limits (favorites, playlists, etc.)
- **`similarity.ts`** - Similarity scoring helpers

### `/hooks`

Custom React hooks (if needed in future)

## 🔑 Key Patterns

### API Usage

```typescript
import { api } from "@/lib/api";

// All API calls are organized by domain
const tracks = await api.music.getTracksByAlbum(albumName, accessToken);
const favorites = await api.music.getFavorites(accessToken);
const user = await api.auth.getMe(accessToken);
```

### Context Usage

```typescript
import { useAuth } from "@/context/AuthContext";
import { usePlayer } from "@/context/PlayerContext";
import { useLibrary } from "@/context/LibraryContext";

const { accessToken, user, logout } = useAuth();
const { playTrack, isPlaying } = usePlayer();
const { favorites, addFavorite } = useLibrary();
```

### Constants

```typescript
import { LIMITS } from "@/constants/limits";

if (favorites.length >= LIMITS.MAX_FAVORITES) {
  // Show error
}
```

## 🎯 Adding New Features

### New API Endpoint

1. Add type to `src/types/api.ts`
2. Add function to appropriate file in `src/lib/api/`
3. Use in components via `api.domain.method()`

### New Page

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link if needed

### New Context

1. Create provider in `src/context/`
2. Wrap `App` in `src/App.tsx`
3. Export custom hook for easy access

## 🧪 Testing Checklist

- [ ] Login/Logout flow
- [ ] Browse artists → albums → tracks
- [ ] Play track (player appears at bottom)
- [ ] Add/remove favorites (heart icon)
- [ ] Create playlist
- [ ] Add tracks to playlist
- [ ] View "My Library" page
- [ ] Play all (favorites/playlist)
- [ ] Similar tracks feature

## 📝 Code Style

- Use TypeScript for type safety
- Prefer functional components with hooks
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use meaningful variable names
- Add comments for complex logic only
