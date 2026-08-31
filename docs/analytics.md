# Measurement

Stage 2 of the discoverability program. Rule 10: **a page without events is
unfinished.**

Nothing here fires until the owner pastes two IDs into Vercel. Until then the
site ships zero third-party JavaScript from Google, needs no consent banner,
and still records pageviews and Core Web Vitals through Vercel.

---

## 1. What is installed

| Vendor              | Owns                                   | Configured by                        |
| ------------------- | -------------------------------------- | ------------------------------------ |
| Google Tag Manager  | GA4, Ads, any future pixel             | `NEXT_PUBLIC_GTM_ID`                 |
| GA4                 | Reporting, conversions                 | Inside GTM — **not** in this repo    |
| Vercel Analytics    | Pageviews, referrers, no cookie        | On by deploy                         |
| Vercel Speed Insights | Field Core Web Vitals from real phones | On by deploy                       |

**GA4 is loaded by GTM and by nothing else.** There is no second `gtag.js`
snippet anywhere in this codebase, and adding one is the fastest way to double
every conversion count on the property. If a future change needs GA4 config,
it goes in the GTM container.

---

## 2. Environment variables

Set in **Vercel → Settings → Environment Variables** (Production *and* Preview):

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

That is the only one the code reads. The GA4 Measurement ID (`G-XXXXXXXXXX`)
is pasted **inside GTM**, not here.

---

## 3. The event taxonomy

Defined once, typed, in [`lib/analytics.ts`](../lib/analytics.ts). A call site
cannot emit an event that is not in this table, and
`tests/analytics.test.ts` fails if this table and that file disagree.

| Event                  | Parameters                                   | Fires when                                              |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------- |
| `tel_click`            | `location`                                   | Any `tel:` link, anywhere on the site                   |
| `sms_click`            | `location`                                   | Any `sms:` link                                         |
| `estimate_start`       | `entry`                                      | First touch of any estimator control                    |
| `estimate_step`        | `step`, `step_name`                          | Reserved for the Stage 4 multi-step estimator           |
| `estimate_band_shown`  | `min`, `max`, `city`, `service`              | A band settles on screen (700 ms debounce)              |
| `estimate_submit`      | `city`, `service`, `has_photos`, `has_stairs`, `source` | The **server action returned success**       |
| `chat_open`            | `location`                                   | The grounded assistant is opened                        |
| `stair_studio_click`   | `location`                                   | Any link into `/stairs`                                 |
| `portfolio_job_open`   | `slug`                                       | Any link into `/portfolio/{slug}`                       |
| `outbound_instagram`   | `location`                                   | Outbound to instagram.com                               |
| `outbound_gbp`         | `location`                                   | Outbound to a Google Business Profile / Maps URL        |
| `file_download`        | `file`                                       | `download` attribute, or a `.pdf` / `.vcf` / `.zip` href |

### `location` values

`utility_bar`, `header`, `mobile_bar`, `footer_action_row`, `footer_nap`,
`form`, `main`, `launcher`, `unknown`.

Set with `data-track-location` on any wrapper; the fallback walks up to the
nearest landmark, so a click is never attributed to nowhere.

### How clicks are captured

One delegated listener in
[`components/analytics/click-tracker.tsx`](../components/analytics/click-tracker.tsx),
mounted once in the root layout. It covers every `tel:`, `sms:`, outbound,
portfolio and download link on all 371 pages — including links added after this
was written. There are no per-link `onClick` handlers to forget.

### Privacy, non-negotiable

No event parameter carries a name, phone number, email address, street address,
or free text a visitor typed. `estimate_submit` is built from a `LeadAnalytics`
object the server action constructs explicitly (`lib/leads.ts`) — the lead's
actual details go to the inbox and stop there. Keep it that way: the coarse
dimensions are enough to optimise on, and sending a phone number to an
analytics vendor is a PIPEDA problem, not a growth tactic.

---

## 4. GTM container recipe

Build this once in the GTM UI. Twenty minutes, then never again.

### 4.1 Variables

Create one **Data Layer Variable** per parameter, each named exactly after the
key it reads (Variables → New → Data Layer Variable):

```
location   entry    step      step_name   min    max
city       service  source    slug        file
has_photos has_stairs
```

### 4.2 Triggers

For each event in the table above: **Triggers → New → Custom Event**, with
*Event name* set to the event exactly as spelled (`tel_click`,
`estimate_submit`, …). No regex, no wildcards — the taxonomy is closed, so a
wildcard would only ever catch a typo.

### 4.3 Tags

One **GA4 Event** tag per trigger:

- *Configuration Tag*: your GA4 Configuration tag
- *Event Name*: same string as the trigger
- *Event Parameters*: map each Data Layer Variable from §4.1 that the event
  carries

### 4.4 Mark the conversions

In **GA4 → Admin → Events**, toggle *Mark as key event* on exactly three:

```
tel_click
sms_click
estimate_submit
```

Nothing else. `estimate_band_shown` and `chat_open` explain conversions; they
are not conversions, and marking them as such flatters the numbers into
uselessness. This list is mirrored in `CONVERSION_EVENTS` in
`lib/analytics.ts`.

### 4.5 Content groups

In the GA4 Configuration tag, add a parameter `content_group` built from a
**Lookup Table** on Page Path:

| Path pattern                | content_group   |
| --------------------------- | --------------- |
| `/areas/…`                  | `city_hub`      |
| `/services/{s}/{city}`      | `city_service`  |
| `/services/{s}`             | `service`       |
| `/answers/…`, `/problems/…`, `/guides/…`, `/methods/…` | `answer` |
| `/portfolio/…`              | `portfolio`     |
| `/estimate`, `/contact`, `/trade` | `conversion` |
| everything else             | `site`          |

City landing pages then report as one group, which is how you find out whether
the twelve enriched hubs (Stage 6) are actually earning their words.

---

## 5. Verifying before you trust a number

1. `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX npm run dev`
2. Open GTM → **Preview**, point it at the dev URL.
3. Walk the money path and confirm each event fires **once**:
   - tap the header phone number → `tel_click` with `location: header`
   - tap the mobile bar phone number → `tel_click` with `location: mobile_bar`
   - drag the estimator area slider → **one** `estimate_start`, then **one**
     `estimate_band_shown` after you let go (not one per tick)
   - submit a valid estimate → **one** `estimate_submit`
   - submit an **invalid** estimate → **no** `estimate_submit` at all
   - open the assistant → `chat_open`
4. In GA4 → **Realtime**, confirm the three key events appear and the parameter
   values are populated rather than `(not set)`.

The invalid-submit check is the one people skip and the one that matters: it is
the difference between a lead count and a wish.

---

## 6. Still to wire (not blocked by code)

- **CallRail number swap** — hook is stubbed. When a tracking number exists,
  set it in `data/company.ts` and it propagates to every surface, schema and
  vCard at once. Do not hard-code a second number anywhere.
- **Google Ads** — add the conversion linker inside GTM; no code change.
- **Search Console** — verify via the GTM container or a DNS TXT record.
