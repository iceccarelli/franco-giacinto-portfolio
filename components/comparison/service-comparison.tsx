"use client";

import { BeforeAfter } from "@/components/before-after";
import { Photo } from "@/components/photo";
import { comparisonFor, ILLUSTRATIVE_NOTE } from "@/data/comparisons";
import type { ServiceKind } from "@/data/estimate";

/**
 * The visual for one service, whichever kind of visual honestly exists.
 *
 * A slider where there is a real pair; a single photograph where there is not,
 * with one line saying what the missing frame would show. The alternative —
 * pairing two unrelated renders behind a Before/After label on all six
 * services — would be manufacturing evidence, and it is precisely the failure
 * the invented testimonials already cost this site once.
 *
 * The slider drifts on its own so the comparison is seen rather than merely
 * available; see components/before-after.tsx for the rules that keep that
 * from being irritating.
 */
export function ServiceComparison({
  kind,
  seed,
  autoplay = true,
}: {
  kind: ServiceKind;
  /**
   * Picks which of the two commissioned rooms this surface shows. The
   * estimator and the service page pass different seeds on purpose, so a
   * visitor who sees both sees two different jobs rather than one photograph
   * twice.
   */
  seed?: string;
  autoplay?: boolean;
}) {
  const c = comparisonFor(kind, seed);

  return (
    <figure className="min-w-0">
      {c.mode === "pair" ? (
        <BeforeAfter
          before={c.before}
          after={c.after}
          beforeAlt={c.beforeAlt}
          afterAlt={c.afterAlt}
          autoplay={autoplay}
        />
      ) : (
        <Photo src={c.image} alt={c.alt} ratio="4/3" slot="half" />
      )}

      <figcaption className="mt-3 space-y-1.5 text-sm">
        <p>
          <span className="font-medium">What to look at: </span>
          <span className="text-muted">{c.lookFor}</span>
        </p>
        {c.mode === "pair" ? (
          <p className="text-xs text-muted">
            {c.verified
              ? "Photographs of the same floor, same position, before and after."
              : ILLUSTRATIVE_NOTE}
          </p>
        ) : (
          <p className="text-xs text-muted">
            <span className="text-fg">No before-and-after here yet. </span>
            {c.pending}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
