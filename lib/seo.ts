import { company } from "@/data/company";
import { SITE_URL } from "@/lib/site-url";
import { cities } from "@/data/areas";
import { faqs } from "@/data/faq";
import { parsePriceBand, services } from "@/data/services";

/**
 * Trims a description to a length search engines will actually display, cutting
 * on a sentence or word boundary rather than mid-word. Applied wherever a
 * description is composed from data, so generated pages cannot drift past the
 * limit as content is edited.
 */
export function clampDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const window = clean.slice(0, max + 1);
  const sentenceEnd = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "));
  if (sentenceEnd > max * 0.6) return clean.slice(0, sentenceEnd + 1);

  const wordEnd = window.lastIndexOf(" ");
  return `${clean.slice(0, wordEnd > 0 ? wordEnd : max).replace(/[,;:—-]$/, "")}…`;
}

export function pageTitle(title?: string) {
  return title
    ? `${title} | Green Hardwood — Toronto & GTA`
    : "Green Hardwood | Hardwood Flooring, Stairs & Railings in Toronto & the GTA";
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: company.name,
    url: SITE_URL,
    inLanguage: "en-CA",
    publisher: { "@id": `${SITE_URL}/#business` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2"],
    },
    potentialAction: {
      "@type": "SearchAction",
      /**
       * This pointed at `/guides/{search_term_string}`. `/guides/[slug]` sets
       * `dynamicParams = false` and calls `notFound()`, so every expansion of
       * that template returned a 404 — a sitelinks searchbox that 404s is
       * worse than no searchbox. `/search` is the route that accepts `?q=`.
       * `tests/seo.test.ts` now asserts the target resolves to a real route.
       */
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function howToStairLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Convert carpeted stairs to hardwood in the Greater Toronto Area",
    description:
      "Green Hardwood replaces builder-grade carpet stairs with solid hardwood treads, matched risers, and a code-compliant railing.",
    totalTime: "P5D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "CAD", minValue: 5000, maxValue: 11000 },
    step: [
      {
        "@type": "HowToStep",
        name: "Measure rise, run, and moisture",
        text: "Site measure against Ontario Building Code. Inspect stringers before a firm quote.",
      },
      {
        "@type": "HowToStep",
        name: "Remove carpet and inspect structure",
        text: "Pull carpet and MDF nosings. Sister anything that flexes. Open sides get returned treads.",
      },
      {
        "@type": "HowToStep",
        name: "Install treads, risers, and nosings",
        text: "Solid oak, maple, or walnut in the same species and finish as the floor.",
      },
      {
        "@type": "HowToStep",
        name: "Through-bolt the railing",
        text: "Graspable handrail and newels into structure, then a written cure schedule.",
      },
    ],
  };
}

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "FlooringContractor"],
    "@id": `${SITE_URL}/#business`,
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og.jpg`,
      width: 1200,
      height: 630,
      caption:
        "Green Hardwood — hardwood flooring, stairs, and railings in the Greater Toronto Area",
    },
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon.svg`,
      caption: "Green Hardwood",
    },
    telephone: company.phone,
    email: company.email,
    priceRange: company.priceRange,
    /*
     * No foundingDate. data/company.ts deliberately carries no founding year —
     * `years: 15` is the only tenure figure — and a previous version asserted
     * foundingDate "2011" here, which is the incorporation year of the
     * unrelated, inactive federal "Green Hardwood Flooring Inc." the machine
     * surfaces explicitly disclaim. A founding year returns only if the owner
     * writes a sourced field into data/company.ts; derive it from that, never
     * from arithmetic on `years`. tests/llms-surface.test.ts enforces this.
     */
    founder: { "@id": `${SITE_URL}/about#franco` },
    employee: { "@id": `${SITE_URL}/about#franco` },
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.line1,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      postalCode: company.address.postal,
      addressCountry: company.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.geo.latitude,
      longitude: company.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${company.address.line1}, ${company.address.city} ${company.address.region}`,
    )}`,
    areaServed: cities.map((c) => ({
      "@type": "City",
      name: c.name,
      containedInPlace: { "@type": "AdministrativeArea", name: "Ontario" },
    })),
    openingHoursSpecification: company.hours
      .filter((h) => h.open && h.close)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      })),
    /**
     * No aggregateRating. No review nodes. Deliberately.
     *
     * This block used to emit ratingValue "4.9" — a number with no source —
     * and reviewCount `testimonials.length * 18`, which is a multiplication,
     * not a count. It shipped on all 358 pages.
     *
     * Google's review-snippet policy requires ratings to come from real,
     * collected reviews, and self-serving reviews marked up on the business's
     * own site are disallowed for LocalBusiness outright. The penalty is not
     * losing the stars: a manual action strips EVERY rich result from the
     * domain — the HowTo, the FAQ, the QAPage, the AggregateOffer on 224 city
     * pages. Fabricating one number risks all of it.
     *
     * The testimonials still render on the page as ordinary copy. They are
     * simply not asserted to a search engine as verified review data.
     *
     * To turn this back on: collect real reviews on Google Business Profile,
     * then set `company.reviews` in data/company.ts to the real count and
     * average, and `reviewsLd()` below will emit them. tests/seo.test.ts fails
     * if a rating ever appears without that source.
     */
    ...reviewsLd(),
    knowsAbout: [
      "Hardwood floor installation",
      "Hardwood stairs",
      "Hardwood railings",
      "Dust-free sanding",
      "Hardwood refinishing",
      "Hardwood repairs",
      "Hardwood decks",
      "Ontario Building Code stairs",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hardwood services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        ...(offersFromBand(s.priceFrom, `${SITE_URL}/services/${s.slug}`).offers
          ? {
              priceCurrency: "CAD",
              priceSpecification: (
                offersFromBand(s.priceFrom, `${SITE_URL}/services/${s.slug}`) as {
                  offers: { lowPrice: string; highPrice?: string };
                }
              ).offers,
            }
          : {}),
        itemOffered: {
          "@id": `${SITE_URL}/services/${s.slug}#service`,
          "@type": "Service",
          name: s.name,
          description: s.summary,
          url: `${SITE_URL}/services/${s.slug}`,
          areaServed: "Greater Toronto Area",
          provider: { "@id": `${SITE_URL}/#business` },
        },
      })),
    },
    sameAs: company.sameAs,
    /**
     * `additionalType` points the entity at an external vocabulary so an
     * assistant resolving "hardwood flooring contractor in Toronto" can match
     * this business to the concept rather than to a string. It is the cheapest
     * entity-disambiguation signal available and almost nobody in the trades
     * emits it.
     */
    additionalType: [
      "https://www.wikidata.org/wiki/Q1195942",
      "https://en.wikipedia.org/wiki/Wood_flooring",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: company.phone,
        email: company.email,
        contactType: "sales",
        areaServed: "CA-ON",
        availableLanguage: ["en"],
        hoursAvailable: company.hours
          .filter((h) => h.open && h.close)
          .map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.day,
            opens: h.open,
            closes: h.close,
          })),
      },
    ],
    paymentAccepted: company.paymentAccepted.join(", "),
    currenciesAccepted: "CAD",
    slogan: company.tagline,
    description: company.description,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1"],
    },
  };
}

