/**
 * One site, one hostname.
 *
 * ── WHY THIS EXISTS (2026-08-17)
 * This site was reachable, and serving 200, on four hostnames at once:
 *
 *   602medicare.com            ← the canonical one
 *   www.602medicare.com
 *   insuranceanthem.com        ← the domain the practice used two rebrands ago
 *   www.insuranceanthem.com
 *
 * Every one of them carried `<link rel="canonical">` pointing at
 * 602medicare.com, and that was not enough. A canonical tag is a HINT.
 * Google weighs it against everything else it knows and can overrule it — and
 * here it did: Search Console reported the 602medicare.com home page as "Not
 * indexed: Duplicate, Google chose different canonical than user", having
 * picked an entirely different domain of Brian's as the canonical instead.
 * The home page of the live site was not in the index at all.
 *
 * A 301 is not a hint. It removes the duplicate rather than asking Google to
 * please ignore it, and it passes the older domains' accumulated authority to
 * the one domain that should have it.
 *
 * ── WHAT IS DELIBERATELY NOT REDIRECTED
 * `*.pages.dev` is left alone. Every deploy is verified against its preview
 * URL before the custom domains are checked, and redirecting previews to
 * production would make that check silently test the wrong site — the kind of
 * green tick that hides a broken deploy. `localhost` is excluded for the same
 * reason during `wrangler pages dev`.
 *
 * ── THE PATH IS PRESERVED, ON PURPOSE
 * insuranceanthem.com serves this identical site, so every path on it exists
 * here too and a deep link should land on its own page rather than the home
 * page. (Contrast 480medicare.com, an old funnel on unrelated software, whose
 * paths do NOT exist here — that one is redirected to the root at the edge in
 * Cloudflare, not here.)
 */

const CANONICAL_HOST = "602medicare.com";

/** Hosts that must serve the site as-is rather than redirect. */
const isDevHost = (host: string) =>
  host.endsWith(".pages.dev") || host === "localhost" || host.startsWith("127.0.0.1");

/** Matches the shape used by functions/api/lead.ts — this project does not
    pull in @cloudflare/workers-types, so the context is declared locally. */
interface Context {
  request: Request;
  next: () => Promise<Response>;
}

export const onRequest = async (context: Context): Promise<Response> => {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();

  if (host !== CANONICAL_HOST && !isDevHost(host)) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    // 301, not 302: this is permanent, and only a permanent redirect
    // consolidates the old domains' ranking signals into this one.
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
};
