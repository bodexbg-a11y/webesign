# Модулни къщи — сайт за българския пазар

A static, two-language (bg / en) site for selling modular homes in Bulgaria,
generated from JSON content files. No framework, no runtime dependencies, no
build toolchain beyond Node and Python.

**Status: the structure is finished, the facts are not.** No model name, area,
price, technical figure, warranty term, phone number or company detail has been
invented. Every one of them is a `null` in `content/` that renders as a visible
*уточнява се* marker, and `node build.mjs` prints the full list of what is still
missing on every build.

---

## Run it

```bash
pip install Pillow          # once, for the image pipeline
./scripts/serve.sh          # builds and serves http://localhost:8000
```

or

```bash
node build.mjs              # writes dist/
cd dist && python3 -m http.server 8000
```

`dist/` is the deployable output. Paths are root-relative (`/assets/…`,
`/bg/…`), so it must be served from a domain root, not a subfolder.

---

## What you edit

Everything a non-developer needs to change lives in three JSON files. Nothing
else has to be touched.

| File | Holds |
|---|---|
| `content/site.json` | Company, contacts, manufacturer, currency, warranty, form endpoint, analytics ids, the eight cost items and their statuses |
| `content/models.json` | The four models: names, areas, bedrooms, prices, packages, technical data, floor plans, which photos each uses |
| `content/copy.json` | All interface and page text, mirrored `bg` / `en` |

Generated, do not edit by hand: `content/images.json`, `assets/css/fonts.css`.

### Draft mode vs live mode

`site.json → buildMode`:

- **`"draft"`** (current) — every unfilled block is shown with the exact JSON key
  that fills it, so the site can be reviewed and handed over.
- **`"live"`** — blocks with no content are omitted entirely. A visitor never
  sees an empty "Реализирани проекти" heading or an internal field name.

**Switch to `"live"` before pointing traffic at the site.**

### What must be filled before advertising

Run `node build.mjs` and work through the printed list. The critical ones:

1. `site.contacts.phone` / `phoneDisplay` / `email` — a local Bulgarian number.
2. `site.company.legalName`, `eik`, `address` — required in the footer.
3. `site.forms.endpoint` — see below. **Without it no enquiry reaches you.**
4. `site.forms.responseTime` — only promise a time the company will keep.
5. Per model: `areas`, `bedrooms`, `bathrooms`, `sleeps`, `price.amount`,
   `price.packageName`, `price.vatIncluded`, `package[]`, `tech[]`, `plan`.
6. `site.costItems[].status` — each is set to a structurally sensible default
   and flagged `"confirm": true`. Check all eight against how the company
   actually sells before launch.
7. `site.warranty` and `site.manufacturer.name`.
8. Have a lawyer complete and review `poveritelnost` and `biskvitki`. Both pages
   carry a visible draft notice until then.

---

## The enquiry form

Two steps, exactly as briefed: step 1 is about the project, step 2 is contact
details. No document upload. The chosen model is preselected when the form is
opened from a model page, and what the visitor typed survives navigating to
another page and back (`sessionStorage`).

**It does not fake a submission.** With `site.forms.endpoint` still `null` the
form validates, keeps the answers and shows a panel saying plainly that the
enquiry was *not* sent, with the phone number. A visitor who believes they have
enquired will never call, which is worse than an obvious failure.

To connect it, set the endpoint to a URL that accepts `POST` with JSON:

```json
{
  "purpose": "Постоянно живеене",
  "model": "modul-s-mezanin",
  "location": "Банско",
  "land": "Да, имам",
  "budget": "30 000 – 60 000 €",
  "name": "…", "phone": "…", "email": "…",
  "channel": "Телефон", "contact_time": "Сутрин", "timeline": "До 3 месеца",
  "consent": "on",
  "locale": "bg",
  "source_page": "/bg/modeli/modul-s-mezanin/",
  "referrer": "…",
  "utm_source": "google", "utm_medium": "", "utm_campaign": "",
  "utm_content": "", "gclid": "…", "fbclid": "…",
  "submitted_at": "2026-09-11T06:12:00.000Z"
}
```

On a `2xx` the visitor is sent to the thank-you page (`/bg/blagodarim/`,
`/en/thank-you/`), which is `noindex` and is the page to use as the conversion
destination. On any other response the honest failure panel is shown instead —
the lead is never silently lost.

Verified end to end against a local endpoint: the model, the delivery town,
`utm_source`, `gclid` and `fbclid` all arrive with the payload.

## Measurement

Events pushed to `window.dataLayer`:

