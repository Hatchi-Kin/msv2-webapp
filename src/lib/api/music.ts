import { API_BASE_URL, handleResponse } from "./client";
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
    const response = await fetch(
      `${API_BASE_URL}/music/artists?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async getAlbumsByArtist(
    artistName: string,
    accessToken: string
  ): Promise<AlbumListResponse> {
    const response = await fetch(
      `${API_BASE_URL}/music/albums/${encodeURIComponent(artistName)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async getTracksByAlbum(
    albumFolder: string,
    accessToken: string,
    includeEmbeddings: boolean = false
  ): Promise<TrackListResponse> {
    const response = await fetch(
      `${API_BASE_URL}/music/tracks/${encodeURIComponent(
        albumFolder
      )}?include_embeddings=${includeEmbeddings}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async getTracksByArtistAndAlbum(
    artistName: string,
    albumName: string,
    accessToken: string,
    includeEmbeddings: boolean = false
  ): Promise<TrackListResponse> {
    const response = await fetch(
      `${API_BASE_URL}/music/tracks/${encodeURIComponent(
        artistName
      )}/${encodeURIComponent(
        albumName
      )}?include_embeddings=${includeEmbeddings}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async getSongCount(accessToken: string): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/music/song_count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  },

  async getRandomSong(
    accessToken: string,
    includeEmbeddings: boolean = false
  ): Promise<MegasetTrack> {
    const response = await fetch(
      `${API_BASE_URL}/music/random_song?include_embeddings=${includeEmbeddings}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async getSongById(
    songId: number,
    accessToken: string,
    includeEmbeddings: boolean = false
  ): Promise<MegasetTrack> {
    const response = await fetch(
      `${API_BASE_URL}/music/song/${songId}?include_embeddings=${includeEmbeddings}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponse(response);
  },

  async getSimilarTracks(
    trackId: number,
    accessToken: string
  ): Promise<SimilarTrackListResponse> {
    const response = await fetch(`${API_BASE_URL}/music/similar/${trackId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  },
};
