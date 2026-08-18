var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../src/lib/freebusy.ts
function busyFromFreeBusy(body) {
  const calendars = body?.calendars;
  if (!calendars || typeof calendars !== "object") {
    throw new Error("freebusy: no calendars in response");
  }
  const out = [];
  for (const [id, value] of Object.entries(calendars)) {
    const cal = value;
    const errors = cal?.errors;
    if (Array.isArray(errors) && errors.length) {
      const reason = errors[0]?.reason ?? "unknown";
      throw new Error(`freebusy: ${id} unreadable (${reason})`);
    }
    if (!Array.isArray(cal?.busy)) {
      throw new Error(`freebusy: ${id} returned no busy array`);
    }
    for (const b of cal.busy) {
      const start = Date.parse(String(b?.start));
      const end = Date.parse(String(b?.end));
      if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
        out.push({ start, end });
      }
    }
  }
  return out;
}
__name(busyFromFreeBusy, "busyFromFreeBusy");
function mergeIntervals(intervals) {
  if (intervals.length < 2) return [...intervals];
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const out = [{ ...sorted[0] }];
  for (const next of sorted.slice(1)) {
    const last = out[out.length - 1];
    if (next.start <= last.end) {
      last.end = Math.max(last.end, next.end);
    } else {
      out.push({ ...next });
    }
  }
  return out;
}
__name(mergeIntervals, "mergeIntervals");
function conflicts(slot, busy) {
  return busy.some((b) => slot.start < b.end && b.start < slot.end);
}
__name(conflicts, "conflicts");
function filterSlots(slots, busy) {
  const merged = mergeIntervals(busy);
  return slots.filter((s) => {
    const start = Date.parse(s?.startUtc);
    const end = Date.parse(s?.endUtc);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false;
    return !conflicts({ start, end }, merged);
  });
}
__name(filterSlots, "filterSlots");
function dayWindow(day, padHours = 24) {
  const base = Date.parse(`${day}T00:00:00Z`);
  if (!Number.isFinite(base)) throw new Error(`freebusy: bad day ${day}`);
  const pad = padHours * 36e5;
  return {
    timeMin: new Date(base - pad).toISOString(),
    timeMax: new Date(base + 864e5 + pad).toISOString()
  };
}
__name(dayWindow, "dayWindow");

// ../src/lib/booking.ts
function parseFreeSlots(body) {
  const days = /* @__PURE__ */ new Map();
  if (!body || typeof body !== "object") return days;
  for (const [k, v] of Object.entries(body)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
    const raw = v?.slots;
    const slots = Array.isArray(raw) ? raw.map(String).filter(Boolean) : [];
    if (slots.length) days.set(k, slots);
  }
  return days;
}
__name(parseFreeSlots, "parseFreeSlots");

