import { API_BASE_URL, handleResponse } from "./client";
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
    const response = await fetch(`${API_BASE_URL}/music/playlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },

  async getPlaylists(accessToken: string): Promise<PlaylistsListResponse> {
    const response = await fetch(`${API_BASE_URL}/music/playlists`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  },

  async getPlaylistDetail(
    playlistId: number,
    accessToken: string
  ): Promise<PlaylistDetail> {
    const response = await fetch(
      `${API_BASE_URL}/music/playlists/${playlistId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async updatePlaylist(
    playlistId: number,
    name: string,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(
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
    return handleResponse(response);
  },

  async deletePlaylist(
    playlistId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/music/playlists/${playlistId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async addTrackToPlaylist(
    playlistId: number,
    trackId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/music/playlists/${playlistId}/tracks/${trackId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async removeTrackFromPlaylist(
    playlistId: number,
    trackId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/music/playlists/${playlistId}/tracks/${trackId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },
};
