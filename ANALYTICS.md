# Foldora acquisition and checkout analytics

Foldora uses the existing GA4 property `G-HZ5J8QN6FF`. The site has one GA4
initialization path per rendered page: React initializes GA4 on the homepage,
while generated SEO pages include the same measurement ID in their static HTML.
`checkout-tracking.js` does not load or configure GA4, so it does not add a
duplicate tag. GA4 and Tawk do not load until the visitor accepts optional
services.

## Consent and data handling

- Consent Mode v2 defaults `analytics_storage`, `ad_storage`, `ad_user_data`,
  `ad_personalization`, and `personalization_storage` to `denied` before any
  Google tag can load. Advertising consent remains denied even after optional
  analytics is accepted.
- The consent decision is stored as `foldora.optional-consent.v1` in
  `localStorage`. This preference is necessary to remember the visitor's choice
  and contains no identity or contact information.
- GA4 and the Tawk support widget use basic consent mode: they make no network
  request before acceptance. Global Privacy Control and Do Not Track force
  optional services off.
- Campaign labels are retained in `sessionStorage` only after acceptance. Before
  consent, they remain in memory long enough to add them to an outbound checkout
  link. Rejecting or withdrawing consent removes stored campaign attribution;
  checkout continues to work.
- The allow-list contains only campaign labels. It never reads names, email
  fields, file names, file contents, payment details, or license information.

## Events and attribution

- `page_view`: sent after analytics consent by the React router on
  client-rendered pages; static pages send the normal GA4 configuration page
  view after consent.
- `click`: GA4 Enhanced Measurement can send this for outbound links when the
  **Outbound clicks** option is enabled. It is a separate automatic event, not
  a duplicate `begin_checkout` event.
- `begin_checkout`: sent once after analytics consent when a marked Foldora
  Gumroad or PayPal checkout link is clicked. It includes price, currency,
  product item, product variant, checkout provider, button location,
  destination URL, and campaign labels. With no consent, the checkout opens but
  no GA4 event is sent.
- `purchase`: never sent by foldoraai.com. A purchase must come from Gumroad's
  native GA4 integration after Gumroad confirms payment.

After consent, the first valid campaign in a browser tab is saved in
`sessionStorage`. Only
`utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_term`, and
`utm_content` are allow-listed, each is limited to 100 characters, and values
that look like email addresses are rejected. Direct or internal navigation does
not replace a valid campaign. Storage is skipped before consent and when Global
Privacy Control or Do Not Track is enabled.

When no explicit UTM campaign exists, a delivered Google referrer is labeled
`google / organic`, a delivered ChatGPT referrer is labeled
`chatgpt.com / referral`, and another external website is labeled as a
referral. If no usable campaign/referrer exists, the checkout link keeps
`foldoraai.com / referral` so Gumroad can distinguish the Foldora website.

## One-time manual checks

### Google Analytics 4

1. Open **Admin → Data collection and modification → Data streams → Web → the
   foldoraai.com stream** and confirm the Measurement ID is `G-HZ5J8QN6FF`.
2. In that stream, open the **Enhanced measurement** settings and confirm
   **Outbound clicks** is enabled if you want GA4's separate automatic `click`
   event.
3. In **Admin → Data display → Custom definitions → Custom dimensions**, click
   **Create custom dimension** for each of the following. Set **Scope** to
   **Event** and use the exact event parameter as the dimension's parameter:
   `checkout_provider`, `checkout_location`, `campaign_source`,
   `campaign_medium`, `campaign_name`, `campaign_id`, `campaign_term`, and
   `campaign_content`. Do not register `destination_url`; its many possible
   values make it a high-cardinality dimension.
4. Open **Admin → Data display → Key events**. If `purchase` is not already
   listed, click **New key event**, enter `purchase`, and save. Do not treat
   `begin_checkout` as proof of payment.
5. In **Admin → Data collection and modification → Consent settings**, verify
   the web stream receives consent signals after an accepted test visit. The
   website code supplies these signals; no consent-management platform or paid
   service is required. Google says the status panel can take 48–72 hours to
   update; advertising-related consent remains denied intentionally.
6. For cross-domain continuity, open the web stream, select **Configure tag
   settings → Configure your domains**, and add conditions covering
   `foldoraai.com` and `gumroad.com`, then save. After accepting optional
   analytics, click a Gumroad button and confirm the destination still opens and
   contains Google's `_gl` linker parameter.

### Gumroad

1. In Gumroad, open **Settings → Third-party analytics**.
2. In **Google Analytics Property ID**, enter `G-HZ5J8QN6FF`, click **Update
   settings**, and do not add a second hand-written GA snippet. Gumroad documents
   native `view_item`, `add_to_cart`, and verified `purchase` events.
3. In Gumroad **Analytics → Links**, confirm that visits and sales appear for
   the UTM-tagged Foldora product URL. Gumroad documents a seven-day attribution
   window for its generated UTM links.
4. In GA4 **Reports → Realtime**, open the Gumroad product page without buying
   and verify `view_item`/`add_to_cart` as appropriate. A verified `purchase`
   cannot be tested without an actual completed order; use the next genuine sale
   rather than making a paid test purchase.

The direct PayPal checkout is not a Gumroad purchase, so Gumroad cannot confirm
it to GA4. This implementation records only its `begin_checkout`. Verified
PayPal purchases would require a separate server-side PayPal confirmation path;
the browser must not guess that a payment succeeded.

## Reading channel performance

In GA4 Explorations, create a funnel with `session_start` or `page_view`, then
`begin_checkout`, then `purchase`. Break it down by Session source / medium and
Session campaign. Use `checkout_provider` and `checkout_location` to see which
button/provider generated checkout intent. Compare those totals with Gumroad's
**Analytics → Links** UTM visits and sales.

Use aggregate campaign results rather than assuming that every website
`begin_checkout` can be joined to one Gumroad `purchase`: privacy controls,
blocked analytics, different browsers/devices, and Gumroad's checkout domain can
break person-level continuity.

## Safe test matrix

First reject optional services and verify that neither a request to
`googletagmanager.com` nor `embed.tawk.to` occurs and checkout still opens. Then
accept optional services and use GA4 Realtime or Tag Assistant/DebugView. Stop
before payment:

| Scenario | Test | Expected checkout attribution |
| --- | --- | --- |
| Direct | Open `/?debug_mode=true` in a new tab | `foldoraai.com / referral` |
| UTM | Open `/?utm_source=qa&utm_medium=test&utm_campaign=checkout_test&debug_mode=true` | `qa / test / checkout_test` |
| Google organic | Click the site from a real Google result | `google / organic / organic-search` when the referrer is delivered |
| ChatGPT referral | Click a Foldora link from ChatGPT | `chatgpt.com / referral / ai-assistant-referral` when the referrer is delivered |

For each scenario, click one Foldora purchase button and confirm exactly one
`begin_checkout`, the correct product/provider/location, and a working Gumroad
or PayPal destination. Do not complete a paid transaction merely to test this
site event. A real `purchase` can only be verified when Gumroad processes an
actual confirmed order.
