"use client";

import { CloseIcon, FlowLogoIcon } from "@/components/icons";
import { useState } from "react";

type UserRole = "tutor" | "student";

type SignInPortalProps = {
  onContinue: (role: UserRole) => void;
  onClose: () => void;
};

export function SignInPortal({ onClose, onContinue }: SignInPortalProps) {
  const [role, setRole] = useState<UserRole>("student");

  return (
    <section className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_20px_50px_rgba(9,9,11,0.08)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
          <FlowLogoIcon className="h-9 w-9" />
          <div>
            <p className="text-lg font-semibold text-zinc-900">QuickLearn Portal</p>
            <p className="text-xs text-zinc-500">Tutor & Student Sign In</p>
          </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Close sign in portal"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
          <button
            type="button"
            onClick={() => setRole("student")}
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
            onClick={() => setRole("tutor")}
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
          onSubmit={(event) => {
            event.preventDefault();
            onContinue(role);
          }}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Email
            </label>
            <input
              type="email"
              placeholder={`${role}@quicklearn.app`}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
            />
          </div>

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
