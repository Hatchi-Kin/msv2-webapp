interface Config {
  apiUrl: string;
}

declare global {
  interface Window {
    ENV?: {
      VITE_API_BASE_URL?: string;
    };
  }
}

/**
 * Application configuration
 * Priority: Runtime config (Docker) > Build-time env var > Default
 */
const config: Config = {
  apiUrl:
    window.ENV?.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000",
};

export default config;
