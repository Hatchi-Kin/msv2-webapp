/**
 * Security utilities for handling URLs and external content.
 */

// List of allowed protocols.
const ALLOWED_PROTOCOLS = ["https:", "http:"];

/**
 * Validates if a URL is safe to navigate to.
 * Prevents javascript: pseudo-protocol and other malicious vectors.
 *
 * @param url The URL to validate
 * @returns true if the URL is safe, false otherwise
 */

export const isSafeUrl = (url: string): boolean => {
  if (!url) return false;

  // Allow relative URLs
  if (url.startsWith("/") || url.startsWith("#") || url.startsWith("?")) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch (e) {
    // If it's not a full URL, it might be a relative path like "foo/bar"
    // We can try properly parsing it with a base to see if it's safe path characters
    // But for strictness, in this app we expect / for relative.
    return false;
  }
};

/**
 * Returns a sanitized URL if safe, or a fallback (or null) if unsafe.
 *
 * @param url The URL to sanitize
 * @param fallback Optional fallback URL
 * @returns The safe URL or fallback
 */
export const getSafeUrl = (
  url: string,
  fallback: string | null = null
): string | null => {
  if (isSafeUrl(url)) {
    return url;
  }
  return fallback;
};

/**
 * Validates a domain against a strict allowlist if provided.
 *
 * @param url The URL to check
 * @param allowedDomains Array of allowed hostnames (e.g. ['spotify.com'])
 * @returns true if domain is allowed
 */
export const isAllowedDomain = (
  url: string,
  allowedDomains: string[]
): boolean => {
  try {
    const parsed = new URL(url);
    return allowedDomains.some(
      (domain) =>
        parsed.hostname === domain || parsed.hostname.endsWith("." + domain)
    );
  } catch {
    return false;
  }
};
