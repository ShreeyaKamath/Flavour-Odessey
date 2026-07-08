import dynamic from "next/dynamic";

import { RouteLoading } from "@/components/production/route-loading";

const SettingsScreen = dynamic(
  () => import("@/features/settings/settings-screen").then((module) => module.SettingsScreen),
  {
    loading: () => <RouteLoading label="Opening crystal settings" />
  }
);

/** Renders the application settings route. */
export default function SettingsPage() {
  return <SettingsScreen />;
}
