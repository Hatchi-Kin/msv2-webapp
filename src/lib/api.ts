import type { UserCreate, Token, ArtistListResponse, AlbumListResponse, TrackListResponse, MegasetTrack, User, SimilarTrackListResponse } from '@/types/api';

// Check for runtime config first (Docker), then build-time env var, then default
const API_BASE_URL = (window as any).ENV?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiError {
  detail: string;
}

// Global handler for 401 errors (session expired)
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Handle 401 Unauthorized (session expired)
    if (response.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    
    const errorData: ApiError = await response.json();
    throw new Error(errorData.detail || 'An unknown error occurred');
  }
  return response.json();
}

export const api = {
  auth: {
    async register(user: UserCreate): Promise<{ message: string }> {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      return handleResponse(response);
    },

    async login(email: string, password: string): Promise<Token> {
      const formBody = new URLSearchParams();
      formBody.append('username', email);
      formBody.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });
      return handleResponse(response);
    },

    async refresh(): Promise<Token> {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Important for sending cookies
      });
      return handleResponse(response);
    },

    async logout(accessToken?: string): Promise<{ message: string }> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers,
      });
      return handleResponse(response);
    },

    async getMe(accessToken: string): Promise<User> {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },
  },

  music: {
    async getArtists(accessToken: string): Promise<ArtistListResponse> {
      const response = await fetch(`${API_BASE_URL}/music/artists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },

    async getAlbumsByArtist(artistName: string, accessToken: string): Promise<AlbumListResponse> {
      const response = await fetch(`${API_BASE_URL}/music/albums/${encodeURIComponent(artistName)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },

    async getTracksByAlbum(albumFolder: string, accessToken: string, includeEmbeddings: boolean = false): Promise<TrackListResponse> {
      const response = await fetch(`${API_BASE_URL}/music/tracks/${encodeURIComponent(albumFolder)}?include_embeddings=${includeEmbeddings}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },

    async getTracksByArtistAndAlbum(artistName: string, albumName: string, accessToken: string, includeEmbeddings: boolean = false): Promise<TrackListResponse> {
      const response = await fetch(`${API_BASE_URL}/music/tracks/${encodeURIComponent(artistName)}/${encodeURIComponent(albumName)}?include_embeddings=${includeEmbeddings}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },

    async getSongCount(accessToken: string): Promise<number> {
      const response = await fetch(`${API_BASE_URL}/music/song_count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },

    async getRandomSong(accessToken: string, includeEmbeddings: boolean = false): Promise<MegasetTrack> {
      const response = await fetch(`${API_BASE_URL}/music/random_song?include_embeddings=${includeEmbeddings}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },

    async getSongById(songId: number, accessToken: string, includeEmbeddings: boolean = false): Promise<MegasetTrack> {
      const response = await fetch(`${API_BASE_URL}/music/song/${songId}?include_embeddings=${includeEmbeddings}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },

    async getSimilarTracks(trackId: number, accessToken: string): Promise<SimilarTrackListResponse> {
      const response = await fetch(`${API_BASE_URL}/music/similar/${trackId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return handleResponse(response);
    },
  },
};
