/* Static site generator for the modular-homes site.
 *
 *   node build.mjs            build into dist/
 *   node build.mjs --report   build and print the placeholder report only
 *
 * Content comes from content/*.json. No value is ever invented here: a null in
 * the content files renders as a visible "to be confirmed" marker and is listed
 * in the report printed at the end of every build.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const site = read('content/site.json');
const copy = read('content/copy.json');
const modelsData = read('content/models.json');
const images = read('content/images.json');

const LOCALES = ['bg', 'en'];
const MODELS = modelsData.models;
const RENDERS = new Set(modelsData.renders);
const missing = [];

/* ---------- helpers ----------------------------------------------------- */

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Records a missing company fact and renders it as a visible placeholder. */
function tbd(loc, what) {
  missing.push(what);
  return `<span class="tbd">${esc(copy[loc].common.tbd)}</span>`;
}

/** Value if present, otherwise the placeholder marker. */
const val = (v, loc, what, suffix = '') =>
  (v === null || v === undefined || v === '') ? tbd(loc, what) : `${esc(v)}${suffix}`;

const u = (loc, ...segs) => '/' + [loc, ...segs.filter(Boolean)].join('/') + (segs.length || true ? '/' : '');

function money(amount, loc) {
  if (amount === null || amount === undefined) return null;
  const c = site.currency;
  const eur = new Intl.NumberFormat(loc === 'bg' ? 'bg-BG' : 'en-GB',
    { style: 'currency', currency: c.code, maximumFractionDigits: 0 }).format(amount);
  if (!c.showBgnEquivalent) return { main: eur, sub: null };
  const bgn = new Intl.NumberFormat('bg-BG', { maximumFractionDigits: 0 }).format(amount * c.bgnRate);
  return { main: eur, sub: `${bgn} лв. (1 € = ${c.bgnRate})` };
}

/** Responsive <picture> with a blur-up placeholder baked into the markup. */
function img(key, { sizes = '100vw', alt = '', ratio = '', cls = '', priority = false, label = null, loc = 'bg' } = {}) {
  const m = images[key];
  if (!m) throw new Error(`unknown image: ${key}`);
  const jpg = m.sizes.map((w) => `/assets/img/${key}-${w}.jpg ${w}w`).join(', ');
  const webp = m.sizes.map((w) => `/assets/img/${key}-${w}.webp ${w}w`).join(', ');
  const mid = m.sizes[Math.min(1, m.sizes.length - 1)];
  const badge = RENDERS.has(key)
    ? `<span class="badge-render">${esc(copy[loc].common.render)}</span>` : '';
  const cap = label ? `<span class="badge-render">${esc(label)}</span>` : badge;
  return `<div class="fig ${ratio} lz ${cls}" data-lz>
  <img class="lz__ph" src="${m.lqip}" alt="" aria-hidden="true">
  <picture>
    <source type="image/webp" srcset="${webp}" sizes="${sizes}">
    <img src="/assets/img/${key}-${mid}.jpg" srcset="${jpg}" sizes="${sizes}"
         width="${m.w}" height="${m.h}" alt="${esc(alt)}"
         ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  </picture>${cap}
</div>`;
}

const ICONS = {
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  arrow: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  phone: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  expand: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  mark: '<svg width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden="true"><path d="M1 8.2 10 1l9 7.2" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><rect x="3.4" y="9.4" width="13.2" height="7.2" stroke="currentColor" stroke-width="1.6"/></svg>'
};

const modelTitle = (m, loc) => m.title[loc];

const DRAFT = site.buildMode !== 'live';

/** An unfilled area. In draft it shows what fills it; when live it disappears. */
function slot(text, key) {
  if (!DRAFT) return '';
  return `<div class="empty-slot"><strong>${esc(text)}</strong><span class="slot-key">${esc(key)}</span></div>`;
}

/** Wraps a whole block so that, when live, an empty one is not rendered at all. */
function blockIf(hasContent, html) {
  if (hasContent) return html;
  return DRAFT ? html : '';
}

/* ---------- shared blocks ------------------------------------------------ */

function phoneLink(loc, cls = 'tel') {
  const c = site.contacts;
  if (!c.phone) {
    missing.push('site.contacts.phone');
    return `<span class="${cls}">${ICONS.phone}<span class="tbd">${esc(copy[loc].common.tbd)}</span></span>`;
  }
  return `<a class="${cls}" href="tel:${esc(c.phone)}" data-track="phone">${ICONS.phone}${esc(c.phoneDisplay || c.phone)}</a>`;
}

function header(loc, current, urls) {
  const t = copy[loc];
  const d = t.dir;
  const links = [
    [u(loc, d.models), t.nav.models, 'models'],
    [u(loc, d.pricing), t.nav.pricing, 'pricing'],
    [u(loc, d.tourism), t.nav.tourism, 'tourism'],
    [u(loc) + '#process', t.nav.process, 'process'],
    [u(loc) + '#faq', t.nav.faq, 'faq']
  ];
  const nav = links.map(([href, text, id]) =>
    `<a href="${href}"${id === current ? ' aria-current="page"' : ''}>${esc(text)}</a>`).join('\n      ');
  // The switcher points at the same page in the other language, never at the home page.
  const lang = `<div class="lang">
      <a href="${urls.bg}"${loc === 'bg' ? ' aria-current="true"' : ''} hreflang="bg" lang="bg">bg</a>
      <a href="${urls.en}"${loc === 'en' ? ' aria-current="true"' : ''} hreflang="en" lang="en">en</a>
    </div>`;

  return `<a class="skip" href="#main">${esc(t.nav.skip)}</a>
<header class="hdr" data-header>
  <div class="wrap hdr__in">
    <a class="brand" href="${u(loc)}">${ICONS.mark}${esc(site.brand.name)}</a>
    <nav class="nav" aria-label="${esc(t.nav.menu)}">
      ${nav}
    </nav>
    <div class="hdr__tools">
      ${lang}
      ${phoneLink(loc)}
      <a class="btn" href="${u(loc)}#quote">${esc(t.nav.quote)}</a>
    </div>
    <button class="burger" type="button" aria-expanded="false" aria-controls="sheet" aria-label="${esc(t.nav.menu)}" data-burger><i></i><i></i><i></i></button>
  </div>
</header>
<div class="sheet" id="sheet" data-sheet hidden>
  <button class="sheet__close" type="button" aria-label="${esc(t.nav.close)}" data-sheet-close>${ICONS.close}</button>
  <nav aria-label="${esc(t.nav.menu)}">
    ${links.map(([href, text]) => `<a href="${href}">${esc(text)}</a>`).join('\n    ')}
  </nav>
  <div class="sheet__foot">
    ${lang}
    ${phoneLink(loc)}
    <a class="btn btn--block" href="${u(loc)}#quote">${esc(t.nav.quote)}</a>
  </div>
</div>`;
}

