import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken
} from "@/lib/auth/token-storage";
import { useAuthStore } from "@/stores/auth-store";

const session = {
  access_token: "access-token",
  expires_at: "2026-07-04T12:00:00Z",
  refresh_token: "refresh-token",
  token_type: "bearer" as const,
  user_id: "user-1",
  user: {
    display_name: "Mira",
    email: "mira@example.com",
    id: "user-1",
    is_guest: false
  }
};

describe("auth store", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
    setAccessToken(null);
    useAuthStore.setState({
      error: null,
      status: "idle",
      user: null
    });
  });

  it("establishes a typed login session", async () => {
    vi.spyOn(apiClient, "authLogin").mockResolvedValueOnce(session);

    await useAuthStore.getState().login({
      email: "mira@example.com",
      password: "bright-spice"
    });

    expect(apiClient.authLogin).toHaveBeenCalledWith({
      email: "mira@example.com",
      password: "bright-spice"
    });
    expect(useAuthStore.getState().status).toBe("authenticated");
    expect(useAuthStore.getState().user).toEqual(session.user);
    expect(getAccessToken()).toBe("access-token");
    expect(getRefreshToken()).toBe("refresh-token");
  });

  it("clears local auth state even when logout fails", async () => {
    setAccessToken("access-token");
    window.sessionStorage.setItem(
      "flavor-odyssey.refresh-token",
      "refresh-token"
    );
    useAuthStore.setState({
      status: "authenticated",
      user: session.user
    });
    vi.spyOn(apiClient, "authLogout").mockRejectedValueOnce(
      new Error("network unavailable")
    );

    await expect(useAuthStore.getState().logout()).rejects.toThrow(
      "network unavailable"
    );

    expect(useAuthStore.getState().status).toBe("anonymous");
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});
