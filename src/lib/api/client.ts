import config from "@/lib/config";

export const API_BASE_URL = config.apiUrl;

interface ApiError {
  detail: string;
}

// Global handler for token refresh
let refreshTokenFn: (() => Promise<string>) | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const setRefreshTokenHandler = (handler: () => Promise<string>) => {
  refreshTokenFn = handler;
};

// Global handler for final logout (when refresh fails)
let onLogout: (() => void) | null = null;

export const setLogoutHandler = (handler: () => void) => {
  onLogout = handler;
};

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.detail || "An unknown error occurred");
  }
  return response.json();
}

// Enhanced fetch with automatic token refresh and retry
export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Important for cookies
  });

  // If 401 and we have a refresh handler and haven't retried yet
  if (response.status === 401 && refreshTokenFn && retryCount === 0) {
    console.log("Got 401, attempting token refresh...");

    try {
      // If already refreshing, wait for that refresh to complete
      if (isRefreshing && refreshPromise) {
        console.log("Refresh already in progress, waiting...");
        await refreshPromise;
      } else {
        // Start a new refresh
        isRefreshing = true;
        refreshPromise = refreshTokenFn();
        const newToken = await refreshPromise;
        console.log("Token refreshed successfully");

        // Update the Authorization header with new token
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${newToken}`);

        isRefreshing = false;
        refreshPromise = null;

        // Retry the original request with new token
        return fetchWithAuth<T>(url, { ...options, headers }, retryCount + 1);
      }

      // After waiting for refresh, retry with updated token from storage
      const headers = new Headers(options.headers);
      const newToken = localStorage.getItem("accessToken");
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
      }

      return fetchWithAuth<T>(url, { ...options, headers }, retryCount + 1);
    } catch (error) {
      console.error("Token refresh failed:", error);
      isRefreshing = false;
      refreshPromise = null;

      // Refresh failed, logout user
      if (onLogout) {
        onLogout();
      }
      throw new Error("Session expired. Please log in again.");
    }
  }

  // Handle response normally
  return handleResponse<T>(response);
}