function footer(loc) {
  const t = copy[loc], d = t.dir, c = site.company;
  const company = c.legalName
    ? `${esc(c.legalName)}${c.eik ? ` · ЕИК ${esc(c.eik)}` : ''}${c.address ? ` · ${esc(c.address)}` : ''}`
    : `<span class="tbd">${esc(t.footer.companyMissing)}</span>`;
  if (!c.legalName) missing.push('site.company.legalName / eik / address');
  const email = site.contacts.email
    ? `<li><a href="mailto:${esc(site.contacts.email)}">${esc(site.contacts.email)}</a></li>` : '';
  if (!site.contacts.email) missing.push('site.contacts.email');
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr__cols">
      <div>
        <div class="brand">${ICONS.mark}${esc(site.brand.name)}</div>
        <p class="ftr__about">${esc(t.footer.about)}</p>
      </div>
      <div>
        <h2>${esc(t.footer.navTitle)}</h2>
        <ul>
          <li><a href="${u(loc, d.models)}">${esc(t.nav.models)}</a></li>
          <li><a href="${u(loc, d.pricing)}">${esc(t.nav.pricing)}</a></li>
          <li><a href="${u(loc, d.tourism)}">${esc(t.nav.tourism)}</a></li>
          <li><a href="${u(loc)}#quote">${esc(t.nav.quote)}</a></li>
        </ul>
      </div>
      <div>
        <h2>${esc(t.footer.legalTitle)}</h2>
        <ul>
          <li><a href="${u(loc, d.privacy)}">${esc(t.footer.privacy)}</a></li>
          <li><a href="${u(loc, d.cookies)}">${esc(t.footer.cookies)}</a></li>
          <li><a href="#" data-consent-open>${esc(t.consent.settings)}</a></li>
        </ul>
      </div>
      <div>
        <h2>${esc(t.footer.contactTitle)}</h2>
        <ul>
          <li>${phoneLink(loc, 'tel')}</li>
          ${email}
        </ul>
      </div>
    </div>
    <div class="ftr__bar">
      <span>${company}</span>
      <span>© ${new Date().getFullYear()} ${esc(site.brand.name)}. ${esc(t.footer.rights)}</span>
    </div>
  </div>
</footer>`;
}

function dock(loc) {
  const t = copy[loc];
  return `<div class="dock" data-dock>
  ${phoneLink(loc, 'btn btn--secondary').replace('>' + ICONS.phone, ' data-track="phone">' + ICONS.phone)}
  <a class="btn" href="${u(loc)}#quote">${esc(t.common.getQuote)}</a>
</div>`;
}

function consentBar(loc) {
  const t = copy[loc].consent, d = copy[loc].dir;
  return `<div class="consent" data-consent hidden>
  <div class="wrap consent__in">
    <div>
      <p><strong>${esc(t.title)}.</strong> ${esc(t.text)} <a href="${u(loc, d.cookies)}" style="text-decoration:underline">${esc(copy[loc].footer.cookies)}</a></p>
      <div class="consent__cats" data-consent-cats hidden>
        <label><input type="checkbox" checked disabled><span><b>${esc(t.catNecessary)}</b>${esc(t.catNecessaryText)}</span></label>
        <label><input type="checkbox" name="analytics" data-cat><span><b>${esc(t.catAnalytics)}</b>${esc(t.catAnalyticsText)}</span></label>
        <label><input type="checkbox" name="marketing" data-cat><span><b>${esc(t.catMarketing)}</b>${esc(t.catMarketingText)}</span></label>
      </div>
    </div>
    <div class="consent__actions">
      <button class="btn btn--secondary" type="button" data-consent-settings>${esc(t.settings)}</button>
      <button class="btn btn--secondary" type="button" data-consent-necessary>${esc(t.necessary)}</button>
      <button class="btn" type="button" data-consent-accept>${esc(t.accept)}</button>
      <button class="btn" type="button" data-consent-save hidden>${esc(t.save)}</button>
    </div>
  </div>
</div>`;
}

/* ---------- the enquiry form -------------------------------------------- */

function radioGroup(name, label, options, { required = false } = {}) {
  return `<fieldset class="field" style="border:0;padding:0;margin:0"${required ? ' data-required' : ''}>
      <legend class="legend">${esc(label)}</legend>
      <div class="choices">
        ${options.map((o, i) => `<label class="choice"><input type="radio" name="${name}" value="${esc(o)}"${i === 0 ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('\n        ')}
      </div>
    </fieldset>`;
}

function selectField(id, name, label, options, { required = false, placeholder = null, value = null } = {}) {
  const opts = (placeholder ? [`<option value="">${esc(placeholder)}</option>`] : [])
    .concat(options.map((o) => {
      const v = typeof o === 'string' ? o : o.value;
      const l = typeof o === 'string' ? o : o.label;
      return `<option value="${esc(v)}"${value === v ? ' selected' : ''}>${esc(l)}</option>`;
    })).join('\n          ');
  return `<div class="field">
      <label for="${id}">${esc(label)}${required ? '' : ` <span class="opt"></span>`}</label>
      <select id="${id}" name="${name}"${required ? ' required' : ''}>
          ${opts}
      </select>
      <span class="field__err" data-err></span>
    </div>`;
}

function textField(id, name, label, { type = 'text', placeholder = '', required = false, optional = '', autocomplete = '', inputmode = '' } = {}) {
  return `<div class="field">
      <label for="${id}">${esc(label)}${optional ? ` <span class="opt">(${esc(optional)})</span>` : ''}</label>
      <input id="${id}" name="${name}" type="${type}" placeholder="${esc(placeholder)}"
             ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${inputmode ? `inputmode="${inputmode}"` : ''}
             ${required ? 'required' : ''}>
      <span class="field__err" data-err></span>
    </div>`;
}

function enquiryForm(loc, { modelSlug = '', heading = null } = {}) {
  const t = copy[loc], f = t.form;
  const modelOptions = MODELS.map((m) => ({ value: m.slug, label: `${modelTitle(m, loc)} · ${m.code}` }))
    .concat([{ value: 'undecided', label: f.model.undecided }]);
  const connected = Boolean(site.forms.endpoint);
  if (!connected) missing.push('site.forms.endpoint (the form cannot send anything yet)');
  const responseTime = site.forms.responseTime
    ? esc(site.forms.responseTime)
    : `<span class="tbd">${esc(f.responseTimeUnknown)}</span>`;
  if (!site.forms.responseTime) missing.push('site.forms.responseTime');

  return `<div class="form-wrap" id="quote-form-wrap">
  <div class="form-result form-result--ok" data-result-ok role="status" aria-live="polite">
    <h3>${esc(f.successTitle)}</h3>
    <p>${esc(f.successText)}</p>
  </div>
  <div class="form-result form-result--warn" data-result-warn role="status" aria-live="polite">
    <h3>${esc(f.notConnectedTitle)}</h3>
    <p>${esc(f.notConnectedText)}</p>
    <div class="contacts">${phoneLink(loc, 'btn btn--secondary')}</div>
  </div>

  <form id="quote-form" novalidate data-endpoint="${esc(site.forms.endpoint || '')}">
    <div class="form-steps" aria-hidden="true">
      <span data-step-label>${esc(f.step1)}</span>
      <span class="bar"><i data-step-bar></i></span>
    </div>

    <div class="fields" data-step="1">
      ${radioGroup('purpose', f.purpose.label, f.purpose.options)}
      ${selectField('q-model', 'model', f.model.label, modelOptions, { required: true, placeholder: f.model.placeholder, value: modelSlug })}
      ${textField('q-location', 'location', f.location.label, { placeholder: f.location.placeholder, required: true, autocomplete: 'address-level2' })}
      ${radioGroup('land', f.land.label, f.land.options)}
      ${selectField('q-budget', 'budget', f.budget.label, f.budget.options)}
    </div>

    <div class="fields" data-step="2" hidden>
      <div class="fields fields--2">
        ${textField('q-name', 'name', f.name.label, { placeholder: f.name.placeholder, required: true, autocomplete: 'name' })}
        ${textField('q-phone', 'phone', f.phone.label, { type: 'tel', placeholder: f.phone.placeholder, required: true, autocomplete: 'tel', inputmode: 'tel' })}
      </div>
      ${textField('q-email', 'email', f.email.label, { type: 'email', placeholder: f.email.placeholder, optional: f.email.optional, autocomplete: 'email', inputmode: 'email' })}
      ${radioGroup('channel', f.channel.label, f.channel.options)}
      <div class="fields fields--2">
        ${selectField('q-time', 'contact_time', f.time.label, f.time.options)}
        ${selectField('q-timeline', 'timeline', f.timeline.label, f.timeline.options)}
      </div>
      <div class="field">
        <label class="check">
          <input type="checkbox" name="consent" required>
          <span>${esc(f.consent)} <a href="${u(loc, t.dir.privacy)}">${esc(f.consentLink)}</a></span>
        </label>
        <span class="field__err" data-err></span>
      </div>
    </div>

    <input type="hidden" name="locale" value="${loc}">
    <input type="hidden" name="source_page" data-source-page value="">
    <input type="hidden" name="referrer" data-referrer value="">
    <input type="hidden" name="utm_source" data-utm="utm_source" value="">
    <input type="hidden" name="utm_medium" data-utm="utm_medium" value="">
    <input type="hidden" name="utm_campaign" data-utm="utm_campaign" value="">
    <input type="hidden" name="utm_content" data-utm="utm_content" value="">
    <input type="hidden" name="gclid" data-utm="gclid" value="">
    <input type="hidden" name="fbclid" data-utm="fbclid" value="">

    <div class="form-actions">
      <button class="btn btn--secondary" type="button" data-prev hidden>${esc(f.back)}</button>
      <button class="btn btn--lg" type="button" data-next>${esc(f.next)} ${ICONS.arrow}</button>
      <button class="btn btn--lg" type="submit" data-submit hidden><span class="spinner"></span><span data-submit-label>${esc(f.submit)}</span></button>
    </div>
    <p class="fine form-note">${responseTime}</p>
    <p class="sr-only" role="status" aria-live="polite" data-form-status></p>
  </form>
</div>`;
}

/* ---------- reusable page blocks ---------------------------------------- */

function priceBlock(m, loc, { big = false } = {}) {
  const t = copy[loc];
  const p = m.price;
  const formatted = money(p.amount, loc);
  if (!formatted) {
    missing.push(`models[${m.slug}].price.amount`);
    return `<div class="price">
      <span class="price__label">${esc(t.common.priceTitle || t.model.priceTitle)}</span>
      <span class="price__value is-tbd">${esc(t.common.onRequest)}</span>
    </div>`;
  }
  const vat = p.vatIncluded === null
    ? `<span class="tbd">${esc(t.common.vatUnknown)}</span>`
    : esc(p.vatIncluded ? t.common.vatIncluded : t.common.vatExcluded);
  if (p.vatIncluded === null) missing.push(`models[${m.slug}].price.vatIncluded`);
  const pkg = p.packageName ? esc(p.packageName) : `<span class="tbd">${esc(t.common.tbd)}</span>`;
  if (!p.packageName) missing.push(`models[${m.slug}].price.packageName`);
  return `<div class="price">
      <span class="price__label">${esc(t.common.from)} · ${pkg}</span>
      <span class="price__value num">${esc(formatted.main)}</span>
      ${formatted.sub ? `<span class="price__bgn num">${esc(formatted.sub)}</span>` : ''}
      <span class="price__sub">${vat}</span>
    </div>`;
}

function specRow(m, loc) {
  const t = copy[loc].common;
  const a = m.areas;
  // Three "to be confirmed" cells in a row is noise; one honest line is clearer.
  if (a.interior === null && m.bedrooms === null && m.bathrooms === null) {
    missing.push(`models[${m.slug}].areas / bedrooms / bathrooms`);
    return `<p class="spec-row spec-row--none small">${esc(t.area)}, ${esc(t.bedrooms).toLowerCase()}, ${esc(t.bathrooms).toLowerCase()} — <span class="tbd">${esc(t.tbd)}</span></p>`;
  }
  const cell = (label, value, suffix = '') => `<div><dt>${esc(label)}</dt><dd>${value === null ? tbd(loc, `models[${m.slug}]`) : esc(value) + suffix}</dd></div>`;
  return `<dl class="spec-row">
      ${cell(t.areaInterior, a.interior, ' ' + t.sqm)}
      ${cell(t.bedrooms, m.bedrooms)}
      ${cell(t.bathrooms, m.bathrooms)}
    </dl>`;
}

function modelCard(m, loc) {
  const t = copy[loc];
  const href = u(loc, t.dir.models, m.slug);
  return `<article class="card" data-purpose="${m.purpose.join(' ')}">
  ${img(m.hero, { loc, ratio: '', sizes: '(min-width:1100px) 30vw, (min-width:700px) 46vw, 92vw', alt: modelTitle(m, loc) })}
  <div class="card__body">
    <span class="card__code">${esc(m.code)}</span>
    <h3 class="card__title"><a href="${href}">${esc(modelTitle(m, loc))}</a></h3>
    ${m.titleConfirmed ? '' : `<p class="label" style="margin-top:.4rem">${esc(t.common.placeholderNote)}</p>`}
    <p class="card__lead">${esc(m.lead[loc])}</p>
    ${specRow(m, loc)}
    <div class="card__foot">
      ${priceBlock(m, loc)}
      <a class="btn btn--secondary" href="${href}">${esc(t.common.viewModel)}</a>
    </div>
  </div>
</article>`;
}

function costTable(loc) {
  const t = copy[loc].costs;
  return `<div class="costs">
    ${site.costItems.map((item) => {
      const c = t.items[item.id];
      return `<div class="cost">
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.text)}</p>
      <span class="chip chip--${item.status}">${esc(t.status[item.status])}</span>
    </div>`;
    }).join('\n    ')}
  </div>
  <div class="vat-note">
    <p class="small"><strong>${esc(t.vatLabel)}.</strong> ${esc(t.vatNote)}</p>
    <p class="small">${esc(t.finalNote)}</p>
  </div>`;
}

