/**
 * Application Limits
 *
 * Centralized configuration for user limits and constraints.
 */

export const LIMITS = {
  /** Maximum number of favorite tracks per user */
  MAX_FAVORITES: 20,

  /** Maximum number of tracks per playlist */
  MAX_PLAYLIST_TRACKS: 20,

  /** Maximum number of playlists per user (unlimited if not set) */
  MAX_PLAYLISTS: undefined,

  /** Default number of items per page for pagination */
  DEFAULT_PAGE_SIZE: 25,

  /** Default number of artists to fetch per page */
  DEFAULT_ARTISTS_PAGE_SIZE: 100,
} as const;
