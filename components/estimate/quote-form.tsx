"use client";

import { useActionState, useId, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { submitLead } from "@/app/actions/lead";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cities } from "@/data/areas";
import { company } from "@/data/company";
import { serviceKinds } from "@/data/estimate";
import { initialLeadState, type LeadErrors, type LeadField } from "@/lib/leads";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          Sending…
        </>
      ) : (
        "Request free site visit"
      )}
    </Button>
  );
}

export function QuoteForm({
  defaultService,
  defaultCity,
  source = "site",
}: {
  defaultService?: string;
  defaultCity?: string;
  source?: string;
}) {
  const [state, formAction] = useActionState(submitLead, initialLeadState);
  const uid = useId();

  if (state.status === "success") {
    return (
      <div className="rounded-xl bg-primary p-8 text-primary-fg" role="status" aria-live="polite">
        <CheckCircle2 className="size-7 text-primary-fg/70" aria-hidden="true" />
        <p className="mt-3 text-xs tracking-[0.16em] text-primary-fg/60 uppercase">
          Request received
        </p>
        <h3 className="mt-2 font-display text-3xl">We have your details.</h3>
        <p className="mt-3 max-w-md text-sm text-primary-fg/75">
          A project lead will call or email within one business day to book the on-site measure. If
          this is a flood or a stair that failed inspection, do not wait on the form.
        </p>
        <a
          href={`tel:${company.phone}`}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-primary-fg px-5 text-sm font-medium text-primary transition-colors hover:bg-bg-warm"
        >
          <Phone className="size-4" aria-hidden="true" />
          {company.phoneDisplay}
        </a>
      </div>
    );
  }

  const errors: LeadErrors = state.errors;
  const val = (field: LeadField) => state.values[field] ?? undefined;
  const errorId = (field: LeadField) => `${uid}-${field}-error`;

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2" noValidate>
      <input type="hidden" name="source" value={source} />

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-company_website`}>Company website</label>
        <input
          id={`${uid}-company_website`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {errors.form && (
        <p
          role="alert"
          className="rounded-md border border-border bg-bg-warm px-4 py-3 text-sm text-fg sm:col-span-2"
        >
          {errors.form}
        </p>
      )}

      <Field label="Full name" id={`${uid}-name`} error={errors.name} errorId={errorId("name")}>
        <Input
          id={`${uid}-name`}
          name="name"
          defaultValue={val("name")}
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? errorId("name") : undefined}
        />
      </Field>

      <Field label="Phone" id={`${uid}-phone`} error={errors.phone} errorId={errorId("phone")}>
        <Input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          defaultValue={val("phone")}
          autoComplete="tel"
          placeholder="(416) 000-0000"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? errorId("phone") : undefined}
        />
      </Field>

      <Field
        label="Email"
        id={`${uid}-email`}
        error={errors.email}
        errorId={errorId("email")}
        className="sm:col-span-2"
      >
        <Input
          id={`${uid}-email`}
          name="email"
          type="email"
          defaultValue={val("email")}
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? errorId("email") : undefined}
        />
      </Field>

      <Field
        label="Service"
        id={`${uid}-service`}
        error={errors.service}
        errorId={errorId("service")}
      >
        <NativeSelect
          id={`${uid}-service`}
          name="service"
          defaultValue={val("service") ?? defaultService ?? "install"}
          aria-invalid={Boolean(errors.service)}
          aria-describedby={errors.service ? errorId("service") : undefined}
        >
          {serviceKinds.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field label="City" id={`${uid}-city`} error={errors.city} errorId={errorId("city")}>
        <NativeSelect
          id={`${uid}-city`}
          name="city"
          defaultValue={val("city") ?? defaultCity ?? "toronto"}
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? errorId("city") : undefined}
        >
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
      </Field>

      <Field
        label="Approximate sq ft"
        hint="optional"
        id={`${uid}-sqft`}
        error={errors.sqft}
        errorId={errorId("sqft")}
        className="sm:col-span-2"
      >
        <Input
          id={`${uid}-sqft`}
          name="sqft"
          inputMode="numeric"
          defaultValue={val("sqft")}
          placeholder="e.g. 1200"
          aria-invalid={Boolean(errors.sqft)}
          aria-describedby={errors.sqft ? errorId("sqft") : undefined}
        />
      </Field>

      <Field
        label="What are we walking into?"
        id={`${uid}-message`}
        error={errors.message}
        errorId={errorId("message")}
        className="sm:col-span-2"
      >
        <Textarea
          id={`${uid}-message`}
          name="message"
          defaultValue={val("message")}
          placeholder="New install, refinish, stairs over carpet, water damage, railing wobble…"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorId("message") : undefined}
        />
      </Field>

      <div className="sm:col-span-2">
        <SubmitButton />
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
  hint,
  id,
  error,
  errorId,
  className,
  children,
}: {
  label: string;
  hint?: string;
  id: string;
  error?: string;
  errorId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block">
        {label}
        {hint && <span className="ml-1.5 font-normal text-muted">({hint})</span>}
      </Label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-primary">
          {error}
        </p>
      )}
    </div>
  );
}
