/* ==========================================================================
   Prépare le dossier `dist/` envoyé à Cloudflare Pages.

   Le site reste sans étape de compilation : ce script ne fait que COPIER.
   Il existe pour une seule raison — décider explicitement ce qui devient
   public. Publier la racine du dépôt mettrait aussi en ligne README.md
   (notes internes, adresse du tableau de bord), package.json, tools/ et
   node_modules/. Ici, seule la liste ci-dessous part.

       node tools/build-site.mjs      (ou : npm run build)
   ========================================================================== */
import { cp, mkdir, rm, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, 'dist');

/* Liste blanche : tout ce qui n'est pas ici ne sera pas en ligne. */
const PUBLIC = [
  'index.html',
  'styles.css',
  'script.js',
  'i18n.js',
  'robots.txt',
  'assets',
  'dashboard'
];

/* Quels chemins passent par une Function. Tout le reste est servi en statique
   pur : illimité et gratuit, et surtout sans consommer le quota de 100 000
   requêtes/jour des Functions. */
const ROUTES = {
  version: 1,
  include: ['/dashboard', '/dashboard/*', '/api/*'],
  exclude: []
};

const exists = (p) => access(p).then(() => true, () => false);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

let copied = 0;
for (const entry of PUBLIC) {
  const from = join(ROOT, entry);
  if (!(await exists(from))) {
    console.warn('  ignoré (absent) : ' + entry);
    continue;
  }
  await cp(from, join(DIST, entry), { recursive: true });
  copied++;
  console.log('  + ' + entry);
}

await writeFile(join(DIST, '_routes.json'), JSON.stringify(ROUTES, null, 2) + '\n', 'utf8');
console.log('  + _routes.json');
console.log('dist/ prêt — ' + copied + ' entrées copiées.');
