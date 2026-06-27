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
    a: "The repository does not document a guaranteed one-click undo feature. Use the preview carefully and keep a backup before large move or rename operations.",
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
    a: `Contact support at ${site.supportEmail}. The repository does not contain a Foldora-specific refund guarantee, so purchase issues should be handled through support and the checkout provider.`,
  },
];
