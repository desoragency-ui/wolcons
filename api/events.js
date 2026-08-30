/* ==========================================================================
   GET /api/events?days=30 — lecture des événements pour le tableau de bord.

   PROTÉGÉE par middleware.js (mot de passe), au même titre que /dashboard/ :
   cette route renvoie l'intégralité de l'activité du site.
   ========================================================================== */
import { sql, ensure, json } from './_db.js';

const MAX_ROWS = 20000;        // garde-fou, très au-dessus d'un usage normal

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'utiliser GET' });

  let days = parseInt(req.query.days, 10);
  if (!Number.isFinite(days) || days < 1 || days > 400) days = 30;
  const cutoff = Date.now() - days * 864e5;

  try {
    await ensure();
    const { rows } = await sql`
      SELECT id, ts, type, detail, lang, src, dev, path, sid, vid
        FROM events
       WHERE ts >= ${cutoff}
       ORDER BY ts DESC
       LIMIT ${MAX_ROWS}`;

    const events = rows.map((r) => ({
      id: String(r.id),
      t: r.type,
      d: parseDetail(r.type, r.detail),
      ts: Number(r.ts),
      lang: r.lang,
      src: r.src,
      dev: r.dev,
      path: r.path,
      sid: r.sid,
      vid: r.vid
    }));

    return json(res, 200, { events, days, count: events.length });
  } catch (e) {
    return json(res, 500, { error: 'lecture impossible', detail: String(e).slice(0, 200), events: [] });
  }
}

/* « detail » est stocké en texte ; on lui rend le type que le tableau de bord attend. */
function parseDetail(type, detail) {
  if (detail === null || detail === undefined) return null;
  if (type === 'quote_submit') {
    try { return JSON.parse(detail); } catch { return detail; }
  }
  if (type === 'scroll_depth' || type === 'time_on_page') {
    const n = Number(detail);
    return Number.isFinite(n) ? n : detail;
  }
  return detail;
}
