# Homepage content disappearance during route loading

Baseline: production output at `1ef2a17`. The homepage's initial HTML contained a
heading and usable checkout links. Once React mounted, `App.tsx` replaced that
content with an empty Suspense fallback until `pages/Index` and its dependencies
arrived. The resource timeline and DOM transitions showed both heading and
checkout links disappearing during that interval. The product landing page is
already static HTML and does not load this React route.

The fix retains the existing initial HTML as the fallback for its own pathname.
The completed React layout, page content, consent system, analytics, and checkout
destinations are unchanged. No additional network services or dependencies were added.

## Reproduction

Node 24 and installed Chrome are required. Set `CHROME_PATH` if Chrome is not at
the script's default Windows location. Serve a built `docs/` directory:

```sh
node scripts/measure-mobile.mjs /path/to/baseline/docs baseline.json 3
node scripts/measure-mobile.mjs docs after.json 3
```

Both measurements used Chrome 157.0.8103.38, a 390 x 844 viewport, 4x CPU
throttling, 150 ms latency, 200,000 bytes/s download, 75,000 bytes/s upload,
disabled browser cache, fresh origin storage, and a 12-second observation window.
The local HTTP server gzips HTML/CSS/JS. Three cold runs were made per page in
each condition. Optional services were not accepted; analytics/chat endpoints
were additionally blocked in the test browser.

## Results

Medians, seconds:

| Page | Heading/checkout absence during route load, before / after | FCP before / after | LCP before / after |
|---|---|---|---|
| `/` | 2.778 / 0 observed | 1.112 / 1.224 | 1.112 / 1.224 |
| `/ai-file-organizer/` | 0 / 0 observed | 1.188 / 1.664 | 1.228 / 1.664 |

Homepage gap durations before: 2.778, 3.700, 2.044 seconds; after: zero in all
three runs. Heading and checkout availability were sampled every 50 ms, so the
reported boundaries have sampling and main-thread scheduling uncertainty.

This is a content-continuity improvement, not a demonstrated paint-time or
JavaScript payload reduction. The unchanged product page's HTML and resource
bytes were identical, yet its paint timings varied too. This shared workstation
is not a dedicated performance machine. These are local lab measurements, not
field Core Web Vitals, Lighthouse scores, real-device INP, or CDN/TLS benchmarks.
LCP can also reflect the early static content rather than the final React hero.

## Validation

- Production build and 43-URL static audit passed.
- 26 focused tests passed, covering loading content, route scoping, consent,
  analytics, checkout tracking, and pricing anchors.
- Chrome checks at 390 and 1440 pixels found no horizontal overflow on either
  page. Screenshots confirmed the final design; homepage pricing navigation
  reached the pricing section and retained its payment links.
- The product landing page's initial HTML and consent/checkout scripts have no
  changes in this fix.
