/* ==========================================================================
   Protection du tableau de bord — Cloudflare Pages Functions.

   C'est la SEULE vraie protection : le lien masqué dans le pied de page et le
   noindex ne font que rendre la page discrète.

   Couvre quatre chemins, et il les faut tous :
     /dashboard      la page
     /api/events     les chiffres  — sans ça, la page est fermée mais pas les données
     /api/settings   les réglages
     /api/pagespeed  la mesure de vitesse (et la clé qui va avec)
   /api/collect reste ouvert : c'est par là que les visiteurs envoient les
   événements, il doit répondre à tout le monde.

   DEUX MODES, au choix, réglés par variables d'environnement :

   1. Cloudflare Access (recommandé) — le client reçoit un code par e-mail,
      chaque personne a son accès, révocable une par une.
        ACCESS_TEAM_DOMAIN   ex. « wolcons » ou « wolcons.cloudflareaccess.com »
        ACCESS_AUD           « Application Audience (AUD) Tag » de l'application
        ALLOWED_EMAILS       facultatif, adresses séparées par des virgules :
                             second mur, vérifié ici même si la règle Access
                             était un jour élargie par erreur
      Le jeton signé par Cloudflare est VÉRIFIÉ ici (signature, émetteur,
      audience, expiration). Sans cette vérification, il suffirait d'ouvrir
      l'URL *.pages.dev pour contourner Access.

   2. Mot de passe unique, partagé.
        DASH_PASSWORD   le mot de passe          (obligatoire dans ce mode)
        DASH_USER       l'identifiant, défaut « wolcons » (facultatif)

   Si les deux sont configurés, un jeton Access valide suffit ; sinon on
   retombe sur le mot de passe. Si AUCUN n'est configuré, tout est refusé :
   mieux vaut un tableau de bord injoignable qu'un tableau de bord ouvert.

   Facultatif : PAGESPEED_KEY, clé Google PageSpeed pour la carte vitesse.
   ========================================================================== */

const PROTECTED = [
  (p) => p === '/dashboard' || p.startsWith('/dashboard/'),
  (p) => p === '/api/events',
  (p) => p === '/api/settings',
  (p) => p === '/api/pagespeed'
];

export async function onRequest(context) {
  const { request, env, next } = context;
  const path = new URL(request.url).pathname;

  if (!PROTECTED.some((match) => match(path))) return next();

  const teamDomain = env.ACCESS_TEAM_DOMAIN;
  const aud = env.ACCESS_AUD;
  const password = env.DASH_PASSWORD;

  if (!teamDomain && !password) {
    return text(503,
      "Le tableau de bord n'est pas encore configuré : renseignez ACCESS_TEAM_DOMAIN "
      + "et ACCESS_AUD (Cloudflare Access), ou DASH_PASSWORD, dans les variables "
      + "d'environnement du projet Pages, puis redéployez.");
  }

  if (teamDomain) {
    if (!aud) {
      return text(503,
        "ACCESS_TEAM_DOMAIN est renseigné mais ACCESS_AUD manque : sans audience, "
        + "un jeton émis pour une autre application serait accepté.");
    }
    const token = request.headers.get('Cf-Access-Jwt-Assertion')
      || cookie(request, 'CF_Authorization');
    const allowed = String(env.ALLOWED_EMAILS || '')
      .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (token && await verifyAccess(token, teamDomain, aud, allowed)) return next();
    if (!password) {
      return text(403,
        "Accès refusé. Ouvrez cette page par l'adresse protégée par Cloudflare Access.");
    }
  }

  if (password && checkBasic(request, env.DASH_USER || 'wolcons', password)) return next();

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

/* ------------------------------------------------------------ mot de passe */

function checkBasic(request, user, expected) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;
  let decoded = '';
  try { decoded = atob(header.slice(6)); } catch { return false; }
  const i = decoded.indexOf(':');
  if (i < 0) return false;
  return decoded.slice(0, i) === user && safeEqual(decoded.slice(i + 1), expected);
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

/* ------------------------------------------------------ Cloudflare Access */

/* Les clés publiques de l'équipe changent rarement ; on les garde une heure
   pour ne pas refaire un aller-retour à chaque fichier du tableau de bord. */
let jwksCache = { domain: '', at: 0, keys: null };
const JWKS_TTL = 3600 * 1000;

function teamHost(teamDomain) {
  return teamDomain.includes('.') ? teamDomain : teamDomain + '.cloudflareaccess.com';
}

async function jwks(teamDomain) {
  const host = teamHost(teamDomain);
  if (jwksCache.keys && jwksCache.domain === host && Date.now() - jwksCache.at < JWKS_TTL) {
    return jwksCache.keys;
  }
  const r = await fetch('https://' + host + '/cdn-cgi/access/certs');
  if (!r.ok) throw new Error('certs indisponibles');
  const body = await r.json();
  const keys = Array.isArray(body.keys) ? body.keys : [];
  jwksCache = { domain: host, at: Date.now(), keys };
  return keys;
}

async function verifyAccess(token, teamDomain, aud, allowed) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const h = parts[0], p = parts[1], s = parts[2];

    const header = JSON.parse(b64uText(h));
    if (header.alg !== 'RS256' || !header.kid) return false;

    const list = await jwks(teamDomain);
    const jwk = list.find((k) => k.kid === header.kid);
    if (!jwk) return false;

    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const ok = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      b64uBytes(s),
      new TextEncoder().encode(h + '.' + p)
    );
    if (!ok) return false;

    const claims = JSON.parse(b64uText(p));
    const now = Math.floor(Date.now() / 1000);
    if (!claims.exp || claims.exp < now) return false;
    if (claims.nbf && claims.nbf > now + 60) return false;
    if (claims.iss !== 'https://' + teamHost(teamDomain)) return false;

    const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!auds.includes(aud)) return false;

    if (allowed && allowed.length) {
      const email = String(claims.email || '').toLowerCase();
      if (!allowed.includes(email)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/* ----------------------------------------------------------------- outils */

function b64uBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64uText(s) {
  return new TextDecoder().decode(b64uBytes(s));
}

function cookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

function text(status, body) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }
  });
}
