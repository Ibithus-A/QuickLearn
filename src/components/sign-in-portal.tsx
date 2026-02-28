"use client";

import { CloseIcon, FlowLogoIcon } from "@/components/icons";
import { MoonIcon, SunIcon } from "@/components/icons";
import { accountFromUser } from "@/lib/supabase/account";
import { createClient } from "@/lib/supabase/client";
import type { AuthenticatedAccount } from "@/types/auth";
import { useState } from "react";

type SignInPortalProps = {
  onContinue: (account: AuthenticatedAccount) => void;
  onClose: () => void;
  showCloseButton?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
};

type AuthMode = "sign-in" | "sign-up";

export function SignInPortal({
  onClose,
  onContinue,
  showCloseButton = true,
  isDarkMode = false,
  onToggleDarkMode,
}: SignInPortalProps) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = createClient();
    setError("");
    setInfo("");
    setIsSubmitting(true);

    if (mode === "sign-in") {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setIsSubmitting(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError("Unable to sign in. Please try again.");
        return;
      }

      onContinue(accountFromUser(data.user));
      return;
    }

    const normalizedName = name.trim();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          role: "student",
          full_name: normalizedName,
        },
      },
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.user) {
      setError("Unable to create account. Please try again.");
      return;
    }

    if (!data.session) {
      setInfo("Account created. Check your email to verify your account, then sign in.");
      setMode("sign-in");
      return;
    }

    onContinue(accountFromUser(data.user));
  };

  return (
    <section className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-[1px] md:p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_20px_50px_rgba(9,9,11,0.08)] transition-all duration-200 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white">
              <FlowLogoIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-900">QuickLearn Portal</p>
              <p className="text-xs text-zinc-500">Secure Sign In with Supabase</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {onToggleDarkMode ? (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </button>
            ) : null}
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                aria-label="Close sign in portal"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("sign-in");
              setError("");
              setInfo("");
            }}
            className={[
              "rounded-md px-3 py-2 text-sm transition",
              mode === "sign-in"
                ? "bg-white font-medium text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("sign-up");
              setError("");
              setInfo("");
            }}
            className={[
              "rounded-md px-3 py-2 text-sm transition",
              mode === "sign-up"
                ? "bg-white font-medium text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            Sign Up
          </button>
        </div>

        <form
          className="space-y-3"
          onSubmit={handleSubmit}
        >
          {mode === "sign-up" ? (
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                  setInfo("");
                }}
                placeholder="Your name"
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                autoComplete="name"
                required
              />
              <p className="mt-1 text-xs text-zinc-500">
                New sign-ups are created as student accounts.
              </p>
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setInfo("");
              }}
              placeholder="you@example.com"
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
                setInfo("");
              }}
              placeholder="••••••••"
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              required
            />
          </div>

          {error ? (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          ) : null}

          {info ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {info}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "sign-up"
                ? "Create Account"
                : "Continue to Workspace"}
          </button>
        </form>
      </div>
    </section>
  );
}
