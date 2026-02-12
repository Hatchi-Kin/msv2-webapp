import { API_BASE_URL, fetchWithAuth } from "./client";
import { DiscoveryResponse } from "../../types/api";

export const discoveryApi = {
  /**
   * Search for tracks using natural language
   */
  search: async (
    query: string,
    accessToken: string,
  ): Promise<DiscoveryResponse> => {
    return fetchWithAuth<DiscoveryResponse>(
      `${API_BASE_URL}/discovery/search?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },

  /**
   * Refine search results using latent space manipulation
   */
  refine: async (
    baseVector: number[],
    sliders: {
      digital_organic: number;
      energy: number;
      urban: number;
      bass: number;
    },
    accessToken: string,
  ): Promise<DiscoveryResponse> => {
    return fetchWithAuth<DiscoveryResponse>(
      `${API_BASE_URL}/discovery/refine`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base_vector: baseVector,
          ...sliders,
        }),
      },
    );
  },
};
