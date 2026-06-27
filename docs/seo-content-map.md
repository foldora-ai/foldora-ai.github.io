# SEO Content Map

Canonical host: `https://foldoraai.com`

## Indexable Pages

| Page | Target Intent | Canonical URL | Key Inbound Links | Key Outbound Links | Decision |
| --- | --- | --- | --- | --- | --- |
| Home | AI file organizer purchase intent | `https://foldoraai.com/` | Navigation, footer, static breadcrumbs | Product, guides, install, privacy, checkout | Index |
| AI File Organizer | AI file organizer | `/ai-file-organizer/` | Home, topic hubs, related guides | Windows, Downloads, Renaming, Offline | Index |
| Best File Organizer for Windows | best file organizer Windows | `/best-file-organizer-windows/` | Home guides, Windows hub, comparisons | File Juggler, Power Automate, Windows guide | Index |
| Clean Downloads Folder | automatically organize Downloads folder | `/clean-downloads-folder/` | Home guides, Downloads hub | Downloads guide, PDFs, renaming | Index |
| Organize Files Windows | file organizer for Windows | `/organize-files-windows/` | Home, Windows hub, related pages | AI organizer, Windows comparison, desktop guide | Index |
| Organize Files Mac | file organizer for macOS | `/organize-files-mac/` | Home, AI organizer, automatic organization pages | AI organizer, offline AI, renaming | Index |
| Organize Files Automatically | organize many files automatically | `/organize-files-automatically/` | Related guides and broad automation pages | Renaming, Windows, manual comparison | Index |
| Rename Files Automatically | rename files automatically | `/rename-files-automatically/` | Home guides, AI organizer | PDF, screenshots, smart renaming feature | Index |
| Organize PDFs Automatically | organize PDFs automatically | `/blog/organize-pdfs-automatically/` | Home guides, Downloads hub | Research, invoices, supported types | Index |
| Organize Invoices Automatically | organize invoices automatically | `/blog/organize-invoices-automatically/` | Productivity hub, accountant use case | Privacy, renaming, support docs | Index |
| Organize Screenshots Automatically | rename and sort screenshots | `/blog/organize-screenshots-automatically/` | Productivity hub, desktop guide | Renaming, clean desktop | Index |
| Organize Downloads Folder Automatically | downloads workflow | `/blog/organize-downloads-folder-automatically/` | Downloads hub | Clean Downloads, downloads feature | Index |
| Offline AI File Organizer | offline/local file organizer | `/blog/offline-ai-file-organizer/` | Privacy hub, home guides | Privacy docs, AI organizer | Index |
| Desktop File Management | desktop file organization | `/blog/desktop-file-management/` | Productivity hub | Clean desktop, Windows guide | Index |
| Clean Desktop Clutter | clean desktop clutter | `/blog/clean-desktop-clutter/` | Windows/productivity hubs | Screenshots, Windows guide | Index |
| Digital File Minimalism | reduce file clutter | `/blog/digital-file-minimalism/` | Productivity hub | Downloads, automatic organization | Index |
| Research Documents | organize research documents | `/blog/organize-research-documents/` | Research use case, productivity hub | PDFs, offline processing | Index |
| Students Use Case | student file organization | `/use-cases/students/` | Productivity hub | PDFs, research, downloads | Index |
| Freelancers Use Case | freelancer file organization | `/use-cases/freelancers/` | Productivity hub | Invoices, work files, privacy | Index |
| Researchers Use Case | research file organization | `/use-cases/researchers/` | Productivity hub | Research guide, PDFs, offline | Index |
| Accountants Use Case | accountant file organization | `/use-cases/accountants/` | Privacy/productivity hubs | Invoices, privacy, renaming | Index |
| Foldora vs Hazel | Foldora vs Hazel | `/alternatives/hazel/` | Home guides, comparison pages | File Juggler, Windows comparison | Index |
| Foldora vs File Juggler | Foldora vs File Juggler | `/alternatives/file-juggler/` | Home guides, comparison pages | Windows comparison, Hazel | Index |
| Foldora vs Power Automate | Foldora vs Power Automate | `/alternatives/power-automate/` | Windows comparison | File Juggler, manual organization | Index |
| Foldora vs Manual Organization | automatic vs manual file organization | `/alternatives/manual-organization/` | Related guides | Automatic organization, AI organizer | Index |
| Install Docs | install Foldora | `/docs/install/` | Footer, pricing, 404 | Privacy, troubleshooting, checkout | Index |
| Privacy Docs | local AI privacy | `/docs/privacy/` | Footer, pricing, generated pages | Install, offline AI, support | Index |
| Troubleshooting Docs | Foldora support | `/docs/troubleshooting/` | Footer, install docs | Support email, install docs | Index |
| How It Works Docs | how Foldora works | `/docs/how-it-works/` | Footer/docs | Privacy, supported file types | Index |
| Supported File Types Docs | supported file types | `/docs/supported-file-types/` | Feature/doc links | How it works, privacy | Index |
| Downloads Hub | downloads topic | `/category/downloads/` | Home/footer guides | Downloads/PDF pages | Index |
| Productivity Hub | productivity topic | `/category/productivity/` | Home/guides | Broad guide list | Index |
| Windows Hub | Windows file organization topic | `/category/windows/` | Windows pages | Windows/comparison pages | Index |
| Privacy Hub | offline AI privacy topic | `/category/privacy/` | Privacy/offline pages | Offline AI, privacy docs | Index |

## Noindex / Canonical / Redirect Pages

| Page | Target | Decision | Reason |
| --- | --- | --- | --- |
| `/features/offline-processing/` | `/blog/offline-ai-file-organizer/` | `noindex,follow` + canonical | Feature page is thinner than canonical guide. |
| `/features/smart-file-renaming/` | `/rename-files-automatically/` | `noindex,follow` + canonical | Avoid duplicate renaming intent. |
| `/features/downloads-cleanup/` | `/clean-downloads-folder/` | `noindex,follow` + canonical | Avoid duplicate downloads intent. |
| `/blog/rename-files-automatically/` | `/rename-files-automatically/` | noindex meta-refresh redirect | Consolidates duplicate route. |
| `/blog/ai-file-organizer-for-windows/` | `/best-file-organizer-windows/` | noindex meta-refresh redirect | Consolidates old route. |
| `/blog/organize-work-files/` | `/blog/desktop-file-management/` | noindex meta-refresh redirect | Consolidates overlapping content. |
| `/alternatives/dropit/` | `/best-file-organizer-windows/` | noindex meta-refresh redirect | Avoids thin comparison footprint. |

## Notes

- `sitemap.xml` includes only canonical indexable pages.
- `robots.txt` allows crawling and points to the production sitemap.
- GitHub Pages cannot emit server-side 301 redirects, so redirect pages use canonical tags, `noindex,follow`, meta refresh, and client-side `Navigate` fallbacks.
- Search engines and users now see the same platform positioning: support is Windows 10, Windows 11, and macOS.
