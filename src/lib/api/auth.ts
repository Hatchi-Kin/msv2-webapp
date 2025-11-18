import { API_BASE_URL, handleResponse } from "./client";
import type { UserCreate, Token, User } from "@/types/api";

export const authApi = {
  async register(user: UserCreate): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return handleResponse(response);
  },

  async login(email: string, password: string): Promise<Token> {
    const formBody = new URLSearchParams();
    formBody.append("username", email);
    formBody.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    });
    return handleResponse(response);
  },

  async refresh(): Promise<Token> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Important for sending cookies
    });
    return handleResponse(response);
  },

  async logout(accessToken?: string): Promise<{ message: string }> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers,
    });
    return handleResponse(response);
  },

  async getMe(accessToken: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  },
};
