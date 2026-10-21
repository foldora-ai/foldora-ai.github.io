# SEO Content Map

Canonical host: `https://foldoraai.com`

## Indexable Pages

| Page | Target Intent | Canonical URL | Key Inbound Links | Key Outbound Links | Decision |
| --- | --- | --- | --- | --- | --- |
| Home | Foldora product and purchase intent | `https://foldoraai.com/` | Navigation, footer, static breadcrumbs | Product, guides, install, privacy, checkout | Index |
| AI File Organizer | AI file organizer for Windows (commercial software evaluation) | `/ai-file-organizer/` | Home, topic hubs, related guides | Windows, Downloads, Renaming, Offline | Index |
| Best File Organizer for Windows | best file organizer Windows | `/best-file-organizer-windows/` | Home guides, Windows hub, comparisons | File Juggler, Power Automate, Windows guide | Index |
| Clean Downloads Folder | automatically organize Downloads folder | `/clean-downloads-folder/` | Home guides, Downloads hub | Downloads guide, PDFs, renaming | Index |
| Organize Files Windows | how to organize files on Windows (informational workflow) | `/organize-files-windows/` | Home, Windows hub, related pages | AI organizer, Windows comparison, desktop guide | Index |
| Organize Files Mac | AI file organizer for Mac with preview | `/organize-files-mac/` | Home, AI organizer, automatic organization pages | AI organizer, offline AI, renaming, Hazel comparison | Index |
| Organize Files Automatically | organize many files automatically | `/organize-files-automatically/` | Related guides and broad automation pages | Renaming, Windows, manual comparison | Index |
| Rename Files Automatically | rename files automatically | `/rename-files-automatically/` | Home guides, AI organizer | PDF, screenshots, smart renaming feature | Index |
| Organize PDFs Automatically | organize PDFs automatically | `/blog/organize-pdfs-automatically/` | Home guides, Downloads hub | Research, invoices, supported types | Index |
| Organize Invoices Automatically | organize invoices automatically | `/blog/organize-invoices-automatically/` | Productivity hub, accountant use case | Privacy, renaming, support docs | Index |
| Organize Screenshots Automatically | rename and sort screenshots | `/blog/organize-screenshots-automatically/` | Productivity hub, desktop guide | Renaming, clean desktop | Index |
| Organize Downloads Folder Automatically | downloads workflow | `/blog/organize-downloads-folder-automatically/` | Downloads hub | Clean Downloads, downloads feature | Index |
| Offline AI File Organizer | offline AI file organizer for Windows and Mac | `/blog/offline-ai-file-organizer/` | Privacy hub, home guides, AI organizer | Privacy docs, AI organizer, Mac organizer | Index |
| Desktop File Management | desktop file organization | `/blog/desktop-file-management/` | Productivity hub | Clean desktop, Windows guide | Index |
| Clean Desktop Clutter | clean desktop clutter | `/blog/clean-desktop-clutter/` | Windows/productivity hubs | Screenshots, Windows guide | Index |
| Digital File Minimalism | reduce file clutter | `/blog/digital-file-minimalism/` | Productivity hub | Downloads, automatic organization | Index |
| Research Documents | organize research documents | `/blog/organize-research-documents/` | Research use case, productivity hub | PDFs, offline processing | Index |
| Students Use Case | student file organization | `/use-cases/students/` | Productivity hub | PDFs, research, downloads | Index |
| Freelancers Use Case | freelancer file organization | `/use-cases/freelancers/` | Productivity hub | Invoices, work files, privacy | Index |
| Researchers Use Case | research file organization | `/use-cases/researchers/` | Productivity hub | Research guide, PDFs, offline | Index |
| Accountants Use Case | accountant file organization | `/use-cases/accountants/` | Privacy/productivity hubs | Invoices, privacy, renaming | Index |
| Foldora vs Hazel | Hazel alternative for Mac: AI suggestions or rules | `/alternatives/hazel/` | Home guides, comparison pages, Mac organizer | Mac organizer, File Juggler, Windows comparison | Index |
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
- Use `marketing/ai-visibility-monitoring.md` and its observation TSV for a repeatable mention-and-citation check; do not treat a single assistant answer as a ranking.

## GSC Optimization Log

| Date | Primary Query | Page | Baseline | Change |
| --- | --- | --- | --- | --- |
| 2026-10-21 | `ai file organizer for windows` | `/ai-file-organizer/` | 2 clicks, 203 impressions, 0.99% CTR, position 21.49 (three-month query export) | Strengthened the title and description for software-selection intent, clarified product fit and limitations, added Windows compatibility guidance, and linked the informational Windows workflow. |

A query-filtered Search Console Pages report subsequently verified that `/ai-file-organizer/` received 2 clicks and 55 impressions for `ai file organizer for windows` over the same three-month period. The homepage received 100 impressions, `/best-file-organizer-windows/` received 55, and `/organize-files-windows/` received 1. This verifies `/ai-file-organizer/` as a ranking URL and the intended commercial landing page, though it is not the only URL Google surfaced for the query.

