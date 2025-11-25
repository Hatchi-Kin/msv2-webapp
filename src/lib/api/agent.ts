import { API_BASE_URL, fetchWithAuth } from "./client";

export interface TrackCard {
  // Core identification
  id: number;
  filename: string;
  filepath: string;
  relative_path: string;
  
  // Metadata
  album_folder?: string | null;
  artist_folder?: string | null;
  filesize?: number | null;
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  year?: number | null;
  tracknumber?: number | null;
  genre?: string | null;
  top_5_genres?: string | null;
  created_at?: string | null;
  
  // Agent-specific field
  reason: string; // The "Pitch" - why this track is recommended
}

export interface ButtonOption {
  id: string;
  label: string;
  action: string;
  payload: Record<string, any>;
}

export interface UIState {
  message: string;
  cards: TrackCard[];
  options: ButtonOption[];
}

export const agentApi = {
  startRecommendation: async (playlistId: number): Promise<UIState> => {
    return fetchWithAuth<UIState>(`${API_BASE_URL}/agent/recommend/${playlistId}`, {
      method: "POST",
    });
  },

  resumeAgent: async (
    action: string,
    playlistId: number,
    payload: Record<string, any> = {},
    trackId?: number
  ): Promise<UIState> => {
    return fetchWithAuth<UIState>(`${API_BASE_URL}/agent/resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        playlist_id: playlistId,
        payload,
        track_id: trackId,
      }),
    });
  },
};
