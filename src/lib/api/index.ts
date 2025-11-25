/**
 * API Client
 *
 * Organized API client for the MSV2 music application.
 * All endpoints are grouped by domain (auth, music, favorites, playlists).
 */

export { setRefreshTokenHandler, setLogoutHandler } from "./client";
export { authApi as auth } from "./auth";
export { libraryApi as library } from "./library";
export { favoritesApi as favorites } from "./favorites";
export { playlistsApi as playlists } from "./playlists";
export { visualizationApi as visualization } from "./visualization";
export { mediaApi as media } from "./media";
export { agentApi as agent } from "./agent";

// Re-export for convenience
import { authApi } from "./auth";
import { libraryApi } from "./library";
import { favoritesApi } from "./favorites";
import { playlistsApi } from "./playlists";
import { visualizationApi } from "./visualization";
import { mediaApi } from "./media";
import { agentApi } from "./agent";

export const api = {
  auth: authApi,
  music: {
    ...libraryApi,
    ...favoritesApi,
    ...playlistsApi,
  },
  visualization: visualizationApi,
  media: mediaApi,
  agent: agentApi,
};
