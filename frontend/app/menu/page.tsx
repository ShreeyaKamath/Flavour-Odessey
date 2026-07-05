import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainMenuScreen } from "@/features/menu/main-menu-screen";

/** Renders the protected main menu route. */
export default function MenuPage() {
  return (
    <ProtectedRoute>
      <MainMenuScreen />
    </ProtectedRoute>
  );
}
