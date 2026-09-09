import { product, site } from "@/config/product";

export const homepageFaqs = [
  {
    q: "Does Foldora upload my files?",
    a: "No. Foldora's organization workflow analyzes supported files locally on your computer instead of uploading them to a cloud organizer.",
  },
  {
    q: "Can I preview changes before files move?",
    a: "Yes. Foldora is built around a review step so you can inspect proposed folders and filenames before applying changes.",
  },
  {
    q: "Can I undo changes?",
    a: "Foldora emphasizes preview before applying changes. Keep a current backup before large move or rename operations; the current product page does not advertise a guaranteed one-click undo workflow.",
  },
  {
    q: "Does it require a subscription?",
    a: `No. Foldora is sold as a ${product.price.billing} for ${product.price.display}.`,
  },
  {
    q: "Which operating systems are supported?",
    a: `Foldora supports ${product.platforms.supported.join(", ")}.`,
  },
  {
    q: "Which languages does Foldora currently support?",
    a: "The current release uses an English interface and generates English folder and category labels. Files with names in other languages may be scanned, but localized organization output is not currently guaranteed.",
  },
  {
    q: "What kinds of files can it organize?",
    a: "Foldora is positioned for messy folders containing PDFs, documents, spreadsheets, presentations, screenshots, images, archives, installers, invoices, work files, and research files.",
  },
  {
    q: "Does it work without internet?",
    a: "Organization workflows are described as local and offline. Internet access is still needed for purchase, download, and any update flow.",
  },
  {
    q: "How do I install it?",
    a: "Buy or download Foldora from the official checkout link, run the Windows installer, choose a focused folder such as Downloads, then review the proposed result before applying changes.",
  },
  {
    q: "What happens if it does not work on my device?",
    a: `Check the installation and troubleshooting pages, then contact ${site.supportEmail} with your operating-system version, downloaded filename, and exact error message. Purchase issues are handled through support and the checkout provider.`,
  },
];
