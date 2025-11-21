import { API_BASE_URL } from "./client";

export const mediaApi = {
  async streamAudio(trackId: number, accessToken: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/media/audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ track_id: trackId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to stream audio: ${response.status}`);
    }

    return response.blob();
  },
};
