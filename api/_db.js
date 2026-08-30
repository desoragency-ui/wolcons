/* ==========================================================================
   Accès Postgres partagé par les routes /api/. Le préfixe « _ » dit à Vercel
   que ce fichier n'est pas une route.

   Les tables se créent au premier appel : rien à lancer à la main, donc
   aucune étape d'installation à rater.
   ========================================================================== */
import { sql } from '@vercel/postgres';

let ready = null;

export function ensure() {
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

export { sql };

/* Pas de chaînage sur res : selon la version du runtime, setHeader ne renvoie
   pas toujours l'objet. */
export function json(res, status, body) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.status(status).send(JSON.stringify(body));
}
