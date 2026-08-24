/* ==========================================================================
   WOLCONS — Interactions & moteur d'animation
   Vanilla JS, zéro dépendance. Tout est neutralisé par prefers-reduced-motion.

   Sommaire
   1.  Utilitaires
   2.  Préchargeur
   3.  Découpe de texte (mot par mot)
   4.  Révélation au défilement
   5.  Révélation d'images (volet + zoom)
   6.  Compteurs & barres de chiffres
   7.  Boucle de défilement (header, progression, parallaxe, rail, retour haut)
   8.  Projecteur curseur & inclinaison 3D
   9.  Boutons magnétiques
   10. Navigation (menu mobile, lien actif)
   11. Filtres réalisations
   12. Accordéon FAQ animé
   13. Carrousel d'avis
   14. Formulaire de devis
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- 1. Utils */
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionQuery.matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var $  = function (s, c) { return (c || document).querySelector(s); };

  /* Quelques libellés produits par le script lui-même : ils suivent la langue
     choisie dans le sélecteur (voir i18n.js). */
  var RUNTIME = {
    'Ouvrir le menu'        : { en: 'Open menu',   ar: '\u0641\u062a\u062d \u0627\u0644\u0642\u0627\u0626\u0645\u0629' },
    'Fermer le menu'        : { en: 'Close menu',  ar: '\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629' },
    'Merci d\u2019indiquer votre nom.' : {
      en: 'Please enter your name.',
      ar: '\u064a\u0631\u062c\u0649 \u0625\u062f\u062e\u0627\u0644 \u0627\u0633\u0645\u0643.'
    },
    'Num\u00e9ro incomplet \u2014 nous en avons besoin pour vous rappeler.' : {
      en: 'Incomplete number \u2014 we need it to call you back.',
      ar: '\u0631\u0642\u0645 \u063a\u064a\u0631 \u0645\u0643\u062a\u0645\u0644 \u2014 \u0646\u062d\u062a\u0627\u062c\u0647 \u0644\u0645\u0639\u0627\u0648\u062f\u0629 \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0628\u0643.'
    },
    'Deux champs \u00e0 corriger avant l\u2019envoi.' : {
      en: 'Two fields to fix before sending.',
      ar: '\u062d\u0642\u0644\u0627\u0646 \u064a\u062d\u062a\u0627\u062c\u0627\u0646 \u0625\u0644\u0649 \u062a\u0635\u062d\u064a\u062d \u0642\u0628\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644.'
    },
    'Bonjour Wolcons, je souhaite un devis.' : {
      en: 'Hello Wolcons, I would like a quote.',
      ar: '\u0645\u0631\u062d\u0628\u0627\u064b \u0648\u0644\u0643\u0648\u0646\u0633\u060c \u0623\u0631\u063a\u0628 \u0641\u064a \u0639\u0631\u0636 \u0633\u0639\u0631.'
    }
  };
  function T(fr) {
    var lang = window.WOLCONS_LANG ? window.WOLCONS_LANG.get() : 'fr';
    var e = RUNTIME[fr];
    return (lang !== 'fr' && e && e[lang]) ? e[lang] : fr;
  }
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var raf = window.requestAnimationFrame.bind(window);
  var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };

  var year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------- 2. Préchargeur */
  var preloader = $('[data-preloader]');
  var preBar    = $('[data-preloader-bar]');
  var readyQueue = [];
  var isReady = false;

  function onReady(fn) { isReady ? fn() : readyQueue.push(fn); }
  function flushReady() {
    if (isReady) return;
    isReady = true;
    readyQueue.splice(0).forEach(function (fn) { fn(); });
  }

  function killPreloader() {
    document.documentElement.classList.remove('is-loading');
    window.setTimeout(flushReady, preloader ? 420 : 0);
    if (!preloader) return;
    preloader.classList.add('is-done');
    window.setTimeout(function () { preloader.classList.add('is-gone'); }, 1300);
  }

  if (preloader && !reduced) {
    document.documentElement.classList.add('is-loading');

    var pct = 0;
    var fake = window.setInterval(function () {
      pct = Math.min(pct + Math.random() * 18, 92);
      if (preBar) preBar.style.width = pct + '%';
    }, 160);

    var finish = function () {
      window.clearInterval(fake);
      if (preBar) preBar.style.width = '100%';
      window.setTimeout(killPreloader, 380);
    };

    if (document.readyState === 'complete') window.setTimeout(finish, 550);
    else window.addEventListener('load', function () { window.setTimeout(finish, 350); });

    // Filet de sécurité : jamais bloqué plus de 4 s
    window.setTimeout(finish, 4000);
  } else {
    killPreloader();
  }

  /* ------------------------------------------------- 3. Découpe de texte */
  /* Enveloppe chaque mot dans .sw > i pour un effet de montée décalée,
     en préservant les <em>, <strong> et <br> présents dans le titre.       */
  function splitNode(node, counter) {
    var out = document.createDocumentFragment();

    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var words = child.textContent.split(/(\s+)/);
        words.forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { out.appendChild(document.createTextNode(' ')); return; }
          var wrap = document.createElement('span');
          wrap.className = 'sw';
          var inner = document.createElement('i');
          inner.textContent = w;
          inner.style.setProperty('--i', counter.n++);
          wrap.appendChild(inner);
          out.appendChild(wrap);
        });
      } else if (child.nodeType === 1) {
        if (child.tagName === 'BR') { out.appendChild(child.cloneNode()); counter.n += 1; return; }
        var clone = child.cloneNode(false);
        clone.appendChild(splitNode(child, counter));
        out.appendChild(clone);
      }
    });

    return out;
  }

  function splitEl(el) {
    if (reduced || el.getAttribute('data-nosplit') !== null) return;
    var frag = splitNode(el, { n: 0 });
    el.innerHTML = '';
    el.appendChild(frag);
    el.setAttribute('data-anim', 'none');   // l'opacité est portée par les mots
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
  }

  // i18n.js rappelle cette fonction après avoir réécrit un titre traduit.
  window.__wolconsSplit = splitEl;

  if (!reduced) $$('.hero__title span, .h2, .statement').forEach(splitEl);

  /* --------------------------------------------- 4. Révélation au défilement */
  var revealables = $$('[data-reveal]');

  function showAll() { revealables.forEach(function (el) { el.classList.add('is-in'); }); }

  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        onReady(function () {
          window.setTimeout(function () { el.classList.add('is-in'); }, delay);
        });
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------- 5. Révélation d'images */
  // Conteneurs sans ::after propre : on peut poser la classe directement.
  $$('.service__media, .project__media, .map').forEach(function (el) {
    if (el.querySelector('img, iframe')) el.classList.add('img-wrap');
  });

  // Images isolées : on les enveloppe pour ne pas écraser un ::after existant.
  $$('[data-img-reveal]').forEach(function (img) {
    if (img.parentElement && img.parentElement.classList.contains('img-wrap')) return;
    var box = document.createElement('div');
    box.className = 'img-wrap';
    img.parentNode.insertBefore(box, img);
    box.appendChild(img);
  });

  if (reduced || !('IntersectionObserver' in window)) {
    $$('.img-wrap').forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        mio.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    $$('.img-wrap').forEach(function (el) { mio.observe(el); });
  }

  /* ---------------------- Filets animés sous les intitulés de section ------- */
  $$('.section__head').forEach(function (head) {
    if (head.querySelector('.rule')) return;
    var rule = document.createElement('span');
    rule.className = 'rule';
    head.appendChild(rule);
  });

  if (reduced || !('IntersectionObserver' in window)) {
    $$('.rule').forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        rio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    $$('.rule').forEach(function (el) { rio.observe(el); });
  }

  /* ------------------------------------------ 6. Compteurs & barres chiffrées */
  $$('.stats li').forEach(function (li) {
    if (li.querySelector('.stats__bar')) return;
    var bar = document.createElement('span');
    bar.className = 'stats__bar';
    bar.setAttribute('aria-hidden', 'true');
    bar.appendChild(document.createElement('i'));
    li.appendChild(bar);
  });

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600;
    var start = null;

    if (reduced) { el.textContent = target.toLocaleString('fr-FR') + suffix; return; }

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased).toLocaleString('fr-FR') + suffix;
      if (p < 1) raf(frame);
    }
    raf(frame);
  }

  var counters = $$('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          var li = entry.target.closest('li');
          if (li) li.classList.add('is-in');
          cio.unobserve(entry.target);
        });
      }, { threshold: 0.45 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ------------------------------------------- 7. Boucle unique de défilement */
  var header    = $('[data-header]');
  var progress  = $('[data-progress]');
  var toTop     = $('[data-to-top]');
  var ring      = $('[data-ring]');
  var steps     = $('.steps');
  var parallaxEls = $$('[data-parallax]');
  var scheduled = false;

  function frameScroll() {
    var y  = window.scrollY || document.documentElement.scrollTop;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    var ratio = max > 0 ? clamp(y / max, 0, 1) : 0;

    if (header) header.classList.toggle('is-stuck', y > 40);
    if (progress) progress.style.width = (ratio * 100) + '%';

    if (toTop) toTop.classList.toggle('is-on', y > vh * 0.9);
    if (ring) ring.style.strokeDashoffset = String(126 - 126 * ratio);

    if (!reduced) {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var box = el.getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) return;
        var offset = (box.top + box.height / 2 - vh / 2) * speed * -1;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });

      if (steps) {
        var sb = steps.getBoundingClientRect();
        var p = clamp((vh * 0.85 - sb.top) / (sb.height + vh * 0.25), 0, 1);
        steps.style.setProperty('--rail', p.toFixed(3));
      }
    }

    scheduled = false;
  }

  window.addEventListener('scroll', function () {
    if (!scheduled) { raf(frameScroll); scheduled = true; }
  }, { passive: true });
  window.addEventListener('resize', function () {
    if (!scheduled) { raf(frameScroll); scheduled = true; }
  }, { passive: true });
  frameScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ----------------------------------- 8. Projecteur curseur & inclinaison 3D */
  if (finePointer && !reduced) {
    $$('[data-spotlight]').forEach(function (sec) {
      var spot = document.createElement('div');
      spot.className = 'spotlight';
      spot.setAttribute('aria-hidden', 'true');
      sec.insertBefore(spot, sec.firstChild);

      sec.addEventListener('pointermove', function (e) {
        var b = sec.getBoundingClientRect();
        sec.classList.add('has-spot');
        spot.style.setProperty('--sx', ((e.clientX - b.left) / b.width * 100).toFixed(2) + '%');
        spot.style.setProperty('--sy', ((e.clientY - b.top) / b.height * 100).toFixed(2) + '%');
      });
      sec.addEventListener('pointerleave', function () { sec.classList.remove('has-spot'); });
    });

    $$('.project, .service, .pain, .review').forEach(function (card) {
      card.classList.add('tilt');
      var maxTilt = card.classList.contains('service') ? 3 : 5;

      card.addEventListener('pointermove', function (e) {
        var b = card.getBoundingClientRect();
        var px = (e.clientX - b.left) / b.width - 0.5;
        var py = (e.clientY - b.top) / b.height - 0.5;
        card.classList.add('is-tilting');
        card.style.transform =
          'perspective(900px) rotateX(' + (-py * maxTilt).toFixed(2) + 'deg) ' +
          'rotateY(' + (px * maxTilt).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------ 9. Boutons magnétiques */
  if (finePointer && !reduced) {
    $$('.btn, .slider__btn, .to-top, .socials a').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var b = btn.getBoundingClientRect();
        var dx = (e.clientX - (b.left + b.width / 2)) / b.width;
        var dy = (e.clientY - (b.top + b.height / 2)) / b.height;
        btn.style.transform = 'translate(' + (dx * 7).toFixed(1) + 'px,' + (dy * 7).toFixed(1) + 'px)';
        btn.style.setProperty('--mx', ((e.clientX - b.left) / b.width * 100).toFixed(1) + '%');
        btn.style.setProperty('--my', ((e.clientY - b.top) / b.height * 100).toFixed(1) + '%');
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* -------------------------------------------------------- 10. Navigation */
  var burger = $('[data-burger]');
  var menu   = $('[data-menu]');

  function setMenu(open) {
    if (!menu || !burger) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', T(open ? 'Fermer le menu' : 'Ouvrir le menu'));
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) {
      menu.hidden = false;
      $$('nav a', menu).forEach(function (a, i) {
        a.style.transition = 'opacity .5s var(--ease-expo) ' + (80 + i * 55) + 'ms, transform .5s var(--ease-expo) ' + (80 + i * 55) + 'ms';
        a.style.opacity = '0';
        a.style.transform = 'translateY(22px)';
      });
      raf(function () {
        menu.classList.add('is-open');
        $$('nav a', menu).forEach(function (a) { a.style.opacity = '1'; a.style.transform = 'none'; });
      });
    } else {
      menu.classList.remove('is-open');
      window.setTimeout(function () {
        if (burger.getAttribute('aria-expanded') === 'false') menu.hidden = true;
      }, 320);
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (menu) $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (burger && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });

  var navLinks = $$('.nav a');
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { sio.observe(s); });
  }

  /* ------------------------------------------------ 11. Filtres réalisations */
  var filters  = $$('[data-filter]');
  var grid     = $('[data-projects]');
  var projects = grid ? $$('.project', grid) : [];

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });

      var shown = 0;
      projects.forEach(function (p) {
        var show = cat === 'all' || p.getAttribute('data-cat') === cat;

        if (!show) {
          p.classList.add('is-hidden');
          p.classList.remove('is-in');
          return;
        }

        p.classList.remove('is-hidden');
        if (reduced) { p.classList.add('is-in'); return; }

        p.classList.remove('is-in');
        p.style.transitionDelay = (shown * 55) + 'ms';
        shown++;
        raf(function () { raf(function () { p.classList.add('is-in'); }); });
        window.setTimeout(function () { p.style.transitionDelay = ''; }, 900);
      });
    });
  });

  /* -------------------------------------------------- 12. Accordéon animé */
  var accordion = $('[data-accordion]');

  function collapse(details) {
    var body = $('.qa__body', details);
    if (!body || reduced) { details.open = false; return; }
    var h = body.scrollHeight;
    body.animate(
      [{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
      { duration: 260, easing: 'cubic-bezier(.4,0,1,1)' }
    ).onfinish = function () { details.open = false; body.style.height = ''; };
  }

  function expand(details) {
    var body = $('.qa__body', details);
    if (!body || reduced) return;
    var h = body.scrollHeight;
    body.animate(
      [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }],
      { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }
    );
  }

  if (accordion) {
    $$('details', accordion).forEach(function (d) {
      var summary = $('summary', d);
      if (!summary) return;

      summary.addEventListener('click', function (e) {
        if (reduced) return;
        e.preventDefault();

        if (d.open) { collapse(d); return; }

        $$('details', accordion).forEach(function (o) { if (o !== d && o.open) collapse(o); });
        d.open = true;
        expand(d);
      });
    });
  }

  /* ------------------------------------------------ 13. Carrousel d'avis */
  var slider = $('[data-slider]');

  if (slider) {
    var track = $('[data-slider-track]', slider);
    var prev  = $('[data-slider-prev]', slider);
    var next  = $('[data-slider-next]', slider);
    var dotsW = $('[data-slider-dots]', slider);
    var slides = $$('.review', track);
    var index = 0;
    var autoplay = null;

    var perView = function () {
      var w = window.innerWidth;
      return w >= 1024 ? 3 : (w >= 768 ? 2 : 1);
    };
    var maxIndex = function () { return Math.max(0, slides.length - perView()); };

    function buildDots() {
      if (!dotsW) return;
      dotsW.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        (function (i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'slider__dot';
          b.setAttribute('aria-label', 'Aller au témoignage ' + (i + 1));
          b.addEventListener('click', function () { go(i, true); });
          dotsW.appendChild(b);
        })(i);
      }
    }

    function go(i, stop) {
      index = clamp(i, 0, maxIndex());
      var slide = slides[0];
      if (!slide) return;
      var step = slide.getBoundingClientRect().width + 16; // gap 1rem
      track.style.transform = 'translate3d(' + (-index * step) + 'px,0,0)';

      slides.forEach(function (s, n) {
        s.classList.toggle('is-off', n < index || n >= index + perView());
      });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= maxIndex();
      if (dotsW) {
        $$('.slider__dot', dotsW).forEach(function (d, n) {
          d.classList.toggle('is-on', n === index);
          d.setAttribute('aria-current', n === index ? 'true' : 'false');
        });
      }
      if (stop) stopAuto();
    }

    function startAuto() {
      if (reduced || autoplay) return;
      autoplay = window.setInterval(function () {
        go(index >= maxIndex() ? 0 : index + 1);
      }, 5200);
    }
    function stopAuto() {
      if (!autoplay) return;
      window.clearInterval(autoplay);
      autoplay = null;
    }

    if (prev) prev.addEventListener('click', function () { go(index - 1, true); });
    if (next) next.addEventListener('click', function () { go(index + 1, true); });

    slider.addEventListener('pointerenter', stopAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('pointerleave', startAuto);

    // Balayage tactile
    var startX = 0, startY = 0, dragging = false;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; dragging = true; stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), true);
    }, { passive: true });

    // Clavier
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(index + 1, true); }
      else if (e.key === 'ArrowLeft') { go(index - 1, true); }
    });

    var rebuild = function () { buildDots(); go(Math.min(index, maxIndex())); };
    buildDots();
    go(0);
    startAuto();

    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuild, 180);
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? startAuto() : stopAuto(); });
      }, { threshold: 0.25 }).observe(slider);
    }
  }

  /* ------------------------------------------------- 14. Formulaire de devis
     Site statique : la demande part sur WhatsApp (canal le plus réactif au
     Maroc) avec repli e-mail. Pour brancher un back-end, voir le README.
  ------------------------------------------------------------------------- */
  var WHATSAPP = '212661978186';
  var EMAIL    = 'contact@wolcons.com';

  var form   = $('[data-form]');
  var status = $('[data-status]');

  function setError(field, msg) {
    var wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('has-error', Boolean(msg));
    var out = $('[data-error]', wrap);
    if (out) out.textContent = msg || '';
  }

  if (form) {
    $$('input[required]', form).forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value.trim()) setError(input, ''); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {};
      $$('input, select, textarea', form).forEach(function (el) { data[el.name] = el.value.trim(); });

      var nom = $('#f-nom');
      var tel = $('#f-tel');
      var valid = true;
      var first = null;

      if (!data.nom) { setError(nom, T('Merci d’indiquer votre nom.')); valid = false; first = nom; }
      else setError(nom, '');

      if (!data.tel || data.tel.replace(/\D/g, '').length < 9) {
        setError(tel, T('Numéro incomplet — nous en avons besoin pour vous rappeler.'));
        valid = false; first = first || tel;
      } else setError(tel, '');

      if (!valid) {
        if (status) status.textContent = T('Deux champs à corriger avant l’envoi.');
        if (first) first.focus();
        return;
      }

      var lines = [
        T('Bonjour Wolcons, je souhaite un devis.'), '',
        'Nom : ' + data.nom,
        'Téléphone : ' + data.tel,
        'Type de projet : ' + (data.type || '—'),
        'Ville : ' + (data.ville || '—'),
        'Surface : ' + (data.surface || '—'),
        'Démarrage : ' + (data.delai || '—'), '',
        'Projet : ' + (data.message || '—')
      ].join('\n');

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines), '_blank', 'noopener');

      if (status) {
        status.innerHTML =
          'Votre demande est prête dans WhatsApp — il ne reste qu’à l’envoyer. ' +
          'Vous préférez l’e-mail ? <a href="mailto:' + EMAIL +
          '?subject=' + encodeURIComponent('Demande de devis — ' + data.nom) +
          '&body=' + encodeURIComponent(lines) + '">Écrire à ' + EMAIL + '</a>';
      }
    });
  }

  /* --------- Si l'utilisateur active « mouvement réduit » en cours de route */
  var onMotionChange = function () {
    if (!motionQuery.matches) return;
    reduced = true;
    showAll();
    $$('.img-wrap, .rule').forEach(function (el) { el.classList.add('is-in'); });
  };
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange);
  else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);
})();
