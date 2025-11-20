// Visual styling constants for 3D point cloud
export const POINT_SIZES = {
  BASE: 0.5,
  HOVER: 0.75,
  SELECTED: 0.8,
} as const;

export const POINT_ALPHAS = {
  BASE: 0.85,
  HOVER: 1.0,
  SELECTED: 1.0,
} as const;

export const POINT_COLORS = {
  SELECTED: "#4a3728", // Mocha brown
  HOVER: "#ffffff", // White
} as const;

// Raycaster configuration
export const RAYCASTER_THRESHOLD = 0.12;

// Data fetching configuration
export const BATCH_SIZE = 5000; // API limit per request
export const MAX_POINTS = 20000; // Performance cap

// Default UI values
export const DEFAULT_POINT_LIMIT = 8000;
export const DEFAULT_SPREAD_FACTOR = 2.5;

// Spread factor range
export const SPREAD_RANGE = {
  MIN: 1.5,
  MAX: 3.5,
  STEP: 0.5,
} as const;
