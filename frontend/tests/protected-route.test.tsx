import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuthStore } from "@/stores/auth-store";

describe("ProtectedRoute", () => {
  afterEach(() => {
    act(() => {
      useAuthStore.setState({
        error: null,
        status: "idle",
        user: null
      });
    });
  });

  it("shows its children to authenticated users", () => {
    useAuthStore.setState({
      status: "authenticated",
      user: {
        display_name: "Guest",
        email: null,
        id: "guest-1",
        is_guest: true
      }
    });

    render(
      <ProtectedRoute>
        <div>Private content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Private content")).toBeInTheDocument();
  });

  it("shows a login path to anonymous users", () => {
    useAuthStore.setState({ status: "anonymous", user: null });

    render(
      <ProtectedRoute>
        <div>Private content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText("Private content")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to login" })).toHaveAttribute(
      "href",
      "/auth/login"
    );
  });
});