function accordion(items, idPrefix) {
  return `<div class="acc" data-acc>
  ${items.map((it, i) => `<div class="acc__item">
    <h3 style="font:inherit;margin:0"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="${idPrefix}-${i}">${esc(it.q)}<span class="acc__ico" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="${idPrefix}-${i}"><div>${esc(it.a)}</div></div>
  </div>`).join('\n  ')}
</div>`;
}

/* ---------- layout ------------------------------------------------------ */

function layout({ loc, title, description, urls, current, body, bodyClass = '', jsonLd = null }) {
  const t = copy[loc];
  const self = urls[loc];
  return `<!doctype html>
<html lang="${t.locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="bg" href="${urls.bg}">
<link rel="alternate" hreflang="en" href="${urls.en}">
<link rel="alternate" hreflang="x-default" href="${urls.bg}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${loc === 'bg' ? 'bg_BG' : 'en_GB'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FAFAF8">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/onest-400-${loc === 'bg' ? 'cyrillic' : 'latin'}.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/source-serif-4-400-${loc === 'bg' ? 'cyrillic' : 'latin'}.woff2" crossorigin>
<script>document.documentElement.classList.add('js');</script>
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/main.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
<script>
  window.dataLayer = window.dataLayer || [];
  window.SITE = ${JSON.stringify({
    locale: loc,
    analytics: site.analytics,
    thanksUrl: u(loc, t.dir.thanks),
    strings: { formErrors: t.form.errors, step1: t.form.step1, step2: t.form.step2, submit: t.form.submit, sending: t.form.sending }
  })};
</script>
</head>
<body class="${bodyClass}">
${header(loc, current, urls)}
<main id="main">
${body}
</main>
${footer(loc)}
${dock(loc)}
${consentBar(loc)}
<div class="lightbox" data-lightbox hidden>
  <button class="lightbox__close" type="button" aria-label="${esc(t.common.closePlan)}" data-lightbox-close>${ICONS.close}</button>
  <img alt="" data-lightbox-img>
  <span class="lightbox__cap" data-lightbox-cap></span>
</div>
<script src="/assets/js/app.js" defer></script>
</body>
</html>`;
}

