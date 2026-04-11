"use client";

import { AssistantIcon, CloseIcon } from "@/components/icons";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

type EditorActionsDrawerProps = {
  pageTitle: string;
  pageContent: string;
  onHoverChange?: (isHovered: boolean) => void;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (isOpen: boolean) => void;
};

export function EditorActionsDrawer({
  pageTitle,
  pageContent,
  onHoverChange,
  isMobileOpen = false,
  onMobileOpenChange,
}: EditorActionsDrawerProps) {
  const [canUseHoverAssistant, setCanUseHoverAssistant] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateHoverCapability = () => {
      setCanUseHoverAssistant(mediaQuery.matches);
    };

    updateHoverCapability();
    mediaQuery.addEventListener("change", updateHoverCapability);
    return () => {
      mediaQuery.removeEventListener("change", updateHoverCapability);
    };
  }, []);

  return (
    <>
      {canUseHoverAssistant ? (
        <div
          onMouseEnter={() => onHoverChange?.(true)}
          onMouseLeave={() => onHoverChange?.(false)}
          className={[
            "group/assistant pointer-events-none absolute inset-y-0 right-0 z-30 hidden md:block",
            "w-[min(390px,42vw)]",
          ].join(" ")}
        >
          <div
            className={[
              "pointer-events-auto absolute inset-y-0 right-0 w-8 md:w-10",
            ].join(" ")}
          />

          <aside
            className={[
              "pointer-events-auto absolute inset-y-0 right-0 h-full min-h-full w-[min(390px,42vw)] overflow-hidden border-l border-zinc-200 bg-[var(--surface-sidebar)]",
              "translate-x-full opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover/assistant:translate-x-0 group-hover/assistant:opacity-100",
            ].join(" ")}
          >
            <DrawerContent pageTitle={pageTitle} pageContent={pageContent} />
          </aside>
        </div>
      ) : null}

      {!canUseHoverAssistant ? (
        <button
          type="button"
          onClick={() => onMobileOpenChange?.(true)}
          className="fixed bottom-4 right-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-[0_18px_45px_rgba(9,9,11,0.14)] transition hover:bg-zinc-50"
          aria-label="Open AI assistant"
        >
          <AssistantIcon className="h-5 w-5" />
        </button>
      ) : null}

      {!canUseHoverAssistant ? (
        <div
          className={[
            "fixed inset-0 z-50 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => onMobileOpenChange?.(false)}
            className={[
              "absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isMobileOpen ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-label="Close AI assistant"
          />
          <aside
            className={[
              "absolute inset-x-0 bottom-0 top-16 overflow-hidden rounded-t-[28px] border-t border-zinc-200 bg-[var(--surface-sidebar)] shadow-[0_-24px_60px_rgba(9,9,11,0.18)]",
              "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isMobileOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            ].join(" ")}
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white">
                    <AssistantIcon className="h-4 w-4 text-zinc-800" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Arthur</p>
                    <p className="text-xs text-zinc-500">{pageTitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onMobileOpenChange?.(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700"
                  aria-label="Close AI assistant"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
              <DrawerContent pageTitle={pageTitle} pageContent={pageContent} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function DrawerContent({
  pageTitle,
  pageContent,
}: {
  pageTitle: string;
  pageContent: string;
}) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMessages([]);
    setDraft("");
    setErrorMessage("");
  }, [pageTitle]);

  const helperText = useMemo(() => {
    if (pageContent.trim()) {
      return "Arthur can explain this page, summarize it, or help you revise from the notes.";
    }

    return "This page is blank, so Arthur will work from your prompt alone.";
  }, [pageContent]);

  const sendMessage = async () => {
    const trimmedDraft = draft.trim();
    if (!trimmedDraft || isSending) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmedDraft }];
    setMessages(nextMessages);
    setDraft("");
    setErrorMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/arthur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageTitle,
          pageContent,
          messages: nextMessages,
        }),
      });

      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok || !payload.message) {
        throw new Error(payload.error ?? "Arthur could not respond right now.");
      }

      setMessages((current) => [...current, { role: "assistant", content: payload.message ?? "" }]);
    } catch (error) {
      const nextError =
        error instanceof Error ? error.message : "Arthur could not respond right now.";
      setErrorMessage(nextError);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage();
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    await sendMessage();
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="hidden border-b border-zinc-200 px-4 py-4 md:block">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Arthur AI Assistant
            </p>
            <p className="mt-1 text-xs text-zinc-500">{pageTitle}</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-emerald-700">
            Live
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1 px-4 py-4">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="mx-auto max-w-[260px] pt-6 text-center">
                <p className="text-sm font-medium text-zinc-700">Arthur is ready</p>
                <p className="mt-2 text-sm text-zinc-500">{helperText}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={[
                      "max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm",
                      message.role === "assistant"
                        ? "mr-auto border border-zinc-200 bg-white text-zinc-800"
                        : "ml-auto bg-zinc-900 text-white",
                    ].join(" ")}
                  >
                    {message.content}
                  </div>
                ))}
                {isSending ? (
                  <div className="mr-auto rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500 shadow-sm">
                    Arthur is thinking...
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-200 bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Arthur to explain, quiz, or summarize..."
                rows={2}
                className="min-h-11 flex-1 resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
              />
              <button
                type="button"
                onClick={() => {
                  void sendMessage();
                }}
                disabled={!draft.trim() || isSending}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-900 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-300"
              >
                Send
              </button>
            </div>
            {errorMessage ? (
              <p className="mt-2 text-xs text-rose-600">{errorMessage}</p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
