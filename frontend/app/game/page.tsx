import dynamic from "next/dynamic";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { RouteLoading } from "@/components/production/route-loading";

const GameplayScreen = dynamic(
  () => import("@/features/game/gameplay-screen").then((module) => module.GameplayScreen),
  {
    loading: () => <RouteLoading label="Opening Joy Meadow" />
  }
);

type GamePageProps = {
  searchParams: Promise<{ island?: string }>;
};

/** Resolves the selected island and renders the protected gameplay route. */
export default async function GamePage({ searchParams }: GamePageProps) {
  const { island } = await searchParams;
  return (
    <ProtectedRoute>
      <GameplayScreen islandId={island} />
    </ProtectedRoute>
  );
}
