-- ===========================================================================
-- Base D1 du collecteur Wolcons.
-- À exécuter UNE FOIS, à la création de la base :
--   npx wrangler d1 execute wolcons-analytics --remote --file=functions/schema.sql
-- ===========================================================================

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ts          INTEGER NOT NULL,   -- horodatage de l'événement (ms), borné côté serveur
  type        TEXT    NOT NULL,   -- pageview, whatsapp_click, quote_submit…
  detail      TEXT,               -- texte, nombre, ou JSON pour quote_submit
  lang        TEXT,               -- fr / en / ar
  src         TEXT,               -- google, instagram, direct…
  dev         TEXT,               -- mobile / desktop / tablet
  path        TEXT,
  sid         TEXT,               -- identifiant de session, éphémère, non nominatif
  created_at  INTEGER NOT NULL    -- date d'arrivée côté serveur
);

-- Le tableau de bord ne demande jamais que « depuis telle date » : c'est le
-- seul index qui compte.
CREATE INDEX IF NOT EXISTS idx_events_ts ON events (ts);

-- Confort pour les requêtes de comptage par type sur une période.
CREATE INDEX IF NOT EXISTS idx_events_type_ts ON events (type, ts);
