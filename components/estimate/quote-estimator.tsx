"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/input";
import { cities } from "@/data/areas";
import {
  calculateEstimate,
  emptyEstimate,
  finishOptions,
  patternOptions,
  serviceKinds,
  speciesOptions,
  type EstimateInput,
  type ServiceKind,
} from "@/data/estimate";
import { formatCad } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function QuoteEstimator({
  compact = false,
  value,
  onChange,
}: {
  compact?: boolean;
  /**
   * Optional controlled mode.
   *
   * On `/estimate` the state is owned one level up by EstimateFlow, so the
   * lead form beneath can be prefilled from whatever the visitor configured
   * here — they should never be asked for city, service and size twice.
   * Everywhere else (the homepage strip) the component keeps its own state and
   * nothing changes.
   */
  value?: EstimateInput;
  onChange?: (next: EstimateInput) => void;
}) {
  const [internal, setInternal] = useState<EstimateInput>(emptyEstimate);
  const input = value ?? internal;
  const result = useMemo(() => calculateEstimate(input), [input]);
  const started = useRef(false);

  function patch<K extends keyof EstimateInput>(key: K, value: EstimateInput[K]) {
    // First touch of any control is the top of the funnel, and only the first.
    if (!started.current) {
      started.current = true;
      track({ event: "estimate_start", entry: compact ? "home" : "estimate_page" });
    }
    const next = { ...input, [key]: value };
    if (onChange) onChange(next);
    else setInternal(next);
  }

  /**
   * The band, once it settles.
   *
   * Debounced by 700 ms because the area control is a range slider: firing on
   * every tick would push a hundred events for one drag, blow through the GA4
   * event quota, and turn the median band into noise. What matters is the band
   * a visitor actually read, which is the one still on screen when they stop
   * moving.
   */
  useEffect(() => {
    if (!started.current) return;
    const t = setTimeout(() => {
      track({
        event: "estimate_band_shown",
        min: Math.round(result.low),
        max: Math.round(result.high),
        city: input.city,
        service: input.service,
      });
    }, 700);
    return () => clearTimeout(t);
  }, [result.low, result.high, input.city, input.service]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-card)] sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Service">
            <NativeSelect
              value={input.service}
              onChange={(e) => patch("service", e.target.value as ServiceKind)}
            >
              {serviceKinds.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="City">
            <NativeSelect value={input.city} onChange={(e) => patch("city", e.target.value)}>
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          {(input.service === "install" ||
            input.service === "refinish" ||
            input.service === "repair" ||
            input.service === "deck") && (
            <Field label={`Area · ${input.sqft} sq ft`}>
              <input
                type="range"
                min={120}
                max={4500}
                step={20}
                value={input.sqft}
                onChange={(e) => patch("sqft", Number(e.target.value))}
                className="h-11 w-full cursor-pointer accent-primary"
              />
            </Field>
          )}
          {(input.service === "install" ||
            input.service === "stairs" ||
            input.service === "refinish") && (
            <Field label="Species">
              <NativeSelect
                value={input.species}
                onChange={(e) => patch("species", e.target.value as EstimateInput["species"])}
              >
                {speciesOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          )}
          {input.service === "install" && (
            <>
              <Field label="Pattern">
                <NativeSelect
                  value={input.pattern}
                  onChange={(e) => patch("pattern", e.target.value as EstimateInput["pattern"])}
                >
                  {patternOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Finish">
                <NativeSelect
                  value={input.finish}
                  onChange={(e) => patch("finish", e.target.value as EstimateInput["finish"])}
                >
                  {finishOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            </>
          )}
          {(input.service === "stairs" ||
            input.service === "install" ||
            input.service === "refinish") && (
            <Field label={`Stairs · ${input.stairs} steps`}>
              <input
                type="range"
                min={0}
                max={40}
                value={input.stairs}
                onChange={(e) => patch("stairs", Number(e.target.value))}
                className="h-11 w-full cursor-pointer accent-primary"
              />
            </Field>
          )}
          {(input.service === "railings" ||
            input.service === "install" ||
            input.service === "stairs") && (
            <Field label={`Railings · ${input.railingFt} lin ft`}>
              <input
                type="range"
                min={0}
                max={80}
                value={input.railingFt}
                onChange={(e) => patch("railingFt", Number(e.target.value))}
                className="h-11 w-full cursor-pointer accent-primary"
              />
            </Field>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-xl bg-primary p-5 text-primary-fg shadow-[var(--shadow-card)] sm:p-7">
        <div>
          <p className="text-xs tracking-[0.16em] text-primary-fg/60 uppercase">
            GTA 2026 range · HST extra
          </p>
          <p className="mt-3 font-display text-4xl leading-none tabular-nums sm:text-5xl">
            {formatCad(result.low)}
            <span className="text-primary-fg/50"> – </span>
            {formatCad(result.high)}
          </p>
          {result.perSqft ? (
            <p className="mt-2 text-sm text-primary-fg/70">
              About {formatCad(result.perSqft)} per sq ft at midpoint
            </p>
          ) : null}
          <p className="mt-1 text-sm text-primary-fg/70">Timeline: {result.timeline}</p>
          <ul className="mt-5 space-y-2 text-sm text-primary-fg/80">
            {result.lines.map((line) => (
              <li key={line.label} className="flex justify-between gap-4">
                <span>{line.label}</span>
                <span className="tabular-nums">{formatCad(line.amount)}</span>
              </li>
            ))}
          </ul>
          {!compact && (
            <ul className="mt-5 space-y-2 text-xs text-primary-fg/60">
              {result.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild variant="invert">
            <Link href="/estimate">Get a site quote</Link>
          </Button>
          <p className="text-xs text-primary-fg/55">
            Ranges are calibrated to 2026 GTA labour and mill pricing. A site moisture reading is
            required before we lock a number.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
