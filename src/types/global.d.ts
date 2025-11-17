declare global {
  interface Window {
    ENV?: {
      VITE_API_BASE_URL: string;
    };
  }
}

export {};
