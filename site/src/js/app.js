/* Modular homes — client behaviour.
 * No dependencies. Every page works without JavaScript: the form falls back to
 * a normal submit, the accordion panels are open by default in the markup flow,
 * and no content is hidden behind a scroll animation. */

(function () {
  'use strict';

  var CFG = window.SITE || {};
  var dl = function (obj) { (window.dataLayer = window.dataLayer || []).push(obj); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- images ---------------- */

  function initImages() {
    $$('[data-lz]').forEach(function (box) {
      var img = box.querySelector('picture img') || box.querySelector('img:not(.lz__ph)');
      if (!img) return;
      var done = function () { box.classList.add('is-loaded'); };
      if (img.complete && img.naturalWidth) done();
      else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      }
    });
  }

  /* ---------------- header + mobile sheet ---------------- */

  function initHeader() {
    var hdr = $('[data-header]');
    var dock = $('[data-dock]');
    var ticking = false;
    function frame() {
      var y = window.pageYOffset;
      if (hdr) hdr.classList.toggle('is-stuck', y > 8);
      if (dock) dock.classList.toggle('is-up', y > 420);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(frame);
    }, { passive: true });
    frame();
  }

  function initSheet() {
    var burger = $('[data-burger]');
    var sheet = $('[data-sheet]');
    if (!burger || !sheet) return;
    var closeBtn = $('[data-sheet-close]', sheet);
    var last = null;

    function open() {
      last = document.activeElement;
      sheet.hidden = false;
      void sheet.offsetWidth;
      sheet.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      sheet.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () { sheet.hidden = true; }, 240);
      if (last) last.focus();
    }
    burger.addEventListener('click', function () {
      burger.getAttribute('aria-expanded') === 'true' ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) close();
    });
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = $$('a[href], button', sheet);
      if (!items.length) return;
      var first = items[0], lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------- accordion ---------------- */

  function initAccordions() {
    $$('[data-acc]').forEach(function (root) {
      var buttons = $$('.acc__btn', root);
      function collapse(btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        btn.setAttribute('aria-expanded', 'false');
        panel.style.height = panel.scrollHeight + 'px';
        window.requestAnimationFrame(function () { panel.style.height = '0px'; });
      }
      function expand(btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        btn.setAttribute('aria-expanded', 'true');
        panel.style.height = panel.scrollHeight + 'px';
        panel.addEventListener('transitionend', function once(e) {
          if (e.propertyName !== 'height') return;
          panel.style.height = 'auto';
          panel.removeEventListener('transitionend', once);
        });
      }
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var open = btn.getAttribute('aria-expanded') === 'true';
          buttons.forEach(function (b) { if (b.getAttribute('aria-expanded') === 'true') collapse(b); });
          if (!open) expand(btn);
        });
      });
    });
  }

  /* ---------------- catalogue filter ---------------- */

  function initFilter() {
    var grid = $('[data-model-grid]');
    if (!grid) return;
    var buttons = $$('[data-filter]');
    var empty = $('[data-filter-empty]');
    function apply(key) {
      var shown = 0;
      $$('[data-purpose]', grid).forEach(function (card) {
        var match = key === 'all' || card.getAttribute('data-purpose').split(' ').indexOf(key) > -1;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === key)); });
      if (history.replaceState) history.replaceState(null, '', key === 'all' ? location.pathname : '#' + key);
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
    });
    var hash = location.hash.replace('#', '');
    if (hash === 'living' || hash === 'tourism') apply(hash);
  }

  /* ---------------- lightbox (gallery + floor plan) ---------------- */

  function initLightbox() {
    var box = $('[data-lightbox]');
    if (!box) return;
    var img = $('[data-lightbox-img]', box);
    var cap = $('[data-lightbox-cap]', box);
    var closeBtn = $('[data-lightbox-close]', box);
    var last = null;

    function open(src, caption) {
      last = document.activeElement;
      img.src = src;
      img.alt = caption || '';
      cap.textContent = caption || '';
      box.hidden = false;
      void box.offsetWidth;
      box.classList.add('is-open');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    }
    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () { box.hidden = true; img.removeAttribute('src'); }, 220);
      if (last) last.focus();
    }
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-zoom]');
      if (!trigger) return;
      e.preventDefault();
      open(trigger.getAttribute('data-zoom'), trigger.getAttribute('data-zoom-cap'));
    });
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });
  }

  /* ---------------- enquiry form ---------------- */

  var DRAFT_KEY = 'enquiry.draft';

  function initForm() {
    var form = $('#quote-form');
    if (!form) return;

    var S = CFG.strings || {};
    var E = S.formErrors || {};
    var steps = $$('[data-step]', form);
    var nextBtn = $('[data-next]', form);
    var prevBtn = $('[data-prev]', form);
    var submitBtn = $('[data-submit]', form);
    var stepLabel = $('[data-step-label]', form);
    var stepBar = $('[data-step-bar]', form);
    var status = $('[data-form-status]', form);
    var wrap = form.closest('.form-wrap');
    var okPanel = $('[data-result-ok]', wrap);
    var warnPanel = $('[data-result-warn]', wrap);
    var endpoint = form.getAttribute('data-endpoint');
    var current = 1;

    /* Where the visitor came from — needed to attribute the lead. */
    var params = new URLSearchParams(location.search);
    $$('[data-utm]', form).forEach(function (input) {
      var v = params.get(input.getAttribute('data-utm'));
      if (v) input.value = v;
    });
    var sp = $('[data-source-page]', form);
    if (sp) sp.value = location.pathname;
    var rf = $('[data-referrer]', form);
    if (rf) rf.value = document.referrer || '';

    /* Keep what was typed if the visitor navigates to a model page and back. */
    function saveDraft() {
      try {
        var data = {};
        new FormData(form).forEach(function (v, k) { if (k.indexOf('utm_') !== 0) data[k] = v; });
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch (err) { /* storage unavailable — not worth failing over */ }
    }
    function loadDraft() {
      try {
        var raw = sessionStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        var data = JSON.parse(raw);
        Object.keys(data).forEach(function (k) {
          var field = form.elements[k];
          if (!field) return;
          if (field.length && field[0] && field[0].type === 'radio') {
            Array.prototype.forEach.call(field, function (r) { r.checked = r.value === data[k]; });
          } else if (field.type === 'checkbox') {
            field.checked = Boolean(data[k]);
          } else if (!field.value || field.tagName === 'SELECT') {
            // A model preselected by the page wins over the draft.
            if (!(k === 'model' && field.value)) field.value = data[k];
          }
        });
      } catch (err) { /* ignore a malformed draft */ }
    }
    loadDraft();
    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);

    function fieldOf(el) { return el.closest('.field'); }

    function setError(el, message) {
      var f = fieldOf(el);
      if (!f) return !message;
      var slot = $('[data-err]', f);
      if (!message) {
        f.classList.remove('has-error');
        el.removeAttribute('aria-invalid');
        return true;
      }
      f.classList.add('has-error');
      el.setAttribute('aria-invalid', 'true');
      if (slot) slot.textContent = message;
      return false;
    }

    function validate(el) {
      var v = (el.value || '').trim();
      if (el.type === 'checkbox') return setError(el, el.checked ? null : E.consent);
      if (el.name === 'name') return setError(el, v.length >= 2 ? null : E.name);
      if (el.name === 'phone') return setError(el, /^[+()\d][\d\s()\-.]{5,}$/.test(v) ? null : E.phone);
      if (el.name === 'email') return setError(el, (!v || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) ? null : E.email);
      if (el.required) return setError(el, v ? null : E.required);
      return true;
    }

    $$('input, select, textarea', form).forEach(function (el) {
      if (el.type === 'hidden') return;
      el.addEventListener('blur', function () { validate(el); });
      el.addEventListener('input', function () {
        var f = fieldOf(el);
        if (f && f.classList.contains('has-error')) validate(el);
      });
    });

    function validateStep(n) {
      var scope = steps[n - 1];
      var bad = null;
      $$('input, select, textarea', scope).forEach(function (el) {
        if (el.type === 'hidden') return;
        if (!validate(el) && !bad) bad = el;
      });
      if (bad) {
        if (status) status.textContent = E.summary || '';
        bad.focus();
      }
      return !bad;
    }

    function show(n) {
      current = n;
      steps.forEach(function (s, i) { s.hidden = (i + 1) !== n; });
      if (prevBtn) prevBtn.hidden = n === 1;
      if (nextBtn) nextBtn.hidden = n !== 1;
      if (submitBtn) submitBtn.hidden = n !== 2;
      if (stepLabel) stepLabel.textContent = n === 1 ? S.step1 : S.step2;
      if (stepBar) stepBar.style.width = n === 1 ? '50%' : '100%';
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (!validateStep(1)) return;
      dl({ event: 'form_step_2', model: (form.elements.model || {}).value || '' });
      show(2);
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { show(1); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(1)) { show(1); return; }
      if (!validateStep(2)) return;

      var payload = {};
      new FormData(form).forEach(function (v, k) { payload[k] = v; });
      payload.submitted_at = new Date().toISOString();

      /* No endpoint configured: say so. Never show a success screen that did
         not happen — a visitor who thinks they have enquired will not call. */
      if (!endpoint) {
        warnPanel.classList.add('is-shown');
        warnPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (status) status.textContent = warnPanel.querySelector('h3').textContent;
        dl({ event: 'lead_submit_blocked', reason: 'no_endpoint' });
        return;
      }

      submitBtn.classList.add('is-busy');
      submitBtn.setAttribute('aria-disabled', 'true');
      var label = $('[data-submit-label]', submitBtn);
      if (label) label.textContent = S.sending || '';

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        try { sessionStorage.removeItem(DRAFT_KEY); } catch (err) {}
        dl({ event: 'generate_lead', model: payload.model || '', locale: CFG.locale, value: null });
        if (CFG.thanksUrl) { location.href = CFG.thanksUrl; return; }
        okPanel.classList.add('is-shown');
        form.hidden = true;
      }).catch(function () {
        submitBtn.classList.remove('is-busy');
        submitBtn.removeAttribute('aria-disabled');
        if (label) label.textContent = S.submit || '';
        warnPanel.classList.add('is-shown');
        warnPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        dl({ event: 'lead_submit_failed' });
      });
    });

    /* A "quote for this model" button anywhere on the page preselects it. */
    $$('a[href="#quote"]').forEach(function (a) {
      a.addEventListener('click', function () {
        dl({ event: 'quote_cta_click', from: location.pathname });
      });
    });
  }

  /* ---------------- phone-click tracking ---------------- */

  function initTracking() {
    document.addEventListener('click', function (e) {
      var tel = e.target.closest('[data-track="phone"], a[href^="tel:"]');
      if (!tel) return;
      dl({ event: 'phone_click', locale: CFG.locale, from: location.pathname });
    });
  }

  /* ---------------- cookie consent ---------------- */

  var CONSENT_KEY = 'consent.v1';

  function readConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); }
    catch (err) { return null; }
  }

  function applyConsent(c) {
    dl({ event: 'consent_update', analytics: !!c.analytics, marketing: !!c.marketing });
    var a = CFG.analytics || {};
    if (c.analytics && a.gtmId) loadScript('https://www.googletagmanager.com/gtm.js?id=' + a.gtmId);
    if (c.analytics && !a.gtmId && a.ga4Id) loadScript('https://www.googletagmanager.com/gtag/js?id=' + a.ga4Id);
    if (c.marketing && a.metaPixelId) dl({ event: 'meta_pixel_allowed', id: a.metaPixelId });
  }

  function loadScript(src) {
    if (document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function initConsent() {
    var bar = $('[data-consent]');
    if (!bar) return;
    var cats = $('[data-consent-cats]', bar);
    var saveBtn = $('[data-consent-save]', bar);
    var settingsBtn = $('[data-consent-settings]', bar);
    var acceptBtn = $('[data-consent-accept]', bar);
    var necessaryBtn = $('[data-consent-necessary]', bar);

    function open() {
      bar.hidden = false;
      void bar.offsetWidth;
      bar.classList.add('is-up');
    }
    function close() {
      bar.classList.remove('is-up');
      window.setTimeout(function () { bar.hidden = true; }, 300);
    }
    function store(c) {
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch (err) {}
      applyConsent(c);
      close();
    }

    var saved = readConsent();
    if (saved) applyConsent(saved);
    else window.setTimeout(open, 700);

    if (acceptBtn) acceptBtn.addEventListener('click', function () { store({ analytics: true, marketing: true }); });
    if (necessaryBtn) necessaryBtn.addEventListener('click', function () { store({ analytics: false, marketing: false }); });
    if (settingsBtn) settingsBtn.addEventListener('click', function () {
      cats.hidden = false;
      settingsBtn.hidden = true;
      if (saveBtn) saveBtn.hidden = false;
    });
    if (saveBtn) saveBtn.addEventListener('click', function () {
      var picked = {};
      $$('[data-cat]', cats).forEach(function (input) { picked[input.name] = input.checked; });
      store(picked);
    });
    $$('[data-consent-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (cats) cats.hidden = false;
        if (settingsBtn) settingsBtn.hidden = true;
        if (saveBtn) saveBtn.hidden = false;
        var c = readConsent() || {};
        $$('[data-cat]', cats).forEach(function (input) { input.checked = !!c[input.name]; });
        open();
      });
    });
  }

  function boot() {
    initImages();
    initHeader();
    initSheet();
    initAccordions();
    initFilter();
    initLightbox();
    initForm();
    initTracking();
    initConsent();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
