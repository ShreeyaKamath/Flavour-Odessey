import dynamic from "next/dynamic";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { RouteLoading } from "@/components/production/route-loading";

const WorldMapScreen = dynamic(
  () => import("@/features/world/world-map-screen").then((module) => module.WorldMapScreen),
  {
    loading: () => <RouteLoading label="Unfolding the world map" />
  }
);

/** Renders the protected world map route. */
export default function WorldPage() {
  return (
    <ProtectedRoute>
      <WorldMapScreen />
    </ProtectedRoute>
  );
}
