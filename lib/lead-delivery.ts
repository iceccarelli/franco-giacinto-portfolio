import "server-only";
import { company } from "@/data/company";
import { cityLabel, serviceLabel, type Lead } from "@/lib/leads";

/**
 * Lead delivery.
 *
 * The contract this module guarantees: a validated lead is NEVER silently
 * dropped. If Resend is configured we send it. If Resend is not configured, or
 * the send fails, we emit a structured single-line JSON log that is greppable in
 * the Vercel runtime logs, and we still report success to the visitor — their
 * request did arrive, and the operational failure is ours to fix, not theirs to
 * retry.
 *
 * To switch delivery on, set these in the Vercel project (Production + Preview):
 *   RESEND_API_KEY   re_xxxxxxxx
 *   LEAD_TO_EMAIL    hello@greenhardwood.ca      (defaults to company.email)
 *   LEAD_FROM_EMAIL  leads@greenhardwood.ca      (must be a Resend-verified domain)
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type DeliveryResult = { delivered: boolean; channel: "resend" | "log"; detail?: string };

function logLead(lead: Lead, note: string): DeliveryResult {
  // Single line, machine-parseable, safe to grep in Vercel logs: `GREEN_HARDWOOD_LEAD`.
  console.info(`GREEN_HARDWOOD_LEAD ${JSON.stringify({ note, ...lead })}`);
  return { delivered: false, channel: "log", detail: note };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderEmail(lead: Lead) {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["City", cityLabel(lead.city)],
    ["Service", serviceLabel(lead.service)],
    ["Approx. sq ft", lead.sqft ? String(lead.sqft) : "not given"],
    ["Came from", lead.source],
    [
      "Received",
      new Date(lead.receivedAt).toLocaleString("en-CA", { timeZone: "America/Toronto" }),
    ],
  ];

  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#1c1612;max-width:640px">
  <h1 style="font-size:20px;margin:0 0 4px">New site visit request</h1>
  <p style="margin:0 0 20px;color:#6b645a;font-size:14px">${escapeHtml(serviceLabel(lead.service))} in ${escapeHtml(cityLabel(lead.city))}</p>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><th align="left" style="padding:6px 12px 6px 0;color:#6b645a;font-weight:500;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</th><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <h2 style="font-size:15px;margin:24px 0 6px">What we are walking into</h2>
  <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.55">${escapeHtml(lead.message)}</p>
  <p style="margin:28px 0 0"><a href="tel:${escapeHtml(lead.phone)}" style="background:#1b3a2a;color:#f3eee6;padding:10px 18px;border-radius:8px;text-decoration:none;font-size:14px">Call ${escapeHtml(lead.name)}</a></p>
</div>`;

  const text = [
    `New site visit request — ${serviceLabel(lead.service)} in ${cityLabel(lead.city)}`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    lead.message,
  ].join("\n");

  return { html, text };
}

export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return logLead(lead, "RESEND_API_KEY not set — lead captured in logs only");

  const to = process.env.LEAD_TO_EMAIL ?? company.email;
  const from = process.env.LEAD_FROM_EMAIL ?? `Green Hardwood <leads@greenhardwood.ca>`;
  const { html, text } = renderEmail(lead);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject: `${serviceLabel(lead.service)} — ${cityLabel(lead.city)} — ${lead.name}`,
        html,
        text,
      }),
      // A visitor should never wait on our mail provider.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return logLead(lead, `Resend responded ${res.status}: ${await res.text().catch(() => "")}`);
    }
    return { delivered: true, channel: "resend" };
  } catch (error) {
    return logLead(lead, `Resend threw: ${error instanceof Error ? error.message : String(error)}`);
  }
}
