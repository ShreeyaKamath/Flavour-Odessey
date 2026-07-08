import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AboutScreen } from "@/features/about/about-screen";
import { ShowcaseScreen } from "@/features/showcase/showcase-screen";

describe("portfolio showcase screens", () => {
  it("renders developer mode, architecture, system information, and screenshot slots", () => {
    render(<ShowcaseScreen />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Flavor Odyssey Showcase" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Architecture viewer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "System information" })).toBeInTheDocument();
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
    expect(screen.getByText("NPC Interaction")).toBeInTheDocument();
  });

  it("renders about, credits, and release information", () => {
    render(<AboutScreen />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Credits and Release" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Credits" })).toBeInTheDocument();
    expect(screen.getByText("ShreeyaKamath/Flavour-Odessey")).toBeInTheDocument();
  });
});