/**
 * Review markup, emitted only when there is something real behind it.
 *
 * `company.reviews` is null until reviews are actually collected on a platform
 * that can corroborate them. While it is null this returns `{}` and the
 * LocalBusiness node carries no rating at all — which is the honest state, and
 * costs nothing except stars the site had not earned.
 *
 * Once it is populated, the numbers here are the numbers on the profile named
 * in `company.reviews.source`. They are never derived, never rounded up, and
 * never computed from the testimonial array.
 */
export function reviewsLd(): Record<string, unknown> {
  const r = company.reviews;
  if (!r) return {};
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(r.ratingValue),
      reviewCount: String(r.reviewCount),
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function faqLd(items: { q: string; a: string }[] = [...faqs]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function serviceLd(service: {
  name: string;
  summary: string;
  slug: string;
  priceFrom?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${service.slug}#service`,
    name: service.name,
    description: service.summary,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Toronto Area",
    },
    serviceType: service.name,
    /**
     * Structured pricing existed on the 224 service x city pages and on none
     * of the eight canonical service pages — the pages most likely to be the
     * one an assistant cites when comparing contractors. Price is among the
     * first facts extracted in that comparison, so leaving it unstructured
     * here meant competing on prose against competitors publishing numbers.
     *
     * The band is parsed from `priceFrom` in data/services.ts, so it cannot
     * drift from what the page displays. Services quoted per project have no
     * parseable band and correctly emit no offer rather than a fake one.
     */
    ...offersFromBand(service.priceFrom, `${SITE_URL}/services/${service.slug}`),
  };
}

/** An AggregateOffer, or nothing. Range parsing lives in data/services.ts. */
export function offersFromBand(band: string | undefined, url: string): Record<string, unknown> {
  const parsed = parsePriceBand(band);
  if (!parsed) return {};
  return {
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: String(parsed.low),
      highPrice: String(parsed.high),
      offerCount: 1,
      availability: "https://schema.org/InStock",
      url,
      description: parsed.unit ? `${band} (per ${parsed.unit}, before HST)` : String(band),
    },
  };
}

