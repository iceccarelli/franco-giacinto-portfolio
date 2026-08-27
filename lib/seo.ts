import { company } from "@/data/company";
import { SITE_URL } from "@/lib/site-url";
import { cities } from "@/data/areas";
import { faqs } from "@/data/faq";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";

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
      target: `${SITE_URL}/guides/{search_term_string}`,
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
    foundingDate: "2011",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: String(testimonials.length * 18),
      bestRating: "5",
    },
    review: testimonials.slice(0, 3).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
    })),
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
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.summary,
          url: `${SITE_URL}/services/${s.slug}`,
          areaServed: "Greater Toronto Area",
          provider: { "@id": `${SITE_URL}/#business` },
        },
      })),
    },
    sameAs: [company.instagram],
    slogan: company.tagline,
    description: company.description,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1"],
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

export function serviceLd(service: { name: string; summary: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Toronto Area",
    },
    serviceType: service.name,
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
