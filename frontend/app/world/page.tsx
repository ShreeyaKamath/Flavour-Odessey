import { ProtectedRoute } from "@/components/auth/protected-route";
import { WorldMapScreen } from "@/features/world/world-map-screen";

/** Renders the protected world map route. */
export default function WorldPage() {
  return (
    <ProtectedRoute>
      <WorldMapScreen />
    </ProtectedRoute>
  );
}
