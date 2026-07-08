import { ProtectedRoute } from "@/components/auth/protected-route";
import dynamic from "next/dynamic";

import { RouteLoading } from "@/components/production/route-loading";

const MainMenuScreen = dynamic(
  () => import("@/features/menu/main-menu-screen").then((module) => module.MainMenuScreen),
  {
    loading: () => <RouteLoading label="Opening the storybook" />
  }
);

/** Renders the protected main menu route. */
export default function MenuPage() {
  return (
    <ProtectedRoute>
      <MainMenuScreen />
    </ProtectedRoute>
  );
}
