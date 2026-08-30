/* ==========================================================================
   /api/settings — ce que le tableau de bord ne peut pas deviner, et que le
   client renseigne lui-même. Stocké en base, donc valable sur tous les
   appareils, pas seulement celui qui a saisi.

   GET            -> { goals, rates, quoteStatus, quotePrice }
   POST { key, value } -> enregistre une clé (goals | rates | quoteStatus | quotePrice)

   PROTÉGÉE par middleware.js, comme /dashboard/ et /api/events.
   ========================================================================== */
import { sql, ensure, json } from './_db.js';

const KEYS = new Set(['goals', 'rates', 'quoteStatus', 'quotePrice']);

/* Valeurs de départ.

   Les prix au m² ne sont PAS inventés : ils viennent des 13 réalisations
   publiées sur le site, surface et budget divisés l'un par l'autre.
     aménagement/fit-out : ISH 6 250 · Huawei 8 750 · Saint-Louis 12 000 ·
                           Thomas & Piron 10 891 · Riad Pru 15 625  -> médiane ~10 900
     villas              : Villa CS 4 419 · Villa E 5 806 · Villa IB 5 490 -> ~5 500
     grands ouvrages     : Ambassade 10 000 · Usine Novares 8 889   -> ~9 400
   Le client reste libre de les corriger : c'est lui qui connaît ses prix du
   moment, la médiane ne dit que l'historique. */
const DEFAULTS = {
  goals: { views: 2500, quotes: 18, contacts: 110, value: 45 },
  rates: {
    'Aménagement TCE': 10900,
    'Construction clé en main': 9400,
    'Project management': 9400,
    'Rénovation / réhabilitation': 10900,
    'Je ne sais pas encore': 8000
  },
  quoteStatus: {},
  quotePrice: {}
};

const NUM_KEYS = { goals: ['views', 'quotes', 'contacts', 'value'] };

/* On ne fait jamais confiance au corps reçu : chaque clé a sa propre
   validation, et tout ce qui n'est pas reconnu est écarté. */
function sanitize(key, value) {
  if (key === 'goals') {
    const out = { ...DEFAULTS.goals };
    for (const k of NUM_KEYS.goals) {
      const n = Number(value?.[k]);
      if (Number.isFinite(n) && n >= 0 && n < 1e9) out[k] = n;
    }
    return out;
  }
  if (key === 'rates') {
    const out = {};
    for (const k of Object.keys(DEFAULTS.rates)) {
      const n = Number(value?.[k]);
      out[k] = (Number.isFinite(n) && n > 0 && n < 1e6) ? n : DEFAULTS.rates[k];
    }
    return out;
  }
  /* Prix réel d'un devis, en MDH, saisi par le client. Remplace l'estimation
     surface x prix au m² : une valeur connue vaut mieux qu'un ordre de grandeur. */
  if (key === 'quotePrice') {
    const out = {};
    let n = 0;
    for (const [id, v] of Object.entries(value || {})) {
      if (n++ > 5000) break;
      if (!/^\d{1,20}$/.test(id)) continue;
      const num = Number(v);
      /* 0 ou vide = le client retire le prix et revient à l'estimation */
      if (Number.isFinite(num) && num > 0 && num < 100000) out[id] = num;
    }
    return out;
  }

  if (key === 'quoteStatus') {
    const allowed = new Set(['nouveau', 'visite planifiée', 'devis envoyé', 'gagné', 'perdu']);
    const out = {};
    let n = 0;
    for (const [id, st] of Object.entries(value || {})) {
      if (n++ > 5000) break;                       // plafond : la table n'est pas un dépotoir
      if (/^\d{1,20}$/.test(id) && allowed.has(st)) out[id] = st;
    }
    return out;
  }
  return null;
}

export default async function handler(req, res) {
  try {
    await ensure();

    if (req.method === 'GET') {
      const { rows } = await sql`SELECT key, value FROM settings`;
      const out = { ...DEFAULTS };
      for (const r of rows) if (KEYS.has(r.key)) out[r.key] = r.value;
      return json(res, 200, out);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { return json(res, 400, { error: 'json invalide' }); }
      }
      const key = body?.key;
      if (!KEYS.has(key)) return json(res, 400, { error: 'clé inconnue' });

      const value = sanitize(key, body.value);
      if (value === null) return json(res, 400, { error: 'valeur invalide' });

      await sql`
        INSERT INTO settings (key, value, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}::jsonb, ${Date.now()})
        ON CONFLICT (key) DO UPDATE
          SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`;

      return json(res, 200, { ok: true, key, value });
    }

    return json(res, 405, { error: 'utiliser GET ou POST' });
  } catch (e) {
    return json(res, 500, { error: 'réglages indisponibles', detail: String(e).slice(0, 200) });
  }
}
