import dynamic from "next/dynamic";

import { RouteLoading } from "@/components/production/route-loading";

const RecipeBookScreen = dynamic(
  () => import("@/features/recipes/recipe-book-screen").then((module) => module.RecipeBookScreen),
  {
    loading: () => <RouteLoading label="Opening the enchanted cookbook" />
  }
);

/** Renders the recipe book route. */
export default function RecipesPage() {
  return <RecipeBookScreen />;
}
