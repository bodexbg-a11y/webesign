# ARKHAUS — modular homes landing page

A single-page, conversion-focused landing page for a modular / prefab home
manufacturer. Static HTML, CSS and vanilla JavaScript — no build step, no
framework, no runtime dependencies.

```
landing/
├─ index.html                 the whole page
├─ assets/
│  ├─ css/main.css            design tokens + every component
│  ├─ css/fonts.css           self-hosted @font-face rules (generated)
│  ├─ fonts/*.woff2           Instrument Serif · Inter Tight · JetBrains Mono
│  ├─ js/main.js              reveals, menu, accordion, form, parallax
│  ├─ js/lqip.js              blur-up placeholders (generated)
│  └─ img/
│     ├─ src/raw*.jpg         the original photographs — keep these
│     └─ *-{480,800,1280,1536}.{jpg,webp}   derived, generated
└─ scripts/
   ├─ build-images.py         regenerates every derived image + lqip.js
   └─ build-fonts.sh          re-downloads the self-hosted webfonts
```

## Run it locally

```bash
cd landing
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` straight from the filesystem also works, but a server is
closer to production (correct MIME types, relative paths, no CORS surprises).

## Before you point traffic at it

Everything below is **placeholder content written to demonstrate the layout**.
Replace it with your own before spending a cent on ads.

| What | Where | Note |
|---|---|---|
| Brand name "ARKHAUS" | throughout `index.html` | also the footer wordmark and `<title>` |
| Phone `+44 20 7946 0318` | header, FAQ, quote section, footer | this is Ofcom's reserved fiction range — it does not ring anywhere |
| Email `hello@arkhaus.build` | header menu, quote section, footer | domain is not registered |
| Prices ($34,900 / $52,400 / $78,600) | `#models`, comparison table, footer, form `<select>` | benchmarked against 2026 prefab market rates ($80–$220/ft²), but they are not your costs |
| Specs (areas, bedrooms, lead times, warranty) | `#models`, comparison table | invented to match the photographs |
| Stats (340 homes, 63-day median, 6.4% APR) | hero, value section, FAQ | invented |
| Testimonials (Marek D., Elena V., Tom & Sara R.) | testimonials section | invented — do not publish unverified reviews |
| Rental figures ($168/night, 61%, 3.4 yrs) | operators section | already labelled "worked example"; keep it labelled or delete it |
| Privacy notice link | quote form | points at `#` — wire it to a real page |
| Canonical URL & og:image | `<head>` | update when you have a domain |

## The lead form

`assets/js/main.js` validates on blur, shows errors next to each field,
announces them through an `aria-live` region, and on success stores the lead in
`localStorage` under `arkhaus.leads`. **There is no backend.**

To wire it up, replace the `window.setTimeout(...)` block at the end of the
submit handler (search for `No backend is wired up`) with your own request:

```js
fetch('https://your-crm.example/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(r => { if (!r.ok) throw new Error(r.status); card.classList.add('is-done'); })
  .catch(() => { /* show a retry message rather than the success panel */ });
```

The payload keys are the form `name` attributes: `name`, `email`, `phone`,
`model`, `land`, `timeline`, `location`, `note`, plus `submittedAt`.

Add analytics where the intent is: the `#quote` anchor clicks, the
`[data-model]` buttons, and the form's success branch.

## Photography

The source photographs in `assets/img/src/` were supplied for this build. The
forest exterior shot arrived with a supplier watermark across the bottom, which
`scripts/build-images.py` crops off before deriving the served sizes — check the
crop box there if you swap that file. Make sure you hold the rights to any image
you publish.

To change, add or re-crop an image: drop it in `assets/img/src/`, edit the `PLAN`
dictionary at the top of `scripts/build-images.py`, then

```bash
pip install Pillow
python3 scripts/build-images.py
```

That regenerates every `-480/-800/-1280/-1536` JPEG and WebP and rewrites
`assets/js/lqip.js` with fresh blur placeholders. Update the `srcset`, `sizes`,
`width`, `height` and `alt` in `index.html` to match.

## Design notes

- **Type** — Instrument Serif for display, Inter Tight for UI and body,
  JetBrains Mono for the technical labels. Self-hosted; run
  `scripts/build-fonts.sh` to refresh them.
- **Colour** — warm neutral surfaces (`--bone`, `--paper`) against a warm black
  (`--ink`), with a single burnt-amber accent (`--clay`) chosen to sit with the
  pine and charcoal in the photography. `--clay-text` and `--clay-light` are the
  contrast-safe variants for small text on light and dark surfaces.
- **Motion** — IntersectionObserver reveals with a 80–320ms stagger, a masked
  line reveal on the H1, easeOutExpo counters, and a scroll-linked parallax on
  the gallery. All of it collapses under `prefers-reduced-motion: reduce`, and
  the page renders complete with JavaScript disabled.
- **Accessibility** — skip link, single H1 with no level skips, labelled fields,
  errors tied to their inputs, a focus-trapped mobile menu that closes on
  Escape, 44px minimum touch targets, and 4.5:1 minimum text contrast
  (inline links inside prose excepted under WCAG 2.2 SC 2.5.8).
- **Weight** — ~590 KB above the fold, ~1.4 MB for the whole page with every
  image scrolled into view. WebP with a JPEG fallback via `<picture>`.
