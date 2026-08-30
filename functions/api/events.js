/* ==========================================================================
   GET /api/events?days=30 — lecture des événements pour le tableau de bord.
   Cloudflare Pages Function, base D1 liée sous le nom DB.

   PROTÉGER CETTE ROUTE. Elle renvoie l'intégralité de l'activité du site.
   Elle doit être couverte par la même règle Cloudflare Access que /dashboard/
   (application self-hosted, chemins « dashboard » ET « api/events »).
   Sans cette règle, n'importe qui peut lire les chiffres du client.

   Le contrôle se fait dans Access, pas ici : une clé d'API écrite dans
   dashboard/data.js serait publique, donc inutile.
   ========================================================================== */

const MAX_ROWS = 20000;        // plafond de sécurité, bien au-delà d'un usage normal

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.DB) {
    return json({ error: 'base non liée', events: [] }, 500);
  }

  const url = new URL(request.url);
  let days = parseInt(url.searchParams.get('days'), 10);
  if (!Number.isFinite(days) || days < 1 || days > 400) days = 30;

  const cutoff = Date.now() - days * 864e5;

  try {
    const { results } = await env.DB.prepare(
      `SELECT ts, type, detail, lang, src, dev, path, sid
         FROM events
        WHERE ts >= ?1
        ORDER BY ts DESC
        LIMIT ?2`
    ).bind(cutoff, MAX_ROWS).all();

    /* On remet la forme que data.js attend : { t, d, ts, lang, src, dev, path, sid }.
       « detail » est stocké en texte ; quote_submit y range du JSON, qu'on
       redéveloppe pour que le tableau de bord retrouve ses champs. */
    const events = (results || []).map((r) => ({
      t: r.type,
      d: parseDetail(r.type, r.detail),
      ts: r.ts,
      lang: r.lang,
      src: r.src,
      dev: r.dev,
      path: r.path,
      sid: r.sid
    }));

    return json({ events, days, count: events.length }, 200);
  } catch (e) {
    return json({ error: 'lecture impossible', detail: String(e).slice(0, 200), events: [] }, 500);
  }
}

function parseDetail(type, detail) {
  if (detail === null || detail === undefined) return null;
  if (type === 'quote_submit') {
    try { return JSON.parse(detail); } catch { return detail; }
  }
  /* scroll_depth et time_on_page sont des nombres côté tableau de bord */
  if (type === 'scroll_depth' || type === 'time_on_page') {
    const n = Number(detail);
    return Number.isFinite(n) ? n : detail;
  }
  return detail;
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      /* jamais de cache : le tableau de bord doit voir l'état courant */
      'cache-control': 'no-store'
    }
  });
}
