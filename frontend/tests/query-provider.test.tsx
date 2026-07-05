import { QueryClient } from "@tanstack/react-query";
import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QueryProvider } from "@/components/providers/query-provider";
import { authIdentityChangedEvent } from "@/lib/auth/session-events";

describe("QueryProvider", () => {
  it("clears authenticated server state when identity changes", () => {
    const client = new QueryClient();
    client.setQueryData(["game", "state"], { user: "first-player" });

    render(
      <QueryProvider client={client}>
        <div>Child</div>
      </QueryProvider>
    );
    expect(client.getQueryData(["game", "state"])).toEqual({
      user: "first-player"
    });

    act(() => {
      window.dispatchEvent(new Event(authIdentityChangedEvent));
    });

    expect(client.getQueryData(["game", "state"])).toBeUndefined();
  });
});
