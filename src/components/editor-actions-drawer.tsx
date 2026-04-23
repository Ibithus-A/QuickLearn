"use client";

import { ArrowUpIcon, AssistantIcon, CloseIcon, MathsIcon } from "@/components/icons";
import katex from "katex";
import {
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

type MessageSegment =
  | { type: "text"; content: string }
  | { type: "math"; content: string; displayMode: boolean };

type AssistantBlock =
  | { type: "divider" }
  | { type: "paragraph"; content: string };

/* ---------- Math keypad ----------
 * Each item describes:
 *   - labelLatex: a KaTeX snippet rendered inside the button (shows exactly what will be inserted)
 *   - build(selection): returns the raw text inserted into the composer, plus the
 *     caret offset measured from the start of that inserted text.
 *
 * All items insert their snippet wrapped in `$…$`, so the resulting user message
 * renders as math in the chat bubble (and is unambiguous to the AI).
 * If the user has an active selection, the selection is placed inside the
 * primary slot; otherwise the caret lands inside the first empty slot so the
 * user can keep typing without breaking flow.
 */

type MathInsertBuild = (selection: string) => { text: string; caret: number };

type MathInsert = {
  id: string;
  label: string;
  labelLatex: string;
  ariaLabel: string;
  build: MathInsertBuild;
};

type MathGroup = {
  id: string;
  label: string;
  items: MathInsert[];
};

/** Wrap a LaTeX snippet in `$…$` and return a build result with caret positioned inside the first empty slot. */
function wrapMath(snippet: string, slotFromStart: number): { text: string; caret: number } {
  return { text: `$${snippet}$`, caret: 1 + slotFromStart };
}

/** Insert a fixed symbol with caret placed after it. */
function insertSymbol(latex: string): MathInsertBuild {
  const text = `$${latex}$`;
  return () => ({ text, caret: text.length });
}

/** Insert a structural snippet. If the user has a selection, it's placed in the primary slot. */
function insertStructure(
  withSelection: (sel: string) => { text: string; caret: number },
  empty: { text: string; caret: number },
): MathInsertBuild {
  return (selection) => (selection ? withSelection(selection) : empty);
}

const MATH_GROUPS: MathGroup[] = [
  {
    id: "structure",
    label: "Structure",
    items: [
      {
        id: "fraction",
        label: "fraction",
        labelLatex: "\\frac{a}{b}",
        ariaLabel: "Insert fraction",
        build: insertStructure(
          (sel) => ({ text: `$\\frac{${sel}}{}$`, caret: 8 + sel.length }),
          wrapMath("\\frac{}{}", 6),
        ),
      },
      {
        id: "sqrt",
        label: "sqrt",
        labelLatex: "\\sqrt{x}",
        ariaLabel: "Insert square root",
        build: insertStructure(
          (sel) => ({ text: `$\\sqrt{${sel}}$`, caret: 7 + sel.length + 1 }),
          wrapMath("\\sqrt{}", 6),
        ),
      },
      {
        id: "power",
        label: "aⁿ",
        labelLatex: "x^{n}",
        ariaLabel: "Insert exponent",
        build: insertStructure(
          (sel) => ({ text: `$${sel}^{}$`, caret: 1 + sel.length + 2 }),
          wrapMath("x^{}", 3),
        ),
      },
      {
        id: "squared",
        label: "a²",
        labelLatex: "x^{2}",
        ariaLabel: "Insert squared",
        build: insertStructure(
          (sel) => ({ text: `$${sel}^{2}$`, caret: 1 + sel.length + 4 }),
          wrapMath("x^{2}", 5),
        ),
      },
      {
        id: "subscript",
        label: "aₙ",
        labelLatex: "x_{n}",
        ariaLabel: "Insert subscript",
        build: insertStructure(
          (sel) => ({ text: `$${sel}_{}$`, caret: 1 + sel.length + 2 }),
          wrapMath("x_{}", 3),
        ),
      },
      {
        id: "brackets",
        label: "(…)",
        labelLatex: "\\left(\\square\\right)",
        ariaLabel: "Insert brackets",
        build: insertStructure(
          (sel) => ({ text: `$\\left(${sel}\\right)$`, caret: 7 + sel.length + 8 }),
          wrapMath("\\left(\\right)", 7),
        ),
      },
      {
        id: "abs",
        label: "|x|",
        labelLatex: "|x|",
        ariaLabel: "Insert absolute value",
        build: insertStructure(
          (sel) => ({ text: `$|${sel}|$`, caret: 2 + sel.length + 1 }),
          wrapMath("||", 2),
        ),
      },
    ],
  },
  {
    id: "calculus",
    label: "Calculus",
    items: [
      {
        id: "integral",
        label: "integral",
        labelLatex: "\\int f(x)\\,dx",
        ariaLabel: "Insert indefinite integral",
        build: insertStructure(
          (sel) => ({ text: `$\\int ${sel}\\,dx$`, caret: 6 + sel.length }),
          wrapMath("\\int \\,dx", 5),
        ),
      },
      {
        id: "definite-integral",
        label: "definite integral",
        labelLatex: "\\int_{a}^{b} f(x)\\,dx",
        ariaLabel: "Insert definite integral",
        build: insertStructure(
          (sel) => ({ text: `$\\int_{}^{} ${sel}\\,dx$`, caret: 7 }),
          wrapMath("\\int_{}^{} \\,dx", 7),
        ),
      },
      {
        id: "derivative",
        label: "d/dx",
        labelLatex: "\\tfrac{d}{dx}",
        ariaLabel: "Insert derivative operator",
        build: insertSymbol("\\frac{d}{dx}"),
      },
      {
        id: "dy-dx",
        label: "dy/dx",
        labelLatex: "\\tfrac{dy}{dx}",
        ariaLabel: "Insert dy over dx",
        build: insertSymbol("\\frac{dy}{dx}"),
      },
      {
        id: "limit",
        label: "limit",
        labelLatex: "\\lim_{x\\to a}",
        ariaLabel: "Insert limit",
        build: () => ({ text: "$\\lim_{x\\to }$", caret: 11 }),
      },
      {
        id: "sum",
        label: "sum",
        labelLatex: "\\sum_{n=1}^{N}",
        ariaLabel: "Insert summation",
        build: () => ({ text: "$\\sum_{n=1}^{}$", caret: 13 }),
      },
    ],
  },
  {
    id: "functions",
    label: "Functions",
    items: [
      {
        id: "sin",
        label: "sin",
        labelLatex: "\\sin x",
        ariaLabel: "Insert sine",
        build: insertStructure(
          (sel) => ({ text: `$\\sin(${sel})$`, caret: 6 + sel.length + 2 }),
          wrapMath("\\sin()", 5),
        ),
      },
      {
        id: "cos",
        label: "cos",
        labelLatex: "\\cos x",
        ariaLabel: "Insert cosine",
        build: insertStructure(
          (sel) => ({ text: `$\\cos(${sel})$`, caret: 6 + sel.length + 2 }),
          wrapMath("\\cos()", 5),
        ),
      },
      {
        id: "tan",
        label: "tan",
        labelLatex: "\\tan x",
        ariaLabel: "Insert tangent",
        build: insertStructure(
          (sel) => ({ text: `$\\tan(${sel})$`, caret: 6 + sel.length + 2 }),
          wrapMath("\\tan()", 5),
        ),
      },
      {
        id: "asin",
        label: "sin⁻¹",
        labelLatex: "\\sin^{-1} x",
        ariaLabel: "Insert inverse sine",
        build: insertStructure(
          (sel) => ({ text: `$\\sin^{-1}(${sel})$`, caret: 11 + sel.length + 2 }),
          wrapMath("\\sin^{-1}()", 10),
        ),
      },
      {
        id: "ln",
        label: "ln",
        labelLatex: "\\ln x",
        ariaLabel: "Insert natural logarithm",
        build: insertStructure(
          (sel) => ({ text: `$\\ln(${sel})$`, caret: 5 + sel.length + 2 }),
          wrapMath("\\ln()", 4),
        ),
      },
      {
        id: "log",
        label: "log",
        labelLatex: "\\log x",
        ariaLabel: "Insert logarithm",
        build: insertStructure(
          (sel) => ({ text: `$\\log(${sel})$`, caret: 6 + sel.length + 2 }),
          wrapMath("\\log()", 5),
        ),
      },
      {
        id: "exp",
        label: "eˣ",
        labelLatex: "e^{x}",
        ariaLabel: "Insert exponential",
        build: insertStructure(
          (sel) => ({ text: `$e^{${sel}}$`, caret: 4 + sel.length + 1 }),
          wrapMath("e^{}", 3),
        ),
      },
    ],
  },
  {
    id: "symbols",
    label: "Symbols",
    items: [
      { id: "pi", label: "π", labelLatex: "\\pi", ariaLabel: "Insert pi", build: insertSymbol("\\pi") },
      { id: "theta", label: "θ", labelLatex: "\\theta", ariaLabel: "Insert theta", build: insertSymbol("\\theta") },
      { id: "alpha", label: "α", labelLatex: "\\alpha", ariaLabel: "Insert alpha", build: insertSymbol("\\alpha") },
      { id: "beta", label: "β", labelLatex: "\\beta", ariaLabel: "Insert beta", build: insertSymbol("\\beta") },
      { id: "infty", label: "∞", labelLatex: "\\infty", ariaLabel: "Insert infinity", build: insertSymbol("\\infty") },
      { id: "pm", label: "±", labelLatex: "\\pm", ariaLabel: "Insert plus or minus", build: insertSymbol("\\pm") },
      { id: "times", label: "×", labelLatex: "\\times", ariaLabel: "Insert times", build: insertSymbol("\\times") },
      { id: "cdot", label: "·", labelLatex: "\\cdot", ariaLabel: "Insert dot product", build: insertSymbol("\\cdot") },
      { id: "leq", label: "≤", labelLatex: "\\leq", ariaLabel: "Insert less or equal", build: insertSymbol("\\leq") },
      { id: "geq", label: "≥", labelLatex: "\\geq", ariaLabel: "Insert greater or equal", build: insertSymbol("\\geq") },
      { id: "neq", label: "≠", labelLatex: "\\neq", ariaLabel: "Insert not equal", build: insertSymbol("\\neq") },
      { id: "approx", label: "≈", labelLatex: "\\approx", ariaLabel: "Insert approximately", build: insertSymbol("\\approx") },
      { id: "to", label: "→", labelLatex: "\\to", ariaLabel: "Insert right arrow", build: insertSymbol("\\to") },
    ],
  },
];

type EditorActionsDrawerProps = {
  pageTitle: string;
  pdfTitle?: string;
  pageContent: string;
  pageNodeId: string;
  workspaceContext: string;
  onHoverChange?: (isHovered: boolean) => void;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (isOpen: boolean) => void;
};

export function EditorActionsDrawer({
  pageTitle,
  pdfTitle,
  pageContent,
  pageNodeId,
  workspaceContext,
  onHoverChange,
  isMobileOpen = false,
  onMobileOpenChange,
}: EditorActionsDrawerProps) {
  const [canUseHoverAssistant, setCanUseHoverAssistant] = useState(false);
  const [isHoverAssistantOpen, setIsHoverAssistantOpen] = useState(false);
  const closeHoverAssistantTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );
    const updateHoverCapability = () => {
      const matches = mediaQuery.matches;
      setCanUseHoverAssistant(matches);
      if (!matches) {
        if (closeHoverAssistantTimerRef.current) {
          clearTimeout(closeHoverAssistantTimerRef.current);
          closeHoverAssistantTimerRef.current = null;
        }
        setIsHoverAssistantOpen(false);
        onHoverChange?.(false);
      } else {
        onMobileOpenChange?.(false);
      }
    };

    updateHoverCapability();
    mediaQuery.addEventListener("change", updateHoverCapability);
    return () => {
      mediaQuery.removeEventListener("change", updateHoverCapability);
    };
  }, [onHoverChange, onMobileOpenChange]);

  useEffect(() => {
    return () => {
      if (closeHoverAssistantTimerRef.current) {
        clearTimeout(closeHoverAssistantTimerRef.current);
      }
    };
  }, []);

  const openHoverAssistant = () => {
    if (closeHoverAssistantTimerRef.current) {
      clearTimeout(closeHoverAssistantTimerRef.current);
      closeHoverAssistantTimerRef.current = null;
    }

    setIsHoverAssistantOpen(true);
    onHoverChange?.(true);
  };

  const closeHoverAssistant = () => {
    if (closeHoverAssistantTimerRef.current) {
      clearTimeout(closeHoverAssistantTimerRef.current);
    }

    closeHoverAssistantTimerRef.current = setTimeout(() => {
      setIsHoverAssistantOpen(false);
      onHoverChange?.(false);
      closeHoverAssistantTimerRef.current = null;
    }, 90);
  };

  return (
    <>
      {canUseHoverAssistant ? (
        <div
          onMouseEnter={openHoverAssistant}
          onMouseLeave={closeHoverAssistant}
          className="pointer-events-none absolute inset-y-0 right-0 z-30 hidden w-[min(460px,46vw)] md:block"
        >
          <div className="pointer-events-auto absolute inset-y-0 right-0 w-8 md:w-10" />

          <aside
            className={[
              "pointer-events-auto absolute inset-y-0 right-0 h-full min-h-full w-[min(460px,46vw)] overflow-hidden border-l border-zinc-200 bg-[var(--surface-sidebar)]",
              "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isHoverAssistantOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
            ].join(" ")}
          >
            <DrawerContent
              pageTitle={pageTitle}
              pdfTitle={pdfTitle}
              pageContent={pageContent}
              pageNodeId={pageNodeId}
              workspaceContext={workspaceContext}
            />
          </aside>
        </div>
      ) : null}

      {!canUseHoverAssistant ? (
        <button
          type="button"
          onClick={() => onMobileOpenChange?.(true)}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-[0_18px_45px_rgba(9,9,11,0.14)] transition hover:bg-zinc-50 active:scale-95"
          aria-label="Open AI assistant"
        >
          <AssistantIcon className="h-5 w-5" />
        </button>
      ) : null}

      {!canUseHoverAssistant ? (
        <div
          className={[
            "fixed inset-0 z-50 transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => onMobileOpenChange?.(false)}
            className={[
              "absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              isMobileOpen ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-label="Close AI assistant"
          />
          <aside
            className={[
              "absolute inset-x-0 bottom-0 top-12 overflow-hidden rounded-t-[28px] border-t border-zinc-200 bg-[var(--surface-sidebar)] shadow-[0_-28px_70px_rgba(9,9,11,0.22)] sm:top-16",
              "transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
              isMobileOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
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
              <DrawerContent
                pageTitle={pageTitle}
                pdfTitle={pdfTitle}
                pageContent={pageContent}
                pageNodeId={pageNodeId}
                workspaceContext={workspaceContext}
              />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function DrawerContent({
  pageTitle,
  pdfTitle,
  pageContent,
  pageNodeId,
  workspaceContext,
}: {
  pageTitle: string;
  pdfTitle?: string;
  pageContent: string;
  pageNodeId: string;
  workspaceContext: string;
}) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMathsOpen, setIsMathsOpen] = useState(false);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const updateIsEmpty = useCallback(() => {
    const node = composerRef.current;
    if (!node) return;
    const hasText = (node.textContent ?? "").trim().length > 0;
    const hasChip = node.querySelector("[data-math-chip]") !== null;
    setIsEmpty(!hasText && !hasChip);
  }, []);

  const clearComposer = useCallback(() => {
    if (composerRef.current) composerRef.current.innerHTML = "";
    setIsEmpty(true);
  }, []);

  useEffect(() => {
    setMessages([]);
    setErrorMessage("");
    setIsMathsOpen(false);
    clearComposer();
  }, [pageNodeId, clearComposer]);

  const rememberSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (composerRef.current?.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  };

  const helperText = useMemo(() => {
    if (pageContent.trim()) {
      return "Arthur can explain this page, summarize it, or help you revise from the notes.";
    }

    return "This page is blank, so Arthur will work from your prompt alone.";
  }, [pageContent]);

  const serializeComposer = (): string => {
    const root = composerRef.current;
    if (!root) return "";

    const walk = (nodes: NodeList): string => {
      let out = "";
      for (const node of Array.from(nodes)) {
        if (node.nodeType === Node.TEXT_NODE) {
          out += node.textContent ?? "";
          continue;
        }
        if (!(node instanceof HTMLElement)) continue;
        if (node.dataset.mathChip !== undefined) {
          const latex = node.dataset.latex ?? "";
          out += `$${latex}$`;
          continue;
        }
        if (node.tagName === "BR") {
          out += "\n";
          continue;
        }
        if (node.tagName === "DIV" || node.tagName === "P") {
          if (out && !out.endsWith("\n")) out += "\n";
          out += walk(node.childNodes);
          continue;
        }
        out += walk(node.childNodes);
      }
      return out;
    };

    return walk(root.childNodes);
  };

  const sendMessage = async () => {
    const content = serializeComposer().replace(/\s+$/, "").trim();
    if (!content || isSending) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    clearComposer();
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
          pdfTitle,
          pageContent,
          pageNodeId,
          workspaceContext,
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

  const handleKeyDown = async (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    await sendMessage();
  };

  const insertMath = (item: MathInsert) => {
    const root = composerRef.current;
    if (!root) return;

    const buildResult = item.build("");
    const rawLatex = buildResult.text.replace(/^\$|\$$/g, "");
    const displayLatex = rawLatex.replace(/\{\}/g, "{\\square}");

    let rendered: string;
    try {
      rendered = katex.renderToString(displayLatex, {
        throwOnError: false,
        strict: "ignore",
      });
    } catch {
      rendered = rawLatex;
    }

    const chip = document.createElement("span");
    chip.setAttribute("contenteditable", "false");
    chip.dataset.mathChip = "true";
    chip.dataset.latex = rawLatex;
    chip.className = "math-chip";
    chip.innerHTML = rendered;

    const selection = window.getSelection();
    const savedRange = savedRangeRef.current;
    let range: Range;

    if (selection && selection.rangeCount && root.contains(selection.anchorNode)) {
      range = selection.getRangeAt(0);
      range.deleteContents();
    } else if (savedRange && root.contains(savedRange.commonAncestorContainer)) {
      range = savedRange.cloneRange();
      range.deleteContents();
    } else {
      range = document.createRange();
      range.selectNodeContents(root);
      range.collapse(false);
    }

    range.insertNode(chip);

    const spacer = document.createTextNode("\u00A0");
    chip.after(spacer);

    const caretRange = document.createRange();
    caretRange.setStart(spacer, 1);
    caretRange.collapse(true);

    const liveSelection = window.getSelection();
    liveSelection?.removeAllRanges();
    liveSelection?.addRange(caretRange);
    savedRangeRef.current = caretRange.cloneRange();

    root.focus();
    updateIsEmpty();
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
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[12px] border border-zinc-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
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
                      "max-w-[92%] rounded-[16px] px-4 py-3.5 text-sm leading-6 shadow-sm",
                      message.role === "assistant"
                        ? "assistant-message mr-auto border border-zinc-200/90 bg-[var(--surface-sidebar)] text-zinc-800"
                        : "user-message ml-auto bg-zinc-900 text-white",
                    ].join(" ")}
                  >
                    {message.role === "assistant" ? (
                      <RenderedAssistantMessage content={message.content} />
                    ) : (
                      <RenderedUserMessage content={message.content} />
                    )}
                  </div>
                ))}
                {isSending ? (
                  <div className="mr-auto max-w-[92%] rounded-[16px] border border-zinc-200/90 bg-[var(--surface-sidebar)] px-4 py-3.5 shadow-sm">
                    <ArthurThinkingSkeleton />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-200/80 bg-white px-3 py-3">
            <div className="flex flex-col gap-2 rounded-[14px] bg-zinc-50 px-2.5 py-2.5 ring-1 ring-inset ring-zinc-200/80 transition focus-within:bg-white focus-within:ring-zinc-400">
              {isMathsOpen ? <MathKeypad onInsert={insertMath} /> : null}

              <div className="flex items-end gap-1.5">
                <div className="relative min-h-[28px] w-full flex-1">
                  <div
                    ref={composerRef}
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline="true"
                    aria-label="Ask Arthur anything"
                    onInput={updateIsEmpty}
                    onBlur={rememberSelection}
                    onKeyDown={handleKeyDown}
                    className="math-composer scroll-slim max-h-[160px] min-h-[28px] w-full overflow-y-auto bg-transparent px-1.5 py-1 text-sm leading-6 text-zinc-800 outline-none"
                  />
                  {isEmpty ? (
                    <span className="pointer-events-none absolute left-[0.375rem] top-1 text-sm leading-6 text-zinc-500">
                      Ask Arthur anything.
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setIsMathsOpen((current) => !current)}
                  className={[
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border transition",
                    isMathsOpen
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100",
                  ].join(" ")}
                  aria-expanded={isMathsOpen}
                  aria-label="Toggle maths symbols"
                >
                  <MathsIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void sendMessage();
                  }}
                  disabled={isEmpty || isSending}
                  aria-label="Send message"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-zinc-900 text-white shadow-[0_6px_16px_rgba(9,9,11,0.16)] transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none"
                >
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {errorMessage ? (
              <p className="mt-2 px-1 text-xs text-rose-600">{errorMessage}</p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}

function MathKeypad({ onInsert }: { onInsert: (item: MathInsert) => void }) {
  const [activeGroupId, setActiveGroupId] = useState(MATH_GROUPS[0].id);
  const activeGroup = MATH_GROUPS.find((group) => group.id === activeGroupId) ?? MATH_GROUPS[0];

  return (
    <div className="overflow-hidden rounded-[12px] border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div
        role="tablist"
        aria-label="Maths categories"
        className="flex items-center gap-1 border-b border-zinc-200/80 bg-zinc-50/70 px-1.5 py-1.5"
      >
        {MATH_GROUPS.map((group) => {
          const isActive = group.id === activeGroupId;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setActiveGroupId(group.id)}
              className={[
                "inline-flex flex-1 items-center justify-center rounded-[8px] px-2 py-1.5 text-[11px] font-medium transition",
                isActive
                  ? "bg-white text-zinc-900 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                  : "text-zinc-500 hover:text-zinc-800",
              ].join(" ")}
            >
              {group.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-5 gap-1.5 p-2">
        {activeGroup.items.map((item) => (
          <MathKeypadButton
            key={item.id}
            item={item}
            onClick={() => onInsert(item)}
          />
        ))}
      </div>
    </div>
  );
}

function MathKeypadButton({
  item,
  onClick,
}: {
  item: MathInsert;
  onClick: () => void;
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(item.labelLatex, {
        displayMode: false,
        throwOnError: false,
        strict: "ignore",
      });
    } catch {
      return null;
    }
  }, [item.labelLatex]);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      title={item.ariaLabel}
      aria-label={item.ariaLabel}
      className="group inline-flex h-11 items-center justify-center rounded-[10px] border border-zinc-200/80 bg-white text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100"
    >
      {html ? (
        <span
          className="math-keypad-label inline-flex items-center justify-center leading-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <span className="text-[15px]">{item.label}</span>
      )}
    </button>
  );
}

function RenderedAssistantMessage({ content }: { content: string }) {
  const blocks = useMemo(() => parseAssistantBlocks(content), [content]);

  return (
    <div className="space-y-3.5 text-[14px] leading-[1.75] tracking-[-0.005em]">
      {blocks.map((block, index) =>
        block.type === "divider" ? (
          <div key={`divider-${index}`} className="flex items-center py-1.5" aria-hidden="true">
            <span className="h-px w-full bg-zinc-200" />
          </div>
        ) : (
          <p key={`paragraph-${index}`} className="whitespace-pre-wrap break-words text-zinc-700">
            {renderParagraph(block.content, `paragraph-${index}`)}
          </p>
        ),
      )}
    </div>
  );
}

function RenderedUserMessage({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2.5 text-[14px] leading-[1.7]">
      {paragraphs.map((paragraph, index) => (
        <p key={`user-paragraph-${index}`} className="whitespace-pre-wrap break-words text-white">
          {renderInlineSegments(paragraph.replace(/\n/g, " "), `user-paragraph-${index}`)}
        </p>
      ))}
    </div>
  );
}

function ArthurThinkingSkeleton() {
  return (
    <div aria-label="Arthur is thinking" aria-live="polite" className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-zinc-400">
        <span className="loading-dot h-2 w-2 rounded-full bg-zinc-300" />
        Arthur is thinking
      </div>
      <div className="space-y-2">
        <div className="loading-skeleton h-3 w-24 rounded-full" />
        <div className="loading-skeleton h-3 w-full rounded-full" />
        <div className="loading-skeleton h-3 w-[88%] rounded-full" />
        <div className="loading-skeleton h-3 w-[68%] rounded-full" />
      </div>
    </div>
  );
}

function parseAssistantBlocks(content: string) {
  const normalized = normalizeAssistantContent(content);

  const chunks = normalized.split(/\n{2,}/).map((chunk) => chunk.trim()).filter(Boolean);

  return chunks.map<AssistantBlock>((chunk) => {
    if (/^([-_])\1{2,}$/.test(chunk)) {
      return { type: "divider" as const };
    }

    return {
      type: "paragraph" as const,
      content: chunk
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          if (/^([-_])\1{2,}$/.test(trimmed)) {
            return "";
          }

          return trimmed.replace(/^([-*]|\d+\.)\s+/, "");
        })
        .filter(Boolean)
        .join(" "),
    };
  });
}

function renderInlineSegments(content: string, keyPrefix: string) {
  return splitMessageSegments(content).map((segment, index) => {
    if (segment.type === "math") {
      return <MathSegment key={`${keyPrefix}-math-${index}`} segment={segment} />;
    }

    return renderFormattedText(segment.content, `${keyPrefix}-text-${index}`);
  });
}

function splitMessageSegments(content: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  const mathPattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/g;
  let lastIndex = 0;

  for (const match of content.matchAll(mathPattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", content: content.slice(lastIndex, index) });
    }

    const token = match[0];
    const displayMode = token.startsWith("$$");
    segments.push({
      type: "math",
      content: token.slice(displayMode ? 2 : 1, displayMode ? -2 : -1).trim(),
      displayMode,
    });
    lastIndex = index + token.length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", content: content.slice(lastIndex) });
  }

  return segments;
}

function renderFormattedText(content: string, keyPrefix: string) {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*\n]+\*\*|`[^`\n]+`)/g;
  let lastIndex = 0;

  for (const match of content.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(content.slice(lastIndex, index));
    }

    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-${index}`} className="font-semibold text-zinc-900">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-${index}`}
          className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.92em] text-zinc-800"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex));
  }

  return nodes;
}

function renderParagraph(content: string, keyPrefix: string) {
  const labelMatch = content.match(/^(Step\s*\d+\.|Question\.|Solution\.|Answer\.)\s+(.*)$/);
  if (!labelMatch) {
    return renderInlineSegments(content, keyPrefix);
  }

  return (
    <>
      <span className="mr-1.5 font-semibold text-zinc-900">{labelMatch[1]}</span>
      {renderInlineSegments(labelMatch[2], `${keyPrefix}-rest`)}
    </>
  );
}

function normalizeAssistantContent(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, math: string) => `$${math.trim()}$`)
    .replace(/\\([*_`])/g, "$1")
    .replace(/\*{3,}/g, "")
    .replace(/\*\*\s*(Worked Example|Worked example)\s*:?\s*\*\*/g, "\n\nWorked example.")
    .replace(/\*\*\s*(Another Question|Your Turn|Try this)\s*:?\s*\*\*/g, "\n\n$1.")
    .replace(/\*\*\s*(Question|Solution|Answer)\s*:?\s*\*\*/g, "\n\n$1. ")
    .replace(/\*\*\s*(Step\s*\d+)\s*:?\s*\*\*/gi, "\n\n$1. ")
    .replace(/(?<!\*)\b(Step\s*\d+)\s*:\s*/gi, "\n\n$1. ")
    .replace(/(?<!\*)\b(Question|Solution|Answer)\s*:\s*/g, "\n\n$1. ")
    .replace(/\b(Worked example)\s*:\s*/gi, "\n\nWorked example. ")
    .replace(/\b(Another Question|Your Turn|Try this)\s*:\s*/g, "\n\n$1. ")
    .replace(/^\*\s+/gm, "")
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, "$1$2")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function MathSegment({ segment }: { segment: Extract<MessageSegment, { type: "math" }> }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(segment.content, {
        displayMode: segment.displayMode,
        throwOnError: false,
        strict: "ignore",
      });
    } catch {
      return null;
    }
  }, [segment.content, segment.displayMode]);

  if (!html) {
    return (
      <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.92em] text-zinc-800">
        {segment.content}
      </code>
    );
  }

  return (
    <span
      className={
        segment.displayMode
          ? "my-3 block max-w-full overflow-x-auto overflow-y-hidden py-1"
          : "mx-0.5 inline align-middle py-1"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
