# 3D Music Visualization

Interactive 3D visualization of music tracks using t-SNE dimensionality reduction.

## Components

### Scene.tsx
Main 3D canvas component using React Three Fiber. Handles camera, lighting, and orbit controls.

### Points.tsx
Renders the point cloud with custom shader material. Handles:
- Point rendering with depth-aware selection
- Hover effects (white highlight)
- Selection effects (brown highlight)
- Dynamic spread factor scaling

### Controls.tsx
UI controls overlay with:
- Camera reset button
- Favorites list toggle
- Density slider (number of points to load)
- Spread slider (×1.5 to ×3.5 spacing)

### TrackCard.tsx
Floating card showing selected track details with play, favorite, and find similar actions.

### constants.ts
Centralized configuration for visual styling, raycaster settings, and default values.

## Key Features

- **Depth-aware selection**: Click handling sorts intersections by distance to select the closest point
- **Hover preview**: Points turn white before clicking so you know what you're selecting
- **Dynamic spread**: Adjust point spacing without backend changes
- **Batched loading**: Fetches data in 5000-point batches to respect API limits
- **Performance optimized**: Uses shader materials, memoization, and efficient attribute updates

## Usage

```tsx
import VisualizationPage from '@/pages/VisualizationPage';

// The page handles all state and data fetching internally
<VisualizationPage />
```

## Configuration

Edit `constants.ts` to adjust:
- Point sizes and opacity
- Colors for hover/selection states
- Raycaster precision
- Data fetching limits
- Default UI values
