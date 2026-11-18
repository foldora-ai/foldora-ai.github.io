# High-intent page review — 2026-11-18

## Changes and rationale

| Page | Change | Buyer question addressed |
| --- | --- | --- |
| `/ai-file-organizer/` | Replaced hypothetical before/after outcomes and prominent runtime figures with the observed two-file Windows test, its content-integrity check, and the recording's stopping point. Retained a link to the separate benchmark. Added a Mac delivery check beside the purchase action. | What does Foldora actually move? Can I inspect a plan? Is the recording a complete result? Can a Mac buyer safely use this checkout? |
| `/best-file-organizer-windows/` | Clarified that the existing recording stops during processing and points readers to the separate observed result on the product page. Kept the five-tool workflow comparison and its publisher disclosure. | Is this a reviewed batch tool, a continuous rules tool, or a demonstrated end-to-end recording? |
| `/` | Routed the Mac hero and initial-HTML links to installation and purchase guidance; kept Windows checkout prominent. Added a Mac guidance link beside pricing. | Does the current checkout deliver and license the Mac package? |

The existing Search Console workbook covers 2026-08-11 to 2026-11-10 and mostly predates the latest page changes. Its separate page aggregates report `/ai-file-organizer/` at 2,485 impressions and 21 clicks, and `/best-file-organizer-windows/` at 959 impressions and 3 clicks. It has no query-by-page table. These numbers justify monitoring buyer pages, not a claim that this copy will improve rankings or sales. The supplied GA4 report has no landing-page-by-source or named checkout/purchase events. Sales UTM fields are frequently blank, so organic conversion rates cannot be calculated from the available files.

## Measurement after publication

- **Day 14:** In Search Console, inspect each changed URL's Google Web impressions, clicks, CTR, and query-by-page pairs for relevant buyer searches such as local AI file organizer, Windows file organizer, preview-before-moving, and Foldora pricing. In GA4, inspect organic landing sessions and consented `begin_checkout` by landing page if available. Reconcile only explicitly tagged, nonrefunded Gumroad orders; do not infer purchases from clicks.
- **Day 28:** Repeat the same URL and query review over a non-overlapping post-publication window. Compare qualified checkout starts and confirmed Foldora orders with the first 14 days and a comparable prior window, noting seasonality, rank movement, missing consent, and blank UTMs. Investigate a specific page/query only if the signal persists.

No ranking, AI citation, checkout conversion, or sales lift has yet been measured. The working tree's generated assets differ broadly from the tracked deployment baseline, so the full `npm run deploy` would publish unrelated changes. The scoped deployment uses the three reviewed HTML pages in `docs/` plus their new hashed JavaScript bundles; other generated pages are excluded. The publication date and live result must be checked against the deployed URLs.
