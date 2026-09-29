// ─────────────────────────────────────────────────────────────────────────────
//  ATTRIBUTION — how did this visitor find the site?
// ─────────────────────────────────────────────────────────────────────────────
//  One question, answered once, on the first page of the first visit, and then
//  carried to whatever the visitor does next: a form, a booking, a tap on the
//  phone number. Those three get reported to the lead scoreboard (a separate
//  Worker, see reportConversion below) with the answer attached, which is what
//  turns "the site got 40 leads" into "31 of them came from Google".
//
//  ── WHAT IS STORED, AND WHERE
//  A first-party cookie, SITE_COOKIE, holding the channel, the referring host,
//  the landing path and the date. No visitor id, nothing about the person, and
//  nothing leaves the browser until the visitor submits something themselves.
//  On this site it is a SESSION cookie, always: it is gone when the browser
//  closes. There is no consent banner here to ask for anything longer, and
//  /privacy/ says what the cookie is in those terms — change one and you
//  change the other. (PERSIST_DAYS is what the sister sites use once a visitor
//  has accepted their banner.)
//
//  It is a cookie rather than sessionStorage for one reason: every form on the
//  site already posts to /api/lead, and a cookie rides along on those requests
//  by itself. No form had to change.
//
//  ── FIRST TOUCH WINS
//  The channel is set on the first visit and kept. The one exception: a visitor
//  first recorded as "direct" who later arrives from a search or a link is
//  re-filed under that, because "direct" only ever means "we could not tell".
//
//  This file is shared by the browser script (Attribution.astro) and the
//  server routes, so the classifier is written once and unit-tested once.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_COOKIE = "src_v1";
export const PERSIST_DAYS = 90;

export type Channel =
  | "organic-search" | "ai-search" | "paid-search" | "paid-social" | "social"
  | "email" | "referral" | "campaign" | "direct" | "unknown";

export interface Attribution {
  channel: Channel;
  source?: string;
  medium?: string;
  campaign?: string;
  /** Path of the first page of the first visit. */
  landing?: string;
  /** Referring host of the first visit. */
  referrer?: string;
  /** YYYY-MM-DD */
  first_seen?: string;
}

const CHANNELS: ReadonlySet<string> = new Set([
  "organic-search", "ai-search", "paid-search", "paid-social", "social",
  "email", "referral", "campaign", "direct", "unknown",
]);

export const CHANNEL_LABEL: Record<Channel, string> = {
  "organic-search": "Organic search",
  "ai-search": "AI assistant",
  "paid-search": "Paid search",
  "paid-social": "Paid social",
  social: "Social",
  email: "Email",
  referral: "Another website",
  campaign: "Campaign",
  direct: "Direct",
  unknown: "Unknown",
};

// Order matters where hosts overlap: gemini.google.com is an AI assistant and
// mail.google.com is email, and both would otherwise match "google".
const AI_HOSTS = /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|copilot\.com|you\.com|phind\.com|meta\.ai|grok\.com|deepseek\.com|chat\.mistral\.ai)$/;
const MAIL_HOSTS = /(^|\.)(mail\.google\.com|mail\.yahoo\.com|outlook\.live\.com|outlook\.office\.com|outlook\.office365\.com|mail\.aol\.com|mail\.proton\.me)$/;
const SEARCH_HOSTS = /(^|\.)(google\.[a-z.]{2,6}|bing\.com|duckduckgo\.com|yahoo\.com|yahoo\.co\.[a-z]{2}|search\.brave\.com|ecosia\.org|startpage\.com|aol\.com|yandex\.[a-z]{2,3}|baidu\.com|qwant\.com|kagi\.com)$/;
const SOCIAL_HOSTS = /(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com|instagram\.com|youtube\.com|youtu\.be|tiktok\.com|linkedin\.com|lnkd\.in|nextdoor\.com|x\.com|twitter\.com|t\.co|pinterest\.com|reddit\.com|threads\.net)$/;

const clip = (v: unknown, n: number): string => (typeof v === "string" ? v.trim().slice(0, n) : "");

