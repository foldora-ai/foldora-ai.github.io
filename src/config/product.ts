export const site = {
  name: "Foldora AI",
  productName: "Foldora",
  url: "https://foldoraai.com",
  supportEmail: "team.foldora@outlook.com",
  analyticsMeasurementId: "G-HZ5J8QN6FF",
};

export const product = {
  productName: "Foldora",
  price: {
    amount: 14.99,
    currency: "USD",
    display: "$14.99",
    referenceDisplay: "$49",
    label: "Early-adopter price",
    billing: "one-time purchase",
  },
  checkout: {
    cardUrl: "https://computora.gumroad.com/l/foldora",
    paypalUrl: "https://www.paypal.com/ncp/payment/YDYSDRF5NRCUW",
  },
  platforms: {
    supported: ["Windows 10", "Windows 11", "macOS"],
    positioning: "Windows and macOS desktop app",
    requirements: [
      "Windows 10 or Windows 11",
      "macOS on Intel or Apple Silicon",
      "Local folder access for the folders you choose",
      "Enough free disk space for moved or renamed files",
      "Internet access for purchase, download, license activation, periodic validation, and updates; file analysis runs locally",
    ],
  },
  claims: [
    "Analyzes supported files locally",
    "No cloud upload is required for organization workflows",
    "Preview proposed folders and filenames before applying changes",
    "Organize files by modified date (Year / Month)",
    "Organize files by type (Category / Extension)",
    "Organizes and renames files",
    "One-time purchase, not a subscription",
  ],
  folders: ["Downloads", "Desktop", "Documents", "screenshots", "PDFs", "invoices", "work files", "research files"],
  supportedFileTypes: {
    Documents: ["PDF", "DOCX", "TXT"],
    Spreadsheets: ["XLSX", "CSV"],
    Presentations: ["PPT", "PPTX"],
    Images: ["PNG", "JPG", "JPEG", "GIF", "WEBP"],
    Archives: ["ZIP"],
  },
};

export function checkoutUrl(source: string, content: string, medium = "referral"): string {
  const url = new URL(product.checkout.cardUrl);
  url.searchParams.set("utm_source", "foldoraai.com");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", source);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function paypalCheckoutUrl(source: string, content: string, medium = "referral"): string {
  const url = new URL(product.checkout.paypalUrl);
  url.searchParams.set("utm_source", "foldoraai.com");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", source);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function checkoutTrackingAttributes(
  provider: "gumroad" | "paypal",
  location: string,
  variant = "windows_macos",
) {
  return {
    "data-foldora-checkout": "true",
    "data-checkout-provider": provider,
    "data-checkout-location": location,
    "data-product-id": "foldora",
    "data-product-name": product.productName,
    "data-product-price": String(product.price.amount),
    "data-product-currency": product.price.currency,
    "data-product-variant": variant,
  } as const;
}

export function absoluteUrl(route = ""): string {
  return `${site.url}/${route ? `${route.replace(/^\/|\/$/g, "")}/` : ""}`;
}
