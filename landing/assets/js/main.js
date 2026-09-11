/* ARKHAUS — landing page behaviour.
   No dependencies. Everything here is progressive: the page is complete and
   readable with JavaScript switched off. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var raf = window.requestAnimationFrame.bind(window);

  /* ------------------------------------------------------------------ *
   * Blur-up images
   * ------------------------------------------------------------------ */

  function initLazyImages() {
    var map = window.ARKHAUS_LQIP || {};

    Array.prototype.forEach.call(document.querySelectorAll('.lz'), function (box) {
      var img = box.querySelector('.lz__img');
      var key = box.getAttribute('data-lqip');
      if (!img) return;

      if (map[key]) {
        var ph = new Image();
        ph.className = 'lz__ph';
        ph.src = map[key];
        ph.alt = '';
        ph.setAttribute('aria-hidden', 'true');
        // <picture> only allows <source> and <img> children, so the blur
        // placeholder goes into the .lz wrapper rather than next to the image.
        box.insertBefore(ph, box.firstChild);
      }

      var done = function () { box.classList.add('is-loaded'); };
      if (img.complete && img.naturalWidth) done();
      else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', function () {
          box.classList.add('is-loaded');
          box.classList.add('is-missing');
        }, { once: true });
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Scroll reveals
   * ------------------------------------------------------------------ */

  function initReveals() {
    var targets = document.querySelectorAll('[data-reveal], [data-step]');

    if (reduced.matches || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Header state, scroll progress, section spy, sticky dock
   * ------------------------------------------------------------------ */

  function initScroll() {
    var header = document.querySelector('[data-header]');
    var bar = document.querySelector('[data-progress]');
    var dock = document.querySelector('[data-dock]');
    var hero = document.querySelector('.hero');
    var ticking = false;
    var darkBands = [];

    /* The header inverts wherever an ink-coloured surface sits behind it.
       Ranges are measured once per layout rather than per frame so scrolling
       never forces a reflow. */
    function measure() {
      darkBands = Array.prototype.map.call(
        document.querySelectorAll('.hero, .dark, .income, .ftr'),
        function (el) {
          var box = el.getBoundingClientRect();
          var top = box.top + window.pageYOffset;
          return [top, top + box.height];
        }
      );
    }

    function overDark(probe) {
      for (var i = 0; i < darkBands.length; i++) {
        if (probe > darkBands[i][0] && probe < darkBands[i][1]) return true;
      }
      return false;
    }

    function frame() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var doc = document.documentElement.scrollHeight - window.innerHeight;

      if (bar) bar.style.transform = 'scaleX(' + (doc > 0 ? Math.min(y / doc, 1) : 0) + ')';

      if (header) {
        header.classList.toggle('is-stuck', y > 12);
        // Probe a little below the header's own bottom edge.
        header.classList.toggle('is-dark', overDark(y + header.offsetHeight + 24));
      }

      if (dock && hero) dock.classList.toggle('is-up', y > hero.offsetHeight * 0.85);

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      raf(frame);
    }, { passive: true });

    window.addEventListener('resize', function () { measure(); frame(); }, { passive: true });
    window.addEventListener('load', function () { measure(); frame(); });

    measure();
    frame();
  }

  function initSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------ *
   * Mobile menu
   * ------------------------------------------------------------------ */

  function initMenu() {
    var burger = document.querySelector('[data-burger]');
    var menu = document.querySelector('[data-menu]');
    if (!burger || !menu) return;

    var closeBtn = menu.querySelector('[data-menu-close]');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      menu.hidden = false;
      // Force a reflow so the clip-path transition runs from its closed state.
      void menu.offsetWidth;
      menu.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('is-locked');
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () { menu.hidden = true; }, 620);
      if (lastFocus) lastFocus.focus();
    }

    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') close(); else open();
    });

    if (closeBtn) closeBtn.addEventListener('click', close);

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !menu.classList.contains('is-open')) return;
      close();
    });

    // Keep tabbing inside the overlay while it is open.
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = menu.querySelectorAll('a[href], button');
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ------------------------------------------------------------------ *
   * Counting statistics
   * ------------------------------------------------------------------ */

  function initCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    if (reduced.matches || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var started = null;
        var span = target > 100 ? 1400 : 900;

        function tick(now) {
          if (started === null) started = now;
          var p = Math.min((now - started) / span, 1);
          // easeOutExpo — fast out of the gate, settles on the number
          var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = String(Math.round(target * eased));
          if (p < 1) raf(tick);
        }

        el.textContent = '0';
        raf(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(nodes, function (n) { io.observe(n); });
  }

  /* ------------------------------------------------------------------ *
   * Parallax on gallery images
   * ------------------------------------------------------------------ */

  function initParallax() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.par'));
    if (!items.length || reduced.matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var ticking = false;

    function frame() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var box = el.parentNode.getBoundingClientRect();
        if (box.bottom < -80 || box.top > vh + 80) return;
        var progress = (box.top + box.height / 2 - vh / 2) / vh; // -1 … 1
        el.style.transform = 'translate3d(0,' + (progress * -22).toFixed(2) + 'px,0) scale(1.08)';
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      raf(frame);
    }, { passive: true });

    frame();
  }

  /* ------------------------------------------------------------------ *
   * FAQ accordion
   * ------------------------------------------------------------------ */

  function initAccordion() {
    var root = document.querySelector('[data-acc]');
    if (!root) return;

    var buttons = Array.prototype.slice.call(root.querySelectorAll('.acc__btn'));

    function collapse(btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', 'false');
      panel.style.height = panel.scrollHeight + 'px';
      raf(function () { panel.style.height = '0px'; });
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
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        buttons.forEach(function (other) {
          if (other.getAttribute('aria-expanded') === 'true') collapse(other);
        });
        if (!isOpen) expand(btn);
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Quote form
   * ------------------------------------------------------------------ */

  var RULES = {
    name: function (v) {
      return v.trim().length >= 2 || 'Please tell us who we’re writing to.';
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) ||
        'That address doesn’t look right — we can’t send the quote without it.';
    },
    phone: function (v) {
      if (!v.trim()) return true; // optional
      return /^[+()\d][\d\s()\-.]{5,}$/.test(v.trim()) || 'Please use digits, spaces and an optional +.';
    },
    model: function (v) {
      return v !== '' || 'Pick one — “not sure yet” is a valid answer.';
    }
  };

  function initForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var card = form.closest('.form');
    var submit = form.querySelector('[data-submit]');
    var status = form.querySelector('[data-form-status]');
    var doneMsg = card.querySelector('[data-done-msg]');

    function fieldOf(input) { return input.closest('.field'); }

    function setError(input, message) {
      var field = fieldOf(input);
      if (!field) return;
      var box = field.querySelector('[data-err] span:last-child');
      if (message === true || message === undefined) {
        field.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        return true;
      }
      field.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (box) box.textContent = message;
      return false;
    }

    function validate(input) {
      var rule = RULES[input.name];
      if (!rule) return true;
      return setError(input, rule(input.value));
    }

    Object.keys(RULES).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) validate(input);
      });
      input.addEventListener('change', function () { validate(input); });
    });

    // A "Price this model" button preselects the model and moves focus into the form.
    Array.prototype.forEach.call(document.querySelectorAll('[data-model]'), function (link) {
      link.addEventListener('click', function () {
        var select = form.elements.model;
        if (!select) return;
        select.value = link.getAttribute('data-model');
        setError(select, true);
        window.setTimeout(function () {
          var name = form.elements.name;
          if (name && !name.value) name.focus({ preventScroll: true });
        }, 700);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var invalid = null;
      Object.keys(RULES).forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        if (!validate(input) && !invalid) invalid = input;
      });

      if (invalid) {
        if (status) status.textContent = 'The form has errors. Please check the highlighted fields.';
        invalid.focus();
        return;
      }

      submit.classList.add('is-busy');
      submit.setAttribute('aria-disabled', 'true');
      if (status) status.textContent = 'Sending your request…';

      var payload = {};
      new FormData(form).forEach(function (value, key) { payload[key] = value; });
      payload.submittedAt = new Date().toISOString();

      /* No backend is wired up in this build. The lead is kept locally so the
         flow can be demonstrated end to end; point this at your CRM endpoint. */
      window.setTimeout(function () {
        try {
          var all = JSON.parse(window.localStorage.getItem('arkhaus.leads') || '[]');
          all.push(payload);
          window.localStorage.setItem('arkhaus.leads', JSON.stringify(all));
        } catch (err) { /* private mode — nothing to store, carry on */ }

        submit.classList.remove('is-busy');
        submit.removeAttribute('aria-disabled');

        if (doneMsg && payload.model && payload.model !== 'Not sure yet') {
          doneMsg.textContent = 'Your ' + payload.model + ' quote is being prepared. ' +
            'A project lead will come back to you within one business day.';
        }

        card.classList.add('is-done');
        if (status) status.textContent = 'Sent. We will reply within one business day.';
      }, 900);
    });
  }

  /* ------------------------------------------------------------------ *
   * Anchor scrolling that respects the sticky header
   * ------------------------------------------------------------------ */

  function initAnchors() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: top, behavior: reduced.matches ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  }

  /* ------------------------------------------------------------------ */

  function boot() {
    initLazyImages();
    initReveals();
    initScroll();
    initSpy();
    initMenu();
    initCounters();
    initParallax();
    initAccordion();
    initForm();
    initAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