/** "www.google.com" → "google", "l.facebook.com" → "facebook", "chatgpt.com" → "chatgpt.com" */
function sourceName(host: string, kind: "search" | "social" | "other"): string {
  const h = host.replace(/^(www|m|l|lm|mobile|search|out)\./, "");
  if (kind === "other") return h;
  if (/^yahoo\./.test(h)) return "yahoo";
  if (/^google\./.test(h)) return "google";
  if (h === "fb.com" || h === "fb.me") return "facebook";
  if (h === "youtu.be") return "youtube";
  if (h === "t.co" || h === "x.com") return "x";
  if (h === "lnkd.in") return "linkedin";
  return h.split(".")[0];
}

function hostOf(referrer: string): string {
  if (!referrer) return "";
  // Android in-app referrers are not URLs a browser can parse as http.
  const app = referrer.match(/^android-app:\/\/([a-z0-9._]+)/i);
  if (app) return `app:${app[1].toLowerCase()}`;
  try { return new URL(referrer).hostname.toLowerCase(); } catch { return ""; }
}

/**
 * Work out the channel from the landing URL's query string and the referrer.
 * Pure — no window, no document — so it runs in a test and on the server.
 */
export function classify(search: string, referrer: string, selfHost: string): Attribution {
  const q = new URLSearchParams(search || "");
  const p = (k: string) => clip(q.get(k) || "", 120).toLowerCase();
  const utmSource = p("utm_source");
  const utmMedium = p("utm_medium");
  const campaign = clip(q.get("utm_campaign") || "", 120);
  const host = hostOf(referrer);
  const base = { ...(campaign ? { campaign } : {}), ...(host ? { referrer: host } : {}) };

  // 1. Ad click ids. These are appended by the ad platform itself, so they are
  //    the most reliable signal there is.
  if (q.has("gclid") || q.has("gbraid") || q.has("wbraid")) {
    return { channel: "paid-search", source: utmSource || "google", medium: utmMedium || "cpc", ...base };
  }
  if (q.has("msclkid")) {
    return { channel: "paid-search", source: utmSource || "bing", medium: utmMedium || "cpc", ...base };
  }

  // 2. Campaign tags someone put on a link.
  if (utmSource || utmMedium) {
    const tagged = { source: utmSource || undefined, medium: utmMedium || undefined, ...base };
    const socialSource = SOCIAL_HOSTS.test(utmSource) || /^(facebook|fb|instagram|ig|youtube|tiktok|linkedin|nextdoor|twitter|x)$/.test(utmSource);
    if (/(^|[^a-z])(cpc|ppc|paid|paidsearch|display|banner|cpm|ads?)([^a-z]|$)/.test(utmMedium)) {
      return { channel: socialSource || /social/.test(utmMedium) ? "paid-social" : "paid-search", ...tagged };
    }
    if (/^e-?mail$|newsletter/.test(utmMedium)) return { channel: "email", ...tagged };
    if (AI_HOSTS.test(utmSource) || /^(chatgpt|perplexity|claude|gemini|copilot)$/.test(utmSource)) {
      return { channel: "ai-search", ...tagged };
    }
    // A Google Business Profile link is organic local search with a tag on it.
    if (utmMedium === "organic" || /^(gbp|gmb|google[-_ ]?business([-_ ]?profile)?|google[-_ ]?maps)$/.test(utmSource)) {
      return { channel: "organic-search", ...tagged, source: utmSource || "google" };
    }
    if (socialSource || /social/.test(utmMedium)) return { channel: "social", ...tagged };
    if (utmMedium === "referral") return { channel: "referral", ...tagged };
    return { channel: "campaign", ...tagged };
  }

  // 3. Facebook's own click id, on a link nobody tagged. Could be a post or an
  //    ad — it cannot be told apart from here, so it is filed as social.
  if (q.has("fbclid")) return { channel: "social", source: "facebook", ...base };

  // 4. The referrer.
  if (!host) return { channel: "direct" };
  if (host.startsWith("app:")) {
    if (/googlequicksearchbox|com\.google\.android\.googlequicksearchbox/.test(host)) return { channel: "organic-search", source: "google", referrer: host };
    if (/com\.google\.android\.gm|mail/.test(host)) return { channel: "email", source: host.slice(4), referrer: host };
    if (/facebook|instagram|linkedin|nextdoor|tiktok|twitter/.test(host)) return { channel: "social", source: host.slice(4), referrer: host };
    return { channel: "referral", source: host.slice(4), referrer: host };
  }
  const self = selfHost.toLowerCase().replace(/^www\./, "");
  if (host.replace(/^www\./, "") === self) return { channel: "direct" };
  if (AI_HOSTS.test(host)) return { channel: "ai-search", source: sourceName(host, "other"), referrer: host };
  if (MAIL_HOSTS.test(host)) return { channel: "email", source: sourceName(host, "other"), referrer: host };
  if (SEARCH_HOSTS.test(host)) return { channel: "organic-search", source: sourceName(host, "search"), referrer: host };
  if (SOCIAL_HOSTS.test(host)) return { channel: "social", source: sourceName(host, "social"), referrer: host };
  return { channel: "referral", source: sourceName(host, "other"), referrer: host };
}

