---
name: webmcp
description: >-
  Make every page of a website usable by AI agents (in-browser assistants, ChatGPT/Claude operators,
  agentic browsers) by exposing its key actions as WebMCP tools. ALWAYS use this when creating or editing
  ANY page, and before a build/deploy, so each page ships "proper WebMCP" — even when the user just says
  "add a page", "wire up WebMCP", "make the site agent-ready", "expose tools for AI", or "add the AI
  widget". Covers the webmcp.dev JS library (works today) AND the emerging native
  navigator.modelContext standard, tool/prompt/resource design, per-page tool checklist, the
  .well-known manifest, and the security model. Tool names/descriptions must follow the brand voice in
  the project's BRAND.md, so load the brand-identity skill first.
---

# WebMCP — make each page agent-ready

WebMCP (Web Model Context Protocol) lets a website expose typed, callable **tools** (plus prompts and
resources) to AI agents running in or alongside the browser. Instead of an agent scraping the DOM and
guessing, the page hands it clean function calls — "search plans", "start checkout", "open the join
flow" — and gets back structured results. The goal: **every page declares the meaningful actions a user
could take on it, so an agent can complete tasks reliably.**

**Load `brand-identity` first.** Tool names and descriptions are user-facing surface area for agents —
they must match the brand voice and naming in `BRAND.md` (e.g. CTA wording, product names). Don't invent
brand strings here.

## Two implementations — pick by need, design for both

The mental model is identical (MCP-style tools that return a `content` array), so write handlers that
work for either.

### A) webmcp.dev library — recommended, works in any browser today
Jason McGhee's open-source library (`https://github.com/jasonjmcghee/WebMCP`, site: `https://webmcp.dev`).
Drop in a script, register tools/prompts/resources, and an agent can connect through its bridge.

```html
<script src="/scripts/webmcp.js"></script>
<script>
  const mcp = new WebMCP({ position: 'bottom-right' }); // optional widget config

  mcp.registerTool(
    'startCheckout',
    'Begin the membership signup/checkout. Use when the user wants to join or subscribe.',
    { plan: { type: 'string' } },                 // inputSchema (JSON Schema)
    function (args) {
      window.location.href = CHECKOUT_URL;         // perform the action
      return { content: [{ type: 'text', text: 'Opening checkout…' }] };
    }
  );
</script>
```
It also supports `mcp.registerPrompt(name, description, args, handler)` (returns `{ messages: [...] }`)
and `mcp.registerResource(name, description, { uri, mimeType }, handler)` (returns `{ contents: [...] }`).

### B) Native `navigator.modelContext` — the W3C Community Group standard
A browser-native API (Edge 147 ships it; Chrome 149 origin trial as of 2026; not yet a finalized
standard). Feature-detect and progressively enhance:

```js
if ('modelContext' in navigator) {
  navigator.modelContext.registerTool({
    name: 'searchPlans',
    description: 'Search available plans by keyword. Use when the user is looking for coverage options.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
    annotations: { readOnlyHint: true },          // mark non-mutating tools
    execute: async (input, client) => {
      const results = await searchPlans(input.query);
      return { content: [{ type: 'text', text: JSON.stringify(results) }] };
    },
  });
}
// unregister when the action goes away: navigator.modelContext.unregisterTool('searchPlans')
```
Native also supports a **declarative form** path (annotate an existing `<form>`):
```html
<form toolname="contactSupport"
      tooldescription="Send a message to support. Use when the user needs help with an order or account.">
```

> **Recommended for this site:** ship the **webmcp.dev** library now for working agent support, and where
> a native form maps cleanly to a real `<form>`, add `toolname`/`tooldescription` too. Keep every handler
> returning the same `{ content: [{ type: 'text', text }] }` shape so a future switch to the native API
> is mechanical.

## Designing good tools

- **One tool per meaningful action**, named in **camelCase** like a function: `searchPlans`, `startCheckout`,
  `openJoinFlow`, `subscribeNewsletter`, `bookCall`, `filterPosts`. Treat the name as an API.
