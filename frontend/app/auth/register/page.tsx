import type { Metadata } from "next";

import { RegisterScreen } from "@/features/auth/register-screen";

export const metadata: Metadata = {
  title: "Register"
};

/** Renders the account registration route. */
export default function RegisterPage() {
  return <RegisterScreen />;
}
