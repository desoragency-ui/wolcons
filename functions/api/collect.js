/* ==========================================================================
   POST /api/collect — réception d'un événement envoyé par assets/js/analytics.js
   Cloudflare Pages Function. Écrit dans la base D1 liée sous le nom DB.

   Cette route est forcément PUBLIQUE : ce sont les visiteurs du site qui
   l'appellent. Elle est donc écrite en supposant qu'on lui enverra n'importe
   quoi — d'où la liste blanche de types, les longueurs plafonnées et le
   refus de tout ce qui n'est pas reconnu.

   Aucune donnée nominative : analytics.js n'envoie que des initiales, jamais
   de nom, d'e-mail ni de téléphone. Pas d'adresse IP stockée non plus.
   ========================================================================== */

/* Seuls ces événements sont acceptés — un type inconnu est rejeté plutôt
   que stocké, sinon la table devient une décharge ouverte sur internet. */
const TYPES = new Set([
  'pageview', 'section_view', 'service_interest', 'project_view', 'project_gallery',
  'project_filter', 'quote_start', 'quote_submit', 'whatsapp_click', 'call_click',
  'mail_click', 'map_click', 'faq_open', 'lang_switch', 'cta_click',
  'scroll_depth', 'time_on_page'
]);

const MAX_DETAIL = 300;        // caractères
const MAX_BODY = 4096;         // octets

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

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) {
    return json({ error: 'base non liée' }, 500);
  }

  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) return json({ error: 'trop volumineux' }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ error: 'json invalide' }, 400);
  }

  if (!body || !TYPES.has(body.t)) return json({ error: 'type inconnu' }, 400);

  /* L'horodatage vient du client : on le borne pour qu'une horloge fausse (ou
     un plaisantin) ne place pas un événement en 1970 ou en 2050. */
  const now = Date.now();
  let ts = Number(body.ts);
  if (!Number.isFinite(ts) || ts < now - 7 * 864e5 || ts > now + 6e5) ts = now;

  try {
    await env.DB.prepare(
      `INSERT INTO events (ts, type, detail, lang, src, dev, path, sid, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
    ).bind(
      ts,
      body.t,
      clean(body.d),
      cut(body.lang, 8) || null,
      cut(body.src, 60) || null,
      cut(body.dev, 16) || null,
      cut(body.path, 120) || null,
      cut(body.sid, 40) || null,
      now
    ).run();
  } catch (e) {
    return json({ error: 'écriture impossible', detail: String(e).slice(0, 200) }, 500);
  }

  /* 204 : le navigateur utilise sendBeacon, il n'attend aucun corps. */
  return new Response(null, { status: 204 });
}

/* Un GET sur cette route ne veut rien dire — on le dit plutôt que de renvoyer
   la page 404 du site, qui laisserait croire que la fonction n'est pas déployée. */
export async function onRequestGet() {
  return json({ error: 'utiliser POST' }, 405);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
