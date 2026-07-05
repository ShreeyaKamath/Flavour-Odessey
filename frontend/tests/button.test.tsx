import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders accessible button content and handles clicks", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Begin</Button>);

    await user.click(screen.getByRole("button", { name: "Begin" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
