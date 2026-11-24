import crypto from 'crypto';
import express, { type Request, type Response } from 'express';
import http from 'http';
import vm from 'vm';
import { buildCloudflareWorkerScript, buildManifestJson } from './cloudflare-worker-template.ts';
import { injectStylishUi } from './stylish-ui.ts';
import { createZipArchive } from './zip-builder.ts';

const PORT = 3000;
const UPSTREAM_ORIGIN = 'https://s2-cdn.studyratna.cc';
const BRAND_NAME = 'GB STUDY';
const TELEGRAM_URL = 'https://t.me/GBFreestudy';
const ICON_SOURCE_URL = 'https://i.ibb.co/Q3g9fGSt/1791541921524.png';
const ICON_PATH = '/gb-icon.png';

const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

let cachedIconBuffer: Buffer | null = null;
let cachedIconContentType = 'image/png';

function isTransientNetworkError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const msg = String((err as { message?: unknown }).message || '').toLowerCase();
  const cause = (err as { cause?: { code?: unknown; message?: unknown; name?: unknown } }).cause;
  const causeCode = String(cause?.code || '').toUpperCase();
  const causeMsg = String(cause?.message || '').toLowerCase();
  const causeName = String(cause?.name || '').toLowerCase();
  return (
    msg.includes('fetch failed') ||
    msg.includes('terminated') ||
    msg.includes('aborted') ||
    causeName.includes('socketerror') ||
    causeMsg.includes('other side closed') ||
    causeMsg.includes('socket') ||
    causeCode === 'UND_ERR_SOCKET' ||
    causeCode === 'UND_ERR_HEADERS_TIMEOUT' ||
    causeCode === 'UND_ERR_BODY_TIMEOUT' ||
    causeCode === 'ECONNRESET' ||
    causeCode === 'ETIMEDOUT' ||
    causeCode === 'EPIPE'
  );
}

