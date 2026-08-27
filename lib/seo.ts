import { company } from "@/data/company";
import { cities } from "@/data/areas";
import { faqs } from "@/data/faq";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";

export function pageTitle(title?: string) {
  return title
    ? `${title} | Green Hardwood — Toronto & GTA`
    : "Green Hardwood | Hardwood Flooring, Stairs & Railings in Toronto & the GTA";
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: company.website,
    inLanguage: "en-CA",
    publisher: { "@id": `${company.website}/#business` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2"],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${company.website}/guides/{search_term_string}`,
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
    "@id": `${company.website}/#business`,
    name: company.name,
    legalName: company.legalName,
    url: company.website,
    image: `${company.website}/og.jpg`,
    logo: `${company.website}/favicon.svg`,
    telephone: company.phone,
    email: company.email,
    priceRange: company.priceRange,
    foundingDate: "2011",
    founder: {
      "@type": "Person",
      name: company.founderFull,
      jobTitle: company.founderTitle,
    },
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
          url: `${company.website}/services/${s.slug}`,
          areaServed: "Greater Toronto Area",
          provider: { "@id": `${company.website}/#business` },
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
      item: `${company.website}${item.path}`,
    })),
  };
}

export function serviceLd(service: { name: string; summary: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    url: `${company.website}/services/${service.slug}`,
    provider: { "@id": `${company.website}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Toronto Area",
    },
    serviceType: service.name,
  };
}
