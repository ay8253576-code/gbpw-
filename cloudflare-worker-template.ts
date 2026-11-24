import { STYLISH_UI_CSS, STYLISH_UI_FONTS, STYLISH_UI_JS } from './stylish-ui.ts';

const UPSTREAM_ORIGIN = 'https://s2-cdn.studyratna.cc';
const BRAND_NAME = 'GB STUDY';
const TELEGRAM_URL = 'https://t.me/GBFreestudy';
const ICON_SOURCE_URL = 'https://i.ibb.co/Q3g9fGSt/1791541921524.png';
const ICON_PATH = '/gb-icon.png';

const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export function buildManifestJson(): string {
  return JSON.stringify(
    {
      name: BRAND_NAME,
      short_name: BRAND_NAME,
      description: `${BRAND_NAME} Learning Studio`,
      start_url: '/',
      display: 'standalone',
      background_color: '#f4f7fb',
      theme_color: '#2563eb',
      icons: [
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  );
}

function buildClientOriginGuardScript(): string {
  return '<script id="gb-origin-guard">(function(){if(window.__gbOriginGuard)return;window.__gbOriginGuard=true;var _o=window.location.origin;function _rw(u){if(typeof u!=="string")return u;u=u.replace(/^https?:\\/\\/(?:s2-cdn\\.)?studyratna\\.cc(?=\\/|$|\\?|#)/i,_o);u=u.replace(/^\\/cdn-cgi\\//i,"/__gb_cf_cgi/");if(u.indexOf(_o+"/cdn-cgi/")===0)u=_o+"/__gb_cf_cgi/"+u.slice((_o+"/cdn-cgi/").length);return u;}function _showGateBanner(url){try{if(document.getElementById("gb-gate-banner")||!document.body)return;var b=document.createElement("div");b.id="gb-gate-banner";b.style.cssText="position:fixed;bottom:18px;right:18px;z-index:99999;background:#0f172a;color:#f8fafc;border:1px solid rgba(56,189,248,0.45);border-radius:14px;padding:12px 16px;box-shadow:0 16px 36px rgba(0,0,0,0.45);display:flex;align-items:center;gap:12px;font-family:sans-serif;font-size:13px;";var t=document.createElement("span");t.textContent="Security verification needed to load content.";var a=document.createElement("button");a.type="button";a.textContent="Verify Now";a.style.cssText="background:#2563eb;color:#fff;border:none;border-radius:10px;padding:7px 14px;font-weight:700;cursor:pointer;";a.onclick=function(){window.location.assign(url||"/?__gb_gate=1");};b.appendChild(t);b.appendChild(a);document.body.appendChild(b);}catch(e){}}var _f=window.fetch;if(typeof _f==="function"){window.fetch=function(u,opts){try{if(typeof u==="string"){u=_rw(u);}else if(u&&u.url){var nu=_rw(u.url);if(nu!==u.url)u=new Request(nu,u);}}catch(e){}return _f.call(this,u,opts).then(function(resp){try{if(resp.status===403&&(resp.headers.get("content-type")||"").indexOf("json")!==-1){resp.clone().json().then(function(d){if(d&&d.security_gate)_showGateBanner(d.challenge_url);},function(){});}}catch(e){}return resp;});};}if(typeof XMLHttpRequest!=="undefined"&&XMLHttpRequest.prototype){var _xo=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){try{if(typeof u==="string")arguments[1]=_rw(u);}catch(e){}return _xo.apply(this,arguments);};}})();</script>';
}

function buildRuntimeObjPatchTail(): string {
  const d1 = ['s2-cdn', 'studyratna', 'cc'].join('.');
  const d2 = ['studyratna', 'cc'].join('.');
  const d3 = ['stream', 'studyratna', 'cc'].join('.');
  const upOrigin = 'https://' + d1;
  const rootOrigin = 'https://' + d2;
  const upOriginEnc = encodeURIComponent(upOrigin);
  const rootOriginEnc = encodeURIComponent(rootOrigin);
  return `;if(typeof _obj==="object"&&_obj){for(var _k in _obj){if(typeof _obj[_k]==="function"&&_obj[_k].length===1){(function(_orig,_key){_obj[_key]=function(_idx){var _v=_orig.call(this,_idx);if(typeof _v!=="string")return _v;if(_v.indexOf("check_origin.php")!==-1)return "/api/check_origin.php";if(_v===${JSON.stringify(d1)}||_v===${JSON.stringify(d2)}||_v===${JSON.stringify(d3)})return window.location.hostname;if(_v.indexOf(${JSON.stringify(upOrigin + '/')})===0)return window.location.origin+_v.slice(${upOrigin.length});if(_v===${JSON.stringify(upOrigin)}||_v===${JSON.stringify(rootOrigin)})return window.location.origin;if(_v.indexOf(${JSON.stringify(rootOrigin + '/')})===0)return window.location.origin+_v.slice(${rootOrigin.length});if(_v.indexOf(${JSON.stringify(upOriginEnc)})!==-1)_v=_v.split(${JSON.stringify(upOriginEnc)}).join(encodeURIComponent(window.location.origin));if(_v.indexOf(${JSON.stringify(rootOriginEnc)})!==-1)_v=_v.split(${JSON.stringify(rootOriginEnc)}).join(encodeURIComponent(window.location.origin));if(_v.indexOf("t.me/")!==-1||_v.indexOf("telegram.me/")!==-1||_v.indexOf("channel.studyrays.cc")!==-1){_v=_v.replace(/https?:\\/\\/(?:t\\.me|telegram\\.me)\\/[^\\s"\\x27<>\\\\)]+/gi,${JSON.stringify(TELEGRAM_URL)}).replace(/https?:\\/\\/channel\\.studyrays\\.cc[^\\s"\\x27<>\\\\)]*/gi,${JSON.stringify(TELEGRAM_URL)});}if(_v.indexOf("StudyRatna")!==-1||_v.indexOf("StudyRays")!==-1||_v.indexOf("studyrays")!==-1||_v.indexOf("Study Ratna")!==-1||_v.indexOf("Ratna Bhai")!==-1){_v=_v.replace(/StudyRays\\s*x\\s*DevJisu/gi,${JSON.stringify(BRAND_NAME)}).replace(/(?<![./a-z0-9-])StudyRatna(?:\\.cc)?/gi,${JSON.stringify(BRAND_NAME)}).replace(/Study\\s+Ratna/gi,${JSON.stringify(BRAND_NAME)}).replace(/Ratna\\s+Bhai/gi,${JSON.stringify(BRAND_NAME)}).replace(/StudyRays/gi,${JSON.stringify(BRAND_NAME)}).replace(/studyrays/gi,${JSON.stringify(BRAND_NAME)});}return _v;};})(_obj[_k],_k);}}}}catch(_e){}})();`;
}

function buildPlayCookieSyncTail(): string {
  return ';if(_p){try{if(document.cookie.indexOf("_pw_sec_chk="+_p)===-1){document.cookie="_pw_sec_chk="+_p+"; path=/; max-age=3600; SameSite=None; Secure; Partitioned";}}catch(e){}try{var _d=Object.getOwnPropertyDescriptor(Document.prototype,"cookie")||Object.getOwnPropertyDescriptor(HTMLDocument.prototype,"cookie");if(_d&&_d.get&&_d.set){Object.defineProperty(document,"cookie",{configurable:true,get:function(){var raw=_d.get.call(document)||"";var parts=raw.split(";").map(function(x){return x.trim();}).filter(function(x){return x&&x.indexOf("_pw_sec_chk=")!==0;});parts.push("_pw_sec_chk="+_p);return parts.join("; ");},set:function(v){if(typeof v==="string"&&v.indexOf("__gb_radha_proxy__")!==-1)return v;return _d.set.call(document,v);}});}}catch(e){}}var _memBundle=null;try{if(typeof Storage!=="undefined"&&Storage.prototype){var _lsGet=Storage.prototype.getItem;var _lsSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(this===window.localStorage&&k==="sr_token_bundle"&&typeof v==="string"&&v.indexOf("__gb_radha_proxy__")!==-1){_memBundle=v;return;}return _lsSet.call(this,k,v);};Storage.prototype.getItem=function(k){var val=_lsGet.call(this,k);if(this===window.localStorage&&k==="sr_token_bundle"&&!val&&_memBundle){return _memBundle;}return val;};}}catch(e){}function _needsMediaProxy(u){if(typeof u!=="string")return false;return /^https?:\\/\\/[^/]*\\.de5\\.net\\//i.test(u)||/^https?:\\/\\/[^/]*\\.studyratna\\.cc\\//i.test(u);}function _toMediaProxy(u){return window.location.origin+"/__gb_media?u="+encodeURIComponent(u);}function _extractRadhaPath(u){if(typeof u!=="string")return null;var m=u.match(/^https?:\\/\\/s[0-9a-z-]*\\.samfygros\\.com\\/radha(\\/[^#]*)/i);if(!m)return null;var p=m[1];if(!p||p.indexOf("type=contents")!==-1||p.indexOf("/videos/get-hls-key")!==-1)return null;return p;}function _toRadhaProxy(p){return window.location.origin+"/__gb_radha?path="+encodeURIComponent(p);}var _f=window.fetch;if(typeof _f==="function"){window.fetch=function(u,o){try{var s=typeof u==="string"?u:(u&&u.url)||"";var m=(o&&o.method)||(u&&typeof u!=="string"&&u.method)||"GET";if(s.indexOf("token-manager.php")!==-1){o=o?Object.assign({},o):{};if(!o.credentials)o.credentials="same-origin";return _f.call(this,u,o).then(function(resp){return resp.clone().json().then(function(d){if(resp.ok&&d&&d.success&&(d.access_token||d.token))return resp;return null;},function(){return null;}).then(function(validResp){if(validResp)return validResp;var fallback={success:true,token:"__gb_radha_proxy__",access_token:"__gb_radha_proxy__",enc_token:"__gb_radha_proxy__",expires_at:Math.floor(Date.now()/1000)+120};return new Response(JSON.stringify(fallback),{status:200,headers:{"Content-Type":"application/json"}});});});}if((_p||_sid)&&(s.indexOf("video-url-details.php")!==-1||s.indexOf("e2e-status-proxy.php")!==-1)){o=o?Object.assign({},o):{};var h=new Headers(o.headers||{});if(_p)h.set("x-gb-pw-chk",_p);if(_sid)h.set("x-gb-play-sid",_sid);o.headers=h;}else if(String(m).toUpperCase()==="GET"){var rp=_extractRadhaPath(s);if(rp){u=_toRadhaProxy(rp);o={method:"GET",credentials:"same-origin",headers:{"Accept":"application/json"}};}else if(_needsMediaProxy(s)){if(typeof u==="string"){u=_toMediaProxy(s);}else if(u&&u.url){u=new Request(_toMediaProxy(s),u);}}}}catch(e){}return _f.call(this,u,o);};}if(typeof XMLHttpRequest!=="undefined"&&XMLHttpRequest.prototype){var _xo=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){try{if(typeof u==="string"&&_needsMediaProxy(u)){arguments[1]=_toMediaProxy(u);}}catch(e){}return _xo.apply(this,arguments);};}})();</script>';
}

export function buildCloudflareWorkerScript(): string {
  // Embed raw string constants safely into the generated ES module Worker
  const configBlock = `
const UPSTREAM_ORIGIN = ${JSON.stringify(UPSTREAM_ORIGIN)};
const UPSTREAM_HOST = 's2-cdn.studyratna.cc';
const ROOT_UPSTREAM_HOST = 'studyratna.cc';
const BRAND_NAME = ${JSON.stringify(BRAND_NAME)};
const TELEGRAM_URL = ${JSON.stringify(TELEGRAM_URL)};
const ICON_SOURCE_URL = ${JSON.stringify(ICON_SOURCE_URL)};
const ICON_PATH = ${JSON.stringify(ICON_PATH)};
const DEFAULT_UA = ${JSON.stringify(DEFAULT_UA)};
const MANIFEST_JSON = ${JSON.stringify(buildManifestJson())};
const GB_UI_FONTS = ${JSON.stringify(STYLISH_UI_FONTS)};
const GB_UI_CSS = ${JSON.stringify(STYLISH_UI_CSS)};
const GB_UI_JS = ${JSON.stringify(STYLISH_UI_JS)};
const GB_ORIGIN_GUARD_SCRIPT = ${JSON.stringify(buildClientOriginGuardScript())};
const GB_RUNTIME_PATCH_TAIL = ${JSON.stringify(buildRuntimeObjPatchTail())};
const GB_PLAY_COOKIE_SYNC_TAIL = ${JSON.stringify(buildPlayCookieSyncTail())};
`;

  return `${configBlock.trim()}

const BLOCKED_UPSTREAM_COOKIE_NAMES = new Set([
  'sapisid',
  'apisid',
  'hsid',
  'ssid',
  'sid',
  'sidcc',
  'nid',
  'aec',
  'socs',
  '1p_jar',
  'otz',
  'g_state',
  '_ga',
  '_gid',
  '_gat',
  '_clck',
  '_clsk',
]);

const BLOCKED_COOKIE_PREFIXES = [
  '__secure-1p',
  '__secure-3p',
  '__host-1p',
  '__host-3p',
  '__secure-enid',
  '_ga_',
  '_gat_',
];

function isBlockedCookieName(name) {
  const lower = String(name || '').toLowerCase();
  if (!lower) return true;
  if (BLOCKED_UPSTREAM_COOKIE_NAMES.has(lower)) return true;
  for (let i = 0; i < BLOCKED_COOKIE_PREFIXES.length; i++) {
    if (lower.startsWith(BLOCKED_COOKIE_PREFIXES[i])) return true;
  }
  return false;
}

function getRequestOrigin(request) {
  const url = new URL(request.url);
  const xfProto = request.headers.get('x-forwarded-proto');
  const proto = xfProto ? xfProto.split(',')[0].trim() : url.protocol.replace(':', '');
  const xfHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const host = xfHost ? xfHost.split(',')[0].trim() : url.host;
  return proto + '://' + host;
}

function isHttpsRequest(request) {
  const url = new URL(request.url);
  if (url.protocol === 'https:') return true;
  const xfProto = request.headers.get('x-forwarded-proto');
  return Boolean(xfProto && xfProto.split(',')[0].trim().toLowerCase() === 'https');
}

function isTransientNetworkError(err) {
  if (!err || typeof err !== 'object') return false;
  const msg = String(err.message || '').toLowerCase();
  return (
    msg.includes('fetch failed') ||
    msg.includes('terminated') ||
    msg.includes('aborted') ||
    msg.includes('network') ||
    msg.includes('connection') ||
    msg.includes('reset') ||
    msg.includes('timeout')
  );
}

async function fetchUpstreamResponse(url, init, maxAttempts = 3) {
  let lastErr;
  const rawBody = init && init.body ? init.body : undefined;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const attemptInit = {
        method: init.method || 'GET',
        headers: init.headers,
        redirect: init.redirect || 'manual',
        signal: controller.signal,
      };
      if (rawBody !== undefined) {
        attemptInit.body = rawBody instanceof Uint8Array ? rawBody.slice() : rawBody;
      }
      const res = await fetch(url, attemptInit);
      const buffer = await res.arrayBuffer();
      return { res, buffer };
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts - 1 && isTransientNetworkError(err)) {
        await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
        continue;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

function getSetCookiesList(headers) {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }
  const combined = headers.get('set-cookie');
  if (!combined) return [];
  return combined.split(/,(?=\\s*[^;=,\\s]+=[^;,]*)/);
}

function rewriteSetCookieHeader(cookieStr, isHttps) {
  const parts = cookieStr
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return cookieStr;

  const isHostCookie = parts[0].toLowerCase().startsWith('__host-');
  let hasRootPath = false;

  const filtered = parts.filter((part) => {
    const lower = part.toLowerCase();
    if (lower.startsWith('domain=')) return false;
    if (lower.startsWith('samesite=')) return false;
    if (lower === 'secure') return false;
    if (lower === 'partitioned') return false;
    if (lower === 'path=/') hasRootPath = true;
    if (isHostCookie && lower.startsWith('path=')) return false;
    return true;
  });

  if (isHostCookie && !hasRootPath) {
    filtered.push('Path=/');
  }

  if (isHttps) {
    filtered.push('SameSite=None', 'Secure', 'Partitioned');
  } else {
    filtered.push('SameSite=Lax');
  }
  return filtered.join('; ');
}

function appendSetCookies(upstreamRes, request, outHeaders) {
  const isHttps = isHttpsRequest(request);
  const rawCookies = getSetCookiesList(upstreamRes.headers);
  for (let i = 0; i < rawCookies.length; i++) {
    outHeaders.append('Set-Cookie', rewriteSetCookieHeader(rawCookies[i], isHttps));
  }
}

function parseCookieMap(cookieHeader) {
  const map = new Map();
  if (!cookieHeader) return map;
  const parts = cookieHeader.split(';');
  for (let i = 0; i < parts.length; i++) {
    const trimmed = parts[i].trim();
    if (!trimmed) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const name = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (name) map.set(name, val);
  }
  return map;
}

function serializeCookieMap(map) {
  const out = [];
  for (const [k, v] of map.entries()) {
    out.push(k + '=' + v);
  }
  return out.join('; ');
}

// Stateless UTF-8 base64url encoding for Cloudflare Workers multi-isolate compatibility
function toBase64UrlUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/g, '');
}

function fromBase64UrlUtf8(token) {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function encodePlaySessionToken(cookieMap) {
  const obj = {};
  for (const [name, val] of cookieMap.entries()) {
    if (!isBlockedCookieName(name)) {
      obj[name] = val;
    }
  }
  if (Object.keys(obj).length === 0) return '';
  return toBase64UrlUtf8(JSON.stringify(obj));
}

function decodePlaySessionToken(token) {
  try {
    if (!token) return null;
    const parsed = JSON.parse(fromBase64UrlUtf8(token));
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function rewriteUpstreamUrls(text, requestOrigin) {
  if (!text) return text;
  const encodedOrigin = encodeURIComponent(requestOrigin);
  const escapedOrigin = requestOrigin.replace(/\\//g, '\\\\/');
  return text
    .replace(/https?:\\/\\/(?:s2-cdn\\.)?studyratna\\.cc(?=[\\s"'<>\\\\/?#&)]|$)/gi, requestOrigin)
    .replace(/https?:\\\\\\/\\\\\\/(?:s2-cdn\\.)?studyratna\\.cc/gi, escapedOrigin)
    .replace(/https?%3A%2F%2F(?:s2-cdn\\.)?studyratna\\.cc/gi, encodedOrigin);
}

function rewriteGatePaths(text) {
  if (!text) return text;
  return text
    .replace(/(['"\`(=,\\s]|^)\\/cdn-cgi\\//gi, '$1/__gb_cf_cgi/')
    .replace(/(['"\`(=,\\s]|^)\\\\\\/cdn-cgi\\\\\\//gi, '$1\\\\/__gb_cf_cgi\\\\/');
}

function isSecurityGateHtml(html, status) {
  if (!html) return false;
  if (
    html.includes('id="app-view"') ||
    html.includes('batches-template') ||
    html.includes('video-player-template') ||
    html.includes('video-js')
  ) {
    return false;
  }
  const lower = html.toLowerCase();
  if (
    lower.includes('cdn-cgi/challenge-platform') ||
    lower.includes('/__gb_cf_cgi/challenge-platform') ||
    lower.includes('_cf_chl_opt') ||
    lower.includes('challenges.cloudflare.com/turnstile') ||
    lower.includes('cf-turnstile') ||
    lower.includes('cf-challenge') ||
    lower.includes('<title>just a moment...</title>') ||
    lower.includes('attention required! | cloudflare') ||
    lower.includes('enable javascript and cookies to continue') ||
    lower.includes('verifying you are human') ||
    lower.includes('checking your browser')
  ) {
    return true;
  }
  return status === 403 || status === 429 || status === 503;
}

function rewriteTelegramUrls(text) {
  return text
    .replace(/https?:\\/\\/(?:t\\.me|telegram\\.me)\\/[^\\s"'<>\\\\)]+/gi, TELEGRAM_URL)
    .replace(/https?:\\/\\/channel\\.studyrays\\.cc[^\\s"'<>\\\\)]*/gi, TELEGRAM_URL);
}

function rewriteBrandText(text) {
  return text
    .replace(/(?<![./a-z0-9-])\\bStudyRatna(?:\\.cc)?\\b/gi, BRAND_NAME)
    .replace(/\\bStudy\\s+Ratna\\b/gi, BRAND_NAME)
    .replace(/\\bStudyRays(?:\\s*x\\s*DevJisu)?\\b/gi, BRAND_NAME)
    .replace(/\\bRatna\\s+Bhai\\b/gi, BRAND_NAME);
}

function patchPlainScript(code, requestOrigin) {
  let out = code;
  out = out.replace(
    /((?:const|let|var)\\s+allowedOrigins\\s*=\\s*\\[[^\\]]*\\])/g,
    '$1.concat([window.location.hostname])',
  );
  out = out.replace(
    /https?:\\/\\/(?:streamfiles\\.eu\\.org|testfile\\.eu\\.org|s2-cdn\\.studyratna\\.cc)\\/#/gi,
    '/#',
  );
  out = rewriteUpstreamUrls(out, requestOrigin);
  out = rewriteGatePaths(out);
  out = rewriteTelegramUrls(out);
  out = rewriteBrandText(out);
  return out;
}

const unlockedScriptCache = new Map();
const MAX_SCRIPT_CACHE_ENTRIES = 8;

function unescapeJsStringLiteral(lit) {
  const body = lit.slice(1, -1);
  return body.replace(
    /\\\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|u\\{[0-9a-fA-F]+\\}|[0-7]{1,3}|[\\s\\S])/g,
    function (_m, seq) {
      if (seq === 'n') return '\\n';
      if (seq === 'r') return '\\r';
      if (seq === 't') return '\\t';
      if (seq === 'b') return '\\b';
      if (seq === 'f') return '\\f';
      if (seq === 'v') return '\\v';
      if (seq === '0') return '\\0';
      if (seq[0] === 'x') return String.fromCharCode(parseInt(seq.slice(1), 16));
      if (seq[0] === 'u') {
        if (seq[1] === '{') return String.fromCodePoint(parseInt(seq.slice(2, -1), 16));
        return String.fromCharCode(parseInt(seq.slice(1), 16));
      }
      if (/^[0-7]+$/.test(seq)) return String.fromCharCode(parseInt(seq, 8));
      return seq;
    },
  );
}

// Pure zero-eval unpacker compatible with Cloudflare Workers V8 isolate constraints
function pureUnlockInner(code) {
  const prefixRe =
    /let\\s+([^;\\s]+);!function\\(\\)\\{const\\s+([^\\s=]+)=Array\\.prototype\\.slice\\.call\\(arguments\\);return\\s+eval\\(/;
  const pm = code.match(prefixRe);
  if (!pm || pm.index === undefined) return null;

  const objVar = pm[1];
  const argsVar = pm[2];
  const evalStart = pm.index + pm[0].indexOf('eval(');
  const strStart = pm.index + pm[0].length;
  const quote = code[strStart];
  if (quote !== '"' && quote !== "'") return null;

  let i = strStart + 1;
  while (i < code.length) {
    if (code[i] === '\\\\') {
      i += 2;
      continue;
    }
    if (code[i] === quote) break;
    i++;
  }
  if (i >= code.length || code[i + 1] !== ')') return null;

  const evalEnd = i + 2;
  const outerSource = unescapeJsStringLiteral(code.slice(strStart, i + 1));
  const callMatch = outerSource.match(/\\}\\)\\((["'])([\\s\\S]*)\\1\\);?$/);
  if (!callMatch) return null;

  let encDecoded = '';
  try {
    encDecoded = decodeURI(callMatch[2]);
  } catch {
    return null;
  }
  if (encDecoded.length < 24) return null;

  const cribs = ['(function(){function ', '(function(){var ', '(function(){let ', '(function(){const ', '(function('];
  let inner = null;
  for (let c = 0; c < cribs.length && !inner; c++) {
    const crib = cribs[c];
    for (let keyLen = 8; keyLen <= 12; keyLen++) {
      if (crib.length < keyLen) continue;
      let key = '';
      let validKey = true;
      for (let k = 0; k < keyLen; k++) {
        const ch = String.fromCharCode(encDecoded.charCodeAt(k) ^ crib.charCodeAt(k));
        if (!/[a-z0-9]/.test(ch)) {
          validKey = false;
          break;
        }
        key += ch;
      }
      if (!validKey) continue;
      const chunks = new Array(encDecoded.length);
      for (let idx = 0; idx < encDecoded.length; idx++) {
        chunks[idx] = String.fromCharCode(encDecoded.charCodeAt(idx) ^ key.charCodeAt(idx % keyLen));
      }
      const candidate = chunks.join('');
      if (candidate.startsWith(crib) && candidate.includes('function')) {
        inner = candidate;
        break;
      }
    }
  }

  if (!inner) return null;
  return { inner, objVar, argsVar, evalStart, evalEnd };
}

function buildRuntimeObjPatch(objVar) {
  return ';(function(){try{var _obj=' + objVar + GB_RUNTIME_PATCH_TAIL;
}

function unlockObfuscatedScript(code) {
  if (!code.includes('Array.prototype.slice.call(arguments)') || !code.includes('eval(')) {
    return code;
  }

  const cacheKey = code.length + ':' + code.slice(0, 120) + ':' + code.slice(-80);
  const cached = unlockedScriptCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  let out = code;
  try {
    const unpacked = pureUnlockInner(code);
    if (unpacked) {
      const hashPatchRegex =
        /(-954999937,-456689553[\\s\\S]{0,2500}?function\\s+[^\\s(]+\\()([^\\s,]+)(,[^\\s,]+,[^\\s,]+,[^\\s)]+\\)\\{)/;
      const patchedInner = unpacked.inner.replace(
        hashPatchRegex,
        function (_m, a, b, c) {
          return a + b + c + b + '="s2-cdn.studyratna.cc";';
        },
      );

      const replacement = '(' + patchedInner + ').apply(null,' + unpacked.argsVar + ')';
      out = code.slice(0, unpacked.evalStart) + replacement + code.slice(unpacked.evalEnd);

      const runtimePatch = buildRuntimeObjPatch(unpacked.objVar);
      const iifeTailIdx = out.indexOf('}();', unpacked.evalStart + replacement.length);
      if (iifeTailIdx !== -1 && iifeTailIdx - (unpacked.evalStart + replacement.length) < 32) {
        const insertPos = iifeTailIdx + 4;
        out = out.slice(0, insertPos) + runtimePatch + out.slice(insertPos);
      } else {
        const anchorRegex = new RegExp('(\\\\(function\\\\(\\\\)\\\\{[^=]{1,40}=\\\\[' + unpacked.objVar + '\\\\.)');
        out = out.replace(anchorRegex, function (m) {
          return runtimePatch + m;
        });
      }
    }
  } catch (err) {
    console.warn('Worker script unlock fallback:', err);
    out = code;
  }

  out = out.replace(
    /\\[(?:wOMp|yrVy|cF7c)\\.\\w+\\(\\d+\\)(?:,(?:wOMp|yrVy|cF7c)\\.\\w+\\(\\d+\\)){4,10}\\]/g,
    function (m) {
      return m + '.concat([window.location.hostname])';
    },
  );

  if (unlockedScriptCache.size >= MAX_SCRIPT_CACHE_ENTRIES) {
    const firstKey = unlockedScriptCache.keys().next().value;
    if (firstKey !== undefined) unlockedScriptCache.delete(firstKey);
  }
  unlockedScriptCache.set(cacheKey, out);
  return out;
}

function unlockHtmlInlineScripts(html, requestOrigin) {
  return html.replace(
    /(<script\\b[^>]*>)([\\s\\S]*?)(<\\/script>)/gi,
    function (_full, openTag, body, closeTag) {
      if (!body.includes('Array.prototype.slice.call(arguments)')) {
        let patched = body.includes('allowedOrigins')
          ? body.replace(
              /((?:const|let|var)\\s+allowedOrigins\\s*=\\s*\\[[^\\]]*\\])/g,
              '$1.concat([window.location.hostname])',
            )
          : body;
        patched = rewriteGatePaths(rewriteUpstreamUrls(patched, requestOrigin));
        return openTag + patched + closeTag;
      }
      return openTag + unlockObfuscatedScript(body) + closeTag;
    },
  );
}

// Client-side origin + /cdn-cgi/ guard so dynamic calls stay on our proxy origin and recover cleanly from security gates
function injectClientOriginGuard(html) {
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, '<head$1>' + GB_ORIGIN_GUARD_SCRIPT);
  }
  return GB_ORIGIN_GUARD_SCRIPT + html;
}

function rewriteHtml(html, requestOrigin) {
  // Rewrite external HTML first, while leaving obfuscated script blocks untouched until unlockHtmlInlineScripts
  let out = html.replace(
    /https:\\/\\/encrypted-tbn0\\.gstatic\\.com\\/images\\?q=tbn:ANd9GcT1fXfQMfsh9IK27z-hikKlLU2h8R_A9XUaLg&s/gi,
    ICON_PATH,
  );
  out = out.replace(/alt=["'](?:Physics Wallah|StudyRatna|StudyRays) Logo["']/gi, 'alt="' + BRAND_NAME + ' Logo"');
  out = out.replace(
    /<div id="srIcon">[\\s\\S]*?<\\/div>/i,
    '<div id="srIcon" style="overflow:hidden;padding:0;"><img src="' + ICON_PATH + '" alt="' + BRAND_NAME + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>',
  );

  // Rewrite upstream origin URLs, URL-encoded callbacks & /cdn-cgi/ paths BEFORE brand text rewrites
  out = out.replace(
    /(<script\\b[^>]*>[\\s\\S]*?<\\/script>)|([^<]+|<)/gi,
    function (seg, scriptTag) {
      if (scriptTag) return scriptTag;
      return rewriteGatePaths(rewriteUpstreamUrls(seg, requestOrigin));
    },
  );
  out = rewriteTelegramUrls(out);
  out = rewriteBrandText(out);

  if (/<title>[^<]*<\\/title>/i.test(out)) {
    out = out.replace(/<title>([^<]*)<\\/title>/i, function (_m, titleText) {
      if (/studyratna|studyrays|study\\s*ratna/i.test(titleText) || !titleText.trim()) {
        return '<title>' + BRAND_NAME + '</title>';
      }
      return '<title>' + rewriteBrandText(titleText) + '</title>';
    });
  } else if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, '<head$1><title>' + BRAND_NAME + '</title>');
  }

  if (!out.includes(ICON_PATH) && /<\\/head>/i.test(out)) {
    out = out.replace(
      /<\\/head>/i,
      '<link rel="icon" type="image/png" href="' + ICON_PATH + '"><link rel="shortcut icon" type="image/png" href="' + ICON_PATH + '"></head>',
    );
  } else if (/<head[^>]*>/i.test(out) && !/rel=["'](?:shortcut )?icon["']/i.test(out)) {
    out = out.replace(
      /<head([^>]*)>/i,
      '<head$1><link rel="icon" type="image/png" href="' + ICON_PATH + '"><link rel="shortcut icon" type="image/png" href="' + ICON_PATH + '">',
    );
  }

  out = unlockHtmlInlineScripts(out, requestOrigin);
  out = injectClientOriginGuard(out);
  return out;
}

function injectStylishUi(html) {
  let out = html;
  if (/<\\/head>/i.test(out)) {
    out = out.replace(/<\\/head>/i, GB_UI_FONTS + GB_UI_CSS + '</head>');
  } else {
    out = GB_UI_FONTS + GB_UI_CSS + out;
  }
  if (/<\\/body>/i.test(out)) {
    out = out.replace(/<\\/body>/i, GB_UI_JS + '</body>');
  } else {
    out = out + GB_UI_JS;
  }
  return out;
}

function rewriteSettingsJson(rawText, requestOrigin) {
  try {
    const parsed = JSON.parse(rawText);
    const data = parsed && parsed.data;
    if (data && typeof data === 'object') {
      if (data.security && typeof data.security === 'object') {
        data.security.origin_check_url = '/api/check_origin.php';
      }
      if (data.splash_screen && typeof data.splash_screen === 'object') {
        data.splash_screen.title = BRAND_NAME;
        data.splash_screen.subtitle = BRAND_NAME;
        data.splash_screen.logo_url = ICON_PATH;
      }
      if (data.messages && typeof data.messages === 'object') {
        data.messages.telegram_link = TELEGRAM_URL;
        if (typeof data.messages.subscriber_milestone === 'string') {
          data.messages.subscriber_milestone = rewriteBrandText(
            rewriteTelegramUrls(data.messages.subscriber_milestone),
          );
        }
      }
      if (Array.isArray(data.quick_nav)) {
        for (let i = 0; i < data.quick_nav.length; i++) {
          const item = data.quick_nav[i];
          if (!item || typeof item !== 'object') continue;
          const titleStr = typeof item.title === 'string' ? item.title : '';
          const urlStr = typeof item.url === 'string' ? item.url : '';
          if (
            /telegram/i.test(titleStr) ||
            /(?:t\\.me|telegram\\.me|channel\\.studyrays\\.cc)/i.test(urlStr)
          ) {
            item.url = TELEGRAM_URL;
          }
        }
      }
    }
    return rewriteUpstreamUrls(JSON.stringify(parsed), requestOrigin);
  } catch {
    return rewriteBrandText(rewriteTelegramUrls(rewriteUpstreamUrls(rawText, requestOrigin)));
  }
}

function solvePlayChallenge(html) {
  if (
    !html.includes('_pw_sec_chk') &&
    !html.includes('pw_chk_') &&
    !html.includes('var _x=') &&
    !html.includes('var _x =')
  ) {
    return null;
  }

  const spanMap = {};
  const spanRegex = /<span\\s+id=['"]([^'"]+)['"](?:\\s+(data-[a-z0-9_-]+)=['"]([^'"]*)['"])?\\s*>([^<]*)<\\/span>/gi;
  let match;
  while ((match = spanRegex.exec(html)) !== null) {
    spanMap[match[1]] = { attrName: match[2], attrVal: match[3], text: match[4] || '' };
  }

  const parts = [];
  const docRegex =
    /document\\.getElementById\\(['"]([^'"]+)['"]\\)\\.(?:getAttribute\\(['"]([^'"]+)['"]\\)|innerHTML)/gi;
  while ((match = docRegex.exec(html)) !== null) {
    const span = spanMap[match[1]];
    if (!span) continue;
    parts.push(match[2] ? (span.attrVal || '') : span.text);
  }
  if (parts.length === 0) return null;

  let cookieName = '_pw_sec_chk';
  const xMatch = html.match(/var\\s+_x\\s*=\\s*\\[([^\\]]+)\\]/);
  if (xMatch) {
    try {
      const xorMatch = html.match(/String\\.fromCharCode\\([^)]*\\^\\s*(\\d+)\\)/);
      const xorKey = xorMatch ? Number(xorMatch[1]) : 42;
      const decoded = xMatch[1]
        .split(',')
        .map((n) => String.fromCharCode(Number(n.trim()) ^ xorKey))
        .join('');
      const nameMatch = decoded.match(/document\\.cookie\\s*=\\s*['"]([^=]+)=/);
      if (nameMatch) cookieName = nameMatch[1];
    } catch {
      // keep default
    }
  }
  return { cookieName, cookieValue: parts.join('') };
}

function buildUpstreamHeaders(request, pathAndQuery) {
  const headers = new Headers();
  const forwardAllowList = new Set([
    'accept',
    'accept-language',
    'authorization',
    'content-type',
    'user-agent',
    'range',
    'if-range',
    'cache-control',
    'pragma',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'cf-turnstile-response',
    'x-requested-with',
    'x-csrf-token',
    'x-xsrf-token',
  ]);

  request.headers.forEach((val, key) => {
    const lower = key.toLowerCase();
    const isCustomGateHeader =
      lower.startsWith('x-') &&
      !lower.startsWith('x-forwarded-') &&
      !lower.startsWith('x-gb-') &&
      !lower.startsWith('x-invoke-') &&
      lower !== 'x-real-ip';
    if ((forwardAllowList.has(lower) || isCustomGateHeader) && val) {
      headers.set(lower, val);
    }
  });

  const incomingMap = parseCookieMap(request.headers.get('cookie') || '');
  const cleanCookieMap = new Map();
  for (const [name, val] of incomingMap.entries()) {
    if (!isBlockedCookieName(name)) {
      cleanCookieMap.set(name, val);
    }
  }

  const playSid = request.headers.get('x-gb-play-sid');
  if (playSid && playSid.trim()) {
    const restored = decodePlaySessionToken(playSid.trim());
    if (restored) {
      for (const [k, v] of Object.entries(restored)) {
        if (typeof v === 'string' && !isBlockedCookieName(k)) {
          cleanCookieMap.set(k, v);
        }
      }
    }
  }

  const pwChkOverride = request.headers.get('x-gb-pw-chk');
  if (pwChkOverride && pwChkOverride.trim()) {
    cleanCookieMap.set('_pw_sec_chk', pwChkOverride.trim());
  }

  const serialized = serializeCookieMap(cleanCookieMap);
  if (serialized) {
    headers.set('cookie', serialized);
  }

  if (!headers.has('user-agent')) {
    headers.set('user-agent', DEFAULT_UA);
  }
  headers.set('origin', UPSTREAM_ORIGIN);
  let refPath = '/';
  const rawReferer = request.headers.get('referer');
  if (rawReferer) {
    try {
      const refUrl = new URL(rawReferer);
      refPath = refUrl.pathname + refUrl.search;
    } catch {
      refPath = pathAndQuery || '/';
    }
  } else if (pathAndQuery) {
    refPath = pathAndQuery;
  }
  headers.set('referer', UPSTREAM_ORIGIN + refPath);
  return headers;
}

function encodeRadhaMetaData(pathStr) {
  const key = 'fgsbhv235793853rifjb';
  let out = '';
  for (let i = 0; i < pathStr.length; i++) {
    out += String.fromCharCode(pathStr.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(unescape(encodeURIComponent(out)));
}

function injectPlayCookieSync(html, pwChk, playSid) {
  const guardScript = '<script>(function(){var _p=' + JSON.stringify(pwChk) + ';var _sid=' + JSON.stringify(playSid) + GB_PLAY_COOKIE_SYNC_TAIL;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, '<head$1>' + guardScript);
  }
  return guardScript + html;
}

function isSafeExternalMediaUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    const h = parsed.hostname.toLowerCase();
    if (
      h === 'localhost' ||
      h === '0.0.0.0' ||
      h === '::1' ||
      h === '[::1]' ||
      h.startsWith('127.') ||
      h.startsWith('10.') ||
      h.startsWith('192.168.') ||
      h.startsWith('169.254.') ||
      /^172\\.(1[6-9]|2\\d|3[01])\\./.test(h) ||
      h.endsWith('.local') ||
      h.endsWith('.internal')
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function rewriteM3u8Playlist(playlistText, baseUrl) {
  const wrapProxy = (uri) => {
    const trimmed = uri.trim();
    if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
    try {
      const abs = new URL(trimmed, baseUrl).toString();
      return '/__gb_media?u=' + encodeURIComponent(abs);
    } catch {
      return trimmed;
    }
  };

  return playlistText
    .split(/\\r?\\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      if (trimmed.startsWith('#')) {
        return line.replace(/URI=(["'])([^"']+)\\1/gi, (_m, q, u) => {
          return 'URI=' + q + wrapProxy(u) + q;
        });
      }
      return wrapProxy(trimmed);
    })
    .join('\\n');
}

const STATIC_ICON_PATHS = new Set([
  ICON_PATH,
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.toLowerCase();
    const requestOrigin = getRequestOrigin(request);

    // 1. Serve icon assets from Cloudflare Pages static assets (with fallback to /gb-icon.png & ICON_SOURCE_URL)
    if (STATIC_ICON_PATHS.has(pathname)) {
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        try {
          let assetRes = await env.ASSETS.fetch(request);
          if ((!assetRes || !assetRes.ok) && pathname !== ICON_PATH) {
            assetRes = await env.ASSETS.fetch(new Request(new URL(ICON_PATH, request.url), { method: 'GET' }));
          }
          if (assetRes && assetRes.ok) {
            const headers = new Headers(assetRes.headers);
            headers.set('Content-Type', 'image/png');
            headers.set('Cache-Control', 'public, max-age=86400');
            return new Response(assetRes.body, { status: 200, headers });
          }
        } catch {
          // fall through to remote fetch
        }
      }
      try {
        const { res, buffer } = await fetchUpstreamResponse(ICON_SOURCE_URL, {
          method: 'GET',
          headers: { 'User-Agent': DEFAULT_UA },
          redirect: 'follow',
        });
        if (res.ok) {
          return new Response(buffer, {
            status: 200,
            headers: {
              'Content-Type': res.headers.get('content-type') || 'image/png',
              'Cache-Control': 'public, max-age=86400',
            },
          });
        }
      } catch {
        // ignore
      }
      return Response.redirect(ICON_SOURCE_URL, 302);
    }

    // 2. Serve GB STUDY Web App Manifest
    if (pathname === '/manifest.json') {
      return new Response(MANIFEST_JSON, {
        status: 200,
        headers: {
          'Content-Type': 'application/manifest+json; charset=UTF-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // 3. Local origin check handler
    if (pathname === '/api/check_origin.php') {
      const host = url.hostname;
      const reqOrigin = request.headers.get('origin') || '';
      const allowed = Array.from(
        new Set(
          [
            host,
            'https://' + host,
            'http://' + host,
            requestOrigin,
            reqOrigin,
          ].filter(Boolean),
        ),
      );
      return new Response(
        JSON.stringify({
          success: true,
          allowed_origins: allowed,
          telegram_url: TELEGRAM_URL,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        },
      );
    }

    // 3a. Upstream Cloudflare /cdn-cgi/* proxy (bypass proxy domain edge /cdn-cgi/ interception)
    if (pathname.startsWith('/__gb_cf_cgi/')) {
      try {
        const upstreamPath = (url.pathname + url.search).replace(/^\\/__gb_cf_cgi\\//i, '/cdn-cgi/');
        const targetUrl = new URL(upstreamPath, UPSTREAM_ORIGIN).toString();
        const headers = buildUpstreamHeaders(request, upstreamPath);
        const method = request.method.toUpperCase();
        const hasBody = method !== 'GET' && method !== 'HEAD';
        let reqBody;
        if (hasBody) {
          const ab = await request.arrayBuffer();
          if (ab.byteLength > 0) reqBody = new Uint8Array(ab);
        }

        const fetched = await fetchUpstreamResponse(targetUrl, {
          method,
          headers,
          body: reqBody,
          redirect: 'manual',
        });
        const upstreamRes = fetched.res;
        const upstreamBuf = fetched.buffer;

        const outHeaders = new Headers();
        appendSetCookies(upstreamRes, request, outHeaders);

        if (upstreamRes.status >= 300 && upstreamRes.status < 400) {
          const loc = upstreamRes.headers.get('location');
          if (loc) {
            outHeaders.set('Location', rewriteGatePaths(rewriteUpstreamUrls(loc, requestOrigin)));
            return new Response(null, { status: upstreamRes.status, headers: outHeaders });
          }
        }

        const ct = upstreamRes.headers.get('content-type') || 'application/octet-stream';
        outHeaders.set('Content-Type', ct);
        const cc = upstreamRes.headers.get('cache-control');
        if (cc) outHeaders.set('Cache-Control', cc);

        if (ct.includes('javascript') || ct.includes('text/html') || ct.includes('json') || ct.includes('text/plain')) {
          const txt = new TextDecoder().decode(upstreamBuf);
          return new Response(rewriteGatePaths(rewriteUpstreamUrls(txt, requestOrigin)), {
            status: upstreamRes.status,
            headers: outHeaders,
          });
        }
        return new Response(upstreamBuf, { status: upstreamRes.status, headers: outHeaders });
      } catch {
        return new Response('Challenge endpoint unavailable', { status: 422 });
      }
    }

    // 3b. Stream/HLS media proxy for CDNs enforcing upstream Referer checks
    if (pathname === '/__gb_media') {
      const rawUrl = url.searchParams.get('u') || '';
      const parsedUrl = isSafeExternalMediaUrl(rawUrl);
      if (!parsedUrl) {
        return new Response('Invalid media URL', { status: 400 });
      }
      try {
        const mediaHeaders = new Headers();
        mediaHeaders.set('user-agent', request.headers.get('user-agent') || DEFAULT_UA);
        mediaHeaders.set('referer', UPSTREAM_ORIGIN + '/');
        mediaHeaders.set('origin', UPSTREAM_ORIGIN);
        if (parsedUrl.hostname.toLowerCase().endsWith('studyratna.cc')) {
          const upHeaders = buildUpstreamHeaders(request, parsedUrl.pathname + parsedUrl.search);
          const ck = upHeaders.get('cookie');
          if (ck) mediaHeaders.set('cookie', ck);
        }
        const range = request.headers.get('range');
        if (range) mediaHeaders.set('range', range);
        const accept = request.headers.get('accept');
        if (accept) mediaHeaders.set('accept', accept);

        const { res: upstreamMedia, buffer: buf } = await fetchUpstreamResponse(parsedUrl.toString(), {
          method: 'GET',
          headers: mediaHeaders,
          redirect: 'follow',
        });

        const ct = upstreamMedia.headers.get('content-type') || '';
        const lowerMediaPath = parsedUrl.pathname.toLowerCase();
        const maybePlaylist =
          ct.includes('mpegurl') ||
          ct.includes('text/plain') ||
          lowerMediaPath.endsWith('.m3u8') ||
          lowerMediaPath.endsWith('.docx');

        const outHeaders = new Headers();
        outHeaders.set('Access-Control-Allow-Origin', '*');
        outHeaders.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Content-Type');

        if (maybePlaylist) {
          const headText = new TextDecoder().decode(buf.slice(0, 64)).trimStart();
          if (headText.startsWith('#EXTM3U')) {
            const fullText = new TextDecoder().decode(buf);
            const rewritten = rewriteM3u8Playlist(fullText, parsedUrl.toString());
            outHeaders.set('Content-Type', 'application/vnd.apple.mpegurl; charset=UTF-8');
            outHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            return new Response(rewritten, { status: upstreamMedia.status, headers: outHeaders });
          }
          if (ct) outHeaders.set('Content-Type', ct);
          return new Response(buf, { status: upstreamMedia.status, headers: outHeaders });
        }

        const passMedia = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control'];
        for (let i = 0; i < passMedia.length; i++) {
          const val = upstreamMedia.headers.get(passMedia[i]);
          if (val) outHeaders.set(passMedia[i], val);
        }
        return new Response(buf, { status: upstreamMedia.status, headers: outHeaders });
      } catch {
        return new Response('Media stream unavailable', { status: 422 });
      }
    }

    // 3c. Content API proxy for samfygros.com/radha (notes, DPPs, timeline slides, doubts)
    if (pathname === '/__gb_radha') {
      const rawPath = url.searchParams.get('path') || '';
      if (!rawPath.startsWith('/') || rawPath.startsWith('//') || rawPath.includes('@')) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid radha path' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        });
      }
      try {
        const metaData = encodeRadhaMetaData(rawPath);
        const radhaUrl =
          'https://s4-cdn.samfygros.com/radha/index.php?type=contents&metaData=' +
          encodeURIComponent(metaData);
        const { res: upstreamRadha, buffer: radhaBuf } = await fetchUpstreamResponse(radhaUrl, {
          method: 'GET',
          headers: {
            'User-Agent': request.headers.get('user-agent') || DEFAULT_UA,
            Accept: 'application/json, text/plain, */*',
            Origin: UPSTREAM_ORIGIN,
            Referer: UPSTREAM_ORIGIN + '/',
          },
          redirect: 'follow',
        });

        const ct = upstreamRadha.headers.get('content-type') || '';
        const text = new TextDecoder().decode(radhaBuf);
        const safeStatus =
          upstreamRadha.status >= 502 && upstreamRadha.status <= 504 ? 422 : upstreamRadha.status;
        if (ct.includes('text/html') && text.trimStart().startsWith('<')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Upstream content endpoint returned HTML.' }),
            {
              status: 422,
              headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
              },
            },
          );
        }
        return new Response(text, {
          status: safeStatus,
          headers: {
            'Content-Type': ct.includes('json') ? ct : 'application/json; charset=UTF-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      } catch {
        return new Response(JSON.stringify({ success: false, error: 'Radha content unavailable.' }), {
          status: 422,
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        });
      }
    }

    // 4. Reverse proxy all other routes to https://s2-cdn.studyratna.cc
    const pathAndQuery = url.pathname + url.search;
    const isAjax = request.headers.get('x-requested-with') === 'XMLHttpRequest';
    const isJsonApiRoute =
      pathname.startsWith('/api/') ||
      pathname.endsWith('/api.php') ||
      pathname.includes('/api/get_settings') ||
      isAjax;
    const isTokenManagerRoute = pathname.endsWith('/api/token-manager.php');

    try {
      const targetUrl = new URL(pathAndQuery, UPSTREAM_ORIGIN).toString();
      const headers = buildUpstreamHeaders(request, pathAndQuery);
      const method = request.method.toUpperCase();
      const hasBody = method !== 'GET' && method !== 'HEAD';
      let reqBody;
      if (hasBody) {
        const ab = await request.arrayBuffer();
        if (ab.byteLength > 0) reqBody = new Uint8Array(ab);
      }

      const fetched = await fetchUpstreamResponse(targetUrl, {
        method,
        headers,
        body: reqBody,
        redirect: 'manual',
      });
      const upstreamRes = fetched.res;
      const upstreamBuf = fetched.buffer;
      const contentType = upstreamRes.headers.get('content-type') || '';

      // Handle upstream redirects (including external key-gen shortlinks & callback URLs)
      if (upstreamRes.status >= 300 && upstreamRes.status < 400) {
        const location = upstreamRes.headers.get('location');
        if (isJsonApiRoute && !contentType.includes('json')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Upstream API redirected unexpectedly.' }),
            { status: 422, headers: { 'Content-Type': 'application/json; charset=UTF-8' } },
          );
        }
        if (location) {
          const redirHeaders = new Headers();
          appendSetCookies(upstreamRes, request, redirHeaders);
          if (/(?:t\\.me|telegram\\.me|channel\\.studyrays\\.cc)/i.test(location)) {
            redirHeaders.set('Location', TELEGRAM_URL);
            return new Response(null, { status: upstreamRes.status, headers: redirHeaders });
          }
          const rewrittenLocation = rewriteUpstreamUrls(location, requestOrigin);
          redirHeaders.set('Location', rewrittenLocation);
          return new Response(null, { status: upstreamRes.status, headers: redirHeaders });
        }
      }

      if (isJsonApiRoute && contentType.includes('text/html')) {
        const errHtml = new TextDecoder().decode(upstreamBuf);
        if (isSecurityGateHtml(errHtml, upstreamRes.status)) {
          const gateHeaders = new Headers();
          appendSetCookies(upstreamRes, request, gateHeaders);
          gateHeaders.set('Content-Type', 'application/json; charset=UTF-8');
          return new Response(
            JSON.stringify({
              success: false,
              security_gate: true,
              challenge_url: '/?__gb_gate=1',
              error: 'Security verification required.',
            }),
            { status: 403, headers: gateHeaders },
          );
        }
        const safeErrStatus =
          upstreamRes.status >= 400 && (upstreamRes.status < 502 || upstreamRes.status > 504)
            ? upstreamRes.status
            : 422;
        return new Response(
          JSON.stringify({ success: false, error: 'Upstream API temporarily unavailable.' }),
          { status: safeErrStatus, headers: { 'Content-Type': 'application/json; charset=UTF-8' } },
        );
      }

      // Auto-solve play.php anti-scraper cookie challenge
      if (pathname.endsWith('/play.php') && contentType.includes('text/html')) {
        const isHttps = isHttpsRequest(request);
        const cookieMap = parseCookieMap(headers.get('cookie') || '');
        const outgoingCookies = new Map();
        let finalRes = upstreamRes;
        let finalHtml = new TextDecoder().decode(upstreamBuf);
        let gotFreshSession = false;

        const recordSetCookies = (resObj) => {
          const list = getSetCookiesList(resObj.headers);
          for (let i = 0; i < list.length; i++) {
            const rawCookie = list[i];
            const pair = rawCookie.split(';')[0] || '';
            const eqIdx = pair.indexOf('=');
            if (eqIdx === -1) continue;
            const cName = pair.slice(0, eqIdx).trim();
            const cVal = pair.slice(eqIdx + 1).trim();
            if (cName) {
              if (cName.toUpperCase() === 'PHPSESSID') gotFreshSession = true;
              cookieMap.set(cName, cVal);
              outgoingCookies.set(cName.toLowerCase(), rewriteSetCookieHeader(rawCookie, isHttps));
            }
          }
        };

        recordSetCookies(upstreamRes);

        for (let attempt = 0; attempt < 3; attempt++) {
          if (isSecurityGateHtml(finalHtml, finalRes.status)) break;
          const challenge = solvePlayChallenge(finalHtml);
          if (!challenge) break;

          if (attempt > 0 && !gotFreshSession) {
            cookieMap.clear();
            headers.delete('cookie');
            const freshFetch = await fetchUpstreamResponse(targetUrl, {
              method,
              headers,
              redirect: 'manual',
            });
            recordSetCookies(freshFetch.res);
            finalRes = freshFetch.res;
            finalHtml = new TextDecoder().decode(freshFetch.buffer);
            const freshChallenge = solvePlayChallenge(finalHtml);
            if (!freshChallenge) break;
            cookieMap.set(freshChallenge.cookieName, freshChallenge.cookieValue);
            outgoingCookies.set(
              freshChallenge.cookieName.toLowerCase(),
              rewriteSetCookieHeader(
                freshChallenge.cookieName + '=' + freshChallenge.cookieValue + '; path=/; max-age=3600',
                isHttps,
              ),
            );
          } else {
            cookieMap.set(challenge.cookieName, challenge.cookieValue);
            outgoingCookies.set(
              challenge.cookieName.toLowerCase(),
              rewriteSetCookieHeader(
                challenge.cookieName + '=' + challenge.cookieValue + '; path=/; max-age=3600',
                isHttps,
              ),
            );
          }

          headers.set('cookie', serializeCookieMap(cookieMap));
          const nextFetch = await fetchUpstreamResponse(targetUrl, {
            method,
            headers,
            redirect: 'manual',
          });
          recordSetCookies(nextFetch.res);
          finalRes = nextFetch.res;
          finalHtml = new TextDecoder().decode(nextFetch.buffer);
        }

        const outHeaders = new Headers();
        for (const cVal of outgoingCookies.values()) {
          outHeaders.append('Set-Cookie', cVal);
        }
        outHeaders.set('Content-Type', finalRes.headers.get('content-type') || 'text/html; charset=UTF-8');
        outHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');

        const effectivePwChk = cookieMap.get('_pw_sec_chk') || '';
        const playSid = encodePlaySessionToken(cookieMap);
        const playIsGate = isSecurityGateHtml(finalHtml, finalRes.status);
        const playRewritten = rewriteHtml(finalHtml, requestOrigin);
        const bodyHtml = playIsGate ? playRewritten : injectPlayCookieSync(playRewritten, effectivePwChk, playSid);
        return new Response(bodyHtml, { status: finalRes.status, headers: outHeaders });
      }

      const outHeaders = new Headers();
      appendSetCookies(upstreamRes, request, outHeaders);

      // Rewrite HTML pages
      if (contentType.includes('text/html')) {
        const html = new TextDecoder().decode(upstreamBuf);
        const isGate = isSecurityGateHtml(html, upstreamRes.status);
        outHeaders.set('Content-Type', contentType);
        const cc = upstreamRes.headers.get('cache-control');
        if (cc) outHeaders.set('Cache-Control', cc);
        const isMainUi = !isGate && (pathname === '/' || pathname === '/index.html');
        const rewritten = rewriteHtml(html, requestOrigin);
        return new Response(isMainUi ? injectStylishUi(rewritten) : rewritten, {
          status: upstreamRes.status,
          headers: outHeaders,
        });
      }

      // Rewrite any first-party JS scripts
      if ((contentType.includes('javascript') || pathname.endsWith('.js')) && !pathname.includes('.min.')) {
        const js = new TextDecoder().decode(upstreamBuf);
        outHeaders.set('Content-Type', 'application/javascript; charset=UTF-8');
        outHeaders.set('Cache-Control', 'no-cache, must-revalidate');
        const processed = js.includes('Array.prototype.slice.call(arguments)')
          ? unlockObfuscatedScript(js)
          : patchPlainScript(js, requestOrigin);
        return new Response(processed, { status: upstreamRes.status, headers: outHeaders });
      }

      // Rewrite get_settings JSON response
      if (pathname.includes('/api/get_settings')) {
        const raw = new TextDecoder().decode(upstreamBuf);
        outHeaders.set('Content-Type', 'application/json; charset=UTF-8');
        outHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        return new Response(rewriteSettingsJson(raw, requestOrigin), {
          status: upstreamRes.status,
          headers: outHeaders,
        });
      }

      // Rewrite upstream origin callback URLs in JSON API responses (e.g. key generation / verify endpoints)
      if (contentType.includes('application/json') || contentType.includes('+json')) {
        const rawJson = new TextDecoder().decode(upstreamBuf);
        const rewrittenJson = rewriteUpstreamUrls(rawJson, requestOrigin);
        outHeaders.set('Content-Type', contentType);
        outHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        let outStatus = upstreamRes.status;
        if ((isJsonApiRoute || contentType.includes('json')) && outStatus >= 502 && outStatus <= 504) {
          outStatus = isTokenManagerRoute ? 200 : 422;
        }
        return new Response(rewrittenJson, { status: outStatus, headers: outHeaders });
      }

      // Pass through all other assets & binary responses untouched
      const passHeaders = ['content-type', 'cache-control', 'etag', 'last-modified', 'content-disposition'];
      for (let i = 0; i < passHeaders.length; i++) {
        const val = upstreamRes.headers.get(passHeaders[i]);
        if (val) outHeaders.set(passHeaders[i], val);
      }

      let outStatus = upstreamRes.status;
      if (isJsonApiRoute && outStatus >= 502 && outStatus <= 504) {
        outStatus = isTokenManagerRoute && contentType.includes('json') ? 200 : 422;
      }
      return new Response(upstreamBuf, { status: outStatus, headers: outHeaders });
    } catch (err) {
      console.warn('Worker proxy error:', pathAndQuery, err && err.message ? err.message : String(err));
      if (isJsonApiRoute) {
        return new Response(
          JSON.stringify({ success: false, error: 'Upstream connection error. Please try again.' }),
          { status: 422, headers: { 'Content-Type': 'application/json; charset=UTF-8' } },
        );
      }
      return new Response('Upstream connection error. Please try again.', { status: 502 });
    }
  },
};
`;
}
