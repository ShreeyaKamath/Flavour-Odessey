export type ScreenStatus = "foundation" | "placeholder";

export type PlaceholderScreen = {
  eyebrow: string;
  title: string;
  description: string;
  status: ScreenStatus;
};
