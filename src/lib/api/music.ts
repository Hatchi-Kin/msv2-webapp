import { API_BASE_URL, fetchWithAuth } from "./client";
import type {
  ArtistListResponse,
  AlbumListResponse,
  TrackListResponse,
  MegasetTrack,
  SimilarTrackListResponse,
} from "@/types/api";

export const musicApi = {
  async getArtists(
    accessToken: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<ArtistListResponse> {
    return fetchWithAuth<ArtistListResponse>(
      `${API_BASE_URL}/music/artists?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async getAlbumsByArtist(
    artistName: string,
    accessToken: string
  ): Promise<AlbumListResponse> {
    return fetchWithAuth<AlbumListResponse>(
      `${API_BASE_URL}/music/albums/${encodeURIComponent(artistName)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async getTracksByAlbum(
    albumFolder: string,
    accessToken: string,
    includeEmbeddings: boolean = false
  ): Promise<TrackListResponse> {
    return fetchWithAuth<TrackListResponse>(
      `${API_BASE_URL}/music/tracks/${encodeURIComponent(albumFolder)}?include_embeddings=${includeEmbeddings}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async getTracksByArtistAndAlbum(
    artistName: string,
    albumName: string,
    accessToken: string,
    includeEmbeddings: boolean = false
  ): Promise<TrackListResponse> {
    return fetchWithAuth<TrackListResponse>(
      `${API_BASE_URL}/music/tracks/${encodeURIComponent(artistName)}/${encodeURIComponent(albumName)}?include_embeddings=${includeEmbeddings}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async getSongCount(accessToken: string): Promise<number> {
    return fetchWithAuth<number>(`${API_BASE_URL}/music/track_count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async getRandomSong(
    accessToken: string,
    includeEmbeddings: boolean = false
  ): Promise<MegasetTrack> {
    return fetchWithAuth<MegasetTrack>(
      `${API_BASE_URL}/music/random_track?include_embeddings=${includeEmbeddings}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async getSongById(
    songId: number,
    accessToken: string,
    includeEmbeddings: boolean = false
  ): Promise<MegasetTrack> {
    return fetchWithAuth<MegasetTrack>(
      `${API_BASE_URL}/music/track/${songId}?include_embeddings=${includeEmbeddings}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },

  async getSimilarTracks(
    trackId: number,
    accessToken: string,
    limit: number = 10
  ): Promise<SimilarTrackListResponse> {
    return fetchWithAuth<SimilarTrackListResponse>(
      `${API_BASE_URL}/music/similar/${trackId}?limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
};
