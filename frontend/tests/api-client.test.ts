import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiClient } from "@/lib/api/client";
import { setAccessToken } from "@/lib/auth/token-storage";

describe("ApiClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setAccessToken(null);
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
    expect(new Headers(init?.headers).get("Authorization")).toBe(
      "Bearer access-token"
    );
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

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://localhost:8000/api/world/islands/joy%20meadow"
    );
  });
});
