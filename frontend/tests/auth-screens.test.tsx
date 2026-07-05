import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LoginScreen } from "@/features/auth/login-screen";
import { RegisterScreen } from "@/features/auth/register-screen";
import { useAuthStore } from "@/stores/auth-store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe("auth screens", () => {
  afterEach(() => {
    act(() => {
      useAuthStore.setState({
        error: null,
        status: "anonymous",
        user: null
      });
    });
  });

  it("renders login and guest actions", () => {
    render(<LoginScreen />);

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue as guest" })).toBeInTheDocument();
  });

  it("renders registration fields", () => {
    render(<RegisterScreen />);

    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();
    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});