/* ---------------------------------------------------------------------------
   Entity and page-level graph nodes.

   Search and answer engines resolve a business by cross-referencing entities,
   not by reading marketing copy. Every node below is addressable by @id so the
   graph is connected rather than a pile of disconnected snippets.
--------------------------------------------------------------------------- */

export function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/about#franco`,
    name: company.founderFull,
    alternateName: company.founder,
    jobTitle: company.founderTitle,
    description: `Master hardwood craftsman and founder of ${company.name}. ${company.years}+ years installing, sanding, finishing, and rebuilding hardwood floors, stairs, and railings across Toronto and the Greater Toronto Area.`,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/franco-giacinto-oller-grimaldi.jpg`,
      width: 800,
      height: 1000,
      caption: `${company.founderFull}, ${company.founderTitle} at ${company.name}`,
    },
    worksFor: { "@id": `${SITE_URL}/#business` },
    founderOf: { "@id": `${SITE_URL}/#business` },
    knowsAbout: [
      "Hardwood floor installation",
      "Custom hardwood stairs",
      "Hardwood railings and handrails",
      "Dust-contained sanding",
      "Hardwood finishing and refinishing",
      "Ontario Building Code Part 9 stairs",
      "NWFA installation guidelines",
      "Wood moisture and acclimation",
    ],
    hasCredential: company.licensed.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c,
    })),
    areaServed: company.areaServed,
    url: `${SITE_URL}/about`,
  };
}

export function webPageLd(page: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  primaryImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": page.type ?? "WebPage",
    "@id": `${SITE_URL}${page.path}#webpage`,
    url: `${SITE_URL}${page.path}`,
    name: page.name,
    description: page.description,
    inLanguage: "en-CA",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#business` },
    provider: { "@id": `${SITE_URL}/#business` },
    ...(page.primaryImage
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: `${SITE_URL}${page.primaryImage}`,
          },
        }
      : {}),
  };
}

export function videoObjectLd() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Custom white oak staircase, Greater Toronto Area",
    description:
      "A Green Hardwood box stair in white oak with iron balusters and a graspable oak handrail, matched to the adjacent hardwood floor.",
    thumbnailUrl: [`${SITE_URL}/images/stair-studio.jpg`],
    contentUrl: `${SITE_URL}/videos/stairs-hero.mp4`,
    uploadDate: "2026-01-15T09:00:00-05:00",
    duration: "PT8S",
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}

export function itemListLd(
  items: { name: string; path: string; description?: string }[],
  name: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
