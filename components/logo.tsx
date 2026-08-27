import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="currentColor" />
      <path
        d="M8 8.5h4.2v15H8V8.5zm6 0h4.2v15H14V8.5zm6 0H24v9.2c0 3.4-1.9 5.8-4 5.8V8.5z"
        fill="var(--color-parchment)"
      />
    </svg>
  );
}

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 font-display text-lg tracking-tight",
        invert ? "text-primary-fg" : "text-primary",
        className,
      )}
    >
      <LogoMark className={invert ? "text-moss" : "text-primary"} />
      <span>
        Green <span className="font-medium">Hardwood</span>
      </span>
    </Link>
  );
}