| Event | When |
|---|---|
| `quote_cta_click` | any "get a quote" link |
| `form_step_2` | step 1 passed validation |
| `generate_lead` | endpoint accepted the enquiry |
| `lead_submit_failed` | endpoint rejected it |
| `lead_submit_blocked` | no endpoint configured |
| `phone_click` | any `tel:` link, anywhere |
| `consent_update` | cookie choice made or restored |

Phone clicks and form submissions are separate events, as briefed. Put the ids
in `site.analytics` (`gtmId`, `ga4Id`, `metaPixelId`); **nothing loads until the
visitor accepts the matching cookie category.** The banner offers accept all /
necessary only / per-category settings, the choice is stored in `localStorage`,
and the footer "Настройки" link reopens it.

---

## Photographs

The originals supplied for this build are in `assets/img/src/` and are excluded
from `dist/`. The pipeline derives 480/800/1280/1600 JPEG and WebP variants plus
an inline blur placeholder:

```bash
python3 scripts/build-images.py
```

Edit the `PLAN` dictionary in that script to add, swap or re-crop an image. One
supplied photograph carried a supplier watermark; the crop box that removes it
is in `PLAN` under `forest-module`.

**Renders are labelled.** `models.json → renders` lists the images that are
visualisations rather than photographs of a delivered house; the site prints a
*ВИЗУАЛИЗАЦИЯ* badge on each. Keep that list accurate — it is the difference
between a credible site and a misleading one. Confirm you hold the rights to
every image before publishing.

**Floor plans are missing.** Each model page has the plan block, the zoom
button and the lightbox wired and waiting. Drop a file at
`assets/plans/<slug>.svg` (or a wide PNG) and set `models.json → <model> → plan`.
Until then the block shows what is missing rather than a fabricated drawing.

---

## Facts the site relies on

Two Bulgarian specifics are baked into the copy and were checked rather than
assumed:

- **Currency.** Bulgaria adopted the euro on 1 January 2026 at the irrevocable
  rate of 1 EUR = 1.95583 BGN. Prices are in EUR, with the lev equivalent shown
  underneath at that rate (`site.currency.showBgnEquivalent`). VAT in Bulgaria
  is 20%; whether it is included is stated next to every price rather than left
  ambiguous.
- **Permits.** A low-rise prefabricated dwelling is a **строеж от V категория**
  and needs a **разрешение за строеж** from the municipal chief architect, via a
  plot survey drawing, a design by a licensed designer and preliminary
  connection agreements with the electricity and water utilities. The site says
  exactly this and tells the visitor that requirements and fees vary by
  municipality. Have the company's own lawyer confirm the wording for the
  municipalities it actually works in.

Sources: [evroto.bg](https://evroto.bg/bg/euro/citizens/faq),
[Pravatami.bg — законови изисквания за сглобяеми къщи](https://www.pravatami.bg/s/11320).

---

## What the site deliberately does not do

Each of these was a direct instruction, and each is enforced in the build rather
than left to discipline:

- No invented models, prices, areas or technical figures.
- No testimonials, certificates, client counts or "our projects" photographs.
- No yield or payback projection on the tourism page — the page says why.
- No "final price" language; every price is tied to a named package and to a
  site survey.
- No promise of installation without permits.
- No fake success screen on the form.
- No booking a showroom visit while there is no house to visit.

---

## Structure

```
site/
├─ build.mjs                 generator — templates, routes, placeholder report
├─ content/*.json            everything you edit
├─ src/css/main.css          design tokens + all components
├─ src/js/app.js             menu, accordion, filter, lightbox, form, consent
├─ scripts/build-images.py   responsive image pipeline
├─ scripts/build-fonts.sh    self-hosted Cyrillic webfonts
├─ assets/                   fonts, derived images, originals under src/
└─ dist/                     generated output — 22 pages, sitemap, robots
```

Pages per language: home, catalogue, four model pages, tourism, pricing,
privacy, cookies, thank-you. Each model has its own URL so a campaign can point
straight at it. `hreflang` is set on every page and the language switcher stays
on the page you are reading.

## Design notes

- **Type.** Source Serif 4 for headings, Onest for UI and body, JetBrains Mono
  for labels — all self-hosted with Cyrillic subsets, so Bulgarian renders with
  proper local letterforms rather than a Latin-first fallback.
- **Colour.** Light warm ground, graphite text, one muted forest accent. No
  gradients, no glass cards, no decorative motion — movement is limited to
  accordions, the mobile sheet, the lightbox and the form steps.
- **Accessibility.** Checked across every page type: one `h1`, no heading-level
  skips, all text at or above 4.5:1, alt text on every image, a focus-trapped
  mobile menu that closes on Escape, and 44px touch targets on mobile.
- **Weight.** WebP with a JPEG fallback via `<picture>`, blur-up placeholders,
  lazy loading below the fold, and no third-party request before consent.
