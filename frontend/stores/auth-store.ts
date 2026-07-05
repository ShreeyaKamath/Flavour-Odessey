import type { components } from "@flavor/contracts/api";
import { create } from "zustand";

import { apiClient } from "@/lib/api/client";
import {
  clearAuthTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken
} from "@/lib/auth/token-storage";
import { notifyAuthIdentityChanged } from "@/lib/auth/session-events";

type AuthUser = components["schemas"]["AuthUser"];
type LoginRequest = components["schemas"]["LoginRequest"];
type RegisterRequest = components["schemas"]["RegisterRequest"];
type AuthStatus = "idle" | "loading" | "authenticated" | "anonymous";

type AuthState = {
  error: string | null;
  status: AuthStatus;
  user: AuthUser | null;
  clearError: () => void;
  expireSession: () => void;
  login: (payload: LoginRequest) => Promise<void>;
  loginAsGuest: (displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  restoreSession: () => Promise<void>;
};

let restoreSessionRequest: Promise<void> | null = null;

function messageFrom(error: unknown) {
  return error instanceof Error ? error.message : "Authentication failed";
}

function establishSession(response: components["schemas"]["AuthSessionResponse"]) {
  setAccessToken(response.access_token);
  setRefreshToken(response.refresh_token);
  notifyAuthIdentityChanged();
  return response.user;
}

export const useAuthStore = create<AuthState>((set) => ({
  error: null,
  status: "idle",
  user: null,

  clearError: () => set({ error: null }),
  expireSession: () => {
    clearAuthTokens();
    notifyAuthIdentityChanged();
    set({ error: null, status: "anonymous", user: null });
  },

  login: async (payload) => {
    set({ error: null, status: "loading" });
    try {
      const session = await apiClient.authLogin(payload);
      set({ status: "authenticated", user: establishSession(session) });
    } catch (error) {
      clearAuthTokens();
      notifyAuthIdentityChanged();
      set({ error: messageFrom(error), status: "anonymous", user: null });
      throw error;
    }
  },

  loginAsGuest: async (displayName) => {
    set({ error: null, status: "loading" });
    try {
      const session = await apiClient.authGuest({
        display_name: displayName || null
      });
      set({ status: "authenticated", user: establishSession(session) });
    } catch (error) {
      clearAuthTokens();
      notifyAuthIdentityChanged();
      set({ error: messageFrom(error), status: "anonymous", user: null });
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.authLogout();
    } finally {
      clearAuthTokens();
      notifyAuthIdentityChanged();
      set({ error: null, status: "anonymous", user: null });
    }
  },

  register: async (payload) => {
    set({ error: null, status: "loading" });
    try {
      const session = await apiClient.authRegister(payload);
      set({ status: "authenticated", user: establishSession(session) });
    } catch (error) {
      clearAuthTokens();
      notifyAuthIdentityChanged();
      set({ error: messageFrom(error), status: "anonymous", user: null });
      throw error;
    }
  },

  restoreSession: () => {
    if (restoreSessionRequest) {
      return restoreSessionRequest;
    }

    restoreSessionRequest = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthTokens();
        set({ error: null, status: "anonymous", user: null });
        return;
      }

      set({ error: null, status: "loading" });
      try {
        const refreshed = await apiClient.authRefresh({
          refresh_token: refreshToken
        });
        setAccessToken(refreshed.access_token);
        setRefreshToken(refreshed.refresh_token);

        const current = await apiClient.authMe();
        notifyAuthIdentityChanged();
        set({ status: "authenticated", user: current.user });
      } catch {
        clearAuthTokens();
        notifyAuthIdentityChanged();
        set({ error: null, status: "anonymous", user: null });
      }
    })().finally(() => {
      restoreSessionRequest = null;
    });
    return restoreSessionRequest;
  }
}));