/* ---------- pages -------------------------------------------------------- */

function homePage(loc) {
  const t = copy[loc], d = t.dir;
  const living = MODELS.filter((m) => m.purpose.includes('living'));
  const tourism = MODELS.filter((m) => m.purpose.includes('tourism'));
  const hero = MODELS[0];

  const proofRole = site.manufacturer.ourRole[loc];
  const mfr = site.manufacturer.name
    ? esc(site.manufacturer.name) : tbd(loc, 'site.manufacturer.name');

  const warranty = (site.warranty.structureYears || site.warranty.finishesYears)
    ? `<div class="facts">
        <div><dt>${esc(t.proof.warranty.structure)}</dt><dd>${val(site.warranty.structureYears, loc, 'site.warranty.structureYears')}</dd></div>
        <div><dt>${esc(t.proof.warranty.finishes)}</dt><dd>${val(site.warranty.finishesYears, loc, 'site.warranty.finishesYears')}</dd></div>
      </div>`
    : slot(t.proof.warranty.empty, 'site.json → warranty');
  if (!site.warranty.structureYears) missing.push('site.warranty.structureYears / finishesYears');

  return `
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <h1 class="t-1">${esc(t.hero.title)}</h1>
      <p class="lead">${esc(t.hero.lead)}</p>
      <div class="hero__actions">
        <a class="btn btn--lg" href="${u(loc, d.models)}">${esc(t.hero.primary)}</a>
        <a class="btn btn--secondary btn--lg" href="#quote">${esc(t.hero.secondary)}</a>
      </div>
      <p class="fine hero__note">${esc(t.hero.priceNote)}</p>
    </div>
    <div>
      ${img(hero.hero, { loc, ratio: 'hero__fig', sizes: '(min-width:900px) 52vw, 100vw', alt: modelTitle(hero, loc), priority: true })}
    </div>
  </div>
</section>

<div class="wrap">
  <dl class="hero__strip">
    ${t.quickAnswers.map(function (q) {
      return `<div><dt>${esc(q.q)}</dt><dd><a href="${q.href.replace('{models}', d.models).replace('{pricing}', d.pricing).replace('{loc}', loc)}">${esc(q.a)}</a></dd></div>`;
    }).join('\n    ')}
  </dl>
</div>

<section class="section" id="scenarios">
  <div class="wrap">
    <div class="head">
      <p class="label">01</p>
      <h2 class="t-2">${esc(t.scenarios.title)}</h2>
      <p class="lead">${esc(t.scenarios.lead)}</p>
    </div>
    <div class="scenarios">
      <article class="scenario">
        ${img('terrace', { loc, sizes: '(min-width:800px) 46vw, 92vw', alt: t.scenarios.living.title })}
        <div class="scenario__body">
          <h3>${esc(t.scenarios.living.title)}</h3>
          <p>${esc(t.scenarios.living.text)}</p>
          <a class="link" href="${u(loc, d.models)}#living">${esc(t.scenarios.living.cta)} ${ICONS.arrow}</a>
        </div>
      </article>
      <article class="scenario">
        ${img('village-forest', { loc, sizes: '(min-width:800px) 46vw, 92vw', alt: t.scenarios.tourism.title })}
        <div class="scenario__body">
          <h3>${esc(t.scenarios.tourism.title)}</h3>
          <p>${esc(t.scenarios.tourism.text)}</p>
          <a class="link" href="${u(loc, d.tourism)}">${esc(t.scenarios.tourism.cta)} ${ICONS.arrow}</a>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section section--alt" id="models">
  <div class="wrap">
    <div class="head">
      <p class="label">02</p>
      <h2 class="t-2">${esc(t.catalog.title)}</h2>
      <p class="lead">${esc(t.catalog.lead)}</p>
    </div>
    <div class="grid-models">
      ${MODELS.map((m) => modelCard(m, loc)).join('\n      ')}
    </div>
    <p style="margin-top:2rem"><a class="link" href="${u(loc, d.models)}">${esc(t.common.allModels)} ${ICONS.arrow}</a></p>
  </div>
</section>

<section class="section" id="costs">
  <div class="wrap">
    <div class="head">
      <p class="label">03</p>
      <h2 class="t-2">${esc(t.costs.title)}</h2>
      <p class="lead">${esc(t.costs.lead)}</p>
    </div>
    ${costTable(loc)}
  </div>
</section>

<section class="section section--white" id="proof">
  <div class="wrap">
    <div class="head">
      <p class="label">04</p>
      <h2 class="t-2">${esc(t.proof.title)}</h2>
      <p class="lead">${esc(t.proof.lead)}</p>
    </div>
    <div class="proof-grid">
      ${blockIf(Boolean(site.proof.videoTourUrl), `<div class="proof-block">
        <h3>${esc(t.proof.video.title)}</h3>
        ${site.proof.videoTourUrl
          ? `<div class="fig" style="aspect-ratio:16/9"><iframe src="${esc(site.proof.videoTourUrl)}" title="${esc(t.proof.video.title)}" loading="lazy" allowfullscreen style="width:100%;height:100%;border:0"></iframe></div>`
          : slot(t.proof.video.empty, 'site.json → proof.videoTourUrl')}
      </div>`)}
      ${blockIf(site.proof.productionPhotos.length > 0, `<div class="proof-block">
        <h3>${esc(t.proof.production.title)}</h3>
        ${site.proof.productionPhotos.length
          ? site.proof.productionPhotos.map((k) => img(k, { loc, sizes: '46vw', alt: t.proof.production.title })).join('')
          : slot(t.proof.production.empty, 'site.json → proof.productionPhotos')}
      </div>`)}
      ${blockIf(site.proof.projects.length > 0, `<div class="proof-block">
        <h3>${esc(t.proof.projects.title)}</h3>
        ${site.proof.projects.length ? '' : slot(t.proof.projects.empty, 'site.json → proof.projects')}
      </div>`)}
      <div class="proof-block">
        <h3>${esc(t.proof.manufacturer.title)}</h3>
        <div class="facts">
          <div><dt>${esc(t.proof.manufacturer.title)}</dt><dd>${mfr}</dd></div>
        </div>
        <p class="small" style="margin-top:1rem">${esc(proofRole)}</p>
      </div>
      <div class="proof-block">
        <h3>${esc(t.proof.warranty.title)}</h3>
        ${warranty}
      </div>
      ${blockIf(site.proof.showroom.available, `<div class="proof-block">
        <h3>${esc(t.proof.showroom.title)}</h3>
        ${site.proof.showroom.available
          ? `<p class="small">${esc(site.proof.showroom.address || '')}</p>`
          : slot(t.proof.showroom.unavailable, 'site.json → proof.showroom')}
      </div>`)}
    </div>
  </div>
</section>

<section class="section" id="process">
  <div class="wrap">
    <div class="head">
      <p class="label">05</p>
      <h2 class="t-2">${esc(t.process.title)}</h2>
      <p class="lead">${esc(t.process.lead)}</p>
    </div>
    <div class="steps">
      ${t.process.steps.map((s, i) => `<div class="step">
        <span class="step__n">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt" id="faq">
  <div class="wrap">
    <div class="head">
      <p class="label">06</p>
      <h2 class="t-2">${esc(t.faq.title)}</h2>
    </div>
    ${accordion(t.faq.items, 'faq')}
  </div>
</section>

<section class="section section--white" id="quote">
  <div class="wrap form-grid">
    <div>
      <p class="label">07</p>
      <h2 class="t-2" style="margin-top:.875rem">${esc(t.form.title)}</h2>
      <p class="lead" style="margin-top:1rem">${esc(t.form.lead)}</p>
      <div style="margin-top:1.75rem">${phoneLink(loc, 'btn btn--secondary')}</div>
    </div>
    ${enquiryForm(loc)}
  </div>
</section>`;
}

function catalogPage(loc) {
  const t = copy[loc], d = t.dir;
  return `
<div class="wrap">
  <nav class="crumbs" aria-label="breadcrumb">
    <a href="${u(loc)}">${esc(site.brand.name)}</a> <span>/</span> <span>${esc(t.catalog.title)}</span>
  </nav>
</div>
<section class="section section--tight">
  <div class="wrap">
    <div class="head">
      <h1 class="t-1">${esc(t.catalog.title)}</h1>
      <p class="lead">${esc(t.catalog.lead)}</p>
    </div>
    <div class="filters" role="group" aria-label="${esc(t.catalog.title)}">
      <button type="button" data-filter="all" aria-pressed="true">${esc(t.catalog.filterAll)}</button>
      <button type="button" data-filter="living" aria-pressed="false">${esc(t.catalog.filterLiving)}</button>
      <button type="button" data-filter="tourism" aria-pressed="false">${esc(t.catalog.filterTourism)}</button>
    </div>
    <h2 class="sr-only">${esc(t.catalog.title)}</h2>
    <div class="grid-models" data-model-grid>
      ${MODELS.map((m) => modelCard(m, loc)).join('\n      ')}
    </div>
    <p class="small" data-filter-empty hidden style="margin-top:2rem">${esc(t.catalog.empty)}</p>
  </div>
</section>
<section class="section section--alt">
  <div class="wrap">
    <div class="head"><h2 class="t-2">${esc(t.costs.title)}</h2><p class="lead">${esc(t.costs.lead)}</p></div>
    ${costTable(loc)}
  </div>
</section>
<section class="section section--white" id="quote">
  <div class="wrap form-grid">
    <div>
      <h2 class="t-2">${esc(t.form.title)}</h2>
      <p class="lead" style="margin-top:1rem">${esc(t.form.lead)}</p>
    </div>
    ${enquiryForm(loc)}
  </div>
</section>`;
}

function modelPage(m, loc) {
  const t = copy[loc], d = t.dir;
  const others = MODELS.filter((x) => x.slug !== m.slug);
  const rows = (list, emptyText) => list.length
    ? `<div class="table-scroll"><table class="specs-table">${list.map((r) =>
        `<tr><th scope="row">${esc(r.key[loc])}</th><td>${esc(r.value[loc])}</td></tr>`).join('')}</table></div>`
    : slot(emptyText, `models.json → ${m.slug}`);
  if (!m.package.length) missing.push(`models[${m.slug}].package`);
  if (!m.tech.length) missing.push(`models[${m.slug}].tech`);
  if (!m.plan) missing.push(`models[${m.slug}].plan`);

  const areaRow = (label, v) => `<tr><th scope="row">${esc(label)}</th><td>${v === null ? tbd(loc, `models[${m.slug}].areas`) : esc(v) + ' ' + t.common.sqm}</td></tr>`;

  return `
<div class="wrap">
  <nav class="crumbs" aria-label="breadcrumb">
    <a href="${u(loc)}">${esc(site.brand.name)}</a> <span>/</span>
    <a href="${u(loc, d.models)}">${esc(t.catalog.title)}</a> <span>/</span>
    <span>${esc(modelTitle(m, loc))}</span>
  </nav>
</div>

<section class="section--tight">
  <div class="wrap">
    <div class="model-gallery">
      ${m.gallery.map((k, i) => `<button type="button" class="zoom-btn" data-zoom="/assets/img/${k}-${images[k].sizes[images[k].sizes.length - 1]}.jpg" data-zoom-cap="${esc(modelTitle(m, loc))}">
        ${img(k, { loc, sizes: i === 0 ? '(min-width:800px) 92vw, 100vw' : '(min-width:800px) 23vw, 46vw', alt: `${modelTitle(m, loc)} — ${i + 1}`, priority: i === 0 })}
      </button>`).join('\n      ')}
    </div>

    <div class="model-head">
      <div>
        <p class="label">${esc(m.code)}</p>
        <h1 class="t-1" style="margin-top:.75rem">${esc(modelTitle(m, loc))}</h1>
        ${m.titleConfirmed ? '' : `<p class="fine" style="margin-top:.5rem">${esc(t.common.placeholderNote)}</p>`}
        <p class="lead" style="margin-top:1.125rem">${esc(m.lead[loc])}</p>

        <h2 class="t-4" style="margin-top:2.5rem">${esc(t.model.specs)}</h2>
        <div class="table-scroll" style="margin-top:.875rem">
          <table class="specs-table">
            ${areaRow(t.common.areaTotal, m.areas.total)}
            ${areaRow(t.common.areaInterior, m.areas.interior)}
            ${areaRow(t.common.areaTerrace, m.areas.terrace)}
            <tr><th scope="row">${esc(t.common.bedrooms)}</th><td>${m.bedrooms === null ? tbd(loc, `models[${m.slug}].bedrooms`) : esc(m.bedrooms)}</td></tr>
            <tr><th scope="row">${esc(t.common.bathrooms)}</th><td>${m.bathrooms === null ? tbd(loc, `models[${m.slug}].bathrooms`) : esc(m.bathrooms)}</td></tr>
            <tr><th scope="row">${esc(t.common.sleeps)}</th><td>${m.sleeps === null ? tbd(loc, `models[${m.slug}].sleeps`) : esc(m.sleeps)}</td></tr>
          </table>
        </div>
        ${m.areas.interior === null ? `<p class="fine" style="margin-top:.875rem">${esc(t.model.techEmpty)}</p>` : ''}
      </div>

      <aside class="model-buy">
        ${priceBlock(m, loc, { big: true })}
        <a class="btn btn--block btn--lg" href="#quote">${esc(t.common.quoteForModel)}</a>
        ${phoneLink(loc, 'btn btn--secondary btn--block')}
        <p class="fine">${esc(t.hero.priceNote)}</p>
      </aside>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="t-2">${esc(t.model.planTitle)}</h2>
    <div style="margin-top:1.25rem">
      ${m.plan
        ? `<div class="plan-box"><img src="${esc(m.plan)}" alt="${esc(modelTitle(m, loc))} — ${esc(t.model.planTitle)}" data-zoom="${esc(m.plan)}" data-zoom-cap="${esc(modelTitle(m, loc))}">
           <button class="plan-open" type="button" data-zoom="${esc(m.plan)}" data-zoom-cap="${esc(modelTitle(m, loc))}">${ICONS.expand} ${esc(t.common.openPlan)}</button></div>`
        : slot(t.model.planEmpty, `models.json → ${m.slug} → plan · assets/plans/${m.slug}.svg`)}
    </div>

    <h2 class="t-2" style="margin-top:3rem">${esc(t.model.roomsTitle)}</h2>
    <div style="margin-top:1.25rem">
      ${m.rooms[loc] ? `<p class="lead">${esc(m.rooms[loc])}</p>` : slot(t.model.roomsEmpty, `models.json → ${m.slug} → rooms.${loc}`)}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <h2 class="t-2">${esc(t.model.packageTitle)}</h2>
    <div style="margin-top:1.25rem">${rows(m.package, t.model.packageEmpty)}</div>
    <h2 class="t-2" style="margin-top:3rem">${esc(t.model.techTitle)}</h2>
    <div style="margin-top:1.25rem">${rows(m.tech, t.model.techEmpty)}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="t-2">${esc(t.model.deliveryTitle)}</h2>
    <div style="margin-top:1.5rem">${costTable(loc)}</div>

    <h2 class="t-2" style="margin-top:3.5rem">${esc(t.model.requirementsTitle)}</h2>
    <ul class="reqs" style="margin-top:1.25rem">
      ${t.model.requirements.map((r) => `<li>${ICONS.check}<span>${esc(r)}</span></li>`).join('\n      ')}
    </ul>
    <p class="fine" style="margin-top:1rem">${esc(t.model.requirementsNote)}</p>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <h2 class="t-2">${esc(t.model.faqTitle)}</h2>
    <div style="margin-top:1.5rem">${accordion(t.faq.items.slice(0, 4), 'mfaq')}</div>
  </div>
</section>

<section class="section section--white" id="quote">
  <div class="wrap form-grid">
    <div>
      <h2 class="t-2">${esc(t.model.formTitle)}</h2>
      <p class="lead" style="margin-top:1rem">${esc(t.form.lead)}</p>
    </div>
    ${enquiryForm(loc, { modelSlug: m.slug })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="t-2">${esc(t.model.otherModels)}</h2>
    <div class="grid-models" style="margin-top:1.75rem">
      ${others.map((x) => modelCard(x, loc)).join('\n      ')}
    </div>
  </div>
</section>`;
}

function tourismPage(loc) {
  const t = copy[loc], d = t.dir;
  const list = MODELS.filter((m) => m.purpose.includes('tourism'));
  return `
<div class="wrap">
  <nav class="crumbs" aria-label="breadcrumb">
    <a href="${u(loc)}">${esc(site.brand.name)}</a> <span>/</span> <span>${esc(t.tourism.title)}</span>
  </nav>
</div>
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <h1 class="t-1">${esc(t.tourism.title)}</h1>
      <p class="lead">${esc(t.tourism.lead)}</p>
      <div class="hero__actions"><a class="btn btn--lg" href="#quote">${esc(t.tourism.cta)}</a></div>
      <p class="fine hero__note">${esc(t.tourism.noYield)}</p>
    </div>
    <div>${img('village-alpine', { loc, ratio: 'hero__fig', sizes: '(min-width:900px) 52vw, 100vw', alt: t.tourism.title, priority: true })}</div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="head"><h2 class="t-2">${esc(t.tourism.modelsTitle)}</h2></div>
    <div class="grid-models grid-models--wide">${list.map((m) => modelCard(m, loc)).join('\n      ')}</div>
    <p class="small" style="margin-top:1.5rem">${esc(t.tourism.capacityNote)}</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="proof-grid">
      <div>
        <h2 class="t-3">${esc(t.tourism.operationTitle)}</h2>
        <p class="lead" style="margin-top:1rem">${esc(t.tourism.operationText)}</p>
      </div>
      <div>
        <h2 class="t-3">${esc(t.tourism.quantityTitle)}</h2>
        <p class="lead" style="margin-top:1rem">${esc(t.tourism.quantityText)}</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="wrap">
    <div class="head"><h2 class="t-2">${esc(t.tourism.stagesTitle)}</h2></div>
    <div class="steps">
      ${t.tourism.stages.map((s, i) => `<div class="step">
        <span class="step__n">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--alt" id="quote">
  <div class="wrap form-grid">
    <div>
      <h2 class="t-2">${esc(t.tourism.cta)}</h2>
      <p class="lead" style="margin-top:1rem">${esc(t.form.lead)}</p>
      <p class="fine" style="margin-top:1.5rem">${esc(t.tourism.noYield)}</p>
    </div>
    ${enquiryForm(loc)}
  </div>
</section>`;
}

function pricingPage(loc) {
  const t = copy[loc];
  return `
<div class="wrap">
  <nav class="crumbs" aria-label="breadcrumb">
    <a href="${u(loc)}">${esc(site.brand.name)}</a> <span>/</span> <span>${esc(t.nav.pricing)}</span>
  </nav>
</div>
<section class="section section--tight">
  <div class="wrap">
    <div class="head">
      <h1 class="t-1">${esc(t.costs.title)}</h1>
      <p class="lead">${esc(t.costs.lead)}</p>
    </div>
    <h2 class="sr-only">${esc(t.costs.title)}</h2>
    ${costTable(loc)}
  </div>
</section>
<section class="section section--alt">
  <div class="wrap">
    <div class="head"><h2 class="t-2">${esc(t.catalog.title)}</h2></div>
    <div class="grid-models">${MODELS.map((m) => modelCard(m, loc)).join('\n      ')}</div>
  </div>
</section>
<section class="section section--white" id="quote">
  <div class="wrap form-grid">
    <div><h2 class="t-2">${esc(t.form.title)}</h2><p class="lead" style="margin-top:1rem">${esc(t.form.lead)}</p></div>
    ${enquiryForm(loc)}
  </div>
</section>`;
}

/* ---------- legal pages (working drafts, clearly marked) ----------------- */

const LEGAL = {
  privacy: {
    bg: [
      ['Кой обработва данните ви', 'Администратор на личните данни е дружеството, посочено в долната част на сайта. Данните за контакт с администратора се публикуват заедно с фирмените данни.'],
      ['Какви данни събираме', 'През формата за оферта: име, телефон, по избор имейл, предпочитан канал и време за връзка, населено място на бъдещия монтаж, интересуващ ви модел, приблизителен бюджет и срок. Автоматично: страницата, от която идва запитването, източникът на посещението (UTM параметри, gclid, fbclid) и препращащият адрес.'],
      ['Защо ги събираме', 'За да подготвим и изпратим оферта и да се свържем с вас по нея. Не използваме данните за друго и не ги продаваме.'],
      ['Основание', 'Предприемане на стъпки по ваше искане преди сключване на договор, както и вашето съгласие, което давате при изпращане на формата.'],
      ['Колко дълго ги пазим', 'Срокът на съхранение се определя от администратора и се публикува тук преди стартиране на реклама.'],
      ['С кого ги споделяме', 'С доставчика на системата за заявки и с доставчика на хостинг, в рамките на необходимото. Списъкът на обработващите се публикува тук, след като бъдат избрани.'],
      ['Вашите права', 'Достъп, коригиране, изтриване, ограничаване на обработването, преносимост и възражение. Оттегляне на съгласието по всяко време. Право на жалба до Комисията за защита на личните данни.']
    ],
    en: [
      ['Who processes your data', 'The controller is the company named in the footer of this site. The controller’s contact details are published alongside the company details.'],
      ['What we collect', 'Through the quote form: name, phone, optionally email, preferred channel and time, the town of the future installation, the model of interest, an approximate budget and timescale. Automatically: the page the enquiry came from, the traffic source (UTM parameters, gclid, fbclid) and the referrer.'],
      ['Why we collect it', 'To prepare and send a quote and to contact you about it. We do not use the data for anything else and we do not sell it.'],
      ['Legal basis', 'Steps taken at your request before entering into a contract, together with the consent you give when submitting the form.'],
      ['How long we keep it', 'The retention period is set by the controller and published here before advertising begins.'],
      ['Who we share it with', 'The enquiry system provider and the hosting provider, to the extent necessary. The list of processors is published here once they are chosen.'],
      ['Your rights', 'Access, rectification, erasure, restriction, portability and objection. Withdrawal of consent at any time. The right to complain to the Bulgarian Commission for Personal Data Protection.']
    ]
  },
  cookies: {
    bg: [
      ['Какво са бисквитките', 'Малки файлове, които сайтът записва в браузъра ви. Част от тях са нужни, за да работи сайтът; други се използват за анализ и за измерване на рекламата.'],
      ['Необходими', 'Записват единствено избора ви в банера за съгласие и текущото състояние на формата, за да не губите въведеното. Не могат да бъдат изключени.'],
      ['Анализ', 'Зареждат се само след вашето съгласие. Показват ни кои страници се четат и къде спира разглеждането.'],
      ['Реклама', 'Зареждат се само след вашето съгласие. Позволяват измерване на кампаниите в Google Ads и Facebook.'],
      ['Как да промените избора си', 'Използвайте връзката „Настройки“ в долната част на всяка страница. Изборът ви се съхранява локално в браузъра.'],
      ['Конкретни бисквитки', 'Списъкът с имена, доставчици и срокове се публикува тук, след като бъдат свързани Google Analytics, Google Ads и Meta Pixel.']
    ],
    en: [
      ['What cookies are', 'Small files the site stores in your browser. Some are needed for the site to work; others are used for analytics and to measure advertising.'],
      ['Necessary', 'They store only your choice in the consent banner and the current state of the form so you do not lose what you typed. They cannot be switched off.'],
      ['Analytics', 'Loaded only after your consent. They show us which pages get read and where people stop.'],
      ['Advertising', 'Loaded only after your consent. They allow measurement of Google Ads and Facebook campaigns.'],
      ['Changing your choice', 'Use the “Settings” link at the bottom of any page. Your choice is stored locally in your browser.'],
      ['The specific cookies', 'The list of names, providers and lifetimes is published here once Google Analytics, Google Ads and Meta Pixel are connected.']
    ]
  }
};

function legalPage(loc, kind) {
  const t = copy[loc];
  const head = kind === 'privacy' ? t.privacy : t.cookies;
  return `
<div class="wrap">
  <nav class="crumbs" aria-label="breadcrumb"><a href="${u(loc)}">${esc(site.brand.name)}</a> <span>/</span> <span>${esc(head.title)}</span></nav>
</div>
<section class="section section--tight">
  <div class="wrap">
    <h1 class="t-1" style="margin-bottom:1.5rem">${esc(head.title)}</h1>
    <div class="prose">
      <p class="notice">${esc(head.draftNote)}</p>
      ${LEGAL[kind][loc].map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function thanksPage(loc) {
  const t = copy[loc], d = t.dir;
  return `
<section class="section">
  <div class="wrap" style="max-width:46rem">
    <h1 class="t-1">${esc(t.thanks.title)}</h1>
    <p class="lead" style="margin-top:1.25rem">${esc(t.thanks.text)}</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn" href="${u(loc, d.models)}">${esc(t.thanks.back)}</a>
      ${phoneLink(loc, 'btn btn--secondary')}
    </div>
  </div>
</section>`;
}

/* ---------- routes and writer ------------------------------------------- */

function routes() {
  const out = [];
  for (const loc of LOCALES) {
    const d = copy[loc].dir;
    const other = loc === 'bg' ? 'en' : 'bg';
    const od = copy[other].dir;
    const pair = (selfSegs, otherSegs) => {
      const urls = {};
      urls[loc] = u(loc, ...selfSegs);
      urls[other] = u(other, ...otherSegs);
      return urls;
    };

    out.push({ loc, file: [loc, 'index.html'], current: 'home',
      urls: pair([], []),
      title: `${site.brand.name} — ${copy[loc].hero.title}`,
      description: copy[loc].hero.lead,
      body: homePage(loc),
      jsonLd: {
        '@context': 'https://schema.org', '@type': 'Organization',
        name: site.brand.name,
        ...(site.contacts.phone ? { telephone: site.contacts.phone } : {}),
        ...(site.contacts.email ? { email: site.contacts.email } : {}),
        areaServed: 'BG'
      } });

    out.push({ loc, file: [loc, d.models, 'index.html'], current: 'models',
      urls: pair([d.models], [od.models]),
      title: `${copy[loc].catalog.title} — ${site.brand.name}`,
      description: copy[loc].catalog.lead,
      body: catalogPage(loc) });

    for (const m of MODELS) {
      out.push({ loc, file: [loc, d.models, m.slug, 'index.html'], current: 'models',
        urls: pair([d.models, m.slug], [od.models, m.slug]),
        title: `${modelTitle(m, loc)} (${m.code}) — ${site.brand.name}`,
        description: m.lead[loc],
        body: modelPage(m, loc),
        jsonLd: {
          '@context': 'https://schema.org', '@type': 'Product',
          name: modelTitle(m, loc), sku: m.code, description: m.lead[loc],
          image: `/assets/img/${m.hero}-1280.jpg`
        } });
    }

    out.push({ loc, file: [loc, d.tourism, 'index.html'], current: 'tourism',
      urls: pair([d.tourism], [od.tourism]),
      title: `${copy[loc].tourism.title} — ${site.brand.name}`,
      description: copy[loc].tourism.lead,
      body: tourismPage(loc) });

    out.push({ loc, file: [loc, d.pricing, 'index.html'], current: 'pricing',
      urls: pair([d.pricing], [od.pricing]),
      title: `${copy[loc].costs.title} — ${site.brand.name}`,
      description: copy[loc].costs.lead,
      body: pricingPage(loc) });

    out.push({ loc, file: [loc, d.privacy, 'index.html'], current: null,
      urls: pair([d.privacy], [od.privacy]),
      title: `${copy[loc].privacy.title} — ${site.brand.name}`,
      description: copy[loc].privacy.title,
      body: legalPage(loc, 'privacy') });

    out.push({ loc, file: [loc, d.cookies, 'index.html'], current: null,
      urls: pair([d.cookies], [od.cookies]),
      title: `${copy[loc].cookies.title} — ${site.brand.name}`,
      description: copy[loc].cookies.title,
      body: legalPage(loc, 'cookies') });

    out.push({ loc, file: [loc, d.thanks, 'index.html'], current: null, noindex: true,
      urls: pair([d.thanks], [od.thanks]),
      title: `${copy[loc].thanks.title} — ${site.brand.name}`,
      description: copy[loc].thanks.text,
      body: thanksPage(loc) });
  }
  return out;
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === 'src') continue;              // originals stay out of dist
    const s = path.join(from, entry.name), d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const pages = routes();
  for (const p of pages) {
    let html = layout(p);
    if (p.noindex) html = html.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"');
    const target = path.join(DIST, ...p.file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
  }

  // Root: send visitors to Bulgarian, keep it crawlable.
  fs.writeFileSync(path.join(DIST, 'index.html'), `<!doctype html>
<html lang="bg"><head><meta charset="utf-8">
<title>${esc(site.brand.name)}</title>
<link rel="canonical" href="/bg/">
<link rel="alternate" hreflang="bg" href="/bg/">
<link rel="alternate" hreflang="en" href="/en/">
<link rel="alternate" hreflang="x-default" href="/bg/">
<meta http-equiv="refresh" content="0; url=/bg/">
<script>location.replace((navigator.language||'bg').toLowerCase().startsWith('bg') ? '/bg/' : '/en/');</script>
</head><body><p><a href="/bg/">Български</a> · <a href="/en/">English</a></p></body></html>`);

  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
  fs.mkdirSync(path.join(DIST, 'assets', 'css'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'src/css/main.css'), path.join(DIST, 'assets/css/main.css'));
  fs.mkdirSync(path.join(DIST, 'assets', 'js'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'src/js/app.js'), path.join(DIST, 'assets/js/app.js'));

  const urls = pages.filter((p) => !p.noindex).map((p) => p.urls[p.loc]);
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((x) => `  <url><loc>${x}</loc></url>`).join('\n') + `\n</urlset>\n`);
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /bg/${copy.bg.dir.thanks}/\nDisallow: /en/${copy.en.dir.thanks}/\nSitemap: /sitemap.xml\n`);

  // Placeholder report — the point of the whole content layer.
  const counts = missing.reduce((acc, k) => (acc[k] = (acc[k] || 0) + 1, acc), {});
  const keys = Object.keys(counts).sort();
  console.log(`\nBuilt ${pages.length} pages into dist/ (${LOCALES.join(', ')}) in ${DRAFT ? 'DRAFT' : 'LIVE'} mode.`);
  console.log(`\n${keys.length} unresolved content fields — each renders as a visible placeholder:\n`);
  for (const k of keys) console.log(`  · ${k}`);
  console.log(`\nFill them in content/site.json and content/models.json, then rebuild.`);
  if (!site.forms.endpoint) {
    console.log(`\n!! The form has no endpoint. It validates and keeps the data, but tells`);
    console.log(`   the visitor plainly that nothing was sent. Set site.forms.endpoint.`);
  }
}

build();