The intents remain deliberately distinct: the homepage handles Foldora product navigation and conversion, `/ai-file-organizer/` evaluates the specific Windows AI organizer, `/best-file-organizer-windows/` compares organizer approaches and alternatives, and `/organize-files-windows/` serves an informational how-to workflow. The local source CSV files remain ignored and untracked.

## Organic Opportunity Audit — 2026-10-21

The following clusters use the three-month `Queries.csv` export. Closely related queries were grouped without overlap; average position is impression-weighted. Branded Foldora queries and obvious brand misspellings were excluded.

| Rank | Non-branded cluster | Clicks | Impressions | CTR | Avg. position | Best existing page | Commercial assessment |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| 1 | Windows / best file organizer software | 2 | 588 | 0.34% | 23.93 | `/best-file-organizer-windows/` | Strong software-selection intent and the best combination of qualified demand and an established landing page. |
| 2 | Core AI file organizer | 6 | 834 | 0.72% | 32.62 | `/ai-file-organizer/` | Largest qualified cluster, but its landing page was optimized on 2026-10-21 and should be observed before another edit. |
| 3 | Automatic file organizer | 0 | 148 | 0% | 36.08 | `/organize-files-automatically/` | Product interest, but some searchers expect unattended folder monitoring rather than Foldora's review-first workflow. |
| 4 | AI desktop sorter | 0 | 108 | 0% | 21.73 | `/blog/desktop-file-management/` | Clear cleanup pain and relatively attainable positions; current page is more informational than commercial. |
| 5 | AI document organizer | 0 | 162 | 0% | 40.07 | `/ai-file-organizer/` | Relevant for supported documents, but broad “document organizer” results can also mean search, records, or enterprise DMS software. |
| 6 | File Juggler comparison | 0 | 68 | 0% | 18.29 | `/alternatives/file-juggler/` | High buying intent from users comparing or replacing a known Windows product. |
| 7 | Offline / local / private file organizer | 0 | 39 | 0% | 15.62 | `/blog/offline-ai-file-organizer/` | Strong product fit and close-to-page-one positions, but less observed query demand. |
| 8 | AI file and folder naming | 0 | 77 | 0% | 29.24 | `/rename-files-automatically/` | Qualified renaming need; the current ranking connection is unverified because the export has no query-page join. |
| 9 | Mac file organizer | 0 | 27 | 0% | 25.67 | `/organize-files-mac/` | Relevant paid-software intent, with a crowded set of native Mac alternatives. |
| 10 | Real-estate file organization | 0 | 6 | 0% | 21.17 | `/use-cases/real-estate-agents/` | Very small verified demand, but unusually specific professional intent. |

### SERP and competitor evidence for the top five

- **Windows / best file organizer software:** current results include vendor comparison guides that expose pricing, platforms, free-plan or trial limits, folder-watching behavior, and setup steps. File Juggler also demonstrates rules with product screenshots. Foldora's comparison page had a useful shortlist but no on-page product demonstration or prominent price-and-limit summary.
- **Core AI file organizer:** competing product pages show real interfaces, a step-by-step workflow, supported file examples, hardware or model requirements, pricing, trial/refund terms, and undo behavior. Foldora's dedicated AI page now covers its verified workflow and demo, so another immediate rewrite would make the latest change harder to evaluate.
- **Automatic file organizer:** competing products emphasize “set and forget” monitoring, activity history, undo, free trials, and explicit lifetime pricing. This is verified product demand, but Foldora should state its selected-folder, review-first limitation rather than imply continuous monitoring.
- **AI desktop sorter:** search results mix focused desktop/download cleanup products with broader file managers. Competitors demonstrate an inbox-to-AI-to-folder flow and show the interface. Foldora has a relevant informational desktop guide, but the export does not verify which URL ranks for this query.
- **AI document organizer:** competitors explain exactly which document formats they read, show before/after examples, publish system requirements, and distinguish content-aware organization from extension sorting. Intent is ambiguous because some searchers want document search or enterprise records management, which Foldora does not provide.

SERP observations are qualitative and location-dependent; they are not search-volume estimates or proof of stable result order. Verified demand comes only from the Search Console export. Except for the previously filtered Windows-AI query, the available exports do not join queries to landing pages, so “best existing page” is an intent map rather than a verified ranking URL.

### Selected experiment

| Date | Target cluster | Page | Baseline | Local change | Measurement plan |
| --- | --- | --- | --- | --- | --- |
| 2026-10-21 | Windows / best file organizer software | `/best-file-organizer-windows/` | Page: 3 clicks, 1,078 impressions, 0.28% CTR, position 24.26. Cluster: 2 clicks, 588 impressions, 0.34% CTR, position 23.93. | Sharpened the title and description for software-comparison intent; added a real video and screenshot, the verified $14.99 one-time price, supported Windows versions, workflow, best fit, and an explicit watched-folder limitation. | After deployment, annotate the date and compare 28-day query and page results only after Google recrawls the page. Watch CTR and position separately; do not attribute changes before indexing. |

Next experiment: if this page gains impressions but CTR remains weak after recrawl, test a title focused on “AI vs rules” while keeping the body stable. If the page does not gain position, improve the comparison depth with verified first-party facts and dated outbound citations rather than adding another overlapping Windows page.
