# Wolcons — Site vitrine

Refonte du site de **Wolcons** (entreprise générale de construction et d'aménagement
tout corps d'état, Casablanca). Site statique, une seule page, 100 % en français,
sans dépendance ni build.

```
wolcons/
├── index.html      Page unique (9 sections + header/footer)
├── styles.css      Design system, composants, moteur d'animation, responsive
├── script.js       Animations, carrousel, filtres, formulaire
└── assets/img/     Visuels WebP + logos PNG (2,3 Mo au total)
```

## Lancer en local

Ouvrir `index.html` directement, **ou** servir le dossier (recommandé — le carrousel
et les images paresseuses se comportent mieux) :

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

**Typographies** — `Outfit` (titres, géométrique, proche du logotype) + `Inter` (texte).
Chiffres en `tabular-nums` partout où ils s'alignent (budgets, surfaces, statistiques).

**Parti pris visuel** — modernisme architectural : angles nets (rayon 2 px), filets
d'un pixel, trames de plan en surimpression, numérotation de sections, équerres
orange. Volontairement à l'opposé du « carte arrondie + dégradé » générique.

## Structure de la page

La page suit une trame narrative (problème → guide → plan → preuve → action) :

| # | Section | Rôle commercial |
|---|---|---|
| — | Hero | Promesse + 2 CTA + 4 preuves chiffrées |
| 01 | Le vrai problème | Nommer la douleur : multiplicité des intervenants, dérive budget, retard |
| 02 | Qui vous accompagne | Empathie + autorité (références, fournisseurs) |
| 03 | La méthode Wolcons | 4 étapes + tableau comparatif « sans / avec » |
| 04 | Nos métiers | TCE · Construction clé en main · Project management |
| — | Chiffres | 4 compteurs animés |
| 05 | Réalisations | 13 projets réels, filtrables par mission |
| 06 | Avis + carte | Note Google, carrousel de témoignages, plan d'accès |
| 07 | Partenaires | Bandeau défilant des 8 fournisseurs |
| 08 | Questions fréquentes | Accordéon — rôle pédagogique (TCE, prix au m², avenants) |
| 09 | Demander un devis | Formulaire + coordonnées |

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
- Inclinaison 3D des cartes (projets, métiers, avis)
- Boutons magnétiques + halo suiveur
- Menu mobile : ouverture avec liens décalés
- Accordéon FAQ : hauteur animée (Web Animations API)
- Carrousel : autoplay, balayage tactile, flèches, points, clavier
- Barre de progression de lecture + bouton retour en haut avec anneau

`prefers-reduced-motion: reduce` **désactive tout**, y compris le préchargeur,
et l'écoute reste active si l'utilisateur change le réglage en cours de visite.

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

1. **Témoignages** — les six avis du carrousel (`section#avis`) sont des **exemples
   de mise en page**, pas de vrais avis. À remplacer par des retours clients réels
   et autorisés. La note **5,0 ★** et le lien vers la fiche Google sont, eux, authentiques
   (relevés le 20/08/2026) ; le nombre d'avis n'est pas affiché car Google ne l'expose pas
   publiquement sur cette fiche.
2. **Horaires** — « lundi – vendredi 09h00 – 17h00 » est déduit de la fiche Google
   (jeudi 09:00–17:00, ouverture vendredi à 09:00). À confirmer.
3. **Fourchettes de prix** en FAQ (6 000–12 500 DH/m² en aménagement, 4 500–6 000
   DH/m² en gros œuvre) — **calculées à partir des budgets et surfaces publiés par
   Wolcons lui-même**. À valider ou ajuster.
4. **Engagements de méthode** — reporting hebdomadaire, avenant validé avant
   exécution, conducteur de travaux dédié : à confirmer comme réellement tenus.
5. **Projets ↔ photos** — les visuels proviennent de l'ancien site ; l'association
   photo/projet est plausible mais à vérifier fiche par fiche.
6. **Adresse** — le site affiche « Bd 11 janvier, rue Essanober, imm 2 n°12 »
   (ancien site). Google indique « imm 2, Bd 11 janvier, n:12 Rue Essanaoubar,
   Casablanca 20480 ». Harmoniser.
7. **LinkedIn** — l'ancien site pointait vers une URL d'administration ; remplacée
   par l'URL publique `linkedin.com/company/106527329/`. À vérifier.

## Visuels

Toutes les photos proviennent du site existant (chantiers et livraisons réels de
Wolcons), recadrées, harmonisées et réencodées en WebP. Les logos partenaires et le
logotype ont été détourés (fond transparent) ; `logo-light.png` est la version
blanche pour fonds sombres.

Remplacer une image = déposer un fichier de même nom dans `assets/img/`.

## Déploiement

100 % statique → Netlify, Vercel, GitHub Pages, ou n'importe quel hébergement
mutualisé. Glisser-déposer le dossier `wolcons/` suffit.
