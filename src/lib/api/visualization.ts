import { API_BASE_URL, fetchWithAuth } from "./client";

export interface VisualizationPoint {
  id: number;
  x: number;
  y: number;
  z: number;
  cluster: number;
  cluster_color: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  year: number;
}

export interface VisualizationStats {
  total_tracks: number;
  total_clusters: number;
  top_genres: {
    genre: string;
    count: number;
    percentage: number;
  }[];
  largest_cluster: number;
  largest_cluster_size: number;
}

export const visualizationApi = {
  getPoints: async (
    accessToken: string,
    limit = 5000,
    offset = 0,
    viz_type?: string
  ) => {
    const vizTypeParam = viz_type ? `&viz_type=${viz_type}` : "";
    return fetchWithAuth<{ points: VisualizationPoint[]; total: number }>(
      `${API_BASE_URL}/library/coordinates/points?limit=${limit}&offset=${offset}${vizTypeParam}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  getStats: async (accessToken: string, viz_type?: string) => {
    const vizTypeParam = viz_type ? `?viz_type=${viz_type}` : "";
    return fetchWithAuth<VisualizationStats>(
      `${API_BASE_URL}/library/coordinates/stats${vizTypeParam}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
};
