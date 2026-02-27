"use client";

import { CloseIcon, FlowLogoIcon } from "@/components/icons";
import { TUTOR_ACCOUNT, authenticateCredentials, type StudentAccount } from "@/lib/auth";
import { MoonIcon, SunIcon } from "@/components/icons";
import type { AuthenticatedAccount, UserRole } from "@/types/auth";
import { useState } from "react";

type SignInPortalProps = {
  onContinue: (account: AuthenticatedAccount) => void;
  onClose: () => void;
  showCloseButton?: boolean;
  students: StudentAccount[];
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
};

export function SignInPortal({
  onClose,
  onContinue,
  showCloseButton = true,
  students,
  isDarkMode = false,
  onToggleDarkMode,
}: SignInPortalProps) {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const account = authenticateCredentials(role, email, password, students);

    if (!account) {
      setError("Invalid credentials for the selected account.");
      return;
    }

    setError("");
    onContinue(account);
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
              <p className="text-xs text-zinc-500">Tutor & Student Sign In</p>
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
              setRole("student");
              setError("");
            }}
            className={[
              "rounded-md px-3 py-2 text-sm transition",
              role === "student"
                ? "bg-white font-medium text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("tutor");
              setError("");
            }}
            className={[
              "rounded-md px-3 py-2 text-sm transition",
              role === "tutor"
                ? "bg-white font-medium text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            Tutor
          </button>
        </div>

        <form
          className="space-y-3"
          onSubmit={handleSubmit}
        >
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
              }}
              placeholder={
                role === "tutor"
                  ? TUTOR_ACCOUNT.email
                  : (students[0]?.email ?? "Alex@QuickLearn.com")
              }
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
              }}
              placeholder="••••••••"
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Continue to Workspace
          </button>
        </form>
      </div>
    </section>
  );
}
