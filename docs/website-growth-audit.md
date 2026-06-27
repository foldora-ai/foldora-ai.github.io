# Foldora AI Website Growth Audit

Audit date: 2026-06-27

## Initial Findings

### Conversion Problems
- Homepage hero did not clearly answer what Foldora organizes, how privacy works, whether purchase is one-time, or which OS is verified.
- Homepage showed both Windows and macOS download CTAs, while SEO pages described Foldora as Windows-focused.
- Pricing used unverified urgency and discount copy (`$49`, launch price, price increasing soon).
- Testimonials and ROI claims appeared in source; testimonial authenticity should be verified before using them as proof.
- Purchase readiness was thin: unclear buyer deliverables, install expectations, system requirements, support path, and refund/purchase-support handling.
- CTA labels were generic in several places (`Download`) instead of platform and action specific.

### SEO / Indexing Problems
- Static generation existed, but React-hydrated pages had weaker content than generated HTML.
- Root `index.html` SoftwareApplication schema claimed macOS support without verified repository evidence.
- Documentation/category generated pages lacked complete OG/Twitter metadata before this work.
- Feature pages were thin and correctly noindexed by the generator, but this was not documented.
- Legacy pages used static meta-refresh/canonical redirects because GitHub Pages cannot emit server-side 301s.

### Technical Problems
- Product facts, price, checkout URLs, platform support, and system requirements were hardcoded across components.
- Analytics calls were hardcoded in static templates and absent from React funnel actions.
- Vite produced one oversized JS chunk before code splitting.
- `npm run lint` had existing errors in UI helper components and Tailwind config.
- Local sandbox blocks Node commands unless run unsandboxed because Node resolves `C:\Users\user`.

### Accessibility Problems
- Some CTA/focus states were inconsistent.
- Mobile navigation was sparse and did not expose key buying pages clearly.
- Motion did not globally respect `prefers-reduced-motion`.
- Demo video autoplay/preload behavior was heavier than needed.

### Mobile Usability Problems
- Hero CTAs competed with each other and included unverified macOS download messaging.
- Large rounded/cards-heavy sections made scanning harder.
- Pricing and FAQ were too far from trust/buying answers.

### Broken Or Suspicious Links
- Checkout links appeared in several components as raw Gumroad URLs.
- PayPal link existed and was preserved.
- README pointed at a GitHub-hosted demo asset and claimed macOS support.
- Legacy routes exist: `/blog/rename-files-automatically/`, `/blog/ai-file-organizer-for-windows/`, `/blog/organize-work-files/`, `/alternatives/dropit/`, `/organize-files-mac/`.

### Duplicate / Thin / Low-Value Content Risks
- Feature pages are thin compared with canonical landing pages, so they remain `noindex,follow`.
- The generated content footprint is controlled at 23 SEO pages, 8 support pages, and 4 topic hubs.
- `/organize-files-mac/` is a redirect/canonical consolidation target because macOS support is not verified.

### Platform-Claim Inconsistencies
- Source of truth now says supported systems are Windows 10, Windows 11, and macOS.
- macOS support was restored after product-owner confirmation.
- Hazel comparison still mentions macOS because Hazel is a macOS product, not because Foldora supports macOS.

### Tracking Gaps
- No central analytics utility existed.
- Funnel actions such as CTA click, checkout click, pricing viewed, demo reached, support click, docs viewed, and 404 were not centrally tracked.

## Fixes Implemented

- Added `src/config/product.ts` as the source of truth for price, checkout links, supported OS, requirements, support email, claims, and file types.
- Rebuilt the homepage hero around verified claims: Windows support, local processing, preview, one-time purchase, and specific CTA wording.
- Added concrete before/after examples and use-case sections for Downloads, PDFs/invoices/documents, screenshots/photos, work folders, and research/study files.
- Replaced pricing with a purchase-readiness section: current price, buyer deliverables, supported systems, install expectations, checkout reassurance, support, and provider purchase-support link.
- Restored the ROI calculator and testimonial section at product-owner request; no review/rating schema was added.
- Added central analytics utility and privacy-conscious funnel events.
- Added homepage FAQ content and FAQ schema only for visible FAQs.
- Updated generated static pages to include manifest links, OG/Twitter metadata on support/category pages, FAQ schema, central checkout URLs, and verified platform claims.
- Added SPA redirects matching static redirect pages for legacy routes.
- Removed blocking Google Fonts import, reduced video preload, added reduced-motion CSS, and code-split routes/vendor chunks.
- Fixed lint errors in UI helper components and Tailwind config.

## Remaining Limitations

- GitHub Pages cannot issue true server-side 301 redirects. The repository uses canonical URLs, noindex meta-refresh redirect pages, and client-side redirects as the strongest feasible alternative.
- Keep `src/config/product.ts` updated if platform-specific download links or requirements differ between Windows and macOS.
- No product-specific refund policy was found. The site links to purchase-provider support and Foldora support instead of inventing a guarantee.
- No external checkout validation was performed because network access is restricted; existing Gumroad and PayPal links were preserved.
- The demo MP4 is 763 KB. It is now metadata-preloaded and poster-protected, but a shorter optimized version would further improve LCP/bandwidth.

## Recommended Fixes By Expected Business Impact

1. Verify actual checkout contents, download artifacts, and refund policy; then update `src/config/product.ts`.
2. Add a real product screenshot or compressed demo poster as a public OG image.
3. Add a concise installation/support page screenshot sequence from the real app.
4. Create a verified changelog/release notes page if updates are meaningful to buyers.
5. Earn links from Windows productivity, privacy, research, and freelancer communities.
6. Add real customer proof only when it can be verified and attributed with permission.
7. Run Search Console after deployment and prune any pages with impressions but poor engagement.
8. Compress or replace the MP4 with a shorter WebM/MP4 pair.
9. Validate Core Web Vitals in production after GitHub Pages/CDN caching.
10. Consider a small Windows-focused comparison table near pricing after product facts are fully verified.
