import { ProtectedRoute } from "@/components/auth/protected-route";
import { WorldMapScreen } from "@/features/world/world-map-screen";

export default function WorldPage() {
  return (
    <ProtectedRoute>
      <WorldMapScreen />
    </ProtectedRoute>
  );
}
