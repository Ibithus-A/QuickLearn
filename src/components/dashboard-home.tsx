"use client";

import { FlowLogoIcon } from "@/components/icons";
import { CHAPTER_ONE_TITLE } from "@/lib/student-progress";
import type { UserRole } from "@/types/auth";
import type { StudentDailyStats } from "@/types/dashboard";
import { useMemo, useState } from "react";

type MetricTab = "reviewed" | "due";

type DashboardHomeProps = {
  name: string;
  role: UserRole;
  onOpenWorkspace: () => void;
  onSignOut: () => void;
  onSwitchAccount: () => void;
  stats: StudentDailyStats;
  activeStudentName?: string;
  chapterTitles?: string[];
  students?: Array<{ name: string; email: string }>;
  selectedStudentEmail?: string;
  selectedStudentMilestone?: string | null;
  chapterTagsByTitle?: Record<string, Array<{ name: string; email: string }>>;
  unlockedChapterTitles?: string[];
  onSelectStudent?: (email: string) => void;
  onSetMilestoneChapter?: (chapterTitle: string) => void;
  onToggleChapter?: (chapterTitle: string) => void;
};

export function DashboardHome({
  name,
  role,
  onOpenWorkspace,
  onSignOut,
  onSwitchAccount,
  stats,
  activeStudentName,
  chapterTitles = [],
  students = [],
  selectedStudentEmail,
  selectedStudentMilestone,
  chapterTagsByTitle = {},
  unlockedChapterTitles = [],
  onSelectStudent,
  onSetMilestoneChapter,
  onToggleChapter,
}: DashboardHomeProps) {
  const [activeTab, setActiveTab] = useState<MetricTab>("reviewed");

  const activeMetric = useMemo(
    () =>
      activeTab === "reviewed"
        ? {
            title: "Modules Reviewed Today",
            value: stats.reviewedToday,
            detail: "Strong momentum. Keep your streak alive.",
          }
        : {
            title: "Modules to Review Today",
            value: stats.dueToday,
            detail: "Focus on these first for best retention.",
          },
    [activeTab, stats.dueToday, stats.reviewedToday],
  );

  return (
    <main className="h-screen w-screen overflow-y-auto bg-[var(--surface-app)] px-3 py-4 md:px-8 md:py-7">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="rounded-2xl border border-zinc-200 bg-[var(--surface-panel)] px-4 py-4 shadow-sm transition-all duration-300 md:px-7 md:py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white">
                <FlowLogoIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Welcome Page</p>
                <h1 className="text-xl font-semibold text-zinc-900 md:text-2xl">
                  Welcome back
                </h1>
                <p className="text-sm text-zinc-600">{name}</p>
                {role === "tutor" && activeStudentName ? (
                  <p className="text-xs text-zinc-500">
                    Viewing student: {activeStudentName}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50"
              >
                Open Workspace
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={onSwitchAccount}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50"
              >
                Switch Account
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <article className="rounded-2xl border border-zinc-200 bg-[var(--surface-panel)] p-4 shadow-sm transition-all duration-300 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
                Habit Tracker
              </h2>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 md:p-4">
              <div className="overflow-x-auto">
                <svg
                  viewBox="0 0 560 240"
                  className="h-52 min-w-[460px] w-full"
                  aria-label="Habit tracker chart"
                >
                  <rect x="0" y="0" width="560" height="240" fill="transparent" />
                  <path d="M30 200H530" stroke="currentColor" className="text-zinc-300" />
                  <path d="M30 150H530" stroke="currentColor" className="text-zinc-200" />
                  <path d="M30 100H530" stroke="currentColor" className="text-zinc-200" />
                  <path d="M30 50H530" stroke="currentColor" className="text-zinc-200" />
                  <path
                    d={stats.habitSeries
                      .map((point, index) => {
                        const x = 40 + index * 80;
                        const y = 200 - point;
                        return `${index === 0 ? "M" : "L"}${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-zinc-900"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={40 + (stats.habitSeries.length - 1) * 80}
                    cy={200 - stats.habitSeries[stats.habitSeries.length - 1]}
                    r="5"
                    className="fill-zinc-900"
                  />
                </svg>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-[var(--surface-panel)] p-4 shadow-sm transition-all duration-300 md:p-6">
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("reviewed")}
                className={[
                  "flex-1 rounded-md px-3 py-2 text-sm transition",
                  activeTab === "reviewed"
                    ? "bg-white font-medium text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700",
                ].join(" ")}
              >
                Modules Reviewed
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("due")}
                className={[
                  "flex-1 rounded-md px-3 py-2 text-sm transition",
                  activeTab === "due"
                    ? "bg-white font-medium text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700",
                ].join(" ")}
              >
                Modules to Review
              </button>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">{activeMetric.title}</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900">
                {activeMetric.value}
              </p>
              <p className="mt-2 text-sm text-zinc-600">{activeMetric.detail}</p>
            </div>
          </article>
        </div>

        {role === "tutor" && chapterTitles.length > 0 ? (
          <article className="rounded-2xl border border-zinc-200 bg-[var(--surface-panel)] p-4 shadow-sm transition-all duration-300 md:p-6">
            <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-800">
                    Student Chapter Access
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-zinc-600">
                    Primary flow: tag a milestone chapter to grant Chapters 1 to N.
                    Manual lock controls remain available for custom plans.
                  </p>
                </div>
                {students.length > 0 ? (
                  <label className="text-sm text-zinc-600">
                    <span className="mr-2">Student</span>
                    <select
                      value={selectedStudentEmail ?? students[0].email}
                      onChange={(event) => onSelectStudent?.(event.target.value)}
                      className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                    >
                      {students.map((student) => (
                        <option
                          key={student.email}
                          value={student.email.trim().toLowerCase()}
                        >
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1">
                  Milestone: {selectedStudentMilestone ?? "Not tagged"}
                </span>
                <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1">
                  Unlocked: {unlockedChapterTitles.length} / {chapterTitles.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {chapterTitles.map((chapterTitle) => {
                const isAlwaysUnlocked = chapterTitle === CHAPTER_ONE_TITLE;
                const canUseCustomUnlock = Boolean(selectedStudentMilestone);
                const isUnlocked =
                  isAlwaysUnlocked || unlockedChapterTitles.includes(chapterTitle);
                const isMilestone = selectedStudentMilestone === chapterTitle;
                const chapterTags = chapterTagsByTitle[chapterTitle] ?? [];

                return (
                  <div
                    key={chapterTitle}
                    className={[
                      "rounded-xl border px-3 py-2.5 transition",
                      isMilestone
                        ? "border-zinc-300 bg-zinc-100/80"
                        : "border-zinc-200 bg-zinc-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-zinc-700">{chapterTitle}</p>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSetMilestoneChapter?.(chapterTitle)}
                          className={[
                            "rounded-md border px-2.5 py-1 text-xs font-medium transition",
                            isMilestone
                              ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100",
                          ].join(" ")}
                        >
                          {isMilestone ? "Tagged" : "Tag"}
                        </button>
                        {isMilestone ? (
                          <button
                            type="button"
                            onClick={() => onSetMilestoneChapter?.(chapterTitle)}
                            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 transition hover:bg-zinc-100"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {chapterTags.length > 0 ? (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {chapterTags.map((taggedStudent) => (
                          <span
                            key={`${chapterTitle}-${taggedStudent.email}`}
                            className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700"
                          >
                            {taggedStudent.name}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-2.5 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => onToggleChapter?.(chapterTitle)}
                        disabled={isAlwaysUnlocked || !canUseCustomUnlock}
                        className={[
                          "rounded-md border px-2.5 py-1 text-xs",
                          isUnlocked
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-zinc-200 bg-white text-zinc-600",
                          isAlwaysUnlocked || !canUseCustomUnlock
                            ? "cursor-not-allowed opacity-70"
                            : "",
                        ].join(" ")}
                      >
                        {isAlwaysUnlocked
                          ? "Always Unlocked"
                          : !canUseCustomUnlock
                            ? "Tag Required"
                            : isUnlocked
                              ? "Unlocked"
                              : "Locked"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
