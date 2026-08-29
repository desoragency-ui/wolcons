/* ==========================================================================
   WOLCONS — collecteur d'analytics first-party, léger.
   Pas de cookie, pas de tiers, pas de donnée personnelle. Les événements
   restent dans le localStorage de l'appareil du visiteur et, si ENDPOINT
   est renseigné, sont POSTés vers VOTRE serveur. Le tableau de bord
   (/dashboard/) lit l'un ou l'autre.

   Pour passer en vrai multi-appareil : renseigner ENDPOINT ci-dessous,
   puis faire un fetch() de la même forme de données dans dashboard/data.js.
   Rien d'autre ne change dans l'interface.
   ========================================================================== */
(function () {
  'use strict';

  var ENDPOINT = '';          // ex. 'https://api.wolcons.com/collect' — vide = local uniquement
  var KEY = 'wlc_events';
  var CAP = 900;              // tampon circulaire, garde le localStorage petit

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function save(rows) {
    try { localStorage.setItem(KEY, JSON.stringify(rows.slice(-CAP))); } catch (e) {}
  }

  /* Quel canal a envoyé cette visite — referrer + utm, aucun fingerprinting */
  function source() {
    var p = new URLSearchParams(location.search);
    var utm = p.get('utm_source');
    if (utm) return utm.toLowerCase();
    var r = document.referrer;
    if (!r) return 'direct';
    try {
      var h = new URL(r).hostname.replace(/^www\./, '');
      if (/google\./.test(h)) return p.get('utm_medium') === 'maps' ? 'google-maps' : 'google';
      if (/linkedin\./.test(h)) return 'linkedin';
      if (/instagram\./.test(h)) return 'instagram';
      if (/facebook\.|fb\./.test(h)) return 'facebook';
      if (/bing\./.test(h)) return 'bing';
      if (/tiktok\./.test(h)) return 'tiktok';
      if (h === location.hostname) return 'internal';
      return h;
    } catch (e) { return 'direct'; }
  }

  function device() {
    var w = innerWidth;
    return w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
  }

  function lang() {
    try {
      if (window.WOLCONS_LANG && window.WOLCONS_LANG.get) return window.WOLCONS_LANG.get();
    } catch (e) {}
    return (document.documentElement.lang || 'fr').slice(0, 2);
  }

  var SESSION = (function () {
    try {
      var s = sessionStorage.getItem('wlc_sid');
      if (!s) { s = String(Date.now()) + Math.random().toString(36).slice(2, 8); sessionStorage.setItem('wlc_sid', s); }
      return s;
    } catch (e) { return 'nosession'; }
  })();

  /* Première visite de la session ? sert à séparer sessions et pages vues */
  var NEW_SESSION = (function () {
    try {
      if (sessionStorage.getItem('wlc_seen')) return false;
      sessionStorage.setItem('wlc_seen', '1');
      return true;
    } catch (e) { return true; }
  })();

  function track(type, detail) {
    var ev = {
      t: type,
      d: (detail === undefined ? null : detail),
      ts: Date.now(),
      lang: lang(),
      src: source(),
      dev: device(),
      path: location.pathname,
      sid: SESSION
    };
    var rows = load(); rows.push(ev); save(rows);
    if (ENDPOINT) {
      try {
        navigator.sendBeacon
          ? navigator.sendBeacon(ENDPOINT, new Blob([JSON.stringify(ev)], { type: 'application/json' }))
          : fetch(ENDPOINT, { method: 'POST', body: JSON.stringify(ev), keepalive: true });
      } catch (e) {}
    }
    return ev;
  }
  window.wlcTrack = track;

  /* ---------------------------------------------------- événements auto */
  track('pageview', NEW_SESSION ? 'session' : 'page');

  var txt = function (el) { return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; };

  /* Le site est traduit en direct (i18n.js) : enregistrer le TEXTE d'un titre
     éclaterait la même réalisation en trois entrées FR/EN/AR dans le tableau de
     bord. On enregistre donc une clé stable tirée du chemin d'image, qui, elle,
     ne change jamais de langue. Le libellé lisible est remis côté dashboard. */
  function slugFromImg(scope, re) {
    if (!scope) return '';
    var img = scope.querySelector('img');
    var m = img && (img.getAttribute('src') || '').match(re);
    return m ? m[1] : '';
  }
  var projectSlug = function (card) { return slugFromImg(card, /projets\/([a-z0-9-]+)\//i); };
  var serviceSlug = function (card) { return slugFromImg(card, /svc-([a-z0-9-]+)\./i); };
  /* la FAQ n'a pas d'image : on prend le rang de la question, stable lui aussi */
  function faqIndex(summary) {
    var list = Array.prototype.slice.call(document.querySelectorAll('.faq__list .qa'));
    return String(list.indexOf(summary.parentNode));
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a,button');
    if (!a) return;
    var href = (a.getAttribute('href') || '').toLowerCase();

    if (href.indexOf('wa.me') > -1) {
      return void track('whatsapp_click', a.classList.contains('whatsapp') ? 'bouton-flottant' : 'page');
    }
    if (href.indexOf('tel:') === 0) return void track('call_click', href.replace('tel:', ''));
    if (href.indexOf('mailto:') === 0) return void track('mail_click', href.replace('mailto:', ''));
    if (href.indexOf('maps.google') > -1 || href.indexOf('google.com/maps') > -1 || href.indexOf('goo.gl/maps') > -1) {
      return void track('map_click');
    }

    if (a.hasAttribute('data-lang')) return void track('lang_switch', a.getAttribute('data-lang'));
    if (a.hasAttribute('data-filter')) return void track('project_filter', a.getAttribute('data-filter'));

    /* « Chiffrer mon aménagement », « Lancer mon projet »… dans une carte métier */
    var svc = a.closest('.service');
    if (svc && a.classList.contains('link-arrow')) {
      return void track('service_interest', serviceSlug(svc) || txt(svc.querySelector('h3')));
    }

    /* navigation du carrousel d'un projet = intérêt marqué */
    var pcarBtn = a.closest('.pcar__nav, .pcar__dot');
    if (pcarBtn) {
      var pj = a.closest('.project');
      return void track('project_gallery', projectSlug(pj));
    }

    /* tout CTA qui mène au devis */
    if (href.indexOf('#devis') > -1) {
      return void track('cta_click', txt(a).slice(0, 48) || 'devis');
    }
  }, true);

  /* ---- formulaire de devis ---- */
  var form = document.querySelector('[data-form]');
  if (form) {
    var started = false;
    form.addEventListener('focusin', function () {
      if (started) return;
      started = true;
      track('quote_start');
    });

    /* phase de capture : script.js lit puis vide le formulaire dans son
       propre handler, on relève donc les champs avant qu'il ne tourne */
    form.addEventListener('submit', function () {
      var get = function (sel) { var el = form.querySelector(sel); return el ? el.value.trim() : ''; };
      var idx = function (sel) { var el = form.querySelector(sel); return el ? el.selectedIndex : -1; };
      if (get('[name="_honey"]')) return;                 // robot : on n'enregistre rien
      var nom = get('#f-nom');
      track('quote_submit', {
        /* i18n.js traduit aussi le texte des <option> : on garde le RANG, qui
           lui ne bouge pas, et le dashboard le retraduit en libellé canonique */
        typeIdx: idx('#f-type'),
        delaiIdx: idx('#f-delai'),
        type: get('#f-type') || 'Non précisé',
        ville: get('#f-ville') || 'Non précisée',
        surface: get('#f-surface') || '',
        delai: get('#f-delai') || 'Non précisé',
        /* initiales uniquement : pas de donnée nominative dans le stockage */
        who: nom ? nom.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase(); }).join('.') + '.' : '—'
      });
    }, true);
  }

  /* ---- FAQ ---- */
  document.querySelectorAll('.qa summary').forEach(function (s) {
    s.addEventListener('click', function () {
      if (!s.parentNode.open) track('faq_open', faqIndex(s));
    });
  });

  /* ---- sections vues + projets vus (IntersectionObserver, une fois chacun) ---- */
  if ('IntersectionObserver' in window) {
    /* PAS de seuil en ratio ici : « Nos métiers » fait 2 300 px et
       « Réalisations » 3 000 px, soit bien plus qu'un écran. Leur ratio
       d'intersection plafonne sous 0,35 et l'événement ne partirait jamais.
       On observe donc le passage dans la bande centrale de l'écran, comme
       le fait déjà le scrollspy de script.js. */
    var seenSection = {};
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        if (id && !seenSection[id]) { seenSection[id] = 1; track('section_view', id); }
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    document.querySelectorAll('section[id]').forEach(function (s) { sio.observe(s); });

    var seenProject = {};
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var name = projectSlug(en.target);
        if (name && !seenProject[name]) { seenProject[name] = 1; track('project_view', name); }
      });
    }, { rootMargin: '-25% 0px -25% 0px', threshold: 0 });
    document.querySelectorAll('.project').forEach(function (p) { pio.observe(p); });
  }

  /* ---- profondeur de lecture, une fois par palier ---- */
  var hit = {};
  addEventListener('scroll', function () {
    var h = document.body.scrollHeight || 1;
    var p = Math.round((scrollY + innerHeight) / h * 100);
    [25, 50, 75, 100].forEach(function (m) {
      if (p >= m && !hit[m]) { hit[m] = 1; track('scroll_depth', m); }
    });
  }, { passive: true });

  /* ---- temps passé ---- */
  var t0 = Date.now();
  addEventListener('pagehide', function () {
    track('time_on_page', Math.round((Date.now() - t0) / 1000));
  });
})();
