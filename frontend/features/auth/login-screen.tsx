"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useAuthStore } from "@/stores/auth-store";

const inputClassName =
  "mt-2 min-h-11 w-full rounded-control border border-border bg-background px-3 py-2 text-foreground";

/** Renders email, password, and guest authentication actions. */
export function LoginScreen() {
  const router = useRouter();
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);
  const status = useAuthStore((state) => state.status);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = status === "loading";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await login({ email, password });
      router.push("/menu");
    } catch {
      // The store exposes the backend-safe error message.
    }
  }

  async function continueAsGuest() {
    try {
      await loginAsGuest();
      router.push("/menu");
    } catch {
      // The store exposes the backend-safe error message.
    }
  }

  return (
    <main className="mx-auto flex min-h-[34rem] max-w-lg items-center px-[var(--space-page)] py-10">
      <GlassPanel className="w-full">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Account</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-foreground">Sign in</h1>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="block text-sm font-medium text-foreground">
            Email
            <input
              autoComplete="email"
              className={inputClassName}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Password
            <input
              autoComplete="current-password"
              className={inputClassName}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button disabled={isLoading} type="submit">
              Sign in
            </Button>
            <Button disabled={isLoading} onClick={() => void continueAsGuest()} variant="secondary">
              Continue as guest
            </Button>
          </div>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Need an account?{" "}
          <Link className="font-semibold text-primary" href="/auth/register">
            Register
          </Link>
        </p>
      </GlassPanel>
    </main>
  );
}
