/* Ancienne adresse du collecteur, gardée pour les navigateurs qui ont encore
   l'ancien analytics.js en cache. La vraie route est /api/wlc : la liste
   EasyPrivacy (uBlock, Brave, AdGuard) bloque /api/collect. */
export { onRequest } from './wlc.js';
