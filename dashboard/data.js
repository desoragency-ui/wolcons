/* ==========================================================================
   WOLCONS — couche de données du tableau de bord.

   Deux sources, permutables depuis l'interface :
     DÉMO  — chiffres d'exemple générés, clairement étiquetés comme fictifs.
             Ils existent pour valider la maquette avant que le collecteur
             n'ait accumulé quoi que ce soit.
     RÉEL  — événements réellement capturés par assets/js/analytics.js dans
             CE navigateur (clé localStorage « wlc_events »).

   Pour passer en vrai multi-appareil : faire POSTer analytics.js vers votre
   endpoint, puis renvoyer ici la même forme de données via fetch().
   Rien d'autre ne change dans l'interface.
   ========================================================================== */
(function () {
  'use strict';

  /* Adresse du collecteur, côté lecture. Vide = pas de serveur : le mode
     « Données réelles » ne montre alors que l'appareil courant.
     Une fois les Pages Functions déployées, mettre '/api/events'.
     Doit rester cohérent avec ENDPOINT dans assets/js/analytics.js. */
  var ENDPOINT = '';

  /* ---------------------------------------------------------- référentiels */

  var SOURCES = ['google', 'google-maps', 'linkedin', 'direct', 'instagram', 'facebook', 'bing'];
  var SOURCE_LABEL = {
    'google': 'Google (recherche)',
    'google-maps': 'Google Maps',
    'linkedin': 'LinkedIn',
    'direct': 'Direct / bouche-à-oreille',
    'instagram': 'Instagram',
    'facebook': 'Facebook',
    'bing': 'Bing',
    'internal': 'Navigation interne'
  };

  /* les 4 valeurs du <select id="f-type"> du site + le métier « Project management » */
  var TYPES = ['Aménagement TCE', 'Construction clé en main', 'Project management',
               'Rénovation / réhabilitation', 'Je ne sais pas encore'];

  /* DH/m² indicatifs, repris des fourchettes annoncées dans la FAQ du site.
     Sert uniquement à estimer un ordre de grandeur de pipeline — jamais un prix. */
  var RATE = {
    'Aménagement TCE': 6500,
    'Construction clé en main': 5000,
    'Project management': 5500,
    'Rénovation / réhabilitation': 4200,
    'Je ne sais pas encore': 4500
  };

  var CITIES = ['Casablanca', 'Rabat', 'Kénitra', 'Marrakech', 'Tanger', 'Mohammedia', 'Autres'];

  var DELAYS = ['Dès que possible', 'Dans 1 à 3 mois', 'Dans 3 à 6 mois', 'Je me renseigne'];

  var SURFACE_BANDS = ['< 100 m²', '100 – 300 m²', '300 – 1 000 m²', '1 000 – 3 000 m²', '> 3 000 m²'];
  var SURFACE_MID   = { '< 100 m²': 70, '100 – 300 m²': 190, '300 – 1 000 m²': 620,
                        '1 000 – 3 000 m²': 1900, '> 3 000 m²': 4000 };

  var BUDGET_BANDS = ['< 0,5 MDH', '0,5 – 2 MDH', '2 – 5 MDH', '5 – 15 MDH', '> 15 MDH'];

  /* les 13 réalisations présentes dans index.html.
     « slug » = le dossier d'images, clé stable enregistrée par analytics.js :
     le titre affiché, lui, change avec la langue du visiteur. */
  var PROJECTS = [
    { slug: 'ambassade',     name: 'Ambassade de Belgique',   cat: 'design-build' },
    { slug: 'novares-usine', name: 'Usine Novares',           cat: 'design-build' },
    { slug: 'riad-pru',      name: 'Riad Pru',                cat: 'design-build' },
    { slug: 'saint-louis',   name: 'Aménagement Saint Louis', cat: 'amenagement' },
    { slug: 'huawei',        name: 'Plateau bureaux Huawei',  cat: 'amenagement' },
    { slug: 'showroom-tp',   name: 'Showroom Thomas & Piron', cat: 'amenagement' },
    { slug: 'ish',           name: 'Aménagement ISH',         cat: 'amenagement' },
    { slug: 'villa-cs',      name: 'Villa CS',                cat: 'construction' },
    { slug: 'villa-e',       name: 'Villa E',                 cat: 'construction' },
    { slug: 'villa-ib',      name: 'Villa IB',                cat: 'construction' },
    { slug: 'villa-mw',      name: 'Villa MW',                cat: 'construction' },
    { slug: 'novares-siege', name: 'Siège Novares',           cat: 'construction' },
    { slug: 'hangar',        name: 'Hangar industriel',       cat: 'construction' }
  ];
  var PROJECT_LABEL = PROJECTS.reduce(function (a, p) { a[p.slug] = p.name; return a; }, {});

  /* même logique pour les 3 cartes « Nos métiers » (svc-*.webp) */
  var SERVICE_LABEL = { 'tce': 'Aménagement TCE', 'construction': 'Construction clé en main',
                        'pm': 'Project management' };

  var FILTERS = { 'all': 'Tout', 'amenagement': 'Aménagement',
                  'construction': 'Construction', 'design-build': 'Design & Build' };

  /* sections de index.html, dans l'ordre de la page */
  var SECTIONS = [
    ['clients', 'Ils nous font confiance'],
    ['probleme', 'Le problème'],
    ['apropos', 'Nous sommes'],
    ['methode', 'La méthode'],
    ['metiers', 'Nos métiers'],
    ['realisations', 'Réalisations'],
    ['partenaires', 'Partenaires'],
    ['faq', 'Questions fréquentes'],
    ['devis', 'Demande de devis']
  ];
  var SECTION_LABEL = SECTIONS.reduce(function (a, s) { a[s[0]] = s[1]; return a; }, {});

  var FAQS = [
    'Qu’est-ce que le « tout corps d’état » exactement ?',
    'Combien coûte un aménagement au mètre carré ?',
    'Travaillez-vous avec les particuliers ?',
    'Intervenez-vous en dehors de Casablanca ?',
    'Le devis peut-il changer en cours de chantier ?',
    'Comment suivre l’avancement sans venir sur place ?'
  ];

  var EVENT_LABEL = {
    pageview: 'Visite', session: 'Session',
    section_view: 'Section vue', service_interest: 'Métier consulté',
    project_view: 'Réalisation vue', project_gallery: 'Galerie projet',
    project_filter: 'Filtre réalisations', quote_start: 'Formulaire ouvert',
    quote_submit: 'Devis demandé', whatsapp_click: 'Clic WhatsApp',
    call_click: 'Appel', mail_click: 'E-mail', map_click: 'Itinéraire',
    faq_open: 'Question ouverte', lang_switch: 'Changement de langue',
    cta_click: 'Clic CTA', scroll_depth: 'Profondeur de lecture',
    time_on_page: 'Temps sur la page'
  };

  /* ------------------------------------------------------------- utilitaires */

  /* pseudo-aléatoire déterministe : la démo ne saute pas d'un rechargement à l'autre */
  function rng(seed) {
    return function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }

  /* tirage pondéré : garde la démo cohérente avec la hiérarchie réelle des
     métiers (le TCE domine, « je ne sais pas encore » reste marginal) */
  function weighted(r, arr, weights) {
    var x = r(), acc = 0;
    for (var i = 0; i < arr.length; i++) {
      acc += weights[i];
      if (x <= acc) return arr[i];
    }
    return arr[arr.length - 1];
  }

  /* Clé de jour en heure LOCALE. toISOString() bascule en UTC : à Casablanca
     (UTC+1) comme en Europe, minuit local retombe la veille en UTC et toute la
     série se décale d'un jour. */
  function dayKey(d) {
    return d.getFullYear() + '-' +
           String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
  }

  function emptyShape() {
    return {
      series: [], sources: {}, types: {}, cities: {}, langs: {}, devices: {},
      funnel: {}, hours: [], projects: {}, filters: {}, budgets: {}, surfaces: {},
      delays: {}, sections: {}, faq: {}, scroll: {}, recent: [], events: [],
      pipelineByType: {}, engagement: {}, weekday: {}
    };
  }

  function bandOfSurface(m2) {
    return m2 < 100 ? SURFACE_BANDS[0] : m2 < 300 ? SURFACE_BANDS[1] :
           m2 < 1000 ? SURFACE_BANDS[2] : m2 < 3000 ? SURFACE_BANDS[3] : SURFACE_BANDS[4];
  }
  function bandOfBudget(mdh) {
    return mdh < 0.5 ? BUDGET_BANDS[0] : mdh < 2 ? BUDGET_BANDS[1] : mdh < 5 ? BUDGET_BANDS[2] :
           mdh < 15 ? BUDGET_BANDS[3] : BUDGET_BANDS[4];
  }
  /* « 160 m² », « 1200m2 », « 3 000 » → nombre */
  function parseSurface(txt) {
    if (!txt) return 0;
    var n = String(txt).replace(/[^\d]/g, '');
    return n ? parseInt(n, 10) : 0;
  }
  function valueMDH(type, m2) {
    if (!m2) return 0;
    return (m2 * (RATE[type] || 4500)) / 1e6;
  }

  /* -------------------------------------------------------------- DÉMO */

  function demo(days) {
    var r = rng(20260829);
    var out = emptyShape();
    out.demo = true;
    var today = new Date(); today.setHours(0, 0, 0, 0);

    /* --- série quotidienne --------------------------------------------- */
    for (var i = days - 1; i >= 0; i--) {
      var d = new Date(today); d.setDate(d.getDate() - i);
      var dow = d.getDay();
      /* B2B : creux le week-end, pas une fermeture nette comme un cabinet */
      var week = dow === 0 ? 0.32 : dow === 6 ? 0.55 : dow === 5 ? 0.92 : 1;
      var growth = 1 + (days - i) / days * 0.38;
      var views = Math.round((58 + r() * 46) * week * growth);
      var sessions = Math.round(views * (0.80 + r() * 0.09));
      /* B2B construction : peu de demandes, mais chacune vaut cher — les taux
         restent volontairement bas pour que la maquette ne promette rien d'irréel */
      var quotes = Math.round(views * (0.004 + r() * 0.005));
      var wa = Math.round(views * (0.012 + r() * 0.012));
      var calls = Math.round(views * (0.010 + r() * 0.010));
      var mails = Math.round(views * (0.003 + r() * 0.004));
      var qualified = Math.round((quotes + wa * 0.35 + calls * 0.5) * (0.4 + r() * 0.22));
      out.series.push({
        date: dayKey(d), dow: dow,
        views: views, sessions: sessions, quotes: quotes, wa: wa,
        calls: calls, mails: mails, qualified: qualified, value: 0
      });
    }

    var totalViews = out.series.reduce(function (s, x) { return s + x.views; }, 0);

    /* --- sources ------------------------------------------------------- */
    [0.31, 0.19, 0.16, 0.14, 0.09, 0.07, 0.04].forEach(function (w, k) {
      out.sources[SOURCES[k]] = Math.round(totalViews * w);
    });

    /* --- langues / appareils ------------------------------------------- */
    out.langs = { fr: Math.round(totalViews * 0.68), ar: Math.round(totalViews * 0.19), en: Math.round(totalViews * 0.13) };
    out.devices = { mobile: Math.round(totalViews * 0.63), desktop: Math.round(totalViews * 0.29), tablet: Math.round(totalViews * 0.08) };

    /* --- villes -------------------------------------------------------- */
    [0.46, 0.17, 0.11, 0.09, 0.06, 0.05, 0.06].forEach(function (w, k) {
      out.cities[CITIES[k]] = Math.round(totalViews * w);
    });

    /* --- intérêt par métier (vues des cartes « Nos métiers ») ---------- */
    [0.42, 0.29, 0.16, 0.09, 0.04].forEach(function (w, k) {
      out.types[TYPES[k]] = Math.round(totalViews * 0.31 * w);
    });

    /* --- sections vues (décroissant selon la position dans la page) ---- */
    SECTIONS.forEach(function (s, k) {
      var decay = Math.pow(0.88, k) * (0.95 + r() * 0.12);
      out.sections[s[0]] = Math.round(totalViews * decay);
    });

    /* --- profondeur de lecture ----------------------------------------- */
    out.scroll = {
      '25%': Math.round(totalViews * 0.86), '50%': Math.round(totalViews * 0.58),
      '75%': Math.round(totalViews * 0.34), '100%': Math.round(totalViews * 0.19)
    };

    /* --- réalisations vues --------------------------------------------- */
    PROJECTS.forEach(function (p, k) {
      var lift = p.cat === 'design-build' ? 1.35 : p.cat === 'amenagement' ? 1.1 : 0.9;
      out.projects[p.name] = Math.round((30 + r() * 90) * lift * (days / 30));
    });
    Object.keys(FILTERS).forEach(function (k, idx) {
      out.filters[FILTERS[k]] = Math.round((idx === 0 ? 120 : 40 + r() * 60) * (days / 30));
    });

    /* --- FAQ ------------------------------------------------------------ */
    [0.27, 0.31, 0.14, 0.11, 0.09, 0.08].forEach(function (w, k) {
      out.faq[FAQS[k]] = Math.round(totalViews * 0.11 * w);
    });

    /* --- demandes de devis détaillées ----------------------------------- */
    var totalQuotes = out.series.reduce(function (s, x) { return s + x.quotes; }, 0);
    var WHO = ['K.B.', 'S.E.', 'M.T.', 'A.L.', 'Y.C.', 'N.R.', 'H.M.', 'I.D.', 'O.F.', 'R.A.', 'Z.B.', 'F.K.'];
    var STATUS = ['nouveau', 'visite planifiée', 'devis envoyé', 'gagné', 'perdu'];
    var quoteRows = [];
    for (var q = 0; q < totalQuotes; q++) {
      var type = weighted(r, TYPES, [0.42, 0.29, 0.16, 0.09, 0.04]);
      /* la plupart des demandes sont des plateaux et villas ; les très grandes
         surfaces industrielles restent rares */
      var band = SURFACE_BANDS[Math.floor(Math.pow(r(), 4) * SURFACE_BANDS.length)];
      var m2 = Math.round(SURFACE_MID[band] * (0.72 + r() * 0.56));
      var mdh = valueMDH(type, m2);
      var dq = new Date(today); dq.setDate(dq.getDate() - Math.floor(r() * days));
      quoteRows.push({
        who: WHO[q % WHO.length],
        type: type,
        ville: CITIES[Math.floor(Math.pow(r(), 1.35) * CITIES.length)],
        surface: m2,
        band: bandOfSurface(m2),
        mdh: mdh,
        delai: DELAYS[Math.floor(Math.pow(r(), 1.2) * DELAYS.length)],
        src: SOURCES[Math.floor(Math.pow(r(), 1.3) * SOURCES.length)],
        lang: r() < 0.68 ? 'fr' : r() < 0.72 ? 'en' : 'ar',
        when: dayKey(dq),
        status: STATUS[Math.floor(Math.pow(r(), 1.6) * STATUS.length)]
      });
    }
    quoteRows.sort(function (a, b) { return a.when < b.when ? 1 : -1; });

    quoteRows.forEach(function (row) {
      out.surfaces[row.band] = (out.surfaces[row.band] || 0) + 1;
      out.budgets[bandOfBudget(row.mdh)] = (out.budgets[bandOfBudget(row.mdh)] || 0) + 1;
      out.delays[row.delai] = (out.delays[row.delai] || 0) + 1;
      out.pipelineByType[row.type] = (out.pipelineByType[row.type] || 0) + row.mdh;
      var day = out.series.filter(function (s) { return s.date === row.when; })[0];
      if (day) day.value += row.mdh;
    });
    out.quotes = quoteRows;
    out.recent = quoteRows.slice(0, 12);

    /* --- heures × jours -------------------------------------------------- */
    for (var h = 0; h < 24; h++) {
      for (var dw = 0; dw < 7; dw++) {
        /* rythme de bureau marocain : 9h-13h puis 15h-19h, samedi matin, dimanche creux */
        var open = dw === 0 ? 0.08
                 : dw === 6 ? (h >= 9 && h <= 14 ? 0.55 : 0.1)
                 : (h >= 9 && h <= 12) ? 1
                 : (h >= 15 && h <= 19) ? 0.95
                 : (h >= 13 && h <= 14) ? 0.5
                 : (h >= 20 && h <= 22) ? 0.42 : 0.09;
        out.hours.push([h, dw, Math.round(r() * 13 * open * (days / 30))]);
      }
    }

    /* --- performance par jour de semaine -------------------------------- */
    var DOW = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    out.series.forEach(function (x) {
      var k = DOW[x.dow];
      if (!out.weekday[k]) out.weekday[k] = { views: 0, contacts: 0, n: 0 };
      out.weekday[k].views += x.views;
      out.weekday[k].contacts += x.quotes + x.wa + x.calls + x.mails;
      out.weekday[k].n++;
    });

    /* --- entonnoir ------------------------------------------------------- */
    var f = out.series.reduce(function (a, x) {
      a.quotes += x.quotes; a.wa += x.wa; a.calls += x.calls; a.mails += x.mails; a.qualified += x.qualified;
      return a;
    }, { quotes: 0, wa: 0, calls: 0, mails: 0, qualified: 0 });
    var contacts = f.quotes + f.wa + f.calls + f.mails;

    /* les étages doivent décroître : on les dérive des contacts réels plutôt
       que d'un pourcentage indépendant, et la visite technique — qui peut naître
       d'un appel comme d'un formulaire — se place APRÈS « contact envoyé »,
       jamais après « devis demandé » qui n'en est qu'un canal */
    out.funnel = {
      'Visites': totalViews,
      'Consultent les métiers': Math.round(totalViews * 0.51),
      'Consultent les réalisations': Math.round(totalViews * 0.33),
      'Ouvrent le formulaire': Math.round(contacts * 2.3),
      'Contact envoyé': contacts,
      'Visite technique planifiée': Math.min(f.qualified, contacts)
    };

    /* --- engagement ------------------------------------------------------ */
    var totalSessions = out.series.reduce(function (s, x) { return s + x.sessions; }, 0) || 1;
    out.engagement = {
      avgTime: Math.round(96 + r() * 60),                    // secondes
      pagesPerSession: (totalViews / totalSessions).toFixed(2),
      bounce: Math.round(38 + r() * 12),                     // %
      returning: Math.round(21 + r() * 10)                   // %
    };

    /* --- flux d'événements (aperçu) -------------------------------------- */
    var kinds = ['pageview', 'section_view', 'project_view', 'service_interest', 'cta_click',
                 'whatsapp_click', 'call_click', 'faq_open', 'quote_submit', 'scroll_depth'];
    for (var e = 0; e < 24; e++) {
      var ed = new Date(today.getTime() - Math.floor(r() * 3 * 864e5) - Math.floor(r() * 864e5));
      var kind = pick(r, kinds);
      out.events.push({
        t: kind,
        d: kind === 'section_view' ? pick(r, SECTIONS)[0]
         : kind === 'project_view' ? pick(r, PROJECTS).name
         : kind === 'service_interest' ? pick(r, TYPES)
         : kind === 'scroll_depth' ? pick(r, [25, 50, 75, 100])
         : kind === 'faq_open' ? pick(r, FAQS)
         : null,
        ts: ed.getTime(), src: pick(r, SOURCES), dev: pick(r, ['mobile', 'desktop', 'tablet']),
        lang: pick(r, ['fr', 'fr', 'ar', 'en'])
      });
    }
    out.events.sort(function (a, b) { return b.ts - a.ts; });

    return out;
  }

  /* -------------------------------------------------------------- RÉEL */

  /* Événements de CE navigateur (aucun endpoint configuré). */
  function local(days) {
    var raw = [];
    try { raw = JSON.parse(localStorage.getItem('wlc_events') || '[]'); } catch (e) { raw = []; }
    return shape(raw, days);
  }

  /* Événements du SERVEUR, tous appareils confondus. Renvoie une promesse.
     Sans endpoint, on retombe proprement sur les données de l'appareil. */
  function remote(days) {
    if (!ENDPOINT) return Promise.resolve(local(days));
    return fetch(ENDPOINT + '?days=' + days, { credentials: 'include' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) {
        var out = shape(j.events || [], days);
        out.server = true;
        return out;
      })
      .catch(function (err) {
        /* le tableau de bord doit rester lisible même si le collecteur tombe */
        var out = shape([], days);
        out.server = true;
        out.error = String(err.message || err);
        return out;
      });
  }

  /* Met en forme une liste d'événements bruts, quelle qu'en soit l'origine. */
  function shape(raw, days) {
    var cutoff = Date.now() - days * 864e5;
    raw = (raw || []).filter(function (e) { return e && e.ts >= cutoff; });

    var out = emptyShape();
    out.demo = false;
    out.empty = raw.length === 0;
    out.count = raw.length;

    var byDay = {};
    var today = new Date(); today.setHours(0, 0, 0, 0);
    for (var i = days - 1; i >= 0; i--) {
      var d = new Date(today); d.setDate(d.getDate() - i);
      var key = dayKey(d);
      byDay[key] = { date: key, dow: d.getDay(), views: 0, sessions: 0, quotes: 0,
                     wa: 0, calls: 0, mails: 0, qualified: 0, value: 0 };
    }

    var grid = {}, times = [], sessions = {}, quoteRows = [];

    raw.forEach(function (e) {
      var k = dayKey(new Date(e.ts));
      var row = byDay[k];
      if (e.sid) { sessions[e.sid] = (sessions[e.sid] || 0) + 1; }

      if (row) {
        switch (e.t) {
          case 'pageview':
            row.views++;
            if (e.d === 'session') row.sessions++;
            out.langs[e.lang] = (out.langs[e.lang] || 0) + 1;
            out.devices[e.dev] = (out.devices[e.dev] || 0) + 1;
            out.sources[e.src] = (out.sources[e.src] || 0) + 1;
            break;
          case 'whatsapp_click': row.wa++; break;
          case 'call_click':     row.calls++; break;
          case 'mail_click':     row.mails++; break;
          case 'quote_submit':
            row.quotes++;
            var det = e.d || {};
            /* le rang de l'<option> l'emporte sur son texte, qui suit la langue */
            if (det.typeIdx >= 0 && TYPES[det.typeIdx]) det.type = TYPES[det.typeIdx];
            if (det.delaiIdx >= 0 && DELAYS[det.delaiIdx]) det.delai = DELAYS[det.delaiIdx];
            var m2 = parseSurface(det.surface);
            var mdh = valueMDH(det.type, m2);
            row.value += mdh;
            out.types[det.type || 'Non précisé'] = (out.types[det.type || 'Non précisé'] || 0) + 1;
            out.cities[det.ville || 'Non précisée'] = (out.cities[det.ville || 'Non précisée'] || 0) + 1;
            out.delays[det.delai || 'Non précisé'] = (out.delays[det.delai || 'Non précisé'] || 0) + 1;
            out.pipelineByType[det.type || 'Non précisé'] = (out.pipelineByType[det.type || 'Non précisé'] || 0) + mdh;
            if (m2) {
              out.surfaces[bandOfSurface(m2)] = (out.surfaces[bandOfSurface(m2)] || 0) + 1;
              out.budgets[bandOfBudget(mdh)] = (out.budgets[bandOfBudget(mdh)] || 0) + 1;
            }
            quoteRows.push({
              who: det.who || '—', type: det.type || 'Non précisé', ville: det.ville || 'Non précisée',
              surface: m2, band: m2 ? bandOfSurface(m2) : '—', mdh: mdh,
              delai: det.delai || 'Non précisé', src: e.src, lang: e.lang,
              when: k, status: 'nouveau'
            });
            break;
          case 'section_view':      out.sections[e.d] = (out.sections[e.d] || 0) + 1; break;
          case 'service_interest':
            var sv = SERVICE_LABEL[e.d] || e.d;
            out.types[sv] = (out.types[sv] || 0) + 1; break;
          case 'project_view':
          case 'project_gallery':
            var pv = PROJECT_LABEL[e.d] || e.d;
            out.projects[pv] = (out.projects[pv] || 0) + 1; break;
          case 'project_filter':    out.filters[FILTERS[e.d] || e.d] = (out.filters[FILTERS[e.d] || e.d] || 0) + 1; break;
          case 'faq_open':
            var fq = FAQS[+e.d] || e.d;
            out.faq[fq] = (out.faq[fq] || 0) + 1; break;
          case 'scroll_depth':      out.scroll[e.d + '%'] = (out.scroll[e.d + '%'] || 0) + 1; break;
          case 'time_on_page':      if (typeof e.d === 'number') times.push(e.d); break;
        }
      }
      var dt = new Date(e.ts);
      grid[dt.getHours() + '_' + dt.getDay()] = (grid[dt.getHours() + '_' + dt.getDay()] || 0) + 1;
    });

    out.series = Object.keys(byDay).map(function (k) { return byDay[k]; });
    for (var h = 0; h < 24; h++) {
      for (var dw = 0; dw < 7; dw++) out.hours.push([h, dw, grid[h + '_' + dw] || 0]);
    }

    var DOW = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    out.series.forEach(function (x) {
      var k = DOW[x.dow];
      if (!out.weekday[k]) out.weekday[k] = { views: 0, contacts: 0, n: 0 };
      out.weekday[k].views += x.views;
      out.weekday[k].contacts += x.quotes + x.wa + x.calls + x.mails;
      out.weekday[k].n++;
    });

    var tv = out.series.reduce(function (s, x) { return s + x.views; }, 0);
    var contacts = out.series.reduce(function (s, x) { return s + x.quotes + x.wa + x.calls + x.mails; }, 0);
    var nQuotes = out.series.reduce(function (s, x) { return s + x.quotes; }, 0);

    out.funnel = {
      'Visites': tv,
      'Consultent les métiers': out.sections['metiers'] || 0,
      'Consultent les réalisations': out.sections['realisations'] || 0,
      'Ouvrent le formulaire': raw.filter(function (e) { return e.t === 'quote_start'; }).length,
      'Contact envoyé': contacts,
      'Devis envoyé depuis le site': nQuotes
    };

    var sessCount = Object.keys(sessions).length;
    out.engagement = {
      avgTime: times.length ? Math.round(times.reduce(function (a, b) { return a + b; }, 0) / times.length) : 0,
      pagesPerSession: sessCount ? (tv / sessCount).toFixed(2) : '0.00',
      bounce: (out.scroll['25%'] && tv) ? Math.max(0, Math.round((1 - out.scroll['25%'] / tv) * 100)) : 0,
      returning: 0
    };

    quoteRows.sort(function (a, b) { return a.when < b.when ? 1 : -1; });
    out.quotes = quoteRows;
    out.recent = quoteRows.slice(0, 12);
    out.events = raw.slice(-40).reverse();

    return out;
  }

  window.WolconsData = {
    demo: demo, local: local, remote: remote, ENDPOINT: ENDPOINT,
    SOURCE_LABEL: SOURCE_LABEL, SECTION_LABEL: SECTION_LABEL, EVENT_LABEL: EVENT_LABEL,
    TYPES: TYPES, CITIES: CITIES, DELAYS: DELAYS,
    SURFACE_BANDS: SURFACE_BANDS, BUDGET_BANDS: BUDGET_BANDS, RATE: RATE,
    PROJECTS: PROJECTS, FILTERS: FILTERS, SECTIONS: SECTIONS,
    PROJECT_LABEL: PROJECT_LABEL, SERVICE_LABEL: SERVICE_LABEL, FAQS: FAQS
  };
})();
