"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Loader2, MessageSquare, Minus, Phone } from "lucide-react";

/**
 * The Ask Green Hardwood widget.
 *
 * Thin by design: retrieval runs server-side in /api/ask, so this ships as UI
 * only rather than dragging ~90 KB of corpus into every page's bundle.
 *
 * Sits above the mobile CTA bar rather than on top of it, so the "Call" and
 * "Free estimate" buttons stay reachable on a phone — a chat bubble that
 * covers the phone number is a net loss for a contractor.
 */

type Source = { title: string; path: string; kind: string };
type Reply = {
  answer: string;
  sources: Source[];
  followUps: string[];
  cta: { label: string; href: string } | null;
  basis: "grounded" | "fallback";
};
type Turn = { role: "user"; text: string } | { role: "assistant"; reply: Reply };

const OPENERS = [
  "How much do hardwood stairs cost?",
  "Do you work in my city?",
  "Solid or engineered hardwood?",
  "Will my stairs pass inspection?",
];

const PHONE = "(416) 847-3366";
const PHONE_HREF = "tel:+14168473366";

export function AskGreenHardwood() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, pending]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = useCallback(async (query: string) => {
    const text = query.trim();
    if (!text || text.length > 500) return;

    setTurns((t) => [...t, { role: "user", text }]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const reply = (await res.json()) as Reply;
      setTurns((t) => [...t, { role: "assistant", reply }]);
    } catch {
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          reply: {
            answer: `Something went wrong on our side — that is our problem, not yours. Call ${PHONE} and someone will answer the question directly.`,
            sources: [],
            followUps: [],
            cta: { label: `Call ${PHONE}`, href: PHONE_HREF },
            basis: "fallback",
          },
        },
      ]);
    } finally {
      setPending(false);
    }
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="fixed right-4 bottom-24 z-40 inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-fg shadow-[0_8px_28px_-8px_rgb(28_22_18/0.55)] transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none md:bottom-6"
      >
        <MessageSquare className="size-5" aria-hidden="true" />
        Ask Green Hardwood
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${uid}-title`}
      className="fixed inset-x-3 bottom-24 z-40 flex max-h-[min(34rem,75vh)] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[0_20px_56px_-20px_rgb(28_22_18/0.5)] sm:inset-x-auto sm:right-4 sm:w-[24rem] md:bottom-6"
    >
      <header className="flex items-start justify-between gap-3 bg-primary px-4 py-3 text-primary-fg">
        <div>
          <h2 id={`${uid}-title`} className="font-display text-lg leading-tight">
            Ask Green Hardwood
          </h2>
          <p className="text-xs text-primary-fg/70">
            Answers drawn from this site. Not a substitute for a site visit.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Minimise the assistant"
          className="-mr-1 rounded-md p-1.5 text-primary-fg/70 transition-colors hover:bg-primary-fg/10 hover:text-primary-fg"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
      </header>

      <div ref={logRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
        {turns.length === 0 && (
          <div>
            <p className="text-sm text-muted">
              Hardwood stairs, installation, refinishing, local pricing, Ontario stair code. Ask
              anything — or start here:
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {OPENERS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void ask(q)}
                  className="rounded-lg border border-border bg-bg px-3 py-2 text-left text-sm transition-colors hover:bg-bg-warm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((turn, i) =>
          turn.role === "user" ? (
            <p
              key={i}
              className="ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-fg"
            >
              {turn.text}
            </p>
          ) : (
            <div key={i} className="max-w-[95%]">
              <p className="text-sm leading-relaxed text-fg">{turn.reply.answer}</p>

              {turn.reply.sources.length > 0 && (
                <div className="mt-2.5">
                  <p className="text-[0.6875rem] tracking-[0.14em] text-muted uppercase">Sources</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {turn.reply.sources.map((s) => (
                      <li key={s.path + s.title}>
                        <Link
                          href={s.path}
                          onClick={() => setOpen(false)}
                          className="inline-block rounded-full border border-border bg-bg px-2.5 py-1 text-xs text-primary transition-colors hover:bg-bg-warm"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {turn.reply.cta && (
                <p className="mt-3">
                  {turn.reply.cta.href.startsWith("tel:") ? (
                    <a
                      href={turn.reply.cta.href}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-fg"
                    >
                      <Phone className="size-3.5" aria-hidden="true" />
                      {turn.reply.cta.label}
                    </a>
                  ) : (
                    <Link
                      href={turn.reply.cta.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-fg"
                    >
                      {turn.reply.cta.label}
                    </Link>
                  )}
                </p>
              )}

              {turn.reply.followUps.length > 0 && i === turns.length - 1 && (
                <div className="mt-3 flex flex-col gap-1.5">
                  {turn.reply.followUps.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void ask(q)}
                      className="rounded-lg border border-border bg-bg px-3 py-1.5 text-left text-xs text-fg transition-colors hover:bg-bg-warm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ),
        )}

        {pending && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Checking the site…
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="flex items-center gap-2 border-t border-border px-3 py-2.5"
      >
        <label htmlFor={`${uid}-input`} className="sr-only">
          Ask a question about hardwood floors, stairs, or railings
        </label>
        <input
          id={`${uid}-input`}
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          autoComplete="off"
          placeholder="Ask a question…"
          className="h-10 w-full bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || input.trim().length === 0}
          aria-label="Send"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg transition-opacity disabled:opacity-40"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
