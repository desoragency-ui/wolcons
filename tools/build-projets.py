# -*- coding: utf-8 -*-
"""
Régénère les carrousels de la section « Nos projets phares » à partir des dossiers
d'images.

Utilisation
-----------
    python tools/build-projets.py

Pour ajouter des photos à un projet : déposer les fichiers (jpg, jpeg, png, webp)
dans `assets/img/projets/<slug>/`, puis relancer ce script. Il :

  1. recadre et réencode chaque nouvelle photo en WebP 1200x900 ;
  2. renumérote l'ensemble en 01.webp, 02.webp, … (ordre alphabétique des noms
     d'origine : préfixer les fichiers 01_, 02_… permet d'imposer l'ordre) ;
  3. réécrit le bloc `<div class="project__media">` du projet dans index.html
     avec autant de diapositives que d'images.

Les fichiers déjà normalisés (01.webp, 02.webp, …) ne sont pas réencodés.
Un projet qui n'a qu'une seule image reste un visuel fixe, sans contrôles.
"""
import io
import os
import re
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJETS = os.path.join(ROOT, 'assets', 'img', 'projets')
INDEX = os.path.join(ROOT, 'index.html')

SIZE = (1200, 900)
QUALITY = 78
EXTS = ('.jpg', '.jpeg', '.png', '.webp')
DONE = re.compile(r'^\d{2}\.webp$')

NL = '\n'

# slug -> (nom affiché, texte alternatif de base)
PROJECTS = [
    ('ambassade',     'Ambassade de Belgique',   "Ambassade de Belgique à Rabat construite par Wolcons"),
    ('novares-usine', 'Usine Novares',           "Usine Novares à Kénitra réalisée par Wolcons"),
    ('riad-pru',      'Riad Pru',                "Riad Pru à Marrakech restauré par Wolcons"),
    ('saint-louis',   'Aménagement Saint Louis', "Aménagement de la boutique Saint Louis à Casablanca"),
    ('huawei',        'Plateau bureaux Huawei',  "Plateau de bureaux Huawei aménagé par Wolcons à Casablanca"),
    ('showroom-tp',   'Showroom Thomas & Piron', "Showroom Thomas &amp; Piron livré par Wolcons à Casablanca"),
    ('villa-cs',      'Villa CS',                "Villa CS : structure en cours d'élévation par Wolcons"),
    ('villa-e',       'Villa E',                 "Villa E en cours de gros œuvre par Wolcons à Rabat"),
    ('villa-ib',      'Villa IB',                "Villa IB : fondations et dallage réalisés par Wolcons"),
    ('ish',           'Aménagement ISH',         "Aménagement des bureaux ISH par Wolcons"),
    ('novares-siege', 'Siège Novares',           "Siège Novares à Kénitra aménagé par Wolcons"),
    ('villa-mw',      'Villa MW',                "Villa MW livrée par Wolcons à Casablanca"),
    ('hangar',        'Hangar industriel',       "Hangar métallique construit par Wolcons à Casablanca"),
]

MEDIA_RE = re.compile(r'        <div class="project__media[^"]*">[\s\S]*?\n        </div>')


