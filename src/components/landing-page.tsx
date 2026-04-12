"use client";

import { ChevronRightIcon, AssistantIcon, FolderIcon } from "@/components/icons";

type LandingPageProps = {
  onSignIn: () => void;
  onGetStarted: () => void;
};

export function LandingPage({ onSignIn, onGetStarted }: LandingPageProps) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[var(--surface-app)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_top,rgba(24,119,242,0.07),transparent_65%)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <img
          src="/assets/excelora-logo.svg"
          alt="Excelora"
          className="h-8 w-auto select-none"
          draggable={false}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Get started
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-16 pb-20 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            A Level Maths, refined
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-900 md:text-6xl">
            Study deeper. Learn faster.
            <br />
            Built for focus.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            Excelora is a calm, notion-style workspace pairing chapter notes, video walkthroughs,
            and a private AI tutor — Arthur — that reads your lesson materials and answers in depth.
          </p>
        </div>

        {/* Workspace preview */}
        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.10)]">
            <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-[var(--surface-sidebar)] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span className="ml-3 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                excelora · workspace
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
              <WorkspaceSidebarMock activeIndex={2} />
              <div className="p-6 md:p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                  Lesson Notes
                </p>
                <h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900">
                  Differentiation from first principles
                </h3>
                <div className="mt-5 space-y-2">
                  <div className="h-2.5 w-[92%] rounded-full bg-zinc-100" />
                  <div className="h-2.5 w-[85%] rounded-full bg-zinc-100" />
                  <div className="h-2.5 w-[78%] rounded-full bg-zinc-100" />
                  <div className="h-2.5 w-[60%] rounded-full bg-zinc-100" />
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white">
                    <span className="leading-none">▶</span>
                    Watch the video
                  </span>
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Notion-style grid of tinted cards */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Features
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-zinc-900 md:text-5xl">
            Bring all your studying together.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-5 md:grid-cols-6">
          <FeatureCard
            className="md:col-span-3"
            tint="bg-[#e8efe9]"
            eyebrow="Notes"
            title="Clean, readable, inline."
            preview={<NotesPreview />}
          />
          <FeatureCard
            className="md:col-span-3"
            tint="bg-[#eef2f7]"
            eyebrow="Video"
            title="Walkthroughs, one click away."
            preview={<VideoPreview />}
          />
          <FeatureCard
            className="md:col-span-4"
            tint="bg-[#f3eee6]"
            eyebrow="Arthur AI"
            title="An assistant that reads the PDF."
            preview={<ArthurPreview />}
          />
          <FeatureCard
            className="md:col-span-2"
            tint="bg-[#eef0ea]"
            eyebrow="Progress"
            title="Chapter by chapter."
            preview={<ProgressPreview />}
          />
        </div>
      </section>

      {/* How it works — three connected steps with workspace surfaces */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Three steps. One study loop.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          <StepCard
            step={1}
            title="Open a subtopic"
            body="Pick a chapter from the sidebar and land straight on the notes."
            preview={<StepSidebarPreview />}
          />
          <StepCard
            step={2}
            title="Read, watch, or ask"
            body="Read the notes, watch the walkthrough, or ask Arthur."
            preview={<StepReadPreview />}
          />
          <StepCard
            step={3}
            title="Track progress"
            body="Mark lessons watched as your chapter bar fills in."
            preview={<StepProgressPreview />}
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Pricing
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Start free. Upgrade when it clicks.
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-[28px] border border-zinc-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900">Basic</h3>
              <span className="rounded-full border border-zinc-200 bg-[var(--surface-sidebar)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                Free
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              Get the fundamentals — written notes for every subtopic.
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-zinc-700">
              {BASIC_PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  {perk}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onGetStarted}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              Create account
            </button>
          </article>

          <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-zinc-900 bg-zinc-900 p-8 text-white shadow-[0_40px_100px_rgba(15,23,42,0.18)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_60%)]"
            />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Premium</h3>
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em]">
                Recommended
              </span>
            </div>
            <p className="mt-2 text-sm text-white/70">
              Notes, video walkthroughs, Arthur AI, and 1:1 tutor sessions.
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-white/90">
              {PREMIUM_PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
                  {perk}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onGetStarted}
              className="mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              Go premium
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          </article>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-10 text-center shadow-[0_30px_80px_rgba(15,23,42,0.06)] md:p-14">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Ready to find your flow?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600 md:text-base">
            Create your account in seconds. Bring your syllabus, bring your questions — Arthur handles the rest.
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Get started
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}

/* ---------- Shared layout ---------- */

