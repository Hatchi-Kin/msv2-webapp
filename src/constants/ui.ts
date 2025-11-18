/**
 * UI Constants
 *
 * Centralized configuration for UI behavior and timing.
 */

export const UI_CONSTANTS = {
  /** Delay before closing dropdown menus when mouse leaves (ms) */
  DROPDOWN_CLOSE_DELAY: 300,

  /** Threshold for restarting vs going to previous track (seconds) */
  TRACK_RESTART_THRESHOLD: 3,

  /** Default audio volume (0.0 - 1.0) */
  DEFAULT_VOLUME: 0.7,

  /** Maximum height for dropdown menus (px) */
  MAX_DROPDOWN_HEIGHT: 240,

  /** Minimum height for media cards (px) */
  MEDIA_CARD_MIN_HEIGHT: 140,

  /** Audio streaming chunk size (bytes) */
  AUDIO_CHUNK_SIZE: 32 * 1024, // 32KB
} as const;
