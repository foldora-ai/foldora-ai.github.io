# Manual QA Checklist

## Desktop QA
- Open `/` and confirm the hero explains product, folders, privacy, one-time price, supported OS, and CTA within the first viewport.
- Confirm there is one visible H1 on the homepage.
- Confirm before/after folder examples do not overflow or overlap.
- Confirm navigation links reach Features, How It Works, Pricing, FAQ, Install, Privacy, and Support.
- Play the demo video and confirm the poster/aspect ratio prevents layout shift.
- Confirm pricing shows `$14.99` and no fake discount, urgency, rating, or testimonial.
- Confirm FAQ answers are visible and match homepage FAQ schema.

## Mobile QA
- Test 360px, 390px, 430px, and tablet widths.
- Confirm CTA buttons have at least 44px tap targets.
- Confirm hero before/after examples wrap cleanly with no horizontal scroll.
- Confirm pricing buttons and support links fit without clipping.
- Confirm FAQ cards, tables, and related-guide cards stack cleanly.
- Confirm reduced-motion mode does not rely on animations to reveal important content.

## Checkout / Download QA
- Homepage hero `Download for Windows` opens the preserved Gumroad checkout link with UTM parameters.
- Pricing `Buy with card` opens the preserved Gumroad checkout link with UTM parameters.
- Pricing `Pay with PayPal` opens `https://www.paypal.com/ncp/payment/YDYSDRF5NRCUW`.
- Footer `Download for Windows` opens the preserved Gumroad checkout link.
- Support email links open a mail client for `team.foldora@outlook.com`.
- Do not change price or checkout URLs unless product owner provides new verified links.

## SEO QA
- Validate `/sitemap.xml` includes canonical indexable pages only.
- Validate `/robots.txt` points to `https://foldoraai.com/sitemap.xml`.
- Inspect page source for unique title, description, canonical, OG, Twitter, favicon, and manifest tags.
- Validate JSON-LD for homepage SoftwareApplication, Organization, WebSite, FAQPage.
- Validate generated article/comparison pages include BreadcrumbList and visible FAQPage schema.
- Confirm no `AggregateRating`, fake review, or testimonial schema exists.
- Confirm `/organize-files-mac/` redirects/canonicalizes to `/organize-files-automatically/`.
- Confirm legacy GitHub Pages domain is not used as a canonical or internal link.

## Analytics QA
- With analytics allowed, confirm `page_view` fires on route changes.
- Click hero CTA and confirm `platform_download_cta_clicked` and `checkout_link_clicked`.
- Scroll to demo and confirm `demo_section_reached`.
- Click hero secondary demo CTA and confirm `demo_started`.
- Scroll to pricing and confirm `pricing_section_viewed`.
- Click card/PayPal checkout buttons and confirm `buy_button_clicked` plus `checkout_link_clicked`.
- Open `/docs/install/` and confirm `documentation_page_viewed`.
- Click support email and confirm `contact_support_clicked`.
- Visit a missing route and confirm `not_found_viewed`.
- Repeat with analytics blocked and confirm all links still work.
