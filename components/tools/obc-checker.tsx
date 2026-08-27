"use client";

import { useMemo, useState } from "react";
import { checkObc, defaultObc } from "@/data/obc";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ObcChecker({ defaultRisers = 13 }: { defaultRisers?: number }) {
  const [input, setInput] = useState(() => ({ ...defaultObc(), risers: defaultRisers }));
  const result = useMemo(() => checkObc(input), [input]);

  function patch<K extends keyof typeof input>(key: K, value: number) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <p className="text-xs tracking-[0.16em] text-accent uppercase">Ontario Building Code</p>
      <h3 className="mt-1 font-display text-2xl">Will this flight pass?</h3>
      <p className="mt-2 text-sm text-muted">
        Typical dwelling stairs, Part 9. The inspector still has the last word. We will not build a
        fail.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Num label="Rise (mm)" value={input.riseMm} onChange={(v) => patch("riseMm", v)} />
        <Num label="Run (mm)" value={input.runMm} onChange={(v) => patch("runMm", v)} />
        <Num label="Nosing (mm)" value={input.nosingMm} onChange={(v) => patch("nosingMm", v)} />
        <Num label="Risers" value={input.risers} onChange={(v) => patch("risers", v)} />
        <Num label="Guard (mm)" value={input.guardMm} onChange={(v) => patch("guardMm", v)} />
        <Num
          label="Handrail height (mm)"
          value={input.handrailMm}
          onChange={(v) => patch("handrailMm", v)}
        />
        <Num
          label="Rail diameter (mm)"
          value={input.railDiameterMm}
          onChange={(v) => patch("railDiameterMm", v)}
        />
      </div>
      <p
        className={cn(
          "mt-4 rounded-md px-3 py-2 text-sm font-medium",
          result.pass ? "bg-primary/10 text-primary" : "bg-bg-warm text-fg",
        )}
      >
        {result.pass
          ? "This drawing would typically pass a dwelling-stair inspection."
          : "This drawing would typically fail. Fix the items marked below before anyone cuts wood."}
      </p>
      <ul className="mt-3 space-y-2">
        {result.checks.map((c) => (
          <li key={c.id} className="text-sm">
            <span className={c.ok ? "text-accent" : "font-medium text-fg"}>
              {c.ok ? "Pass" : "Fail"} · {c.label}.
            </span>{" "}
            <span className="text-muted">{c.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 tabular-nums"
      />
    </div>
  );
}
