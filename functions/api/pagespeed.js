/* ==========================================================================
   GET /api/pagespeed — vitesse réelle du site, mesurée par Google.

   La clé vit dans la variable d'environnement PAGESPEED_KEY, côté serveur.
   Elle ne doit JAMAIS partir dans le JavaScript de la page : ce qui est dans
   le navigateur est lisible par tout le monde.

   La mesure prend 15 à 30 secondes chez Google, donc on la garde en cache
   12 heures : la vitesse d'un site ne bouge pas d'une minute à l'autre, et
   on ne va pas faire attendre le tableau de bord à chaque ouverture.
   ========================================================================== */
import { db, ensure, json } from '../../lib/db.js';

const CACHE_MS = 12 * 3600 * 1000;
const KEY = 'pagespeed';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return json(405, { error: 'utiliser GET' });

  /* L'origine à mesurer est celle du site lui-même : rien à configurer, et
     impossible de faire mesurer un site tiers avec votre quota. */
  const url = new URL(request.url);
  const target = `${url.protocol}//${url.host}/`;

  if (/^localhost|^127\.|^0\.0\.0\.0/.test(url.hostname)) {
    return json(200, { unavailable: 'local', message:
      'Google ne peut pas mesurer une adresse locale — cette carte se remplira une fois le site en ligne.' });
  }

  try {
    const sql = db(env);
    await ensure(sql);

    const force = url.searchParams.get('force') === '1';
    const rows = await sql`SELECT value, updated_at FROM settings WHERE key = ${KEY}`;
    const cached = rows[0];
    if (!force && cached && Date.now() - Number(cached.updated_at) < CACHE_MS) {
      return json(200, { ...cached.value, cached: true });
    }

    const apiKey = env.PAGESPEED_KEY;
    if (!apiKey) {
      return json(200, { unavailable: 'nokey', message:
        'Ajoutez la variable PAGESPEED_KEY dans Cloudflare Pages pour activer cette mesure.' });
    }

    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
      + '?url=' + encodeURIComponent(target)
      + '&strategy=mobile&category=performance&key=' + encodeURIComponent(apiKey);

    const r = await fetch(api);
    const body = await r.json();
    if (body.error) {
      /* On rend le cache périmé plutôt que rien : un chiffre d'hier vaut mieux
         qu'une carte vide, à condition de dire qu'il date. */
      if (cached) return json(200, { ...cached.value, cached: true, stale: true });
      return json(200, { unavailable: 'api', message: String(body.error.message).slice(0, 200) });
    }

    const lr = body.lighthouseResult || {};
    const audits = lr.audits || {};
    const num = (k) => {
      const v = audits[k]?.numericValue;
      return Number.isFinite(v) ? Math.round(v * 100) / 100 : null;
    };

    const value = {
      target,
      score: Math.round((lr.categories?.performance?.score ?? 0) * 100),
      lcp: num('largest-contentful-paint'),      // ms
      cls: num('cumulative-layout-shift'),       // sans unité
      tbt: num('total-blocking-time'),           // ms
      measuredAt: Date.now()
    };

    await sql`
      INSERT INTO settings (key, value, updated_at)
      VALUES (${KEY}, ${JSON.stringify(value)}::jsonb, ${Date.now()})
      ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`;

    return json(200, value);
  } catch (e) {
    return json(200, { unavailable: 'error', message: String(e).slice(0, 200) });
  }
}
