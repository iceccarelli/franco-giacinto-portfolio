import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Visible breadcrumbs. The JSON-LD equivalent lives in `breadcrumbLd()` — both
 * are emitted, because Google reads the markup and answer engines read the text.
 * The last crumb is the current page and is not a link.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: { name: string; path: string }[];
  className?: string;
}) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className={className ?? "py-4"}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden="true" />
              )}
              {last ? (
                <span aria-current="page" className="text-fg">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-primary hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
