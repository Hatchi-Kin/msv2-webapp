import * as THREE from "three";

/**
 * Utility to fetch a CSS variable color and convert it to a THREE.Color
 * @param varName The CSS variable name (including --)
 * @param fallback The fallback hex color string
 */
export const getThemeThreeColor = (
  varName: string,
  fallback: string,
): THREE.Color => {
  if (typeof window === "undefined") return new THREE.Color(fallback);

  const rootStyle = getComputedStyle(document.documentElement);
  let colorStr = rootStyle.getPropertyValue(varName).trim();

  if (!colorStr) return new THREE.Color(fallback);

  // Handle HSL format if provided as "210 40% 98%" (Tailwind style)
  if (
    !colorStr.startsWith("#") &&
    !colorStr.startsWith("rgb") &&
    !colorStr.startsWith("hsl")
  ) {
    // Check if it's the raw space-separated HSL values (e.g. "188 86% 53%")
    const parts = colorStr.split(" ");
    if (parts.length === 3) {
      return new THREE.Color(`hsl(${parts[0]}, ${parts[1]}, ${parts[2]})`);
    }
  }

  return new THREE.Color(colorStr);
};
