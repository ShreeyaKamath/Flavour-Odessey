import { ProtectedRoute } from "@/components/auth/protected-route";
import { GameplayScreen } from "@/features/game/gameplay-screen";

type GamePageProps = {
  searchParams: Promise<{ island?: string }>;
};

export default async function GamePage({ searchParams }: GamePageProps) {
  const { island } = await searchParams;
  return (
    <ProtectedRoute>
      <GameplayScreen islandId={island} />
    </ProtectedRoute>
  );
}
