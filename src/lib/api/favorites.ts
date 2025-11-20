import { API_BASE_URL, fetchWithAuth } from "./client";
import type { FavoritesListResponse, CheckFavoriteResponse } from "@/types/api";

export const favoritesApi = {
  async addFavorite(
    trackId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    return fetchWithAuth(`${API_BASE_URL}/music/favorites/${trackId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async removeFavorite(
    trackId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    return fetchWithAuth(`${API_BASE_URL}/music/favorites/${trackId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async getFavorites(accessToken: string): Promise<FavoritesListResponse> {
    return fetchWithAuth(`${API_BASE_URL}/music/favorites`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async checkFavorite(
    trackId: number,
    accessToken: string
  ): Promise<CheckFavoriteResponse> {
    return fetchWithAuth(`${API_BASE_URL}/music/favorites/check/${trackId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
