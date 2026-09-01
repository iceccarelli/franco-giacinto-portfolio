"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { QuoteEstimator } from "@/components/estimate/quote-estimator";
import { QuoteForm } from "@/components/estimate/quote-form";
import { calculateEstimate, type EstimateInput } from "@/data/estimate";
import { getCity } from "@/data/areas";
import { serviceKinds } from "@/data/estimate";
import {
  prefillFrom,
  readStoredEstimate,
  seedEstimate,
  writeStoredEstimate,
} from "@/lib/estimate-prefill";
import { track } from "@/lib/analytics";
import { formatCad } from "@/lib/utils";

/**
 * One configuration, two views.
 *
 * `/estimate` used to render the calculator and the lead form as unrelated
 * components: a visitor set city, service and size on the calculator, then
 * typed city, service and size again into the form beneath it. This owns the
 * state once and hands it to both.
 *
 * It also does the two things the brief asks for and the page could not do:
 *
 *   - honours `?service=` and `?city=` (the catalogue was already sending
 *     them; nothing was reading them)
 *   - restores an abandoned configuration on the next visit, without
 *     re-engagement nagging and without ever storing a name or a phone number
 */
/**
 * The query string is read on the CLIENT, deliberately.
 *
 * Reading `searchParams` in the server component turned `/estimate` from a
 * prerendered, edge-cached page into a per-request function render — the site
 * audit caught it — and that is a bad trade on the one page every conversion
 * path ends at. The prefill only ever seeds client state, so nothing is gained
 * by resolving it on the server.
 *
 * `useSearchParams` needs a Suspense boundary in a static page, so the export
 * below provides one and the real component sits inside it.
 */
export function EstimateFlow() {
  return (
    <Suspense fallback={<EstimateFlowInner prefill={{}} />}>
      <EstimateFlowFromUrl />
    </Suspense>
  );
}

function EstimateFlowFromUrl() {
  const params = useSearchParams();
  const prefill = useMemo(
    () =>
      prefillFrom({
        service: params.get("service") ?? undefined,
        city: params.get("city") ?? undefined,
        sqft: params.get("sqft") ?? undefined,
        steps: params.get("steps") ?? undefined,
      }),
    [params],
  );
  return <EstimateFlowInner prefill={prefill} />;
}

function EstimateFlowInner({ prefill }: { prefill: Partial<EstimateInput> }) {
  // Server and first client render must agree, so the URL prefill seeds the
  // initial state and anything remembered is merged in after hydration.
  const [input, setInput] = useState<EstimateInput>(() => seedEstimate(prefill));
  const [restored, setRestored] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const stored = readStoredEstimate();
    // An explicit link wins over a memory: somebody who just clicked "price a
    // stair conversion" means it, whatever they configured last week.
    const merged = { ...stored, ...prefill };
    if (Object.keys(stored).length > 0 && Object.keys(prefill).length === 0) {
      setInput(seedEstimate(merged));
      setRestored(true);
    }
  }, [prefill]);

  useEffect(() => {
    if (!hydrated.current) return;
    writeStoredEstimate(input);
  }, [input]);

  const result = calculateEstimate(input);
  const cityName = getCity(input.city)?.name ?? input.city;
  const serviceLabel = serviceKinds.find((s) => s.id === input.service)?.label ?? input.service;

  return (
    <>
      {restored && (
        /*
          Stated, not silent. A page that quietly changes what the visitor sees
          is worse than one that starts fresh — so it says what it did and how
          to undo it, in one line, once.
        */
        <p className="mb-5 rounded-lg border border-border bg-bg-warm px-4 py-3 text-sm text-muted">
          Picked up where you left off — {serviceLabel.toLowerCase()} in {cityName}.{" "}
          <button
            type="button"
            className="font-medium text-primary underline underline-offset-2"
            onClick={() => {
              setInput(seedEstimate({}));
              setRestored(false);
            }}
          >
            Start over
          </button>
        </p>
      )}

      <QuoteEstimator
        value={input}
        onChange={(next) => {
          if (next.service !== input.service) {
            track({ event: "estimate_step", step: 2, step_name: "service" });
          } else if (next.city !== input.city) {
            track({ event: "estimate_step", step: 1, step_name: "city" });
          }
          setInput(next);
        }}
      />

      <section className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="font-display text-3xl">Book the free measure</h2>
          {/*
            The handover. The form below is already filled in from the
            configuration above, so this states what it is carrying rather than
            making the visitor check.
          */}
          <div className="mt-4 rounded-xl border border-border bg-surface p-5">
            <p className="text-xs tracking-[0.16em] text-accent uppercase">Carried over</p>
            <p className="mt-2 font-display text-2xl tabular-nums">
              {formatCad(result.low)} – {formatCad(result.high)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {serviceLabel} · {cityName}
              {input.service === "stairs" || input.service === "railings"
                ? input.stairs > 0
                  ? ` · ${input.stairs} steps`
                  : ""
                : ` · ${input.sqft} sq ft`}
            </p>
            <p className="mt-3 text-sm text-muted">
              GTA 2026 range · HST extra · not a firm quote. We lock a number only after a moisture
              reading on site.
            </p>
          </div>
          <p className="mt-5 text-sm text-muted">
            Not sure which job you have?{" "}
            <Link href="/catalog" className="text-primary underline underline-offset-2">
              Find it in the catalogue
            </Link>{" "}
            — twelve job types with the specification and what goes wrong in each.
          </p>
        </div>

        <QuoteForm
          source="estimate"
          defaultService={input.service}
          defaultCity={input.city}
          defaultSqft={input.sqft > 0 ? String(input.sqft) : undefined}
        />
      </section>
    </>
  );
}