function FeatureCard({
  eyebrow,
  title,
  preview,
  tint,
  className = "",
}: {
  eyebrow: string;
  title: string;
  preview: React.ReactNode;
  tint: string;
  className?: string;
}) {
  return (
    <article
      className={[
        "flex flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.04)]",
        className,
      ].join(" ")}
    >
      <div className="px-7 pb-5 pt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 md:text-[22px]">
          {title}
        </h3>
      </div>
      <div className={["relative overflow-hidden px-6 pb-7 pt-2", tint].join(" ")}>
        {preview}
      </div>
    </article>
  );
}

function StepCard({
  step,
  title,
  body,
  preview,
}: {
  step: number;
  title: string;
  body: string;
  preview: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
      <div className="border-b border-zinc-200 bg-[var(--surface-sidebar)] p-5">{preview}</div>
      <div className="p-6">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700">
          {step}
        </span>
        <h3 className="mt-4 text-base font-semibold tracking-tight text-zinc-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
      </div>
    </div>
  );
}

/* ---------- Workspace surface mocks ---------- */

function WorkspaceSidebarMock({ activeIndex }: { activeIndex: number }) {
  const items = ["Algebra", "Functions", "Differentiation", "Integration", "Vectors"];
  return (
    <aside className="hidden border-r border-zinc-200 bg-[var(--surface-sidebar)] p-4 md:block">
      <p className="px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
        A Level Maths
      </p>
      <ul className="mt-3 space-y-1 text-sm text-zinc-700">
        {items.map((item, index) => (
          <li
            key={item}
            className={[
              "flex items-center gap-2 truncate rounded-lg px-2 py-1.5 transition",
              index === activeIndex ? "bg-white text-zinc-900 shadow-sm" : "hover:bg-white/60",
            ].join(" ")}
          >
            <FolderIcon className="h-3.5 w-3.5 text-zinc-500" />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function NotesPreview() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-zinc-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-2.5">
        <p className="truncate text-[11px] font-medium tracking-wide text-zinc-500">
          Implicit &amp; Parametric Differentiation.pdf
        </p>
        <span className="ml-3 inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-900 bg-zinc-900 px-2.5 py-[3px] text-[10px] font-medium text-white">
          <span className="leading-none">▶</span> Watch
        </span>
      </div>
      <div className="px-6 pb-5 pt-5 font-serif text-zinc-900">
        <h4 className="border-b border-zinc-300 pb-1.5 text-[18px] font-semibold tracking-tight">
          Implicit and Parametric Differentiation
        </h4>
        <div className="mt-3 rounded-[6px] bg-zinc-100 px-4 py-3 text-[12.5px] leading-[1.7]">
          <p>
            <span className="font-semibold">Implicit:</span> Differentiate each term w.r.t.{" "}
            <Var>x</Var>, using chain rule for <Var>y</Var>-terms:{" "}
            <DFrac top={<>d</>} bot={<>d<Var>x</Var></>} /> (<Var>y</Var>
            <sup className="text-[9px]">n</sup>) = <Var>n</Var>
            <Var>y</Var>
            <sup className="text-[9px]">n−1</sup>{" "}
            <DFrac top={<>d<Var>y</Var></>} bot={<>d<Var>x</Var></>} />.
          </p>
          <p className="mt-2">
            <span className="font-semibold">Parametric:</span>{" "}
            <DFrac top={<>d<Var>y</Var></>} bot={<>d<Var>x</Var></>} /> ={" "}
            <DFrac top={<>d<Var>y</Var>/d<Var>t</Var></>} bot={<>d<Var>x</Var>/d<Var>t</Var></>} />.
          </p>
        </div>
      </div>
    </div>
  );
}

function Var({ children }: { children: React.ReactNode }) {
  return <span className="italic">{children}</span>;
}

function DFrac({ top, bot }: { top: React.ReactNode; bot: React.ReactNode }) {
  return (
    <span className="relative mx-[1px] inline-flex flex-col items-center align-middle text-[10.5px] leading-[1.15]">
      <span className="px-1 pb-[1px]">{top}</span>
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-zinc-800" />
      <span className="px-1 pt-[1px]">{bot}</span>
    </span>
  );
}

function VideoPreview() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-zinc-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Lesson Video
          </p>
          <p className="text-[12px] text-zinc-600">Walkthrough · 6 min</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-zinc-900 bg-zinc-900 px-2.5 py-[3px] text-[10px] font-medium text-white">
          Coming soon
        </span>
      </div>
      <div className="px-4 pb-4 pt-3">
        <div className="flex aspect-[16/8] items-center justify-center rounded-[12px] bg-gradient-to-br from-zinc-900 to-zinc-700">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm">
            <span className="ml-0.5 text-base text-zinc-800">▶</span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">Not watched yet</span>
          <span className="inline-flex items-center rounded-full border border-zinc-900 bg-zinc-900 px-2.5 py-[3px] text-[10px] text-white">
            Next →
          </span>
        </div>
      </div>
    </div>
  );
}

function ArthurPreview() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white">
            <AssistantIcon className="h-4 w-4 text-zinc-800" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Arthur</p>
            <p className="text-xs text-zinc-500">Differentiation · Chain rule</p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-emerald-700">
          Live
        </span>
      </div>
      <div className="space-y-2.5 p-5">
        <div className="ml-auto max-w-[78%] rounded-[14px] bg-zinc-900 px-3.5 py-2 text-[13px] leading-6 text-white">
          Walk me through the stationary point for{" "}
          <span className="font-serif italic">3x²⁄y − 5y = 2(x+8)</span>.
        </div>
        <div className="mr-auto max-w-[92%] rounded-[14px] border border-zinc-200 bg-white px-3.5 py-2.5 text-[13px] leading-[1.65] text-zinc-800 shadow-sm">
          <p className="font-medium text-zinc-900">Step 1 — differentiate implicitly.</p>
          <p className="mt-0.5 font-serif italic">
            6x⁄y − (3x²⁄y²)(dy⁄dx) − 5(dy⁄dx) = 2
          </p>
          <p className="mt-2 font-medium text-zinc-900">Step 2 — set dy⁄dx = 0.</p>
          <p className="mt-0.5">
            <span className="font-serif italic">6x⁄y = 2</span> ⇒{" "}
            <span className="font-serif italic">y = 3x</span>.
          </p>
          <p className="mt-2 font-medium text-zinc-900">Step 3 — substitute back.</p>
          <p className="mt-0.5">
            Into the original curve gives{" "}
            <span className="font-serif italic">x = −1</span>, so the stationary point is{" "}
            <strong>(−1,&nbsp;−3)</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProgressPreview() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="px-5 py-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              Chapter Progress
            </p>
            <p className="mt-1 text-sm text-zinc-600">5 of 8 subtopics completed</p>
          </div>
          <p className="text-sm font-medium text-zinc-800">63%</p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#16a34a,#22c55e)]"
            style={{ width: "63%" }}
          />
        </div>
        <ul className="mt-5 space-y-1.5 text-sm">
          {[
            { label: "The chain rule", done: true },
            { label: "Product rule", done: true },
            { label: "Quotient rule", done: false },
          ].map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between rounded-lg px-2 py-1.5"
            >
              <span className="text-zinc-800">{row.label}</span>
              <span
                className={[
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                  row.done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 bg-zinc-100 text-zinc-600",
                ].join(" ")}
              >
                {row.done ? "Watched" : "Not yet"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepSidebarPreview() {
  return (
    <div className="rounded-[14px] border border-zinc-200 bg-white p-3 shadow-sm">
      <p className="px-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
        A Level Maths
      </p>
      <ul className="mt-2 space-y-1 text-[13px] text-zinc-700">
        {["Algebra", "Functions", "Differentiation"].map((item, index) => (
          <li
            key={item}
            className={[
              "flex items-center gap-2 rounded-md px-1.5 py-1",
              index === 2 ? "bg-zinc-100 text-zinc-900" : "",
            ].join(" ")}
          >
            <FolderIcon className="h-3 w-3 text-zinc-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepReadPreview() {
  return (
    <div className="rounded-[14px] border border-zinc-200 bg-white p-3 shadow-sm">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
        Chain rule
      </p>
      <div className="mt-2 space-y-1.5">
        <div className="h-2 w-[92%] rounded-full bg-zinc-100" />
        <div className="h-2 w-[80%] rounded-full bg-zinc-100" />
        <div className="h-2 w-[68%] rounded-full bg-zinc-100" />
      </div>
      <div className="mt-3 flex gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-900 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-white">
          ▶ Watch
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] text-zinc-700">
          Ask Arthur
        </span>
      </div>
    </div>
  );
}

function StepProgressPreview() {
  return (
    <div className="rounded-[14px] border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="flex items-end justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
          Chapter
        </p>
        <p className="text-[11px] font-medium text-zinc-800">63%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#16a34a,#22c55e)]"
          style={{ width: "63%" }}
        />
      </div>
      <p className="mt-3 text-[11px] text-zinc-500">5 of 8 subtopics watched</p>
    </div>
  );
}

const BASIC_PERKS = [
  "Full access to chapter notes",
  "PDF workbook for every subtopic",
  "Progress tracking across chapters",
];

const PREMIUM_PERKS = [
  "Everything in Basic",
  "Video walkthroughs for every subtopic",
  "Arthur AI tutor, grounded in your notes",
  "1:1 tutor sessions",
];
