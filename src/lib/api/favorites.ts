import { API_BASE_URL, handleResponse } from "./client";
import type { FavoritesListResponse, CheckFavoriteResponse } from "@/types/api";

export const favoritesApi = {
  async addFavorite(
    trackId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/music/favorites/${trackId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  },

  async removeFavorite(
    trackId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/music/favorites/${trackId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  },

  async getFavorites(accessToken: string): Promise<FavoritesListResponse> {
    const response = await fetch(`${API_BASE_URL}/music/favorites`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  },

  async checkFavorite(
    trackId: number,
    accessToken: string
  ): Promise<CheckFavoriteResponse> {
    const response = await fetch(
      `${API_BASE_URL}/music/favorites/check/${trackId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },
};
