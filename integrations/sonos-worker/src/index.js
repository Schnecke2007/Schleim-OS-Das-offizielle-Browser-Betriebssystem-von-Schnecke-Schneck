const CONTROL_API = 'https://api.ws.sonos.com/control/api/v1';
const TOKEN_URL = 'https://api.sonos.com/login/v3/oauth/access';
const SESSION_TTL = 60 * 60 * 24 * 60;

function originFor(request) {
  const origin = request.headers.get('Origin') || '';
  if (origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://')) return origin;
  return 'null';
}
function headersFor(request, extra = {}) {
  return {
    'Access-Control-Allow-Origin': originFor(request),
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    ...extra
  };
}
function json(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: headersFor(request, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  });
}
function html(data, status = 200) {
  return new Response(data, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' }
  });
}
function randomState(value) {
  return typeof value === 'string' && /^[a-f0-9]{64,128}$/i.test(value);
}
function bearer(request) {
  const value = request.headers.get('Authorization') || '';
  const match = value.match(/^Bearer\s+([a-f0-9]{64,128})$/i);
  return match ? match[1] : '';
}
function allowedApiPath(path, method) {
  const id = '[A-Za-z0-9_.:-]+';
  if (path === '/households') return method === 'GET';
  if (new RegExp('^/households/' + id + '/(groups|favorites|playlists)$').test(path)) return method === 'GET';
  if (new RegExp('^/groups/' + id + '/playback$').test(path)) return method === 'GET';
  if (new RegExp('^/groups/' + id + '/playbackMetadata$').test(path)) return method === 'GET';
  if (new RegExp('^/groups/' + id + '/groupVolume$').test(path)) return method === 'GET' || method === 'POST';
  if (new RegExp('^/groups/' + id + '/groupVolume/mute$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/favorites$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playlists$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(play|pause|togglePlayPause|skipToNextTrack|skipToPreviousTrack)$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/seek$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/playMode$').test(path)) return method === 'POST';
  return false;
}

