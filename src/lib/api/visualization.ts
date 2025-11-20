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

export interface ClusterDetails {
  cluster_id: number;
  color: string;
  track_count: number;
  tracks: VisualizationPoint[];
}

export interface TrackNeighbors {
  track_id: number;
  neighbors: VisualizationPoint[];
}

export const visualizationApi = {
  getPoints: async (accessToken: string, limit = 5000, offset = 0) => {
    return fetchWithAuth<{ points: VisualizationPoint[]; total: number }>(
      `${API_BASE_URL}/coordinates/points?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  getStats: async (accessToken: string) => {
    return fetchWithAuth<VisualizationStats>(
      `${API_BASE_URL}/coordinates/stats`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  search: async (accessToken: string, query: string, limit = 50) => {
    return fetchWithAuth<VisualizationPoint[]>(
      `${API_BASE_URL}/coordinates/search?q=${encodeURIComponent(
        query
      )}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  getCluster: async (accessToken: string, clusterId: number) => {
    return fetchWithAuth<ClusterDetails>(
      `${API_BASE_URL}/coordinates/cluster/${clusterId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  getNeighbors: async (accessToken: string, trackId: number, limit = 20) => {
    return fetchWithAuth<TrackNeighbors>(
      `${API_BASE_URL}/coordinates/track/${trackId}/neighbors?limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
};