def trim_black(im, thr=24, keep=0.12):
    """Retire les bandes noires des captures d'ecran (letterbox, barre d'accueil).

       On repere les lignes et colonnes qui portent du contenu, puis on garde la
       plus longue plage continue : une fine barre claire isolee au bord (barre
       d'accueil d'un telephone) est ainsi ecartee avec la bande noire qui la
       precede. Le recadrage est abandonne s'il retire trop d'image."""
    g = im.convert('L')
    w, h = g.size
    px = g.load()
    sx = max(1, w // 200)
    sy = max(1, h // 200)

    def longest(flags):
        best = (0, -1, -1)
        run_start = None
        for i, on in enumerate(flags + [False]):
            if on and run_start is None:
                run_start = i
            elif not on and run_start is not None:
                if i - run_start > best[0]:
                    best = (i - run_start, run_start, i - 1)
                run_start = None
        return best[1], best[2]

    rows = [max(px[x, y] for x in range(0, w, sx)) > thr for y in range(h)]
    cols = [max(px[x, y] for y in range(0, h, sy)) > thr for x in range(w)]

    top, bottom = longest(rows)
    left, right = longest(cols)
    if top < 0 or left < 0:
        return im
    if (bottom - top + 1) < h * keep or (right - left + 1) < w * keep:
        return im
    if (top, left, right, bottom) == (0, 0, w - 1, h - 1):
        return im
    return im.crop((left, top, right + 1, bottom + 1))


def normalise(slug):
    """Recadre, réencode et renumérote les images d'un projet. Retourne la liste finale."""
    folder = os.path.join(PROJETS, slug)
    if not os.path.isdir(folder):
        return []

    sources = sorted(f for f in os.listdir(folder) if f.lower().endswith(EXTS))
    if not sources:
        return []

    # Déjà normalisé : on ne réencode pas (évite une perte de qualité à chaque passage).
    if all(DONE.match(f) for f in sources):
        return sources

    tmp = []
    for i, name in enumerate(sources, 1):
        path = os.path.join(folder, name)
        try:
            im = Image.open(path)
            im = ImageOps.exif_transpose(im).convert('RGB')
            im = trim_black(im)
            im = ImageOps.fit(im, SIZE, Image.LANCZOS, centering=(0.5, 0.45))
        except Exception as exc:
            print('  ! ignoree (%s) : %s' % (name, exc))
            continue
        out = os.path.join(folder, '__tmp_%03d.webp' % i)
        im.save(out, 'WEBP', quality=QUALITY, method=6)
        tmp.append(out)

    for f in sources:
        os.remove(os.path.join(folder, f))

    final = []
    for i, t in enumerate(sorted(tmp), 1):
        name = '%02d.webp' % i
        os.rename(t, os.path.join(folder, name))
        final.append(name)
    return final


def simple_markup(slug, f, alt, badge):
    return NL.join([
        '        <div class="project__media">',
        '          <img src="assets/img/projets/%s/%s" alt="%s" width="1200" height="900" loading="lazy" decoding="async">' % (slug, f, alt),
        '          <span class="project__badge">%s</span>' % badge,
        '        </div>',
    ])


def carousel_markup(slug, files, name, alt, badge):
    n = len(files)
    lines = [
        '        <div class="project__media pcar">',
        '          <div class="pcar__viewport" data-pcar tabindex="0" role="group"',
        '               aria-roledescription="carrousel" aria-label="Photos du projet %s">' % name,
        '            <ul class="pcar__track" data-pcar-track>',
    ]
    for i, f in enumerate(files, 1):
        lines += [
            '              <li class="pcar__slide"%s>' % (' aria-hidden="true"' if i > 1 else ''),
            '                <img src="assets/img/projets/%s/%s" alt="%s — photo %d sur %d"' % (slug, f, alt, i, n),
            '                     width="1200" height="900" loading="lazy" decoding="async">',
            '              </li>',
        ]
    lines += [
        '            </ul>',
        '          </div>',
        '          <button type="button" class="pcar__nav pcar__nav--prev" data-pcar-prev aria-label="Photo précédente">',
        '            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
        '          </button>',
        '          <button type="button" class="pcar__nav pcar__nav--next" data-pcar-next aria-label="Photo suivante">',
        '            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
        '          </button>',
        '          <div class="pcar__dots" data-pcar-dots>',
    ]
    for i in range(1, n + 1):
        lines += [
            '            <button type="button" class="pcar__dot%s" data-pcar-dot="%d"' % (' is-on' if i == 1 else '', i - 1),
            '                    aria-label="Photo %d de %s"%s></button>' % (i, name, ' aria-current="true"' if i == 1 else ''),
        ]
    lines += [
        '          </div>',
        '          <span class="pcar__count" data-pcar-count aria-hidden="true">1/%d</span>' % n,
        '          <span class="project__badge">%s</span>' % badge,
        '        </div>',
    ]
    return NL.join(lines)


def main():
    html = io.open(INDEX, encoding='utf-8').read()
    total = 0

    for slug, name, alt in PROJECTS:
        files = normalise(slug)
        if not files:
            print('%-15s aucun fichier' % slug)
            continue

        target = None
        for b in MEDIA_RE.finditer(html):
            chunk = b.group(0)
            if ('assets/img/projets/%s/' % slug) in chunk or ('assets/img/p-%s.webp' % slug) in chunk:
                target = b
                break
        if not target:
            print('%-15s bloc introuvable dans index.html' % slug)
            continue

        m = re.search(r'<span class="project__badge">([^<]+)</span>', target.group(0))
        badge = m.group(1) if m else 'Construction'

        if len(files) > 1:
            block = carousel_markup(slug, files, name, alt, badge)
        else:
            block = simple_markup(slug, files[0], alt, badge)

        html = html[:target.start()] + block + html[target.end():]
        total += len(files)
        print('%-15s %d photo(s)%s' % (slug, len(files), '  [carrousel]' if len(files) > 1 else ''))

    io.open(INDEX, 'w', encoding='utf-8').write(html)
    print('\n%d photos au total, index.html mis a jour.' % total)


if __name__ == '__main__':
    sys.exit(main())
