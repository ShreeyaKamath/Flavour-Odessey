"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const status = useAuthStore((state) => state.status);

  if (status !== "authenticated") {
    return null;
  }

  return (
    <Button
      className="ml-auto shrink-0"
      onClick={() => void logout()}
      variant="ghost"
    >
      Log out
    </Button>
  );
}