// api/availability.ts
var GOGURUX = "https://roiypxggqlgbzrspkeoo.supabase.co";
var GOGURUX_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvaXlweGdncWxnYnpyc3BrZW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNDY3NTUsImV4cCI6MjA2MTYyMjc1NX0.KBULK0GoGRIXOW0uRFya8kLuiXaxpTsA5RW2tUlDOPY";
var LOCATION_SLUG = "medicareonmain-com";
var CALENDAR_SLUG = "602-medicare";
var DEFAULT_CALENDAR_ID = "brianinsuranceservices@gmail.com";
var FREE_SLOTS_API = "https://backend.leadconnectorhq.com";
var FREE_SLOTS_CALENDAR = "8CcYJMIVgaxb2XBKcKtk";
var DISPLAY_TZ = "America/Phoenix";
var DEFAULT_MINUTES = 30;
var TIMEOUT_MS = 8e3;
var json = /* @__PURE__ */ __name((status, body) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    // Availability is stale the moment someone else books. Never cache it.
    "Cache-Control": "no-store"
  }
}), "json");
var b64url = /* @__PURE__ */ __name((bytes) => {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const byte of b) s += String.fromCharCode(byte);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}, "b64url");
var b64urlText = /* @__PURE__ */ __name((text) => b64url(new TextEncoder().encode(text)), "b64urlText");
function pemToBytes(pem) {
  const body = pem.replace(/-----BEGIN [^-]+-----/, "").replace(/-----END [^-]+-----/, "").replace(/\s+/g, "");
  const raw = atob(body);
  const buffer = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return buffer;
}
__name(pemToBytes, "pemToBytes");
async function googleToken(saJson) {
  let sa;
  try {
    sa = JSON.parse(saJson);
  } catch {
    throw new Error("service account JSON does not parse");
  }
  if (!sa.client_email || !sa.private_key) {
    throw new Error("service account JSON has no client_email/private_key");
  }
  const now = Math.floor(Date.now() / 1e3);
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };
  const unsigned = `${b64urlText(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64urlText(JSON.stringify(claim))}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBytes(sa.private_key.replace(/\\n/g, "\n")),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned)
  );
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${b64url(sig)}`
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(`token exchange ${res.status} ${body.error ?? ""}`.trim());
  }
  return body.access_token;
}
__name(googleToken, "googleToken");
async function googleBusy(env, day) {
  const token = await googleToken(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const calendarId = env.GOOGLE_CALENDAR_ID || DEFAULT_CALENDAR_ID;
  const { timeMin, timeMax } = dayWindow(day);
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId }] }),
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!res.ok) throw new Error(`freebusy ${res.status}`);
  return busyFromFreeBusy(await res.json());
}
__name(googleBusy, "googleBusy");
async function freeSlots(day) {
  const startMs = Date.parse(`${day}T00:00:00-07:00`);
  if (!Number.isFinite(startMs)) throw new Error(`bad day ${day}`);
  const endMs = startMs + 864e5 - 1;
  const q = new URLSearchParams({
    startDate: String(startMs),
    endDate: String(endMs),
    timezone: DISPLAY_TZ
  });
  const res = await fetch(
    `${FREE_SLOTS_API}/calendars/${FREE_SLOTS_CALENDAR}/free-slots?${q}`,
    { headers: { accept: "application/json" }, signal: AbortSignal.timeout(TIMEOUT_MS) }
  );
  if (!res.ok) throw new Error(`free-slots ${res.status}`);
  const days = parseFreeSlots(await res.json());
  return days.get(day) ?? [];
}
__name(freeSlots, "freeSlots");
var onRequest = /* @__PURE__ */ __name(async ({ request, env }) => {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ success: false, error: "method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json; charset=utf-8", Allow: "GET" }
    });
  }
  const day = new URL(request.url).searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return json(400, { success: false, error: "date must be YYYY-MM-DD" });
  }
  const [slotsResult, calendarResult] = await Promise.allSettled([
    freeSlots(day),
    (async () => {
      const q = new URLSearchParams({
        date: day,
        duration: String(DEFAULT_MINUTES),
        location_slug: LOCATION_SLUG,
        calendar_slug: CALENDAR_SLUG
      });
      const res = await fetch(`${GOGURUX}/functions/v1/get-availability?${q}`, {
        headers: { Authorization: `Bearer ${GOGURUX_ANON}`, apikey: GOGURUX_ANON },
        signal: AbortSignal.timeout(TIMEOUT_MS)
      });
      if (!res.ok) throw new Error(`get-availability ${res.status}`);
      const body = await res.json();
      if (!body?.calendar) throw new Error("get-availability returned no calendar");
      return body.calendar;
    })()
  ]);
  if (slotsResult.status === "rejected") {
    console.error("availability: free-slots failed, withholding \u2014", String(slotsResult.reason));
    return json(502, { success: false, error: "availability unavailable" });
  }
  if (calendarResult.status === "rejected") {
    console.error("availability: calendar lookup failed \u2014", String(calendarResult.reason));
    return json(502, { success: false, error: "scheduler unavailable" });
  }
  const minutes = Number(calendarResult.value?.slot_duration) || DEFAULT_MINUTES;
  const raw = slotsResult.value.map((iso) => {
    const start = Date.parse(iso);
    if (!Number.isFinite(start)) return null;
    return {
      startUtc: new Date(start).toISOString(),
      endUtc: new Date(start + minutes * 6e4).toISOString(),
      available: true
    };
  }).filter((s) => s !== null);
  let slots = raw;
  let busy = [];
  if (env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      busy = await googleBusy(env, day);
      slots = filterSlots(raw, busy);
    } catch (err) {
      console.error("availability: optional diary check skipped \u2014", String(err));
    }
  }
  const dropped = raw.length - slots.length;
  if (dropped > 0) {
    console.log(
      `availability ${day}: diary check withheld ${dropped}/${raw.length} slot(s) the feed still listed, against ${mergeIntervals(busy).length} busy span(s)`
    );
  }
  return json(200, {
    success: true,
    calendar: calendarResult.value,
    slots,
    filtered: { offered: raw.length, withheld: dropped }
  });
}, "onRequest");

