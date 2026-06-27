# Analytics Events

Analytics is centralized in `src/lib/analytics.ts`. The site uses Google Analytics only through this utility and should continue to work if analytics is blocked.

Privacy rule: never send file names, file paths, file contents, user document metadata, or personal data from the Foldora app. Website events may include page path, CTA location, provider, platform, and price.

| Event | Trigger | Data Captured | Privacy Notes |
| --- | --- | --- | --- |
| `homepage_viewed` | React homepage mounts | `landing_page` | No user identity or file data. |
| `platform_download_cta_clicked` | Windows download CTA clicked | `platform`, `location` | Platform is marketing CTA context only. |
| `demo_section_reached` | Demo section enters viewport | None by default | Intersection event only. |
| `demo_started` | Hero demo/secondary CTA clicked | `location` | Does not track video progress or personal data. |
| `pricing_section_viewed` | Pricing section enters viewport | `price`, `currency` | Product price only. |
| `buy_button_clicked` | Card or PayPal buy button clicked | `provider`, `location` | Provider name only. |
| `checkout_link_clicked` | Any checkout/download link clicked | `provider`, `location` | No checkout personal data captured. |
| `documentation_page_viewed` | React docs page mounts | `page` | Page path only. |
| `contact_support_clicked` | Email/support CTA clicked | `location` | Does not capture email body or user email address. |
| `not_found_viewed` | React 404 page renders | `path` | Records missing URL path only. |

Static generated pages still include a minimal `gtag` snippet in `scripts/generate-static-pages.ts` for direct HTML visits. React funnel events should not be added directly to components with raw `gtag`; use `trackEvent`.
