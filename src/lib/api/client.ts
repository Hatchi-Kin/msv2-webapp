import config from "@/lib/config";

export const API_BASE_URL = config.apiUrl;

interface ApiError {
  detail: string;
}

// Global handler for 401 errors (session expired)
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Handle 401 Unauthorized (session expired)
    if (response.status === 401 && onUnauthorized) {
      onUnauthorized();
    }

    const errorData: ApiError = await response.json();
    throw new Error(errorData.detail || "An unknown error occurred");
  }
  return response.json();
}
