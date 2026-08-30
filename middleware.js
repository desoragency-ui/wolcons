/* ==========================================================================
   Mot de passe sur le tableau de bord — Vercel Edge Middleware.

   C'est la SEULE vraie protection : le lien masqué dans le pied de page et le
   noindex ne font que rendre la page discrète. Ici, rien ne sort du serveur
   sans le mot de passe.

   Couvre trois chemins, et il faut les trois :
     /dashboard      la page
     /api/events     les chiffres  — sans ça, la page est fermée mais pas les données
     /api/settings   les réglages
   /api/collect reste ouvert : c'est par là que les visiteurs envoient les
   événements, il doit répondre à tout le monde.

   Réglage dans Vercel (Settings -> Environment Variables) :
     DASH_PASSWORD   le mot de passe          (obligatoire)
     DASH_USER       l'identifiant, défaut « wolcons » (facultatif)
   ========================================================================== */

export const config = {
  matcher: ['/dashboard/:path*', '/api/events', '/api/settings']
};

export default function middleware(request) {
  const expected = process.env.DASH_PASSWORD;

  /* Pas de mot de passe configuré = on refuse tout, plutôt que de laisser
     l'accès ouvert sans que personne ne s'en aperçoive. */
  if (!expected) {
    return new Response(
      "Le tableau de bord n'est pas encore configuré : ajoutez la variable " +
      "d'environnement DASH_PASSWORD dans Vercel, puis redéployez.",
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    );
  }

  const user = process.env.DASH_USER || 'wolcons';
  const header = request.headers.get('authorization') || '';

  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch { decoded = ''; }
    const i = decoded.indexOf(':');
    const gotUser = i < 0 ? '' : decoded.slice(0, i);
    const gotPass = i < 0 ? '' : decoded.slice(i + 1);

    if (gotUser === user && safeEqual(gotPass, expected)) {
      return;                                   // authentifié : la requête continue
    }
  }

  return new Response('Authentification requise.', {
    status: 401,
    headers: {
      /* déclenche la fenêtre de connexion du navigateur */
      'WWW-Authenticate': 'Basic realm="Tableau de bord Wolcons", charset="UTF-8"',
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

/* Comparaison à durée constante : évite de laisser deviner le mot de passe
   caractère par caractère en mesurant le temps de réponse. */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
