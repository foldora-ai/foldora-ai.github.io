import { product, site } from "@/config/product";

export const docs = {
  install: {
    title: "How to Install Foldora",
    description:
      "Install Foldora on a supported desktop device and start with a small folder before organizing larger file collections.",
    sections: [
      {
        title: "Download Foldora",
        content: `Complete checkout through the official Foldora link, then download the installer provided by the checkout flow.`,
      },
      {
        title: "Run the installer",
        content: `The supported systems are ${product.platforms.supported.join(", ")}. Use the installer or download package provided by the checkout flow for your platform.`,
      },
      {
        title: "Choose a focused folder first",
        content: `Start with Downloads, Desktop, Documents, screenshots, PDFs, invoices, or a work folder small enough to review carefully.`,
      },
      {
        title: "Review before applying",
        content: `Foldora proposes folders and filenames for review. Apply changes only after the preview matches how you want to find files later.`,
      },
      {
        title: "Need help",
        content: `Contact ${site.supportEmail} for installation or purchase-support questions.`,
      },
    ],
  },

  privacy: {
    title: "Foldora Privacy",
    description:
      "Learn how Foldora's local organization workflow reduces cloud exposure for messy folders and sensitive files.",
    sections: [
      {
        title: "Organization runs locally",
        content: `Foldora is positioned around local analysis. Files do not need to be uploaded to a cloud organizer for the organization workflow.`,
      },
      {
        title: "Checkout is separate from file organization",
        content: `Internet access is needed for purchase, download, and updates. The checkout provider does not need your file names or file contents.`,
      },
      {
        title: "Preview is still important",
        content: `Privacy does not prevent filing mistakes. Review proposed folders and filenames before moving or renaming important documents.`,
      },
    ],
  },

  troubleshooting: {
    title: "Foldora Troubleshooting",
    description:
      "Fix common Foldora installation, folder access, preview, and checkout issues.",
    sections: [
      {
        title: "Folder permissions",
        content: `Make sure Foldora can access the folder you selected. Start with a focused folder instead of a full drive.`,
      },
      {
        title: "Large folders",
        content: `Large folders can take longer to analyze and are harder to review. Test with a smaller representative folder first.`,
      },
      {
        title: "Preview unexpected suggestions",
        content: `If suggestions do not match your workflow, do not apply them. Narrow the folder scope or organize a smaller batch.`,
      },
      {
        title: "Support",
        content: `For purchase or installation help, contact ${site.supportEmail}.`,
      },
    ],
  },

  "how-it-works": {
    title: "How Foldora Works",
    description:
      "Understand how Foldora analyzes local files, proposes folders and names, and keeps you in control with a preview step.",
    sections: [
      {
        title: "Select a folder",
        content: `Choose a messy folder such as Downloads, Desktop, Documents, screenshots, PDFs, invoices, work files, or research files.`,
      },
      {
        title: "Analyze locally",
        content: `Foldora analyzes filenames and supported file content locally to infer useful folders and clearer names.`,
      },
      {
        title: "Preview the plan",
        content: `Review proposed categories and filenames before files move or names change.`,
      },
      {
        title: "Apply approved changes",
        content: `Apply changes only after the result matches your retrieval workflow.`,
      },
    ],
  },

  "supported-file-types": {
    title: "Supported File Types",
    description:
      "See the file categories Foldora is positioned to organize and rename in messy local folders.",
    sections: Object.entries(product.supportedFileTypes).map(([title, types]) => ({
      title,
      content: `${types.join(", ")} files are included in the verified repository copy for supported file-type messaging.`,
    })),
  },
};
