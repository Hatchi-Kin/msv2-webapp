import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { api } from "@/lib/api";
import { setRefreshTokenHandler, setLogoutHandler } from "@/lib/api/client";
import type { User, UserCreate, Token } from "@/types/api";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/lib/utils/errors";

// Import usePlayer - we'll use it via a ref to avoid circular dependency
let stopMusicCallback: (() => void) | null = null;

export const setStopMusicCallback = (callback: () => void) => {
  stopMusicCallback = callback;
};

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (user: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const storeAccessToken = (token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  };

  const clearAuth = useCallback(() => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
    setError(null);
    
    // Stop music when clearing auth
    if (stopMusicCallback) {
      stopMusicCallback();
    }
  }, []);

  const fetchUser = useCallback(
    async (token: string) => {
      try {
        const fetchedUser = await api.auth.getMe(token);
        setUser(fetchedUser);
        return fetchedUser;
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(getErrorMessage(err));
        clearAuth(); // Clear auth if user fetch fails
        throw err; // Re-throw to propagate error
      }
    },
    [clearAuth]
  );

  const refreshAccessToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenResponse: Token = await api.auth.refresh();
      storeAccessToken(tokenResponse.access_token);
      await fetchUser(tokenResponse.access_token);
    } catch (err) {
      console.error("Failed to refresh token:", err);
      setError(getErrorMessage(err));
      clearAuth();
      navigate("/"); // Redirect to login on refresh failure
    } finally {
      setLoading(false);
    }
  }, [fetchUser, navigate, clearAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const tokenResponse: Token = await api.auth.login(email, password);
        storeAccessToken(tokenResponse.access_token);
        await fetchUser(tokenResponse.access_token);
        navigate("/library"); // Redirect to library on successful login
      } catch (err) {
        console.error("Login failed:", err);
        setError(getErrorMessage(err));
        clearAuth();
      } finally {
        setLoading(false);
      }
    },
    [fetchUser, navigate, clearAuth]
  );

  const register = useCallback(
    async (userCreate: UserCreate) => {
      setLoading(true);
      setError(null);
      try {
        await api.auth.register(userCreate);
        // Optionally log in the user after successful registration
        await login(userCreate.email, userCreate.password);
      } catch (err) {
        console.error("Registration failed:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Send access token with logout request
      await api.auth.logout(accessToken || undefined);
    } catch (err) {
      console.error("Logout API call failed:", err);
      // Continue with logout even if API call fails
    } finally {
      // Always clear auth and redirect, regardless of API call success
      clearAuth();
      setLoading(false);
      navigate("/"); // Redirect to landing page on logout
    }
  }, [accessToken, navigate, clearAuth]);

  // Handler for token refresh that returns the new token
  const handleRefreshToken = useCallback(async (): Promise<string> => {
    console.log("Refreshing access token...");
    const tokenResponse: Token = await api.auth.refresh();
    storeAccessToken(tokenResponse.access_token);
    // Fetch user data with new token
    await fetchUser(tokenResponse.access_token);
    return tokenResponse.access_token;
  }, [fetchUser]);

  // Handler for final logout when refresh fails
  const handleLogout = useCallback(() => {
    console.log("Session expired, logging out...");
    clearAuth();
    navigate("/", { state: { sessionExpired: true } });
  }, [clearAuth, navigate]);

  // Register global handlers
  useEffect(() => {
    setRefreshTokenHandler(handleRefreshToken);
    setLogoutHandler(handleLogout);
    return () => {
      setRefreshTokenHandler(async () => "");
      setLogoutHandler(() => {});
    };
  }, [handleRefreshToken, handleLogout]);

  useEffect(() => {
    const initAuth = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        try {
          await fetchUser(storedAccessToken);
        } catch {
          // If fetching user with stored access token fails, try refreshing
          await refreshAccessToken();
        }
      } else {
        // No access token in localStorage, so user is not authenticated initially.
        // Do NOT call refreshAccessToken here, as it would fail if no refresh token cookie exists.
        // The login form will handle authentication.
        clearAuth(); // Ensure all auth states are clear
      }
      setLoading(false);
    };
    initAuth();
  }, [fetchUser, refreshAccessToken, clearAuth]);

  const isAuthenticated = !!user && !!accessToken;

  const value = {
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
