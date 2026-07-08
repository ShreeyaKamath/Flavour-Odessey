import dynamic from "next/dynamic";

import { RouteLoading } from "@/components/production/route-loading";

const JournalScreen = dynamic(
  () => import("@/features/journal/journal-screen").then((module) => module.JournalScreen),
  {
    loading: () => <RouteLoading label="Opening the Journal of Memories" />
  }
);

/** Renders the Journal of Memories route. */
export default function JournalPage() {
  return <JournalScreen />;
}
