import { absoluteUrl, product, site } from "@/config/product";

export interface FaqItem {
  q: string;
  a: string;
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: `${site.url}/`,
    sameAs: ["https://github.com/foldora-ai"],
    parentOrganization: {
      "@type": "Organization",
      "@id": "https://computoraai.com/#organization",
      name: "Computora AI",
      url: "https://computoraai.com/",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: site.supportEmail,
      contactType: "customer support",
    },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: `${site.url}/`,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en",
  };
}

export function softwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software`,
    name: product.productName ?? "Foldora",
    url: `${site.url}/`,
    applicationCategory: "FileManagementApplication",
    operatingSystem: product.platforms.supported.join(", "),
    image: `${site.url}/foldora-social-preview.png`,
    description:
      "Foldora organizes and renames messy folders with local AI and a preview step before changes are applied.",
    featureList: product.claims,
    offers: {
      "@type": "Offer",
      price: product.price.amount.toFixed(2),
      priceCurrency: product.price.currency,
      url: product.checkout.cardUrl,
      availability: "https://schema.org/InStock",
    },
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function homepagePageSchema() {
  return {
    "@type": "WebPage",
    "@id": `${site.url}/#webpage`,
    url: `${site.url}/`,
    name: "Foldora AI File Organizer for Windows and macOS | Offline & Private",
    description:
      "Foldora organizes, categorizes, and renames files with local AI. Clean Downloads, Desktop, PDFs, and work folders offline on Windows and macOS.",
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#software` },
    primaryImageOfPage: `${site.url}/foldora-social-preview.png`,
    inLanguage: "en",
  };
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; route?: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.route ?? ""),
    })),
  };
}

export function homepageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      homepagePageSchema(),
      softwareApplicationSchema(),
      faqSchema(faqs),
    ],
  };
}
