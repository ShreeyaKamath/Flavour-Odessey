import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiClient, authSessionExpiredEvent } from "@/lib/api/client";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken
} from "@/lib/auth/token-storage";

describe("ApiClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setAccessToken(null);
    setRefreshToken(null);
  });

  it("reads backend health", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "ok",
          service: "flavor-odyssey-backend"
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200
        }
      )
    );

    const client = new ApiClient("http://localhost:8000");

    await expect(client.getHealth()).resolves.toEqual({
      status: "ok",
      service: "flavor-odyssey-backend"
    });
  });

  it("serializes typed auth bodies and supplies the bearer token", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          user: {
            display_name: "Mira",
            email: "mira@example.com",
            id: "user-1",
            is_guest: false
          }
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200
        }
      )
    );
    setAccessToken("access-token");

    const client = new ApiClient("http://localhost:8000");
    await client.authMe();

    const [, init] = fetchMock.mock.calls[0];
    expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer access-token");
  });

  it("encodes generated world path parameters", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        headers: { "Content-Type": "application/json" },
        status: 200
      })
    );

    const client = new ApiClient("http://localhost:8000");
    await client.getWorldIsland("joy meadow");

    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8000/api/world/islands/joy%20meadow");
  });

  it("refreshes an expired access token and retries the protected request", async () => {
    setAccessToken("expired-access");
    setRefreshToken("refresh-token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      const authorization = new Headers(init?.headers).get("Authorization");
      if (url.endsWith("/api/auth/refresh")) {
        return new Response(
          JSON.stringify({
            access_token: "fresh-access",
            expires_at: "2026-07-05T12:00:00Z",
            refresh_token: "rotated-refresh",
            token_type: "bearer"
          }),
          { status: 200 }
        );
      }
      if (authorization === "Bearer expired-access") {
        return new Response(
          JSON.stringify({
            error: { code: "UNAUTHORIZED", message: "Expired access token" }
          }),
          { status: 401 }
        );
      }
      return new Response(JSON.stringify({ reloaded: true }), { status: 200 });
    });

    const client = new ApiClient("http://localhost:8000");
    await expect(client.getGameState()).resolves.toEqual({ reloaded: true });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(getAccessToken()).toBe("fresh-access");
    expect(getRefreshToken()).toBe("rotated-refresh");
  });

  it("shares one refresh request across concurrent protected requests", async () => {
    setAccessToken("expired-access");
    setRefreshToken("refresh-token");
    let resolveRefresh!: (response: Response) => void;
    let refreshCalls = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      const url = String(input);
      const authorization = new Headers(init?.headers).get("Authorization");
      if (url.endsWith("/api/auth/refresh")) {
        refreshCalls += 1;
        return new Promise<Response>((resolve) => {
          resolveRefresh = resolve;
        });
      }
      if (authorization === "Bearer expired-access") {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              error: { code: "UNAUTHORIZED", message: "Expired access token" }
            }),
            { status: 401 }
          )
        );
      }
      return Promise.resolve(new Response(JSON.stringify({ reloaded: true }), { status: 200 }));
    });

    const client = new ApiClient("http://localhost:8000");
    const requests = Promise.all([client.getGameState(), client.getGameState()]);
    await vi.waitFor(() => expect(refreshCalls).toBe(1));
    resolveRefresh(
      new Response(
        JSON.stringify({
          access_token: "fresh-access",
          expires_at: "2026-07-05T12:00:00Z",
          refresh_token: "rotated-refresh",
          token_type: "bearer"
        }),
        { status: 200 }
      )
    );

    await expect(requests).resolves.toEqual([{ reloaded: true }, { reloaded: true }]);
    expect(refreshCalls).toBe(1);
  });

  it("refreshes before retrying protected logout", async () => {
    setAccessToken("expired-access");
    setRefreshToken("refresh-token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      const authorization = new Headers(init?.headers).get("Authorization");
      if (url.endsWith("/api/auth/refresh")) {
        return new Response(
          JSON.stringify({
            access_token: "fresh-access",
            expires_at: "2026-07-05T12:00:00Z",
            refresh_token: "rotated-refresh",
            token_type: "bearer"
          }),
          { status: 200 }
        );
      }
      if (authorization === "Bearer expired-access") {
        return new Response(
          JSON.stringify({
            error: { code: "UNAUTHORIZED", message: "Expired access token" }
          }),
          { status: 401 }
        );
      }
      return new Response(JSON.stringify({ logged_out: true }), {
        status: 200
      });
    });

    const client = new ApiClient("http://localhost:8000");
    await expect(client.authLogout()).resolves.toEqual({ logged_out: true });

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("clears tokens and emits expiry when refresh fails", async () => {
    setAccessToken("expired-access");
    setRefreshToken("invalid-refresh");
    const expired = vi.fn();
    window.addEventListener(authSessionExpiredEvent, expired);
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const isRefresh = String(input).endsWith("/api/auth/refresh");
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: isRefresh ? "Invalid refresh token" : "Expired access token"
          }
        }),
        { status: 401 }
      );
    });

    const client = new ApiClient("http://localhost:8000");
    await expect(client.getGameState()).rejects.toThrow("Expired access token");

    expect(expired).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    window.removeEventListener(authSessionExpiredEvent, expired);
  });
});