async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
).test(path)) return method === 'GET' || method === 'POST';
  if (new RegExp('^/groups/' + id + '/groupVolume/mute
  if (new RegExp('^/groups/' + id + '/favorites$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playlists$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(play|pause|togglePlayPause|skipToNextTrack|skipToPreviousTrack)$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(seek|playMode)$').test(path)) return method === 'POST';
  return false;
}
async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
).test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/favorites$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playlists$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(play|pause|togglePlayPause|skipToNextTrack|skipToPreviousTrack)$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(seek|playMode)$').test(path)) return method === 'POST';
  return false;
}
async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
).test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/playMode
  return false;
}
async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
).test(path)) return method === 'GET' || method === 'POST';
  if (new RegExp('^/groups/' + id + '/groupVolume/mute
  if (new RegExp('^/groups/' + id + '/favorites$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playlists$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(play|pause|togglePlayPause|skipToNextTrack|skipToPreviousTrack)$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(seek|playMode)$').test(path)) return method === 'POST';
  return false;
}
async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
).test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/favorites$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playlists$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(play|pause|togglePlayPause|skipToNextTrack|skipToPreviousTrack)$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(seek|playMode)$').test(path)) return method === 'POST';
  return false;
}
async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
).test(path)) return method === 'GET' || method === 'POST';
  return false;
}
async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
).test(path)) return method === 'GET' || method === 'POST';
  if (new RegExp('^/groups/' + id + '/groupVolume/mute
  if (new RegExp('^/groups/' + id + '/favorites$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playlists$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(play|pause|togglePlayPause|skipToNextTrack|skipToPreviousTrack)$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(seek|playMode)$').test(path)) return method === 'POST';
  return false;
}
async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
).test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/favorites$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playlists$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(play|pause|togglePlayPause|skipToNextTrack|skipToPreviousTrack)$').test(path)) return method === 'POST';
  if (new RegExp('^/groups/' + id + '/playback/(seek|playMode)$').test(path)) return method === 'POST';
  return false;
}
async function tokenRequest(env, form) {
  if (!env.SONOS_CLIENT_ID || !env.SONOS_CLIENT_SECRET || !env.SONOS_REDIRECT_URI) throw new Error('Sonos credentials are not configured on the bridge.');
  const credentials = btoa(env.SONOS_CLIENT_ID + ':' + env.SONOS_CLIENT_SECRET);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(form)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.error || 'Sonos token exchange failed (' + response.status + ').');
  }
  return payload;
}
async function readSession(env, key) {
  const raw = await env.SONOS_SESSIONS.get('session:' + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function writeSession(env, key, value) {
  await env.SONOS_SESSIONS.put('session:' + key, JSON.stringify(value), { expirationTtl: SESSION_TTL });
}
async function validSession(request, env) {
  const key = bearer(request);
  if (!key) return null;
  const session = await readSession(env, key);
  return session ? { key, session } : null;
}
async function freshAccessToken(env, key, session) {
  if (Number(session.expiresAt || 0) > Date.now() + 120000) return session.accessToken;
  const token = await tokenRequest(env, { grant_type: 'refresh_token', refresh_token: session.refreshToken });
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 86400) * 1000;
  await writeSession(env, key, session);
  return session.accessToken;
}
async function callback(env, url) {
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  if (error) return html('<!doctype html><meta charset="utf-8"><title>Sonos-Verbindung</title><h2>Sonos-Anmeldung nicht abgeschlossen</h2><p>Sonos hat den Zugriff nicht freigegeben. Kehre zu Schleim OS zurück und versuche es erneut.</p>', 400);
  if (!code || !randomState(state)) return html('<!doctype html><meta charset="utf-8"><title>Ungültige Anfrage</title><p>Die Sonos-Rückmeldung ist unvollständig. Bitte starte die Anmeldung erneut.</p>', 400);
  const pending = await env.SONOS_SESSIONS.get('pending:' + state);
  if (!pending) return html('<!doctype html><meta charset="utf-8"><title>Anmeldung abgelaufen</title><p>Diese Anmeldung ist abgelaufen. Kehre zu Schleim OS zurück und starte sie erneut.</p>', 400);
  try {
    const token = await tokenRequest(env, { grant_type: 'authorization_code', code, redirect_uri: env.SONOS_REDIRECT_URI });
    await writeSession(env, state, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + Number(token.expires_in || 86400) * 1000,
      connectedAt: Date.now()
    });
    await env.SONOS_SESSIONS.delete('pending:' + state);
    return html('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Sonos verbunden</title><body style="margin:0;background:#160e09;color:#f5e8dc;font:16px system-ui;display:grid;min-height:100vh;place-items:center"><main style="max-width:420px;padding:32px;text-align:center"><div style="font-size:48px">🔊</div><h1>Sonos wurde autorisiert</h1><p>Du kannst diesen Tab schließen und zu Schleim OS zurückkehren. Die App verbindet sich automatisch mit deinen Lautsprechern.</p></main></body></html>');
  } catch (err) {
    const message = String(err.message || 'Unbekannter Fehler').replace(/[<>&"]/g, '');
    return html('<!doctype html><meta charset="utf-8"><title>Sonos-Fehler</title><h2>Sonos konnte nicht verbunden werden</h2><p>' + message + '</p><p>Kehre zu Schleim OS zurück und prüfe die Bridge-Einstellungen.</p>', 502);
  }
}
async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headersFor(request) });
  if (url.pathname === '/health' && request.method === 'GET') {
    return json(request, { service: 'Schleim OS Sonos Bridge', configured: !!(env.SONOS_CLIENT_ID && env.SONOS_CLIENT_SECRET && env.SONOS_REDIRECT_URI && env.SONOS_SESSIONS) });
  }
  if (url.pathname === '/oauth/login' && request.method === 'GET') {
    const state = url.searchParams.get('state') || '';
    if (!randomState(state)) return json(request, { error: 'Invalid OAuth state.' }, 400);
    if (!env.SONOS_CLIENT_ID || !env.SONOS_REDIRECT_URI || !env.SONOS_SESSIONS) return json(request, { error: 'The Sonos bridge is not configured yet.' }, 503);
    await env.SONOS_SESSIONS.put('pending:' + state, JSON.stringify({ createdAt: Date.now() }), { expirationTtl: 600 });
    const login = new URL('https://api.sonos.com/login/v3/oauth');
    login.searchParams.set('client_id', env.SONOS_CLIENT_ID);
    login.searchParams.set('response_type', 'code');
    login.searchParams.set('scope', 'playback-control-all');
    login.searchParams.set('state', state);
    login.searchParams.set('redirect_uri', env.SONOS_REDIRECT_URI);
    return Response.redirect(login.toString(), 302);
  }
  if (url.pathname === '/oauth/callback' && request.method === 'GET') return callback(env, url);
  if (url.pathname === '/oauth/status' && request.method === 'GET') {
    const current = await validSession(request, env);
    if (!current) return json(request, { connected: false }, 401);
    return json(request, { connected: true, expiresAt: current.session.expiresAt, connectedAt: current.session.connectedAt });
  }
  if (url.pathname === '/session' && request.method === 'DELETE') {
    const current = await validSession(request, env);
    if (current) await env.SONOS_SESSIONS.delete('session:' + current.key);
    return json(request, { connected: false });
  }
  if (url.pathname.startsWith('/api/')) {
    const current = await validSession(request, env);
    if (!current) return json(request, { error: 'Sonos session is missing or expired. Please reconnect.' }, 401);
    const apiPath = url.pathname.slice(4);
    if (!allowedApiPath(apiPath, request.method)) return json(request, { error: 'This Sonos API route is not allowed by the bridge.' }, 403);
    let body;
    if (request.method !== 'GET') {
      const raw = await request.text();
      if (raw.length > 20000) return json(request, { error: 'Request body is too large.' }, 413);
      try { body = raw ? JSON.parse(raw) : {}; } catch { return json(request, { error: 'Invalid JSON body.' }, 400); }
    }
    try {
      const token = await freshAccessToken(env, current.key, current.session);
      const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json', 'User-Agent': 'Schleim-OS-Sonos-Bridge/1.0' };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      let sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
        method: request.method, headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      if (sonosResponse.status === 401) {
        current.session.expiresAt = 0;
        const refreshed = await freshAccessToken(env, current.key, current.session);
        headers.Authorization = 'Bearer ' + refreshed;
        sonosResponse = await fetch(CONTROL_API + apiPath + url.search, {
          method: request.method, headers,
          body: body === undefined ? undefined : JSON.stringify(body)
        });
      }
      const responseText = await sonosResponse.text();
      return new Response(responseText, {
        status: sonosResponse.status,
        headers: headersFor(request, {
          'Content-Type': sonosResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Cache-Control': 'no-store'
        })
      });
    } catch (err) {
      return json(request, { error: err.message || 'Sonos request failed.' }, 502);
    }
  }
  return json(request, { error: 'Not found.' }, 404);
}
export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (err) { return json(request, { error: err.message || 'Bridge error.' }, 500); }
  }
};
