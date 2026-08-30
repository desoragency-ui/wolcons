/* ==========================================================================
   POST /api/collect — reçoit un événement envoyé par assets/js/analytics.js.

   Route forcément PUBLIQUE : ce sont les visiteurs qui l'appellent. Elle est
   donc écrite en supposant qu'on lui enverra n'importe quoi — liste blanche de
   types, longueurs plafonnées, horodatage borné, tout le reste rejeté.

   Aucune donnée nominative : analytics.js n'envoie que des initiales, jamais
   de nom, d'e-mail ni de téléphone, et aucune adresse IP n'est stockée.
   ========================================================================== */
import { sql, ensure, json } from './_db.js';

const TYPES = new Set([
  'pageview', 'section_view', 'service_interest', 'project_view', 'project_gallery',
  'project_filter', 'quote_start', 'quote_submit', 'whatsapp_click', 'call_click',
  'mail_click', 'map_click', 'faq_open', 'lang_switch', 'cta_click',
  'scroll_depth', 'time_on_page'
]);

const MAX_DETAIL = 300;
const MAX_BODY = 4096;

const cut = (v, n) => (typeof v === 'string' ? v.slice(0, n) : v);

function clean(detail) {
  if (detail === null || detail === undefined) return null;
  if (typeof detail === 'number') return String(detail);
  if (typeof detail === 'string') return cut(detail, MAX_DETAIL);
  if (typeof detail === 'object') {
    /* quote_submit : on ne garde que les champs attendus, jamais l'objet brut */
    const keep = {};
    for (const k of ['typeIdx', 'delaiIdx', 'type', 'ville', 'surface', 'delai', 'who']) {
      if (detail[k] !== undefined) keep[k] = cut(detail[k], 80);
    }
    return cut(JSON.stringify(keep), MAX_DETAIL);
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'utiliser POST' });

  let body = req.body;
  /* sendBeacon envoie du text/plain : selon le cas Vercel donne déjà un objet,
     sinon une chaîne à analyser nous-mêmes. */
  if (typeof body === 'string') {
    if (body.length > MAX_BODY) return json(res, 413, { error: 'trop volumineux' });
    try { body = JSON.parse(body); } catch { return json(res, 400, { error: 'json invalide' }); }
  }
  if (!body || typeof body !== 'object') return json(res, 400, { error: 'corps manquant' });
  if (!TYPES.has(body.t)) return json(res, 400, { error: 'type inconnu' });

  /* L'horodatage vient du client : on le borne pour qu'une horloge fausse ne
     place pas un événement en 1970 ou l'an prochain. */
  const now = Date.now();
  let ts = Number(body.ts);
  if (!Number.isFinite(ts) || ts < now - 7 * 864e5 || ts > now + 6e5) ts = now;

  try {
    await ensure();
    await sql`
      INSERT INTO events (ts, type, detail, lang, src, dev, path, sid, vid, created_at)
      VALUES (${ts}, ${body.t}, ${clean(body.d)}, ${cut(body.lang, 8) || null},
              ${cut(body.src, 60) || null}, ${cut(body.dev, 16) || null},
              ${cut(body.path, 120) || null}, ${cut(body.sid, 40) || null},
              ${cut(body.vid, 40) || null}, ${now})`;
  } catch (e) {
    return json(res, 500, { error: 'écriture impossible', detail: String(e).slice(0, 200) });
  }

  /* 204 : sendBeacon n'attend aucun corps de réponse. */
  res.status(204).end();
}