async function fetchUpstreamResponse(
  url: string,
  init: RequestInit,
  maxAttempts = 3,
): Promise<{ res: globalThis.Response; buffer: Buffer }> {
  let lastErr: unknown;
  const rawBody =
    init.body instanceof Uint8Array
      ? init.body
      : Buffer.isBuffer(init.body)
        ? new Uint8Array(init.body)
        : init.body;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const attemptInit: RequestInit = {
        ...init,
        body: rawBody instanceof Uint8Array ? new Uint8Array(rawBody) : rawBody,
        signal: AbortSignal.timeout(25000),
      };
      const res = await fetch(url, attemptInit);
      const buffer = Buffer.from(await res.arrayBuffer());
      return { res, buffer };
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts - 1 && isTransientNetworkError(err)) {
        await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

async function loadIconBuffer(): Promise<Buffer | null> {
  if (cachedIconBuffer) return cachedIconBuffer;
  try {
    const { res, buffer } = await fetchUpstreamResponse(ICON_SOURCE_URL, {
      headers: { 'User-Agent': DEFAULT_UA },
    });
    if (res.ok) {
      cachedIconBuffer = buffer;
      const ct = res.headers.get('content-type');
      if (ct && ct.startsWith('image/')) {
        cachedIconContentType = ct;
      }
      return cachedIconBuffer;
    }
  } catch (err) {
    console.warn('Failed to preload icon:', err instanceof Error ? err.message : String(err));
  }
  return null;
}

function isHttpsRequest(req: Request): boolean {
  if (req.secure) return true;
  const proto = req.headers['x-forwarded-proto'];
  if (typeof proto === 'string') {
    return proto.split(',')[0].trim().toLowerCase() === 'https';
  }
  return false;
}

function getRequestOrigin(req: Request): string {
  const xfProto = typeof req.headers['x-forwarded-proto'] === 'string' ? req.headers['x-forwarded-proto'] : '';
  const proto = xfProto ? xfProto.split(',')[0].trim() : isHttpsRequest(req) ? 'https' : req.protocol || 'http';
  const xfHost = typeof req.headers['x-forwarded-host'] === 'string' ? req.headers['x-forwarded-host'] : '';
  const hostHeader = xfHost || (typeof req.headers.host === 'string' ? req.headers.host : '');
  const host = hostHeader ? hostHeader.split(',')[0].trim() : `127.0.0.1:${PORT}`;
  return `${proto}://${host}`;
}

function rewriteUpstreamUrls(text: string, requestOrigin: string): string {
  if (!text) return text;
  const encodedOrigin = encodeURIComponent(requestOrigin);
  const escapedOrigin = requestOrigin.replace(/\//g, '\\/');
  return text
    .replace(/https?:\/\/(?:s2-cdn\.)?studyratna\.cc(?=[\s"'<>\\/?#&)]|$)/gi, requestOrigin)
    .replace(/https?:\\\/\\\/(?:s2-cdn\.)?studyratna\.cc/gi, escapedOrigin)
    .replace(/https?%3A%2F%2F(?:s2-cdn\.)?studyratna\.cc/gi, encodedOrigin);
}

function rewriteGatePaths(text: string): string {
  if (!text) return text;
  return text
    .replace(/(['"`(=,\s]|^)\/cdn-cgi\//gi, '$1/__gb_cf_cgi/')
    .replace(/(['"`(=,\s]|^)\\\/cdn-cgi\\\//gi, '$1\\/__gb_cf_cgi\\/');
}

function isSecurityGateHtml(html: string, status: number): boolean {
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

function rewriteSetCookieHeader(cookieStr: string, isHttps: boolean): string {
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

function parseCookieMap(cookieHeader: string): Map<string, string> {
  const map = new Map<string, string>();
  if (!cookieHeader) return map;
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const name = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (name) map.set(name, val);
  }
  return map;
}

function serializeCookieMap(map: Map<string, string>): string {
  return Array.from(map.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

function forwardSetCookies(upstreamRes: globalThis.Response, req: Request, res: Response): void {
  const isHttps = isHttpsRequest(req);
  const rawCookies =
    typeof upstreamRes.headers.getSetCookie === 'function'
      ? upstreamRes.headers.getSetCookie()
      : [];
  if (rawCookies.length > 0) {
    res.setHeader(
      'Set-Cookie',
      rawCookies.map((c) => rewriteSetCookieHeader(c, isHttps)),
    );
  }
}

function rewriteTelegramUrls(text: string): string {
  return text
    .replace(/https?:\/\/(?:t\.me|telegram\.me)\/[^\s"'<>\\)]+/gi, TELEGRAM_URL)
    .replace(/https?:\/\/channel\.studyrays\.cc[^\s"'<>\\)]*/gi, TELEGRAM_URL);
}

function rewriteBrandText(text: string): string {
  return text
    .replace(/(?<![./a-z0-9-])\bStudyRatna(?:\.cc)?\b/gi, BRAND_NAME)
    .replace(/\bStudy\s+Ratna\b/gi, BRAND_NAME)
    .replace(/\bStudyRays(?:\s*x\s*DevJisu)?\b/gi, BRAND_NAME)
    .replace(/\bRatna\s+Bhai\b/gi, BRAND_NAME);
}

function patchPlainScript(code: string, requestOrigin: string): string {
  let out = code;
  // Bypass plain allowedOrigins domain allowlists (e.g. /start-dpp-test/script.js ORIGIN_MISMATCH_403)
  out = out.replace(
    /((?:const|let|var)\s+allowedOrigins\s*=\s*\[[^\]]*\])/g,
    '$1.concat([window.location.hostname])',
  );
  // Keep in-app navigation (e.g. Leave Quiz redirect) on our proxy origin instead of external mirrors
  out = out.replace(
    /https?:\/\/(?:streamfiles\.eu\.org|testfile\.eu\.org|s2-cdn\.studyratna\.cc)\/#/gi,
    '/#',
  );
  out = rewriteUpstreamUrls(out, requestOrigin);
  out = rewriteGatePaths(out);
  out = rewriteTelegramUrls(out);
  out = rewriteBrandText(out);
  return out;
}

function unlockHtmlInlineScripts(html: string, requestOrigin: string): string {
  return html.replace(
    /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi,
    (_full, openTag: string, body: string, closeTag: string) => {
      if (!body.includes('Array.prototype.slice.call(arguments)')) {
        let patched = body.includes('allowedOrigins')
          ? body.replace(
              /((?:const|let|var)\s+allowedOrigins\s*=\s*\[[^\]]*\])/g,
              '$1.concat([window.location.hostname])',
            )
          : body;
        patched = rewriteGatePaths(rewriteUpstreamUrls(patched, requestOrigin));
        return `${openTag}${patched}${closeTag}`;
      }
      return `${openTag}${unlockObfuscatedScript(body)}${closeTag}`;
    },
  );
}

function injectClientOriginGuard(html: string): string {
  const guard =
    '<script id="gb-origin-guard">(function(){if(window.__gbOriginGuard)return;window.__gbOriginGuard=true;var _o=window.location.origin;function _rw(u){if(typeof u!=="string")return u;u=u.replace(/^https?:\\/\\/(?:s2-cdn\\.)?studyratna\\.cc(?=\\/|$|\\?|#)/i,_o);u=u.replace(/^\\/cdn-cgi\\//i,"/__gb_cf_cgi/");if(u.indexOf(_o+"/cdn-cgi/")===0)u=_o+"/__gb_cf_cgi/"+u.slice((_o+"/cdn-cgi/").length);return u;}function _showGateBanner(url){try{if(document.getElementById("gb-gate-banner")||!document.body)return;var b=document.createElement("div");b.id="gb-gate-banner";b.style.cssText="position:fixed;bottom:18px;right:18px;z-index:99999;background:#0f172a;color:#f8fafc;border:1px solid rgba(56,189,248,0.45);border-radius:14px;padding:12px 16px;box-shadow:0 16px 36px rgba(0,0,0,0.45);display:flex;align-items:center;gap:12px;font-family:sans-serif;font-size:13px;";var t=document.createElement("span");t.textContent="Security verification needed to load content.";var a=document.createElement("button");a.type="button";a.textContent="Verify Now";a.style.cssText="background:#2563eb;color:#fff;border:none;border-radius:10px;padding:7px 14px;font-weight:700;cursor:pointer;";a.onclick=function(){window.location.assign(url||"/?__gb_gate=1");};b.appendChild(t);b.appendChild(a);document.body.appendChild(b);}catch(e){}}var _f=window.fetch;if(typeof _f==="function"){window.fetch=function(u,opts){try{if(typeof u==="string"){u=_rw(u);}else if(u&&u.url){var nu=_rw(u.url);if(nu!==u.url)u=new Request(nu,u);}}catch(e){}return _f.call(this,u,opts).then(function(resp){try{if(resp.status===403&&(resp.headers.get("content-type")||"").indexOf("json")!==-1){resp.clone().json().then(function(d){if(d&&d.security_gate)_showGateBanner(d.challenge_url);},function(){});}}catch(e){}return resp;});};}if(typeof XMLHttpRequest!=="undefined"&&XMLHttpRequest.prototype){var _xo=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){try{if(typeof u==="string")arguments[1]=_rw(u);}catch(e){}return _xo.apply(this,arguments);};}})();</script>';
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${guard}`);
  }
  return `${guard}${html}`;
}

function rewriteHtml(html: string, requestOrigin: string): string {
  let out = html;

  // Replace known site logos with local proxied icon
  out = out.replace(
    /https:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:ANd9GcT1fXfQMfsh9IK27z-hikKlLU2h8R_A9XUaLg&s/gi,
    ICON_PATH,
  );

  // Replace alt text for logos
  out = out.replace(/alt=["'](?:Physics Wallah|StudyRatna|StudyRays) Logo["']/gi, `alt="${BRAND_NAME} Logo"`);

  // Replace popup emoji/icon with GB STUDY icon
  out = out.replace(
    /<div id="srIcon">[\s\S]*?<\/div>/i,
    `<div id="srIcon" style="overflow:hidden;padding:0;"><img src="${ICON_PATH}" alt="${BRAND_NAME}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>`,
  );

  // Rewrite upstream origin callback URLs & /cdn-cgi/ paths in HTML markup BEFORE brand text rewrites
  out = out.replace(
    /(<script\b[^>]*>[\s\S]*?<\/script>)|([^<]+|<)/gi,
    (seg, scriptTag?: string) => {
      if (scriptTag) return scriptTag;
      return rewriteGatePaths(rewriteUpstreamUrls(seg, requestOrigin));
    },
  );

  // Rewrite Telegram links and brand names
  out = rewriteTelegramUrls(out);
  out = rewriteBrandText(out);

  // Ensure <title> and favicon are set to GB STUDY
  if (/<title>[^<]*<\/title>/i.test(out)) {
    out = out.replace(/<title>([^<]*)<\/title>/i, (_m, titleText: string) => {
      if (/studyratna|studyrays|study\s*ratna/i.test(titleText) || !titleText.trim()) {
        return `<title>${BRAND_NAME}</title>`;
      }
      return `<title>${rewriteBrandText(titleText)}</title>`;
    });
  } else if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, `<head$1><title>${BRAND_NAME}</title>`);
  }

  // Inject favicon if not already pointing to ICON_PATH
  if (!out.includes(ICON_PATH) && /<\/head>/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      `<link rel="icon" type="image/png" href="${ICON_PATH}"><link rel="shortcut icon" type="image/png" href="${ICON_PATH}"></head>`,
    );
  } else if (/<head[^>]*>/i.test(out) && !/rel=["'](?:shortcut )?icon["']/i.test(out)) {
    out = out.replace(
      /<head([^>]*)>/i,
      `<head$1><link rel="icon" type="image/png" href="${ICON_PATH}"><link rel="shortcut icon" type="image/png" href="${ICON_PATH}">`,
    );
  }

  // Unlock and patch obfuscated inline scripts (e.g. play.php cF7c) after brand/URL rewrites
  out = unlockHtmlInlineScripts(out, requestOrigin);
  out = injectClientOriginGuard(out);

  return out;
}



const unlockedScriptCache = new Map<string, string>();
const MAX_SCRIPT_CACHE_ENTRIES = 12;

function buildRuntimeObjPatch(objVar: string): string {
  // Build domain strings dynamically so HTML brand rewriters cannot accidentally mutate them
  const d1 = ['s2-cdn', 'studyratna', 'cc'].join('.');
  const d2 = ['studyratna', 'cc'].join('.');
  const d3 = ['stream', 'studyratna', 'cc'].join('.');
  const upOrigin = 'https://' + d1;
  const rootOrigin = 'https://' + d2;
  const upOriginEnc = encodeURIComponent(upOrigin);
  const rootOriginEnc = encodeURIComponent(rootOrigin);
  return `;(function(){try{var _obj=${objVar};if(typeof _obj==="object"&&_obj){for(var _k in _obj){if(typeof _obj[_k]==="function"&&_obj[_k].length===1){(function(_orig,_key){_obj[_key]=function(_idx){var _v=_orig.call(this,_idx);if(typeof _v!=="string")return _v;if(_v.indexOf("check_origin.php")!==-1)return "/api/check_origin.php";if(_v===${JSON.stringify(d1)}||_v===${JSON.stringify(d2)}||_v===${JSON.stringify(d3)})return window.location.hostname;if(_v.indexOf(${JSON.stringify(upOrigin + '/')})===0)return window.location.origin+_v.slice(${upOrigin.length});if(_v===${JSON.stringify(upOrigin)}||_v===${JSON.stringify(rootOrigin)})return window.location.origin;if(_v.indexOf(${JSON.stringify(rootOrigin + '/')})===0)return window.location.origin+_v.slice(${rootOrigin.length});if(_v.indexOf(${JSON.stringify(upOriginEnc)})!==-1)_v=_v.split(${JSON.stringify(upOriginEnc)}).join(encodeURIComponent(window.location.origin));if(_v.indexOf(${JSON.stringify(rootOriginEnc)})!==-1)_v=_v.split(${JSON.stringify(rootOriginEnc)}).join(encodeURIComponent(window.location.origin));if(_v.indexOf("t.me/")!==-1||_v.indexOf("telegram.me/")!==-1||_v.indexOf("channel.studyrays.cc")!==-1){_v=_v.replace(/https?:\\/\\/(?:t\\.me|telegram\\.me)\\/[^\\s"\\x27<>\\\\)]+/gi,${JSON.stringify(TELEGRAM_URL)}).replace(/https?:\\/\\/channel\\.studyrays\\.cc[^\\s"\\x27<>\\\\)]*/gi,${JSON.stringify(TELEGRAM_URL)});}if(_v.indexOf("StudyRatna")!==-1||_v.indexOf("StudyRays")!==-1||_v.indexOf("studyrays")!==-1||_v.indexOf("Study Ratna")!==-1||_v.indexOf("Ratna Bhai")!==-1){_v=_v.replace(/StudyRays\\s*x\\s*DevJisu/gi,${JSON.stringify(BRAND_NAME)}).replace(/(?<![./a-z0-9-])StudyRatna(?:\\.cc)?/gi,${JSON.stringify(BRAND_NAME)}).replace(/Study\\s+Ratna/gi,${JSON.stringify(BRAND_NAME)}).replace(/Ratna\\s+Bhai/gi,${JSON.stringify(BRAND_NAME)}).replace(/StudyRays/gi,${JSON.stringify(BRAND_NAME)}).replace(/studyrays/gi,${JSON.stringify(BRAND_NAME)});}return _v;};})(_obj[_k],_k);}}}}catch(_e){}})();`;
}

function unescapeJsStringLiteral(lit: string): string {
  const body = lit.slice(1, -1);
  return body.replace(
    /\\(x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|u\{[0-9a-fA-F]+\}|[0-7]{1,3}|[\s\S])/g,
    (_m, seq: string) => {
      if (seq === 'n') return '\n';
      if (seq === 'r') return '\r';
      if (seq === 't') return '\t';
      if (seq === 'b') return '\b';
      if (seq === 'f') return '\f';
      if (seq === 'v') return '\v';
      if (seq === '0') return '\0';
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

function pureUnlockInner(code: string): {
  inner: string;
  objVar: string;
  argsVar: string;
  evalStart: number;
  evalEnd: number;
} | null {
  const prefixRe =
    /let\s+([^;\s]+);!function\(\)\{const\s+([^\s=]+)=Array\.prototype\.slice\.call\(arguments\);return\s+eval\(/;
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
    if (code[i] === '\\') {
      i += 2;
      continue;
    }
    if (code[i] === quote) break;
    i++;
  }
  if (i >= code.length || code[i + 1] !== ')') return null;

  const evalEnd = i + 2;
  const outerSource = unescapeJsStringLiteral(code.slice(strStart, i + 1));
  const callMatch = outerSource.match(/\}\)\((["'])([\s\S]*)\1\);?$/);
  if (!callMatch) return null;

  let encDecoded = '';
  try {
    encDecoded = decodeURI(callMatch[2]);
  } catch {
    return null;
  }
  if (encDecoded.length < 24) return null;

  const cribs = ['(function(){function ', '(function(){var ', '(function(){let ', '(function(){const ', '(function('];
  for (const crib of cribs) {
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
      const chunks = new Array<string>(encDecoded.length);
      for (let idx = 0; idx < encDecoded.length; idx++) {
        chunks[idx] = String.fromCharCode(encDecoded.charCodeAt(idx) ^ key.charCodeAt(idx % keyLen));
      }
      const candidate = chunks.join('');
      if (candidate.startsWith(crib) && candidate.includes('function')) {
        return { inner: candidate, objVar, argsVar, evalStart, evalEnd };
      }
    }
  }
  return null;
}

function unlockObfuscatedScript(code: string): string {
  if (!code.includes('Array.prototype.slice.call(arguments)') || !code.includes('eval(')) {
    return code;
  }

  const cacheKey = `${code.length}:${code.slice(0, 120)}:${code.slice(-80)}`;
  const cached = unlockedScriptCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  let out = code;
  try {
    let innerPayload: string | null = null;
    let objVar = '';
    let argsVar = '';
    let evalStart = 0;
    let evalEnd = 0;

    const pure = pureUnlockInner(code);
    if (pure) {
      innerPayload = pure.inner;
      objVar = pure.objVar;
      argsVar = pure.argsVar;
      evalStart = pure.evalStart;
      evalEnd = pure.evalEnd;
    } else {
      const capture: { inner: string | null } = { inner: null };
      let evalCount = 0;

      // Isolated VM context fallback with standard built-ins only; intercepts the 2nd eval()
      const sandbox: Record<string, unknown> = {
        Array,
        Object,
        String,
        Number,
        Boolean,
        RegExp,
        Date,
        Math,
        JSON,
        Error,
        TypeError,
        RangeError,
        parseInt,
        parseFloat,
        isNaN,
        isFinite,
        encodeURIComponent,
        decodeURIComponent,
        escape,
        unescape,
        eval: (str: string) => {
          evalCount++;
          if (evalCount === 1) {
            return vm.runInContext(str, ctx);
          }
          capture.inner = str;
          throw new Error('__CAPTURE_STOP__');
        },
      };
      const ctx = vm.createContext(sandbox);
      try {
        vm.runInContext(code, ctx, { timeout: 2000 });
      } catch {
        // Expected __CAPTURE_STOP__ once inner payload is captured
      }

      if (capture.inner) {
        const prefixRe =
          /let\s+([^;\s]+);!function\(\)\{const\s+([^\s=]+)=Array\.prototype\.slice\.call\(arguments\);return\s+eval\(/;
        const pm = code.match(prefixRe);
        if (pm && pm.index !== undefined) {
          objVar = pm[1];
          argsVar = pm[2];
          evalStart = pm.index + pm[0].indexOf('eval(');
          const strStart = pm.index + pm[0].length;
          const quote = code[strStart];
          if (quote === '"' || quote === "'") {
            let i = strStart + 1;
            while (i < code.length) {
              if (code[i] === '\\') {
                i += 2;
                continue;
              }
              if (code[i] === quote) break;
              i++;
            }
            if (i < code.length && code[i + 1] === ')') {
              evalEnd = i + 2;
              innerPayload = capture.inner;
            }
          }
        }
      }
    }

    if (innerPayload && objVar && argsVar && evalEnd > evalStart) {
      // Unlock the inner hostname-hash function (4-param CHECK_HOST after [-954999937, -456689553])
      const hashPatchRegex =
        /(-954999937,-456689553[\s\S]{0,2500}?function\s+[^\s(]+\()([^\s,]+)(,[^\s,]+,[^\s,]+,[^\s)]+\)\{)/;
      const patchedInner = innerPayload.replace(
        hashPatchRegex,
        (_m: string, a: string, b: string, c: string) => `${a}${b}${c}${b}="s2-cdn.studyratna.cc";`,
      );

      const replacement = `(${patchedInner}).apply(null,${argsVar})`;
      out = code.slice(0, evalStart) + replacement + code.slice(evalEnd);

      // Inject runtime string rewriter immediately after the wrapper IIFE completes: }();
      const runtimePatch = buildRuntimeObjPatch(objVar);
      const iifeTailIdx = out.indexOf('}();', evalStart + replacement.length);
      if (iifeTailIdx !== -1 && iifeTailIdx - (evalStart + replacement.length) < 32) {
        const insertPos = iifeTailIdx + 4;
        out = out.slice(0, insertPos) + runtimePatch + out.slice(insertPos);
      } else {
        const anchorRegex = new RegExp(`(\\(function\\(\\)\\{[^=]{1,40}=\\[${objVar}\\.)`);
        out = out.replace(anchorRegex, (m) => runtimePatch + m);
      }
    }
  } catch (err) {
    console.error('Script unlock fallback:', err);
    out = code;
  }

  // Expand literal domain allowlists as an additional guard
  out = out.replace(
    /\[(?:wOMp|yrVy|cF7c)\.\w+\(\d+\)(?:,(?:wOMp|yrVy|cF7c)\.\w+\(\d+\)){4,10}\]/g,
    (m) => `${m}.concat([window.location.hostname])`,
  );

  if (unlockedScriptCache.size >= MAX_SCRIPT_CACHE_ENTRIES) {
    const firstKey = unlockedScriptCache.keys().next().value;
    if (firstKey !== undefined) unlockedScriptCache.delete(firstKey);
  }
  unlockedScriptCache.set(cacheKey, out);
  return out;
}

function rewriteSettingsJson(rawText: string, requestOrigin: string): string {
  try {
    const parsed = JSON.parse(rawText);
    const data = parsed?.data;
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
        for (const item of data.quick_nav) {
          if (!item || typeof item !== 'object') continue;
          const titleStr = typeof item.title === 'string' ? item.title : '';
          const urlStr = typeof item.url === 'string' ? item.url : '';
          if (
            /telegram/i.test(titleStr) ||
            /(?:t\.me|telegram\.me|channel\.studyrays\.cc)/i.test(urlStr)
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

function solvePlayChallenge(html: string): { cookieName: string; cookieValue: string } | null {
  if (
    !html.includes('_pw_sec_chk') &&
    !html.includes('pw_chk_') &&
    !html.includes('var _x=') &&
    !html.includes('var _x =')
  ) {
    return null;
  }

  const spanMap: Record<string, { attrName?: string; attrVal?: string; text: string }> = {};
  const spanRegex = /<span\s+id=['"]([^'"]+)['"](?:\s+(data-[a-z0-9_-]+)=['"]([^'"]*)['"])?\s*>([^<]*)<\/span>/gi;
  let match: RegExpExecArray | null;
  while ((match = spanRegex.exec(html)) !== null) {
    spanMap[match[1]] = {
      attrName: match[2],
      attrVal: match[3],
      text: match[4] || '',
    };
  }

  const parts: string[] = [];
  const docRegex =
    /document\.getElementById\(['"]([^'"]+)['"]\)\.(?:getAttribute\(['"]([^'"]+)['"]\)|innerHTML)/gi;
  while ((match = docRegex.exec(html)) !== null) {
    const span = spanMap[match[1]];
    if (!span) continue;
    if (match[2]) {
      parts.push(span.attrVal ?? '');
    } else {
      parts.push(span.text);
    }
  }

  if (parts.length === 0) return null;

  let cookieName = '_pw_sec_chk';
  const xMatch = html.match(/var\s+_x\s*=\s*\[([^\]]+)\]/);
  if (xMatch) {
    try {
      const xorMatch = html.match(/String\.fromCharCode\([^)]*\^\s*(\d+)\)/);
      const xorKey = xorMatch ? Number(xorMatch[1]) : 42;
      const decoded = xMatch[1]
        .split(',')
        .map((n) => String.fromCharCode(Number(n.trim()) ^ xorKey))
        .join('');
      const nameMatch = decoded.match(/document\.cookie\s*=\s*['"]([^=]+)=/);
      if (nameMatch) cookieName = nameMatch[1];
    } catch {
      // keep default cookieName
    }
  }

  return { cookieName, cookieValue: parts.join('') };
}

interface PlaySessionEntry {
  cookies: Record<string, string>;
  expiresAt: number;
}

const playSessionStore = new Map<string, PlaySessionEntry>();
const MAX_PLAY_SESSIONS = 500;

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

function isBlockedCookieName(name: string): boolean {
  const lower = String(name || '').toLowerCase();
  if (!lower) return true;
  if (BLOCKED_UPSTREAM_COOKIE_NAMES.has(lower)) return true;
  return BLOCKED_COOKIE_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

function savePlaySession(cookieMap: Map<string, string>): string {
  const cookies: Record<string, string> = {};
  for (const [name, val] of cookieMap.entries()) {
    if (!isBlockedCookieName(name)) {
      cookies[name] = val;
    }
  }
  if (Object.keys(cookies).length === 0) return '';
  const now = Date.now();
  for (const [k, v] of playSessionStore.entries()) {
    if (v.expiresAt <= now) playSessionStore.delete(k);
  }
  while (playSessionStore.size >= MAX_PLAY_SESSIONS) {
    const oldest = playSessionStore.keys().next().value;
    if (oldest !== undefined) playSessionStore.delete(oldest);
    else break;
  }
  const sid = crypto.randomBytes(16).toString('hex');
  playSessionStore.set(sid, { cookies, expiresAt: now + 3600_000 });
  return sid;
}

function getPlaySession(sid: string): PlaySessionEntry | null {
  const entry = playSessionStore.get(sid);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    playSessionStore.delete(sid);
    return null;
  }
  return entry;
}

function buildUpstreamHeaders(req: Request): Headers {
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

  for (const [key, val] of Object.entries(req.headers)) {
    if (!val) continue;
    const lower = key.toLowerCase();
    const isCustomGateHeader =
      lower.startsWith('x-') &&
      !lower.startsWith('x-forwarded-') &&
      !lower.startsWith('x-gb-') &&
      !lower.startsWith('x-invoke-') &&
      lower !== 'x-real-ip';
    if (!forwardAllowList.has(lower) && !isCustomGateHeader) continue;
    const strVal = Array.isArray(val) ? val.join(', ') : val;
    if (strVal) headers.set(lower, strVal);
  }

  // Forward all upstream & key-generation cookies while stripping Google/Analytics cookies
  const rawCookieHeader = typeof req.headers.cookie === 'string' ? req.headers.cookie : '';
  const incomingMap = parseCookieMap(rawCookieHeader);
  const cleanCookieMap = new Map<string, string>();
  for (const [name, val] of incomingMap.entries()) {
    if (!isBlockedCookieName(name)) {
      cleanCookieMap.set(name, val);
    }
  }

  // Restore server-side play.php session & key cookies if browser iframe restricted cookies
  const playSid = req.headers['x-gb-play-sid'];
  if (typeof playSid === 'string' && playSid.trim()) {
    const sess = getPlaySession(playSid.trim());
    if (sess) {
      for (const [k, v] of Object.entries(sess.cookies)) {
        if (typeof v === 'string' && !isBlockedCookieName(k)) {
          cleanCookieMap.set(k, v);
        }
      }
    }
  }

  const pwChkOverride = req.headers['x-gb-pw-chk'];
  if (typeof pwChkOverride === 'string' && pwChkOverride.trim()) {
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
  const rawReferer = typeof req.headers.referer === 'string' ? req.headers.referer : '';
  if (rawReferer) {
    try {
      const refUrl = new URL(rawReferer);
      refPath = refUrl.pathname + refUrl.search;
    } catch {
      refPath = req.originalUrl || '/';
    }
  } else {
    refPath = req.originalUrl || '/';
  }
  headers.set('referer', `${UPSTREAM_ORIGIN}${refPath}`);
  return headers;
}

function encodeRadhaMetaData(pathStr: string): string {
  const key = 'fgsbhv235793853rifjb';
  let out = '';
  for (let i = 0; i < pathStr.length; i++) {
    out += String.fromCharCode(pathStr.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return Buffer.from(unescape(encodeURIComponent(out)), 'binary').toString('base64');
}

function injectPlayCookieSync(html: string, pwChk: string, playSid: string): string {
  const guardScript = `<script>(function(){var _p=${JSON.stringify(pwChk)};var _sid=${JSON.stringify(playSid)};if(_p){try{if(document.cookie.indexOf("_pw_sec_chk="+_p)===-1){document.cookie="_pw_sec_chk="+_p+"; path=/; max-age=3600; SameSite=None; Secure; Partitioned";}}catch(e){}try{var _d=Object.getOwnPropertyDescriptor(Document.prototype,"cookie")||Object.getOwnPropertyDescriptor(HTMLDocument.prototype,"cookie");if(_d&&_d.get&&_d.set){Object.defineProperty(document,"cookie",{configurable:true,get:function(){var raw=_d.get.call(document)||"";var parts=raw.split(";").map(function(x){return x.trim();}).filter(function(x){return x&&x.indexOf("_pw_sec_chk=")!==0;});parts.push("_pw_sec_chk="+_p);return parts.join("; ");},set:function(v){if(typeof v==="string"&&v.indexOf("__gb_radha_proxy__")!==-1)return v;return _d.set.call(document,v);}});}}catch(e){}}var _memBundle=null;try{if(typeof Storage!=="undefined"&&Storage.prototype){var _lsGet=Storage.prototype.getItem;var _lsSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(this===window.localStorage&&k==="sr_token_bundle"&&typeof v==="string"&&v.indexOf("__gb_radha_proxy__")!==-1){_memBundle=v;return;}return _lsSet.call(this,k,v);};Storage.prototype.getItem=function(k){var val=_lsGet.call(this,k);if(this===window.localStorage&&k==="sr_token_bundle"&&!val&&_memBundle){return _memBundle;}return val;};}}catch(e){}function _needsMediaProxy(u){if(typeof u!=="string")return false;return /^https?:\\/\\/[^/]*\\.de5\\.net\\//i.test(u)||/^https?:\\/\\/[^/]*\\.studyratna\\.cc\\//i.test(u);}function _toMediaProxy(u){return window.location.origin+"/__gb_media?u="+encodeURIComponent(u);}function _extractRadhaPath(u){if(typeof u!=="string")return null;var m=u.match(/^https?:\\/\\/s[0-9a-z-]*\\.samfygros\\.com\\/radha(\\/[^#]*)/i);if(!m)return null;var p=m[1];if(!p||p.indexOf("type=contents")!==-1||p.indexOf("/videos/get-hls-key")!==-1)return null;return p;}function _toRadhaProxy(p){return window.location.origin+"/__gb_radha?path="+encodeURIComponent(p);}var _f=window.fetch;if(typeof _f==="function"){window.fetch=function(u,o){try{var s=typeof u==="string"?u:(u&&u.url)||"";var m=(o&&o.method)||(u&&typeof u!=="string"&&u.method)||"GET";if(s.indexOf("token-manager.php")!==-1){o=o?Object.assign({},o):{};if(!o.credentials)o.credentials="same-origin";return _f.call(this,u,o).then(function(resp){return resp.clone().json().then(function(d){if(resp.ok&&d&&d.success&&(d.access_token||d.token))return resp;return null;},function(){return null;}).then(function(validResp){if(validResp)return validResp;var fallback={success:true,token:"__gb_radha_proxy__",access_token:"__gb_radha_proxy__",enc_token:"__gb_radha_proxy__",expires_at:Math.floor(Date.now()/1000)+120};return new Response(JSON.stringify(fallback),{status:200,headers:{"Content-Type":"application/json"}});});});}if((_p||_sid)&&(s.indexOf("video-url-details.php")!==-1||s.indexOf("e2e-status-proxy.php")!==-1)){o=o?Object.assign({},o):{};var h=new Headers(o.headers||{});if(_p)h.set("x-gb-pw-chk",_p);if(_sid)h.set("x-gb-play-sid",_sid);o.headers=h;}else if(String(m).toUpperCase()==="GET"){var rp=_extractRadhaPath(s);if(rp){u=_toRadhaProxy(rp);o={method:"GET",credentials:"same-origin",headers:{"Accept":"application/json"}};}else if(_needsMediaProxy(s)){if(typeof u==="string"){u=_toMediaProxy(s);}else if(u&&u.url){u=new Request(_toMediaProxy(s),u);}}}}catch(e){}return _f.call(this,u,o);};}if(typeof XMLHttpRequest!=="undefined"&&XMLHttpRequest.prototype){var _xo=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){try{if(typeof u==="string"&&_needsMediaProxy(u)){arguments[1]=_toMediaProxy(u);}}catch(e){}return _xo.apply(this,arguments);};}})();</script>`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${guardScript}`);
  }
  return guardScript + html;
}

function isSafeExternalMediaUrl(rawUrl: string): URL | null {
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
      /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
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

function rewriteM3u8Playlist(playlistText: string, baseUrl: string): string {
  const wrapProxy = (uri: string): string => {
    const trimmed = uri.trim();
    if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
    try {
      const abs = new URL(trimmed, baseUrl).toString();
      return `/__gb_media?u=${encodeURIComponent(abs)}`;
    } catch {
      return trimmed;
    }
  };

  return playlistText
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      if (trimmed.startsWith('#')) {
        return line.replace(/URI=(["'])([^"']+)\1/gi, (_m, q: string, u: string) => {
          return `URI=${q}${wrapProxy(u)}${q}`;
        });
      }
      return wrapProxy(trimmed);
    })
    .join('\n');
}

async function startServer() {
  await loadIconBuffer();

  const app = express();
  app.set('trust proxy', true);

  // Raw body capture for proxied POST/PUT/PATCH requests
  app.use(
    express.raw({
      type: '*/*',
      limit: '20mb',
    }),
  );

  // 1. Serve GB STUDY icon directly for all icon/favicon paths
  app.get(
    [ICON_PATH, '/favicon.ico', '/apple-touch-icon.png', '/icons/icon-192x192.png', '/icons/icon-512x512.png'],
    async (_req: Request, res: Response) => {
      const buf = await loadIconBuffer();
      if (buf) {
        res.setHeader('Content-Type', cachedIconContentType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).send(buf);
      } else {
        res.redirect(302, ICON_SOURCE_URL);
      }
    },
  );

  // 2. Serve GB STUDY Web App Manifest
  app.get('/manifest.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/manifest+json; charset=UTF-8');
    res.status(200).send(buildManifestJson());
  });

  // 2b. One-click Cloudflare Pages Direct Upload .zip bundle
  app.get(['/gb-study-cloudflare.zip', '/download-cloudflare-zip'], async (_req: Request, res: Response) => {
    try {
      const iconBuf =
        (await loadIconBuffer()) ||
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          'base64',
        );
      const workerBuf = Buffer.from(buildCloudflareWorkerScript(), 'utf8');
      const manifestBuf = Buffer.from(buildManifestJson(), 'utf8');
      const zipBuf = createZipArchive([
        { name: '_worker.js', data: workerBuf },
        { name: 'manifest.json', data: manifestBuf },
        { name: 'gb-icon.png', data: iconBuf },
      ]);
      res.status(200);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="gb-study-cloudflare.zip"');
      res.setHeader('Content-Length', String(zipBuf.length));
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(zipBuf);
    } catch (err) {
      console.error('ZIP build error:', err);
      res.status(500).send('Failed to generate Cloudflare deployment zip.');
    }
  });

  // 3. Local origin check handler so any proxy hostname/origin is authorized
  app.all('/api/check_origin.php', (req: Request, res: Response) => {
    const host = (req.hostname || req.headers.host || 'localhost').split(':')[0];
    const reqOrigin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
    const allowed = Array.from(
      new Set(
        [
          host,
          `https://${host}`,
          `http://${host}`,
          reqOrigin,
          'localhost',
          'http://localhost:3000',
          '127.0.0.1',
          'http://127.0.0.1:3000',
        ].filter(Boolean),
      ),
    );
    res.status(200).json({
      success: true,
      allowed_origins: allowed,
      telegram_url: TELEGRAM_URL,
    });
  });

  // 3a. Upstream Cloudflare /cdn-cgi/* proxy (bypass proxy domain's own edge /cdn-cgi/ interception)
  app.all('/__gb_cf_cgi/*', async (req: Request, res: Response) => {
    const requestOrigin = getRequestOrigin(req);
    try {
      const upstreamPath = req.originalUrl.replace(/^\/__gb_cf_cgi\//i, '/cdn-cgi/');
      const targetUrl = new URL(upstreamPath, UPSTREAM_ORIGIN).toString();
      const headers = buildUpstreamHeaders(req);
      const hasBody = !['GET', 'HEAD'].includes(req.method.toUpperCase());
      const body =
        hasBody && Buffer.isBuffer(req.body) && req.body.length > 0
          ? new Uint8Array(req.body)
          : undefined;

      const { res: upstreamRes, buffer: upstreamBuf } = await fetchUpstreamResponse(targetUrl, {
        method: req.method,
        headers,
        body,
        redirect: 'manual',
      });

      forwardSetCookies(upstreamRes, req, res);
      if (upstreamRes.status >= 300 && upstreamRes.status < 400) {
        const loc = upstreamRes.headers.get('location');
        if (loc) {
          res.redirect(upstreamRes.status, rewriteGatePaths(rewriteUpstreamUrls(loc, requestOrigin)));
          return;
        }
      }

      const ct = upstreamRes.headers.get('content-type') || 'application/octet-stream';
      res.setHeader('Content-Type', ct);
      const cc = upstreamRes.headers.get('cache-control');
      if (cc) res.setHeader('Cache-Control', cc);

      const safeStatus = upstreamRes.status === 503 ? 403 : upstreamRes.status;
      if (ct.includes('javascript') || ct.includes('text/html') || ct.includes('json') || ct.includes('text/plain')) {
        const txt = upstreamBuf.toString('utf8');
        res.status(safeStatus).send(rewriteGatePaths(rewriteUpstreamUrls(txt, requestOrigin)));
        return;
      }
      res.status(safeStatus).send(upstreamBuf);
    } catch (err) {
      console.warn('CF-CGI proxy error:', err instanceof Error ? err.message : String(err));
      res.status(422).send('Challenge endpoint unavailable');
    }
  });

  // 3b. Stream/HLS media proxy for CDNs (e.g. *.de5.net) that enforce upstream Referer checks
  app.get('/__gb_media', async (req: Request, res: Response) => {
    const rawUrl = typeof req.query.u === 'string' ? req.query.u : '';
    const parsedUrl = isSafeExternalMediaUrl(rawUrl);
    if (!parsedUrl) {
      res.status(400).send('Invalid media URL');
      return;
    }

    try {
      const mediaHeaders = new Headers();
      mediaHeaders.set('user-agent', req.headers['user-agent']?.toString() || DEFAULT_UA);
      mediaHeaders.set('referer', `${UPSTREAM_ORIGIN}/`);
      mediaHeaders.set('origin', UPSTREAM_ORIGIN);
      if (parsedUrl.hostname.toLowerCase().endsWith('studyratna.cc')) {
        const upHeaders = buildUpstreamHeaders(req);
        const ck = upHeaders.get('cookie');
        if (ck) mediaHeaders.set('cookie', ck);
      }
      if (typeof req.headers.range === 'string') {
        mediaHeaders.set('range', req.headers.range);
      }
      if (typeof req.headers.accept === 'string') {
        mediaHeaders.set('accept', req.headers.accept);
      }

      const { res: upstreamMedia, buffer: buf } = await fetchUpstreamResponse(parsedUrl.toString(), {
        method: 'GET',
        headers: mediaHeaders,
        redirect: 'follow',
      });

      const ct = upstreamMedia.headers.get('content-type') || '';
      const lowerPath = parsedUrl.pathname.toLowerCase();
      const maybePlaylist =
        ct.includes('mpegurl') ||
        ct.includes('text/plain') ||
        lowerPath.endsWith('.m3u8') ||
        lowerPath.endsWith('.docx');

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Content-Type');

      if (maybePlaylist) {
        const headText = buf.subarray(0, 64).toString('utf8').trimStart();
        if (headText.startsWith('#EXTM3U')) {
          const rewritten = rewriteM3u8Playlist(buf.toString('utf8'), parsedUrl.toString());
          res.status(upstreamMedia.status);
          res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=UTF-8');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.send(rewritten);
          return;
        }
        if (ct) res.setHeader('Content-Type', ct);
        res.status(upstreamMedia.status).send(buf);
        return;
      }

      for (const h of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control']) {
        const val = upstreamMedia.headers.get(h);
        if (val) res.setHeader(h, val);
      }
      res.status(upstreamMedia.status).send(buf);
    } catch (err) {
      console.warn('Media proxy error:', err instanceof Error ? err.message : String(err));
      res.status(422).send('Media stream unavailable');
    }
  });

  // 3c. Content API proxy for samfygros.com/radha (class notes, DPPs, timeline slides, doubts, playlists)
  app.get('/__gb_radha', async (req: Request, res: Response) => {
    const rawPath = typeof req.query.path === 'string' ? req.query.path : '';
    if (!rawPath.startsWith('/') || rawPath.startsWith('//') || rawPath.includes('@')) {
      res.status(400).json({ success: false, error: 'Invalid radha path' });
      return;
    }

    try {
      const metaData = encodeRadhaMetaData(rawPath);
      const radhaUrl = `https://s4-cdn.samfygros.com/radha/index.php?type=contents&metaData=${encodeURIComponent(metaData)}`;
      const { res: upstreamRadha, buffer: radhaBuf } = await fetchUpstreamResponse(radhaUrl, {
        method: 'GET',
        headers: {
          'User-Agent': req.headers['user-agent']?.toString() || DEFAULT_UA,
          Accept: 'application/json, text/plain, */*',
          Origin: UPSTREAM_ORIGIN,
          Referer: `${UPSTREAM_ORIGIN}/`,
        },
      });

      const ct = upstreamRadha.headers.get('content-type') || '';
      const text = radhaBuf.toString('utf8');
      // Never emit 502/503/504 so AI Studio's Cloud Run dev proxy doesn't replace JSON with <!doctype html>
      const safeStatus =
        upstreamRadha.status >= 502 && upstreamRadha.status <= 504 ? 422 : upstreamRadha.status;
      res.status(safeStatus);
      res.setHeader('Content-Type', ct.includes('json') ? ct : 'application/json; charset=UTF-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      if (ct.includes('text/html') && text.trimStart().startsWith('<')) {
        res.json({ success: false, error: 'Upstream content endpoint returned HTML.' });
        return;
      }
      res.send(text);
    } catch (err) {
      console.warn('Radha proxy error:', err instanceof Error ? err.message : String(err));
      res.status(422).json({ success: false, error: 'Radha content unavailable.' });
    }
  });

  // 4. Reverse proxy all other routes to https://s2-cdn.studyratna.cc
  app.all('*', async (req: Request, res: Response) => {
    const pathname = req.path.toLowerCase();
    const requestOrigin = getRequestOrigin(req);
    const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
    const isJsonApiRoute =
      pathname.startsWith('/api/') ||
      pathname.endsWith('/api.php') ||
      pathname.includes('/api/get_settings') ||
      isAjax;
    const isTokenManagerRoute = pathname.endsWith('/api/token-manager.php');

    try {
      const targetUrl = new URL(req.originalUrl, UPSTREAM_ORIGIN).toString();
      const headers = buildUpstreamHeaders(req);
      const hasBody = !['GET', 'HEAD'].includes(req.method.toUpperCase());
      const body =
        hasBody && Buffer.isBuffer(req.body) && req.body.length > 0
          ? new Uint8Array(req.body)
          : undefined;

      const { res: upstreamRes, buffer: upstreamBuf } = await fetchUpstreamResponse(targetUrl, {
        method: req.method,
        headers,
        body,
        redirect: 'manual',
      });

      const contentType = upstreamRes.headers.get('content-type') || '';

      // Handle upstream redirects safely (including key-gen shortlink & callback URLs)
      if (upstreamRes.status >= 300 && upstreamRes.status < 400) {
        const location = upstreamRes.headers.get('location');
        if (isJsonApiRoute && !contentType.includes('json')) {
          res.status(422).json({ success: false, error: 'Upstream API redirected unexpectedly.' });
          return;
        }
        if (location) {
          forwardSetCookies(upstreamRes, req, res);
          if (/(?:t\.me|telegram\.me|channel\.studyrays\.cc)/i.test(location)) {
            res.redirect(upstreamRes.status, TELEGRAM_URL);
            return;
          }
          const rewrittenLocation = rewriteUpstreamUrls(location, requestOrigin);
          res.redirect(upstreamRes.status, rewrittenLocation);
          return;
        }
      }

      // Guard JSON API routes so HTML error pages, security gates, or 502/503/504 never trigger <!doctype html>
      if (isJsonApiRoute && contentType.includes('text/html')) {
        const errHtml = upstreamBuf.toString('utf8');
        if (isSecurityGateHtml(errHtml, upstreamRes.status)) {
          forwardSetCookies(upstreamRes, req, res);
          res.status(403).json({
            success: false,
            security_gate: true,
            challenge_url: '/?__gb_gate=1',
            error: 'Security verification required.',
          });
          return;
        }
        const safeErrStatus =
          upstreamRes.status >= 400 && (upstreamRes.status < 502 || upstreamRes.status > 504)
            ? upstreamRes.status
            : 422;
        res.status(safeErrStatus).json({
          success: false,
          error: 'Upstream API temporarily unavailable.',
        });
        return;
      }

      // Auto-solve play.php anti-scraper cookie challenge server-side so lectures work in iframes & tabs
      if (pathname.endsWith('/play.php') && contentType.includes('text/html')) {
        const isHttps = isHttpsRequest(req);
        const cookieMap = parseCookieMap(headers.get('cookie') || '');
        const outgoingCookies = new Map<string, string>();
        let finalRes = upstreamRes;
        let finalHtml = upstreamBuf.toString('utf8');

        let gotFreshSession = false;
        const recordSetCookies = (resObj: globalThis.Response) => {
          const list =
            typeof resObj.headers.getSetCookie === 'function'
              ? resObj.headers.getSetCookie()
              : [];
          for (const rawCookie of list) {
            const pair = rawCookie.split(';')[0] || '';
            const eqIdx = pair.indexOf('=');
            if (eqIdx === -1) continue;
            const cName = pair.slice(0, eqIdx).trim();
            const cVal = pair.slice(eqIdx + 1).trim();
            if (cName) {
              if (cName.toUpperCase() === 'PHPSESSID') {
                gotFreshSession = true;
              }
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

          // If the first attempt with incoming cookies still returned a challenge,
          // the incoming PHPSESSID may be stale/expired — obtain a fresh session cleanly.
          if (attempt > 0 && !gotFreshSession) {
            cookieMap.clear();
            headers.delete('cookie');
            const freshFetch = await fetchUpstreamResponse(targetUrl, {
              method: req.method,
              headers,
              redirect: 'manual',
            });
            recordSetCookies(freshFetch.res);
            finalRes = freshFetch.res;
            finalHtml = freshFetch.buffer.toString('utf8');
            const freshChallenge = solvePlayChallenge(finalHtml);
            if (!freshChallenge) break;
            cookieMap.set(freshChallenge.cookieName, freshChallenge.cookieValue);
            outgoingCookies.set(
              freshChallenge.cookieName.toLowerCase(),
              rewriteSetCookieHeader(
                `${freshChallenge.cookieName}=${freshChallenge.cookieValue}; path=/; max-age=3600`,
                isHttps,
              ),
            );
          } else {
            cookieMap.set(challenge.cookieName, challenge.cookieValue);
            outgoingCookies.set(
              challenge.cookieName.toLowerCase(),
              rewriteSetCookieHeader(
                `${challenge.cookieName}=${challenge.cookieValue}; path=/; max-age=3600`,
                isHttps,
              ),
            );
          }

          headers.set('cookie', serializeCookieMap(cookieMap));
          const nextFetch = await fetchUpstreamResponse(targetUrl, {
            method: req.method,
            headers,
            redirect: 'manual',
          });
          recordSetCookies(nextFetch.res);
          finalRes = nextFetch.res;
          finalHtml = nextFetch.buffer.toString('utf8');
        }

        if (outgoingCookies.size > 0) {
          res.setHeader('Set-Cookie', Array.from(outgoingCookies.values()));
        }

        const effectivePwChk = cookieMap.get('_pw_sec_chk') || '';
        const playSid = savePlaySession(cookieMap);
        const playIsGate = isSecurityGateHtml(finalHtml, finalRes.status);
        res.status(playIsGate && finalRes.status === 503 ? 403 : finalRes.status);
        res.setHeader(
          'Content-Type',
          finalRes.headers.get('content-type') || 'text/html; charset=UTF-8',
        );
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        const playRewritten = rewriteHtml(finalHtml, requestOrigin);
        res.send(playIsGate ? playRewritten : injectPlayCookieSync(playRewritten, effectivePwChk, playSid));
        return;
      }

      forwardSetCookies(upstreamRes, req, res);

      // Rewrite HTML pages
      if (contentType.includes('text/html')) {
        const html = upstreamBuf.toString('utf8');
        const isGate = isSecurityGateHtml(html, upstreamRes.status);
        res.status(isGate && upstreamRes.status === 503 ? 403 : upstreamRes.status);
        res.setHeader('Content-Type', contentType);
        const cc = upstreamRes.headers.get('cache-control');
        if (cc) res.setHeader('Cache-Control', cc);
        const isMainUi = !isGate && (pathname === '/' || pathname === '/index.html');
        const rewritten = rewriteHtml(html, requestOrigin);
        res.send(isMainUi ? injectStylishUi(rewritten) : rewritten);
        return;
      }

      // Rewrite any first-party JS scripts (script-v43.js, shreee.js, start-dpp-test/script.js, etc.)
      if ((contentType.includes('javascript') || pathname.endsWith('.js')) && !pathname.includes('.min.')) {
        const js = upstreamBuf.toString('utf8');
        res.status(upstreamRes.status);
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        const processed = js.includes('Array.prototype.slice.call(arguments)')
          ? unlockObfuscatedScript(js)
          : patchPlainScript(js, requestOrigin);
        res.send(processed);
        return;
      }

      // Rewrite get_settings JSON response
      if (pathname.includes('/api/get_settings')) {
        const raw = upstreamBuf.toString('utf8');
        res.status(upstreamRes.status);
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.send(rewriteSettingsJson(raw, requestOrigin));
        return;
      }

      // Rewrite upstream origin callback URLs inside general JSON API responses (key generation / verification)
      if (contentType.includes('application/json') || contentType.includes('+json')) {
        const rawJson = upstreamBuf.toString('utf8');
        const rewrittenJson = rewriteUpstreamUrls(rawJson, requestOrigin);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        let outStatus = upstreamRes.status;
        if ((isJsonApiRoute || contentType.includes('json')) && outStatus >= 502 && outStatus <= 504) {
          outStatus = isTokenManagerRoute ? 200 : 422;
        }
        res.status(outStatus).send(rewrittenJson);
        return;
      }

      // Pass through all other assets & binary responses untouched
      const passHeaders = ['content-type', 'cache-control', 'etag', 'last-modified', 'content-disposition'];
      for (const h of passHeaders) {
        const val = upstreamRes.headers.get(h);
        if (val) res.setHeader(h, val);
      }

      let outStatus = upstreamRes.status;
      // AI Studio Cloud Run dev proxy intercepts 502/503/504 and replaces the body with <!doctype html>.
      // Map those gateway codes on JSON API routes so the client always receives clean JSON.
      if (isJsonApiRoute && outStatus >= 502 && outStatus <= 504) {
        outStatus = isTokenManagerRoute && contentType.includes('json') ? 200 : 422;
      }
      res.status(outStatus).send(upstreamBuf);
    } catch (err) {
      console.warn('Proxy upstream error:', req.originalUrl, err instanceof Error ? err.message : String(err));
      if (isJsonApiRoute) {
        res.status(422).json({ success: false, error: 'Upstream connection error. Please try again.' });
        return;
      }
      res.status(502).send('Upstream connection error. Please try again.');
    }
  });

  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`${BRAND_NAME} proxy server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
