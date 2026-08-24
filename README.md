# Wolcons — Site vitrine

Refonte du site de **Wolcons** (entreprise générale de construction et d'aménagement
tout corps d'état, Casablanca). Site statique, une seule page, 100 % en français,
sans dépendance ni build. Trilingue **français / anglais / arabe**.

```
wolcons/
├── index.html      Page unique (9 sections + header/footer)
├── styles.css      Design system, composants, moteur d'animation, RTL, responsive
├── i18n.js         Dictionnaires FR / EN / AR + sélecteur de langue
├── script.js       Animations, filtres, accordéon, formulaire
└── assets/img/     Visuels WebP, logos partenaires + clients PNG détourés
```

## Lancer en local

Ouvrir `index.html` directement, **ou** servir le dossier (recommandé — les images
paresseuses et le `localStorage` du sélecteur de langue se comportent mieux) :

```bash
python -m http.server 8130 --directory wolcons
```

Puis ouvrir http://127.0.0.1:8130

## Identité de marque

Les couleurs sont **échantillonnées pixel par pixel sur le logo officiel**, pas approximées :

| Rôle | Valeur | Usage |
|---|---|---|
| Bleu marine | `#0B3A58` | fond des sections sombres, texte fort, boutons secondaires |
| Marine profond | `#062537` | hero, pied de page, préchargeur |
| Orange | `#E85A38` | accent unique — CTA, chiffres, soulignements |
| Papier | `#F6F4F1` | sections claires alternées |
| Encre | `#0D1A24` | texte courant |

**Typographie arabe** — `Cairo`, activée automatiquement en mode `lang="ar"`.

**Typographies** — `Outfit` (titres, géométrique, proche du logotype) + `Inter` (texte).
Chiffres en `tabular-nums` partout où ils s'alignent (budgets, surfaces, statistiques).

**En-tête** — barre blanche fixe dès le haut de page ; elle se resserre au
défilement (logo 58 → 48 px, ombre portée renforcée).

**Parti pris visuel** — modernisme architectural : angles nets (rayon 2 px), filets
d'un pixel, trames de plan en surimpression, numérotation de sections, équerres
orange. Volontairement à l'opposé du « carte arrondie + dégradé » générique.

## Structure de la page

La page suit une trame narrative (problème → guide → plan → preuve → action) :

| # | Section | Rôle commercial |
|---|---|---|
| — | Hero | Promesse + 2 CTA + 4 preuves chiffrées |
| — | Nos clients | Bandeau des 15 logos clients, en couleur, défilement gauche → droite |
| 01 | Le vrai problème | Nommer la douleur : multiplicité des intervenants, dérive budget, retard |
| 02 | Qui vous accompagne | Empathie + autorité (références, fournisseurs) |
| 03 | La méthode Wolcons | 4 étapes + tableau comparatif « sans / avec » |
| 04 | Nos métiers | TCE · Construction clé en main · Project management |
| — | Chiffres | 4 compteurs animés |
| 05 | Réalisations | 13 projets réels, filtrables par mission |
| — | Accès | Carte Google + adresse et horaires |
| 06 | Partenaires | Bandeau défilant des 8 fournisseurs (niveaux de gris) |
| 07 | Questions fréquentes | Accordéon — rôle pédagogique (TCE, prix au m², avenants) |
| 08 | Demander un devis | Formulaire + coordonnées |

## Animations

Tout est en `transform` / `opacity` / `clip-path`, piloté par `IntersectionObserver`
et **une seule boucle `requestAnimationFrame`** pour le défilement.

- Préchargeur : tracé du logo, barre de progression, rideau en 3 volets
- Titres découpés **mot par mot**, montée décalée sous masque
- Révélation d'images : volet orange + zoom arrière
- Parallaxe : hero, visuel « à propos », fond du CTA
- Filets animés sous chaque intitulé de section
- Compteurs + barres de progression sur les chiffres
- Rail de progression orange sous les 4 étapes de la méthode
- Projecteur qui suit le curseur sur les sections sombres
- Inclinaison 3D des cartes (projets, métiers)
- Boutons magnétiques + halo suiveur
- Menu mobile : ouverture avec liens décalés
- Accordéon FAQ : hauteur animée (Web Animations API)
- Deux bandeaux défilants : clients (couleur, gauche → droite) et fournisseurs
- Barre de progression de lecture + bouton retour en haut avec anneau

`prefers-reduced-motion: reduce` **désactive tout**, y compris le préchargeur,
et l'écoute reste active si l'utilisateur change le réglage en cours de visite.

## Trois langues : FR · EN · AR

Le sélecteur est **repliable** : un bouton (globe + code de la langue active +
chevron) ouvre un petit panneau FR / EN / AR. Il se ferme au choix d'une langue,
au clic en dehors ou à la touche Échap. Présent dans l'en-tête et dans le menu
mobile, où le panneau s'ouvre vers le haut.

- Le **français est la langue source** : `i18n.js` indexe les traductions sur le
  texte français exact tel qu'il figure dans `index.html`. Une chaîne absente du
  dictionnaire (nom propre, montant, ville) reste inchangée.
- Le choix est mémorisé dans `localStorage` (`wolcons-lang`).
- En arabe, `<html>` passe en `lang="ar" dir="rtl"`, la typographie bascule sur
  **Cairo**, et une feuille de règles `[dir="rtl"]` remet à l'endroit les
  éléments directionnels (équerres, flèches, filets, badges, carte).
- `i18n.js` est chargé **avant** `script.js` : la traduction est appliquée avant
  le découpage des titres mot par mot. À chaque changement de langue, les titres
  sont réécrits puis re-découpés via `window.__wolconsSplit`.

### Ajouter ou corriger une traduction

Ouvrir `i18n.js` → objet `DICT` → sections `en` et `ar`. La clé est la phrase
française **exacte** (espaces normalisés). Pour traduire une nouvelle phrase,
copier le texte français depuis `index.html` et l'ajouter comme clé.

## Responsive & accessibilité

- Mobile first, points de rupture 560 / 768 / 1024 / 1280
- Vérifié sans débordement horizontal à 375 px et en paysage court
- Cibles tactiles ≥ 44 px, focus clavier visible, `skip-link`
- `alt` descriptifs, `aria-label` sur les boutons icônes, hiérarchie `h1→h3` continue
- Images WebP dimensionnées (`width`/`height`) → pas de saut de mise en page

## SEO (volontairement basique)

`title`, `meta description`, `canonical`, Open Graph, `lang="fr"`, un seul `h1`,
`alt` sur toutes les images. Pas de données structurées ni d'optimisation avancée.

## Formulaire de devis

Le site étant statique, l'envoi ouvre **WhatsApp** avec le message pré-rempli
(canal le plus réactif au Maroc), avec repli e-mail affiché après soumission.
Numéro et adresse en haut de `script.js` :

```js
var WHATSAPP = '212661978186';
var EMAIL    = 'contact@wolcons.com';
```

Pour brancher un vrai back-end (Formspree, Netlify Forms, API maison) : remplacer
le `window.open(...)` de la section 14 par un `fetch()` POST. La validation des
champs et l'affichage d'état sont déjà en place.

## ⚠ À valider avec le client avant mise en ligne

1. **Horaires** — « lundi – vendredi 09h00 – 17h00 » est déduit de la fiche Google
   (jeudi 09:00–17:00, ouverture vendredi à 09:00). À confirmer.
2. **Traductions EN et AR** — rédigées à partir du texte français. À faire relire
   par un locuteur natif avant mise en ligne, en particulier les termes techniques
   du bâtiment en arabe.
3. **Engagements de méthode** — reporting régulier, avenant validé avant exécution,
   conducteur de travaux **et chef de projet** dédiés : à confirmer comme réellement tenus.
4. **12+ années d'expérience** — chiffre fourni par le client, à confirmer.
5. **Barre d'en-tête** — elle est blanche en permanence, y compris en haut de page.
   C'est ce qui permet d'afficher le logotype dans ses couleurs d'origine sans
   aucun artifice. Le pied de page utilise `logo-light.png` (mot-symbole blanc,
   marque orange), la version prévue pour les fonds sombres.
6. **Liste clients** — les 15 logos du bandeau « Ils nous font confiance » sont
   ceux fournis par le client. Plusieurs sont des fabricants de matériaux
   (Sika, Rockwool, Legrand, Carrier, Geberit, Jacob Delafon, Holcim, O'Dassia) :
   confirmer qu'il s'agit bien de donneurs d'ordre et non de fournisseurs, et
   vérifier l'autorisation d'utiliser chaque marque.
7. **LinkedIn** — l'ancien site pointait vers une URL d'administration ; remplacée
   par l'URL publique `linkedin.com/company/106527329/`. À vérifier.

## Visuels

Toutes les photos proviennent du site existant (chantiers et livraisons réels de
Wolcons), recadrées, harmonisées et réencodées en WebP.

**Association projet ↔ photo** : l'ordre a été relevé directement dans le balisage
de `wolcons.com`, où chaque titre de projet précède immédiatement son visuel. Les
13 fiches correspondent donc à l'ordre officiel du site d'origine.

**Logos** : logotype Wolcons et 8 logos fournisseurs détourés (fond transparent)
dans `assets/img/` ; **15 logos clients** dans `assets/img/clients/`, détourés et
conservés **en couleur**. `logo-light.png` est la version à mot-symbole blanc,
conservée au cas où.

Pour ajouter un client : déposer le PNG détouré (hauteur 140 px) dans
`assets/img/clients/` et ajouter une ligne `<img>` dans **les deux**
`.marquee__group` de la section `#clients` — le second groupe est la copie
qui rend le défilement continu, ses `alt` restent vides.

Remplacer une image = déposer un fichier de même nom dans le même dossier.

## Déploiement

100 % statique → Netlify, Vercel, GitHub Pages, ou n'importe quel hébergement
mutualisé. Glisser-déposer le dossier `wolcons/` suffit.