// api/lead.ts
var DEFAULT_SOURCE = "602medicare.com";
var UPSTREAM_TIMEOUT_MS = 1e4;
var json2 = /* @__PURE__ */ __name((status, body, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    // A lead POST is never cacheable, and never a thing to share cross-site.
    "Cache-Control": "no-store",
    ...headers
  }
}), "json");
var INTEREST_LABELS = {
  "turning-65": "Turning 65 \u2014 new to Medicare",
  review: "Has a plan, wants it reviewed",
  retiring: "Retiring / losing employer coverage",
  "new-to-area": "New to Arizona",
  rx: "Prescription costs went up",
  ltc: "Long-term care planning",
  "helping-parent": "Helping a parent",
  other: "Something else"
};
function clean(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}
__name(clean, "clean");
async function readFields(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out2 = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v === null || v === void 0) continue;
      out2[k] = typeof v === "string" ? v : String(v);
    }
    return out2;
  }
  const form = await request.formData();
  const out = {};
  for (const [k, v] of form.entries()) out[k] = typeof v === "string" ? v : "";
  return out;
}
__name(readFields, "readFields");
function splitName(full) {
  const parts = full.split(" ").filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}
__name(splitName, "splitName");
function buildNotes(f) {
  const interest = clean(f.coverage_interest || f.situation || f.intent);
  const lines = [];
  if (interest) lines.push(`Situation: ${INTEREST_LABELS[interest] || interest}`);
  if (clean(f.age)) lines.push(`Age: ${clean(f.age)}`);
  if (clean(f.rx)) lines.push(`Prescriptions: ${clean(f.rx)}`);
  const message = clean(f.message);
  if (message) lines.push(`Message: ${message}`);
  const consented = ["on", "true", "yes", "1"].includes(clean(f.consent).toLowerCase());
  lines.push(
    consented ? `TCPA consent given on the website form at ${(/* @__PURE__ */ new Date()).toISOString()}.` : "No TCPA consent checkbox recorded with this submission."
  );
  return lines.join("\n");
}
__name(buildNotes, "buildNotes");
var onRequest2 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  if (request.method !== "POST") {
    return json2(405, { ok: false, error: "Method not allowed" }, { Allow: "POST" });
  }
  const origin = request.headers.get("origin");
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = "";
    }
    if (originHost !== new URL(request.url).host) {
      return json2(403, { ok: false, error: "Cross-origin submissions are not accepted" });
    }
  }
  let fields;
  try {
    fields = await readFields(request);
  } catch {
    return json2(400, { ok: false, error: "Could not read the submission body" });
  }
  const email = clean(fields.email);
  const phone = clean(fields.phone);
  if (!email && !phone) {
    return json2(400, { ok: false, error: "An email address or a phone number is required" });
  }
  const named = splitName(clean(fields.name));
  const first = clean(fields.first || fields.first_name) || named.first;
  const last = clean(fields.last || fields.last_name) || named.last;
  const payload = {
    contact: {
      first_name: first,
      last_name: last,
      email,
      phone,
      zip: clean(fields.zip)
    },
    source: clean(fields.source) || DEFAULT_SOURCE,
    notes: buildNotes(fields)
  };
  const webhook = env.GOGURUX_WEBHOOK_URL;
  if (!webhook) {
    console.error("GOGURUX_WEBHOOK_URL is not set \u2014 lead not relayed");
    return json2(502, { ok: false, error: "Lead relay is not configured" });
  }
  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    });
    if (!upstream.ok) {
      console.error(`GoGuruX rejected the lead: ${upstream.status}`);
      return json2(502, {
        ok: false,
        error: "The CRM did not accept the submission",
        upstream_status: upstream.status
      });
    }
    return json2(200, { ok: true });
  } catch (err) {
    console.error("GoGuruX relay failed", err);
    return json2(502, { ok: false, error: "The CRM could not be reached" });
  }
}, "onRequest");

// _middleware.ts
var CANONICAL_HOST = "602medicare.com";
var isDevHost = /* @__PURE__ */ __name((host) => host.endsWith(".pages.dev") || host === "localhost" || host.startsWith("127.0.0.1"), "isDevHost");
var onRequest3 = /* @__PURE__ */ __name(async (context) => {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();
  if (host !== CANONICAL_HOST && !isDevHost(host)) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}, "onRequest");

// ../.wrangler/tmp/pages-GOJ3pC/functionsRoutes-0.1822219176504195.mjs
var routes = [
  {
    routePath: "/api/availability",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/lead",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest3],
    modules: []
  }
];

// ../../../../.npm/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
