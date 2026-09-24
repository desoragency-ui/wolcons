/* ==========================================================================
   Accès Postgres partagé par les fonctions /api/ (Cloudflare Pages Functions).

   Base : Neon (offre gratuite, usage commercial autorisé, pas de mise en
   veille après inactivité). Le pilote @neondatabase/serverless parle en HTTP
   — pas de connexion TCP, donc utilisable depuis le runtime Workers.

   L'API est la même que celle de @vercel/postgres : sql`…` en gabarit
   étiqueté, les valeurs interpolées sont paramétrées, jamais concaténées.

   Les tables se créent au premier appel : rien à lancer à la main, donc
   aucune étape d'installation à rater.
   ========================================================================== */
import { neon } from '@neondatabase/serverless';

/* Une connexion par isolat, réutilisée d'une requête à l'autre. */
let cached = null;

export function db(env) {
  const url = env.DATABASE_URL || env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL absente — liez la base Neon au projet Pages.');
  if (!cached || cached.url !== url) cached = { url, sql: neon(url) };
  return cached.sql;
}

let ready = null;

export function ensure(sql) {
  if (!ready) {
    ready = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS events (
          id         BIGSERIAL PRIMARY KEY,
          ts         BIGINT NOT NULL,
          type       TEXT   NOT NULL,
          detail     TEXT,
          lang       TEXT,
          src        TEXT,
          dev        TEXT,
          path       TEXT,
          sid        TEXT,
          vid        TEXT,
          created_at BIGINT NOT NULL
        )`;
      await sql`CREATE INDEX IF NOT EXISTS idx_events_ts ON events (ts)`;
      /* colonne ajoutée après coup : une base créée avant cette version
         doit la recevoir sans qu'on ait à toucher à quoi que ce soit */
      await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS vid TEXT`;
      await sql`
        CREATE TABLE IF NOT EXISTS settings (
          key        TEXT PRIMARY KEY,
          value      JSONB  NOT NULL,
          updated_at BIGINT NOT NULL
        )`;
    })().catch((e) => {
      ready = null;                 // un échec ne doit pas se figer définitivement
      throw e;
    });
  }
  return ready;
}

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