- **Descriptions convey intent + when to use it**, not field names. "Submit form" is useless; write
  "Send a message to support. Use when the user wants help with an order or account." For dynamic pages,
  bake current context into the description (e.g. "Add the currently displayed item (SKU 1234, $97/mo) to
  the cart.").
- **inputSchema is JSON Schema** — types, `required`, `minimum`, `default`, enums. The agent fills it; you
  validate it. Treat all agent input as untrusted.
- **Return structured results** in the `content` array (`type: 'text'`, JSON-stringified data is fine).
  Report success/failure clearly so the agent knows what happened.
- **Mark read-only tools** with `annotations: { readOnlyHint: true }`; reserve writes/navigations for
  explicit user-intent tools, and confirm destructive actions (native: `client.requestUserInteraction`).

## What each page type should expose (per-page checklist)

Map tools to the page's real jobs-to-be-done. Aim for the few actions that matter, not dozens.

- **Home / landing:** `openJoinFlow`/`startCheckout` (primary CTA from `BRAND.md`), `getOverview`
  (read-only summary of the offer), `goToSection`.
- **Offer / pricing / community page:** `startCheckout`, `getPricing` (read-only), `getFaqs` (read-only),
  `contactSupport`.
- **Blog index:** `searchPosts`/`filterByTag` (read-only), `getLatestPosts` (read-only).
- **Blog post:** `getArticleSummary` (read-only), `getArticleFaqs` (read-only), `subscribe`/`startCheckout`.
- **Contact / lead forms:** the declarative `toolname`/`tooldescription` on the `<form>`, or an imperative
  `submitContact` tool with a validated schema.
- **Every page:** a read-only `getPageContext` returning page title, purpose, and primary CTA, so an agent
  can orient quickly.

## Discovery manifest (when using the native path)

Serve a static manifest so agents can discover tools without executing JS:
- Path: **`/.well-known/webmcp`**, `Content-Type: application/json`, keep it **< 64 KB**.
- List tool `name` + `description` (and optionally schema) for the site's stable tools.
- In Astro, place it at `public/.well-known/webmcp` so it's served verbatim.

## Security model (non-negotiable)

- **HTTPS only** — the native API requires a secure context; serve the library over HTTPS too.
- **Top-level pages only** — iframes can't be providers; register from the top document.
- **Validate every input** against the schema; never trust agent-supplied args. Don't expose tools that
  bypass auth, leak PII, or perform irreversible actions without explicit confirmation.
- **Gate by state** — register tools only when their action is actually available (authenticated,
  in-stock, form present). On SPA route changes, **`unregisterTool` on unmount** so agents never call
  stale tools. Removing a hidden form from the DOM is the right way to retract a declarative tool —
  `display:none` still registers.
- **No security-by-analytics** — flags like "was this agent-invoked" are telemetry, not authorization.

## Implementing on this site (Astro)

Centralize so every page gets WebMCP consistently:
1. Add the webmcp.dev script to `public/scripts/webmcp.js` (or load from CDN) and include it from the
   shared layout (`src/layouts/BaseLayout.astro`) via the `head` slot or a `<script>`.
2. Create a small `src/components/WebMCP.astro` (or a module in `src/scripts/`) that registers the
   site-wide tools (`getPageContext`, `startCheckout`/`openJoinFlow` using the CTA from `BRAND.md`).
3. Let each page/section pass its page-specific tools (e.g. the blog index registers `searchPosts`).
4. Feature-detect the native API and register there too, reusing the same handlers.
5. Add `public/.well-known/webmcp` listing the stable site-wide tools.

## Pre-publish gate (WebMCP)
- [ ] Loaded `brand-identity`; tool names/descriptions match `BRAND.md` voice and CTA wording.
- [ ] Page's key actions are each exposed as a clearly-named tool with an intent-rich description.
- [ ] Each tool has a valid JSON-Schema `inputSchema`; inputs are validated in the handler.
- [ ] Handlers return a structured `content` array; read-only tools carry `readOnlyHint`.
- [ ] Tools are gated by availability and unregistered on unmount/route change (no stale tools).
- [ ] HTTPS, top-level registration; no tool bypasses auth or does irreversible work without confirmation.
- [ ] (Native path) `/.well-known/webmcp` manifest present and < 64 KB.
- [ ] Production build passes; a manual agent/console test confirms a tool actually runs.

## References
- Library: https://webmcp.dev · https://github.com/jasonjmcghee/WebMCP
- Standard: W3C Web Machine Learning CG "Web Model Context API" (`navigator.modelContext`).
