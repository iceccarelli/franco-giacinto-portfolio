"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cities } from "@/data/areas";
import { serviceKinds } from "@/data/estimate";

const STORAGE_KEY = "gh-leads";

export function QuoteForm({ defaultService }: { defaultService?: string }) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lead = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      city: String(data.get("city") || ""),
      service: String(data.get("service") || ""),
      sqft: String(data.get("sqft") || ""),
      message: String(data.get("message") || ""),
      at: new Date().toISOString(),
    };
    const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([lead, ...prev].slice(0, 25)));
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-primary p-8 text-primary-fg">
        <p className="text-xs tracking-[0.16em] text-primary-fg/60 uppercase">Request received</p>
        <h3 className="mt-2 font-display text-3xl">We have your details.</h3>
        <p className="mt-3 max-w-md text-sm text-primary-fg/75">
          A project lead will call or email within one business day to book the on-site measure. If
          the job is flooding or a stair that failed inspection, call us — do not wait on the form.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name">
        <Input name="name" required autoComplete="name" placeholder="Your name" />
      </Field>
      <Field label="Phone">
        <Input name="phone" required type="tel" autoComplete="tel" placeholder="(416) 000-0000" />
      </Field>
      <Field label="Email" className="sm:col-span-2">
        <Input
          name="email"
          required
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
        />
      </Field>
      <Field label="Service">
        <NativeSelect name="service" defaultValue={defaultService || "install"}>
          {serviceKinds.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="City">
        <NativeSelect name="city" defaultValue="toronto">
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Approximate sq ft (optional)" className="sm:col-span-2">
        <Input name="sqft" inputMode="numeric" placeholder="e.g. 1200" />
      </Field>
      <Field label="What are we walking into?" className="sm:col-span-2">
        <Textarea
          name="message"
          required
          placeholder="New install, refinish, stairs over carpet, water damage, railing wobble…"
        />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Request free site visit
        </Button>
        <p className="mt-2 text-xs text-muted">
          No spam. Site visits are free inside our GTA service area for qualified hardwood, stair,
          and railing work.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
    </div>
  );
}
