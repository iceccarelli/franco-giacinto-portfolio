"use server";

import { headers } from "next/headers";
import { deliverLead } from "@/lib/lead-delivery";
import { initialLeadState, parseLead, type LeadState } from "@/lib/leads";

/**
 * In-memory throttle. This is a single-instance guard against a bored visitor
 * hammering submit, not a distributed rate limiter — serverless instances do not
 * share this map. Real abuse protection belongs at the edge (Vercel WAF).
 */
const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function throttled(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  // Honeypot: a real person never fills a field they cannot see.
  if (String(form.get("company_website") ?? "")) {
    return { ...initialLeadState, status: "success" };
  }

  const head = await headers();
  const ip = head.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return {
      status: "error",
      errors: { form: "That is a lot of requests. Give it a minute, or call us — we pick up." },
      values: {},
    };
  }

  const source = String(form.get("source") ?? "unknown");
  const parsed = parseLead(form, source);

  if (!parsed.ok) {
    return { status: "error", errors: parsed.errors, values: parsed.values };
  }

  await deliverLead(parsed.lead);

  // Delivery problems are ours. The visitor's request was accepted and logged.
  return {
    status: "success",
    errors: {},
    values: {},
    /**
     * Coarse dimensions only. The client fires `estimate_submit` from these,
     * so the conversion is counted from the server's verdict — a lead that
     * failed validation never reaches this line and therefore never inflates
     * the conversion count, which an onSubmit handler on the form would.
     */
    analytics: {
      city: parsed.lead.city,
      service: parsed.lead.service,
      has_photos: false,
      has_stairs: parsed.lead.service === "stairs" || parsed.lead.service === "both",
      source: parsed.lead.source,
    },
  };
}