/** Whether a fresh arrival should replace what is already on file. */
export function shouldReplace(existing: Attribution | null, fresh: Attribution): boolean {
  if (!existing) return true;
  return (existing.channel === "direct" || existing.channel === "unknown") && fresh.channel !== "direct";
}

/** Trust nothing in a cookie: it is visitor-editable text. */
export function sanitize(raw: unknown): Attribution | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const channel = typeof r.channel === "string" && CHANNELS.has(r.channel) ? (r.channel as Channel) : null;
  if (!channel) return null;
  const out: Attribution = { channel };
  const source = clip(r.source, 80); if (source) out.source = source;
  const medium = clip(r.medium, 60); if (medium) out.medium = medium;
  const campaign = clip(r.campaign, 120); if (campaign) out.campaign = campaign;
  const landing = clip(r.landing, 200); if (landing.startsWith("/")) out.landing = landing;
  const referrer = clip(r.referrer, 120); if (referrer) out.referrer = referrer;
  const seen = clip(r.first_seen, 10); if (/^\d{4}-\d{2}-\d{2}$/.test(seen)) out.first_seen = seen;
  return out;
}

export function encodeCookie(a: Attribution): string {
  return encodeURIComponent(JSON.stringify(a));
}

/** Read the attribution cookie out of a Cookie header (or document.cookie). */
export function readAttribution(cookieHeader: string | null | undefined): Attribution | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SITE_COOKIE}=([^;]+)`));
  if (!m) return null;
  try { return sanitize(JSON.parse(decodeURIComponent(m[1]))); } catch { return null; }
}

/** "Organic search (google)" — the line that goes into the CRM note. */
export function describeAttribution(a: Attribution | null): string {
  if (!a) return "";
  const label = CHANNEL_LABEL[a.channel];
  const detail = a.source || a.referrer;
  return detail && a.channel !== "direct" ? `${label} (${detail})` : label;
}

/** The lines added to a CRM note, so the source is on the contact itself. */
export function attributionNote(a: Attribution | null): string[] {
  if (!a) return [];
  const lines = [`Found us via: ${describeAttribution(a)}`];
  if (a.campaign) lines.push(`Campaign: ${a.campaign}`);
  if (a.landing) lines.push(`First page: ${a.landing}`);
  if (a.first_seen) lines.push(`First visit: ${a.first_seen}`);
  return lines;
}

// ── reporting to the scoreboard ──────────────────────────────────────────────

export interface ConversionContact {
  first?: string; last?: string; name?: string; phone?: string; email?: string;
}

export interface Conversion {
  site: string;
  type: "lead" | "booking" | "call_click";
  attr: Attribution | null;
  page?: string;
  form?: string;
  contact?: ConversionContact;
  appt?: { start: string; kind?: string; ref?: string };
}

export interface TrackEnv {
  /** https://…/e on the scoreboard Worker. */
  TRACK_URL?: string;
  TRACK_KEY?: string;
}

/**
 * Report one conversion. Never throws and never blocks the visitor: the
 * scoreboard is a record of what happened, and a lead is not allowed to fail
 * because the record-keeping did. Unset secrets mean tracking is simply off.
 */
export async function reportConversion(
  env: TrackEnv,
  event: Conversion,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!env?.TRACK_URL || !env?.TRACK_KEY) return false;
  try {
    const res = await fetchImpl(env.TRACK_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-track-key": env.TRACK_KEY },
      body: JSON.stringify({ ...event, attr: event.attr ?? { channel: "unknown" } }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Crawlers and link previewers follow tel: links and post forms. Not people. */
export function isBot(userAgent: string | null | undefined): boolean {
  return !userAgent || /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|facebookexternalhit|python|curl|wget/i.test(userAgent);
}
