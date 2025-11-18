/**
 * API Client
 *
 * Organized API client for the MSV2 music application.
 * All endpoints are grouped by domain (auth, music, favorites, playlists).
 */

export { setUnauthorizedHandler } from "./client";
export { authApi as auth } from "./auth";
export { musicApi as music } from "./music";
export { favoritesApi as favorites } from "./favorites";
export { playlistsApi as playlists } from "./playlists";

// Re-export for convenience
import { authApi } from "./auth";
import { musicApi } from "./music";
import { favoritesApi } from "./favorites";
import { playlistsApi } from "./playlists";

export const api = {
  auth: authApi,
  music: {
    ...musicApi,
    ...favoritesApi,
    ...playlistsApi,
  },
};
