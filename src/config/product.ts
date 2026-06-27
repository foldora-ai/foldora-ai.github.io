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
    billing: "one-time purchase",
  },
  checkout: {
    cardUrl: "https://foldora.gumroad.com/l/foldora",
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
      "Internet access for purchase, download, and updates; organization workflows run locally",
    ],
  },
  claims: [
    "Analyzes supported files locally",
    "No cloud upload is required for organization workflows",
    "Preview proposed folders and filenames before applying changes",
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
  refundPolicy: {
    label: "Gumroad purchase support",
    url: "https://gumroad.com/help/article/47-what-to-do-if-you-have-an-issue-with-a-purchase",
    note: "No product-specific refund policy was found in the repository.",
  },
};

export function checkoutUrl(source: string, content: string, medium = "organic"): string {
  const url = new URL(product.checkout.cardUrl);
  url.searchParams.set("utm_source", "foldoraai.com");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", source);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function absoluteUrl(route = ""): string {
  return `${site.url}/${route ? `${route.replace(/^\/|\/$/g, "")}/` : ""}`;
}
