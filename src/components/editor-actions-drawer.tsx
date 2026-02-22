"use client";

import { ChevronRightIcon } from "@/components/icons";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  variant: "intro" | "chat";
  content: string;
};

function getArthurReply(prompt: string): string {
  const text = prompt.trim().toLowerCase();
  if (!text) return "Share a maths problem and I will break it down step by step.";

  if (text.includes("differentiat") || text.includes("derivative")) {
    return "For differentiation, identify the rule first: power, product, quotient, or chain rule, then simplify the result.";
  }
  if (text.includes("integrat")) {
    return "For integration, check if substitution or parts fits best. If the integrand is a product, try parts; if it is composite, try substitution.";
  }
  if (text.includes("quadratic")) {
    return "For quadratics: factorise if possible, otherwise use completing the square or the quadratic formula.";
  }
  if (text.includes("trigon")) {
    return "For trig equations, convert to one function where possible, solve in the interval, then state periodic solutions if needed.";
  }

  return "Good question. Start by identifying known values, the target quantity, and the equation family you need, then solve one step at a time.";
}

export function EditorActionsDrawer() {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const nextMessageIdRef = useRef(2);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      variant: "intro",
      content:
        "Hi, I am Arthur. I specialise in Maths. Ask me anything from algebra to calculus.",
    },
  ]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    const content = draft.trim();
    if (!content) return;

    const userMessageId = nextMessageIdRef.current;
    nextMessageIdRef.current += 1;
    const assistantMessageId = nextMessageIdRef.current;
    nextMessageIdRef.current += 1;

    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      variant: "chat",
      content,
    };
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      variant: "chat",
      content: getArthurReply(content),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraft("");
  };

  return (
    <div className="group/actions absolute inset-y-0 right-0 z-40 w-2">
      <button
        type="button"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-[55%] rounded-l-md border border-zinc-200 bg-white px-1 py-2 text-zinc-600 opacity-0 shadow-sm transition-all duration-200 ease-out group-hover/actions:pointer-events-auto group-hover/actions:translate-x-0 group-hover/actions:opacity-100"
        aria-label="Open Arthur chat"
        title="Open Arthur chat"
      >
        <ChevronRightIcon className="h-3.5 w-3.5 rotate-180" />
      </button>

      <aside className="pointer-events-auto absolute inset-y-0 right-0 z-30 w-[min(390px,88vw)] translate-x-full border-l border-zinc-200 bg-[var(--surface-sidebar)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/actions:translate-x-0">
        <div className="flex h-full min-h-0 flex-col">
          <header className="border-b border-zinc-200 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Arthur
            </p>
            <h3 className="text-base font-semibold text-zinc-900">Maths Assistant</h3>
          </header>

          <div
            ref={messagesContainerRef}
            className="scroll-slim scroll-smooth min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[var(--surface-sidebar)] px-3 py-4"
          >
            {messages.map((message) => (
              message.variant === "intro" ? (
                <p
                  key={message.id}
                  className="mx-auto w-[92%] px-1 py-1 text-sm leading-6 text-[var(--text-muted)]"
                >
                  {message.content}
                </p>
              ) : (
                <div
                  key={message.id}
                  className={[
                    "rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm transition-all duration-200",
                    message.role === "assistant"
                      ? "mx-auto w-[92%] border border-zinc-200 bg-white text-zinc-800 shadow-[0_12px_30px_rgba(9,9,11,0.06)]"
                      : "ml-auto w-fit max-w-[86%] bg-zinc-900 text-white",
                  ].join(" ")}
                >
                  {message.content}
                </div>
              )
            ))}
          </div>

          <div className="border-t border-zinc-200 bg-[var(--surface-sidebar)] px-3 pb-3 pt-2">
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-2.5 pr-14 shadow-sm">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message Arthur..."
                className="scroll-slim max-h-28 min-h-[42px] w-full resize-none bg-transparent px-1 py-1 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="absolute bottom-2.5 right-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-base text-white shadow-[0_10px_24px_rgba(9,9,11,0.26)] transition hover:bg-zinc-800"
                aria-label="Send message"
                title="Send"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
