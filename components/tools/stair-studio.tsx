"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/input";
import { calculateEstimate, type EstimateInput } from "@/data/estimate";
import { species } from "@/data/species";
import { formatCad } from "@/lib/utils";
import {
  StairVisual,
  type NewelStyle,
  type RailStyle,
  type StairStyle,
} from "@/components/tools/stair-visual";
import { ObcChecker } from "@/components/tools/obc-checker";

const styles: { id: StairStyle; label: string }[] = [
  { id: "box", label: "Box stair (treads + wood risers)" },
  { id: "open", label: "Open riser" },
  { id: "retread", label: "Retread over carpeted stringers" },
];

const rails: { id: RailStyle; label: string }[] = [
  { id: "wood-iron", label: "Wood rail + iron balusters" },
  { id: "wood", label: "Wood rail + wood balusters" },
  { id: "wall", label: "Wall-mounted rail only" },
];

const newels: { id: NewelStyle; label: string }[] = [
  { id: "box", label: "Box newels" },
  { id: "turned", label: "Turned newels" },
  { id: "none", label: "No newel (wall rail)" },
];

export function StairStudio() {
  const [speciesId, setSpeciesId] = useState("white-oak");
  const [steps, setSteps] = useState(13);
  const [style, setStyle] = useState<StairStyle>("box");
  const [rail, setRail] = useState<RailStyle>("wood-iron");
  const [newel, setNewel] = useState<NewelStyle>("box");
  const [city, setCity] = useState("toronto");

  const estimate = useMemo(() => {
    const speciesForQuote: EstimateInput["species"] =
      speciesId === "red-oak" ||
      speciesId === "walnut" ||
      speciesId === "maple" ||
      speciesId === "hickory"
        ? speciesId
        : "white-oak";
    const stair = calculateEstimate({
      service: "stairs",
      sqft: 0,
      species: speciesForQuote,
      pattern: "straight",
      finish: "matte",
      stairs: steps,
      railingFt: 0,
      city,
    });
    const railFt = Math.round(steps * 0.85 + (rail === "wall" ? 0 : 6));
    const railing =
      rail === "wall"
        ? calculateEstimate({
            service: "railings",
            sqft: 0,
            species: "white-oak",
            pattern: "straight",
            finish: "matte",
            stairs: 0,
            railingFt: Math.max(10, Math.round(steps * 0.7)),
            city,
          })
        : calculateEstimate({
            service: "railings",
            sqft: 0,
            species: "white-oak",
            pattern: "straight",
            finish: "matte",
            stairs: 0,
            railingFt: railFt,
            city,
          });
    const styleMult = style === "open" ? 1.18 : style === "retread" ? 0.92 : 1;
    const mid = stair.mid * styleMult + railing.mid;
    return {
      low: mid * 0.86,
      mid,
      high: mid * 1.22,
      railFt,
      timeline: stair.timeline,
    };
  }, [speciesId, steps, style, rail, city]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]">
        <StairVisual
          speciesId={speciesId}
          steps={steps}
          style={style}
          rail={rail}
          newel={rail === "wall" ? "none" : newel}
        />
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Species">
            <NativeSelect value={speciesId} onChange={(e) => setSpeciesId(e.target.value)}>
              {species
                .filter((s) => s.id !== "engineered-oak")
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </NativeSelect>
          </Field>
          <Field label={`Steps · ${steps}`}>
            <input
              type="range"
              min={10}
              max={20}
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="mt-3 w-full accent-primary"
            />
          </Field>
          <Field label="Stair type">
            <NativeSelect value={style} onChange={(e) => setStyle(e.target.value as StairStyle)}>
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Railing">
            <NativeSelect value={rail} onChange={(e) => setRail(e.target.value as RailStyle)}>
              {rails.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Newels">
            <NativeSelect
              value={newel}
              onChange={(e) => setNewel(e.target.value as NewelStyle)}
              disabled={rail === "wall"}
            >
              {newels.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="City (labour)">
            <NativeSelect value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="toronto">Toronto</option>
              <option value="vaughan">Vaughan</option>
              <option value="oakville">Oakville</option>
              <option value="mississauga">Mississauga</option>
              <option value="markham">Markham</option>
              <option value="burlington">Burlington</option>
            </NativeSelect>
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-xl bg-primary p-6 text-primary-fg">
          <p className="text-xs tracking-[0.16em] text-primary-fg/60 uppercase">
            2026 GTA range · HST extra
          </p>
          <p className="mt-3 font-display text-4xl tabular-nums">
            {formatCad(estimate.low)} – {formatCad(estimate.high)}
          </p>
          <p className="mt-2 text-sm text-primary-fg/75">
            Mid {formatCad(estimate.mid)} · {steps} treads · ~{estimate.railFt} lin ft of rail ·{" "}
            {estimate.timeline}
          </p>
          <p className="mt-4 text-sm text-primary-fg/70">
            A range, not a contract. Open risers, curves, and failed stringers move it. We lock a
            number after we measure rise, run, and moisture.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="invert">
              <Link href="/estimate">Book the site visit</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-fg/20 text-primary-fg hover:bg-primary-fg/10"
            >
              <Link href={`/services/${"hardwood-stairs"}`}>Stair service</Link>
            </Button>
          </div>
        </div>
        <ObcChecker defaultRisers={steps} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  );
}
