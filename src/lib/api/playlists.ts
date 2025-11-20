import { API_BASE_URL, fetchWithAuth } from "./client";
import type {
  PlaylistSummary,
  PlaylistsListResponse,
  PlaylistDetail,
} from "@/types/api";

export const playlistsApi = {
  async createPlaylist(
    name: string,
    accessToken: string
  ): Promise<PlaylistSummary> {
    return fetchWithAuth(`${API_BASE_URL}/music/playlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    });
  },

  async getPlaylists(accessToken: string): Promise<PlaylistsListResponse> {
    return fetchWithAuth(`${API_BASE_URL}/music/playlists`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async getPlaylistDetail(
    playlistId: number,
    accessToken: string
  ): Promise<PlaylistDetail> {
    return fetchWithAuth(
      `${API_BASE_URL}/music/playlists/${playlistId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async updatePlaylist(
    playlistId: number,
    name: string,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    return fetchWithAuth(
      `${API_BASE_URL}/music/playlists/${playlistId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name }),
      }
    );
  },

  async deletePlaylist(
    playlistId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    return fetchWithAuth(
      `${API_BASE_URL}/music/playlists/${playlistId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async addTrackToPlaylist(
    playlistId: number,
    trackId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    return fetchWithAuth(
      `${API_BASE_URL}/music/playlists/${playlistId}/tracks/${trackId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async removeTrackFromPlaylist(
    playlistId: number,
    trackId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    return fetchWithAuth(
      `${API_BASE_URL}/music/playlists/${playlistId}/tracks/${trackId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
};
