"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchSite, type SearchDoc } from "@/lib/search-index";

/**
 * Site search.
 *
 * Implements the WAI-ARIA combobox-with-listbox pattern by hand rather than
 * pulling in a command-palette library: the whole interaction is one input, one
 * listbox, and arrow keys, and owning it means the focus and roving-selection
 * behaviour is actually correct rather than approximately correct.
 *
 * Opens with the button, with ⌘K / Ctrl-K, or with "/" anywhere outside a field.
 */
export function SiteSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        aria-haspopup="dialog"
        className={
          className ??
          "inline-flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-muted transition-colors hover:bg-bg-warm hover:text-fg focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
        }
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="ml-1 hidden rounded border border-border px-1.5 py-0.5 font-sans text-[0.6875rem] text-muted lg:inline">
          ⌘K
        </kbd>
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchSite(query, 8), [query]);

  useEffect(() => {
    inputRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = useCallback(
    (doc: SearchDoc | undefined) => {
      if (!doc) return;
      onClose();
      router.push(doc.path);
    },
    [onClose, router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(0, results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length) go(results[active]);
      else if (query.trim()) {
        onClose();
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  const listboxId = `${uid}-listbox`;
  const activeId = results.length ? `${uid}-option-${active}` : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[10vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Green Hardwood"
        className="w-full max-w-xl overflow-hidden rounded-xl bg-surface shadow-[0_24px_64px_-24px_rgb(28_22_18/0.5)]"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search services, areas, guides, and species"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Stairs in Vaughan, refinishing cost, white oak…"
            className="h-14 w-full bg-transparent text-base text-fg placeholder:text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-bg-warm hover:text-fg"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {query.trim() === "" ? (
          <div className="px-4 py-6 text-sm text-muted">
            <p className="text-xs tracking-[0.16em] uppercase">Try</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["hardwood stairs", "vaughan", "refinishing cost", "white oak", "water damage"].map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-border px-3 py-1 text-sm text-fg transition-colors hover:bg-bg-warm"
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            Nothing matches “{query}”. Try a service, a city, or a species.
          </p>
        ) : (
          <ul id={listboxId} ref={listRef} role="listbox" className="max-h-[22rem] overflow-y-auto">
            {results.map((doc, i) => (
              <li
                key={doc.id}
                id={`${uid}-option-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(doc)}
                className={`cursor-pointer border-b border-border/60 px-4 py-3 last:border-b-0 ${
                  i === active ? "bg-bg-warm" : ""
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-fg">{doc.title}</span>
                  <span className="shrink-0 text-xs tracking-wide text-accent uppercase">
                    {doc.kind}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted">{doc.description}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted">
          <span>↑↓ to move · ↵ to open · esc to close</span>
          <span>
            {results.length > 0 ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
