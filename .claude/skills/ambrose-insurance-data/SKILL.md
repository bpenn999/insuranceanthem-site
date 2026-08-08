---
name: ambrose-insurance-data
description: >-
  Fetch REAL, citable data from the Ambrose Insurance Brain MCP for insurance blog posts and pages —
  Medicare, ACA / Healthcare.gov marketplace, life insurance, ICHRA/HRA, Medicaid, and adjacent
  health-finance topics. Use this WHENEVER you are writing or researching insurance content and need
  a statistic, premium, plan count, county health figure, drug price, provider count, or program
  rule — even if the user just says "write a blog about Medicare", "add stats to this post", "what's
  the data for ACA in Texas", or "back this claim with a source". It maps each Brain tool to the
  blog use case it serves and shows how to turn the result into a cited stat callout, chart, or
  comparison table. Prefer this over inventing numbers; the Brain returns live federal/healthcare data
  you can quote and link. Pairs with seo-aeo-publishing, blog-write, blog-chart, and blog-geo.
---

# Ambrose Insurance Data — real numbers for insurance blogs

Insurance content lives and dies on trust. A blog post about Medicare or ACA that says "many seniors"
gets ignored by both readers and answer engines (ChatGPT, Perplexity, Google AI Overviews); a post that
says "28.0% of Travis County adults have high blood pressure (CDC PLACES, 2023)" gets quoted. The
**Ambrose Insurance Brain** is a federated MCP gateway to ~30 live U.S. federal & healthcare data
sources (~179 tools) — CMS Medicare, Healthcare.gov/ACA marketplace, Medicaid, CDC health outcomes,
Census, BLS, FDA/NADAC drug pricing, the NPI provider registry, the Federal Register, and more. This
skill is how you turn that firehose into one or two precise, sourced figures per claim.

**Golden rule: never fabricate a number.** Every statistic in an insurance post must come from the
Brain or an official `.gov` source, and must be cited with a real link. If the Brain can't answer it,
confirm with a federal-site web search; if neither can, describe it qualitatively instead.

## The 3-call workflow

The Brain is intentionally discoverable so you never guess tool names or arguments:

1. **`brain_catalog`** — call FIRST (takes no input). Lists every source and the tools it exposes, so
   you know exactly what's answerable for this post.
2. **`brain_tool_schema`** (`{tool: "<name>"}`) — get a tool's exact parameters before running it.
3. **`brain_execute`** (`{tool, arguments}`) — run one focused query and read the result.

For a quick, fuzzy ask you can also use **`ask_brain`** (`{input: "ACA Silver premiums in Travis County TX for 2026"}`) — it runs the Brain team and drafts an answer. Use `brain_execute` when you want
structured, quotable fields; use `ask_brain` when you're exploring.

> One focused `brain_execute` beats five exploratory ones. Decide the figure you need, pick the tool
> from the catalog, fetch it, quote it, link it.

## Tool → blog-use-case map, by field

Pick the tool by the claim you're trying to support. (Names are stable; always confirm args with
`brain_tool_schema`. A fuller catalog is in [references/brain-tools.md](references/brain-tools.md).)

### Medicare blogs
| You want to write about… | Brain tool | What it gives you |
|---|---|---|
| Local plan landscape / Part C, Part D plans by county | `aca_marketplace_plans`*, `cms_data_query`, `medicare_enrollment` | plan counts, issuers, enrollment |
| Medicare-certified hospital quality (network choice) | `cms_hospitals` / `hospital_search` | 1–5 star ratings, ownership, ER |
| Nursing homes / home health / dialysis / hospice quality | `cms_nursing_homes`, `home_health_search`, `cms_dialysis`, `cms_hospice` | quality ratings, staffing |
| Part D / Part B drug spending & trends | `cms_drug_spending` | total spend, beneficiaries, per-unit |
| What pharmacies actually pay for a drug | `nadac_drug_costs` | NADAC unit cost (great for Part D cost posts) |
| New CMS/Medicare rules (caps, AEP, IRMAA changes) | `federal_register_cms_latest`, `federal_register_search` | latest rules & effective dates |
| Provider supply ("how many cardiologists near me") | `provider_density`, `npi_provider_search` | counts by specialty / NPI lookup |

\*For Part C/D plan landscape also confirm current-year specifics (premiums, the Part D out-of-pocket
cap, AEP dates) with a Medicare.gov / CMS.gov web search — program rules change yearly.

### ACA / Healthcare.gov marketplace blogs
| Claim | Brain tool | Output |
|---|---|---|
| Marketplace plans by state/metal level/year | `hcgov_aca_plans`, `aca_marketplace_plans` | plan details, metal levels, issuers |
| Premium rates by age & rating area | `aca_premium_rates`, `hcgov_aca_rates` | individual rates, tobacco rates |
| Deductibles / OOP max / HSA eligibility / network type | `hcgov_plan_attributes` | detailed cost-sharing |
| Which issuers serve which counties | `aca_service_areas`, `hcgov_service_areas` | rating areas + issuers |
| Subsidy / household quote | `get_quote` (HealthSherpa), `marketplace_subsidy_estimate` | APTC-aware quotes |
| Uninsured rate for a market | `census_health_insurance`, `census_market_snapshot` | insured/uninsured counts & rate |

### Life insurance & ICHRA / employer blogs
| Claim | Brain tool | Output |
|---|---|---|
| ICHRA / HRA rules & rulemaking | `federal_register_ichra_rules` | individual-coverage HRA entries |
| Market demographics for targeting (income, age, housing) | `census_demographics`, `census_market_snapshot`, `census_income` | population, median age/income |
| Workforce / employer context (group vs individual) | `bls_county_employment`, `census_business_counts` | employment, establishments |
| Cost-of-care pressure driving life/health need | `healthcare_inflation`, `fred_series` | Medical Care CPI vs general CPI |
| Mortality / health-risk framing (chronic disease load) | `cdc_county_health`, `cdc_health_snapshot` | diabetes, BP, heart disease rates |

### Cross-cutting (any insurance niche)
- **Local health load → "why coverage matters here":** `cdc_county_health` (47 PLACES measures —
  diabetes, obesity, BP, CHD, uninsured) and `cdc_county_health` comparisons for a bar chart.
- **Market size & affordability:** `census_market_snapshot` (population, median income, uninsured rate,
  agency counts) — one call fills a whole "by the numbers" stat row.
- **Rising-cost narrative:** `healthcare_inflation` (Medical Care CPI YoY vs All-Items CPI).
- **Drug-cost angle:** `nadac_drug_costs`, `fda_drug_labels`, `fda_adverse_events`.
- **Access / equity angle:** `hrsa_shortage_areas`, `hrsa_health_centers`, `sdoh_indicators`.

## Turn Brain data into blog visuals (and cite it)

Fetching the number is half the job — answer engines and readers reward **stat callouts, charts, and
comparison tables**. Convert each Brain result into one of these and put a source line under it.

**Stat callout row** (3 real figures from `census_market_snapshot` + `healthcare_inflation`):
```astro
<div class="stats">
  <div class="stat"><div class="n">1.29M</div><div class="l">Travis County residents (U.S. Census, 2022)</div></div>
  <div class="stat"><div class="n">12.5%</div><div class="l">uninsured under 65 (Census, 2022)</div></div>
  <div class="stat"><div class="n">+2.16%</div><div class="l">medical-care inflation YoY (BLS Medical Care CPI, May 2026)</div></div>
</div>
```

**Accessible bar chart** from `cdc_county_health` (prevalence is 0–100, so width = value/scale):
```astro
const TRAVIS_HEALTH = [
  { label: "Obesity", value: 30.4 }, { label: "High blood pressure", value: 28.0 },
  { label: "Arthritis", value: 18.9 }, { label: "Diabetes (diagnosed)", value: 9.5 },
  { label: "Coronary heart disease", value: 4.6 },
];
<div class="chart">
  {TRAVIS_HEALTH.map((h) => (
    <div class="crow">
      <span class="cl">{h.label}</span>
      <span class="ct"><span class="cf" style={`width:${Math.round((h.value / 40) * 100)}%`}></span></span>
      <span class="cv">{h.value}%</span>
    </div>
  ))}
</div>
<p class="src">Source: CDC PLACES (2023), Travis County — via the Ambrose Insurance Brain.</p>
```
(These `.stats` / `.chart` classes ship in this repo's `src/styles/blog.css`. For other chart types use
the `blog-chart` skill.)

**Comparison table** is the highest-quoted block in AI answers — use it for hospital star ratings
(`cms_hospitals`), plan premiums (`aca_premium_rates`), or metal-tier costs.

**Wrap every Brain figure in a Dataset (Pillar 3 — the citation moat).** Every Brain figure used on a page
MUST also be wrapped in a `Dataset` JSON-LD block, with `creator.url` = the underlying authority endpoint
(CDC PLACES → `cdc.gov/places`, Census → `census.gov`, BLS → `bls.gov`, CMS → `cms.gov`/`medicare.gov`,
marketplace → `healthcare.gov`). The stat callout is the **visible** layer; the `Dataset` block is the
**citation moat** that earns the AI citation. Template:
```json
{"@context":"https://schema.org","@type":"Dataset","name":"<source dataset name>","description":"<1 sentence on what was pulled>","creator":{"@type":"Organization","name":"<source name>","url":"<exact endpoint URL>"},"license":"https://creativecommons.org/publicdomain/zero/1.0/","isAccessibleForFree":true}
```

**WebMCP (Pillar 4) — for data-driven sites.** The same Brain tools should also be exposed to agents via the
site's `/mcp` proxy (`/.well-known/mcp.json` + in-page `navigator.modelContext`), not just rendered as text —
so an AI agent can *call* the data, not only read it.

## Citation pattern (do this every time)
- Quote the exact figure **and the year** the Brain returned ("28.0%", "2023") — vague years read as stale.
- Link the underlying authority, not the Brain UI: CDC PLACES → `cdc.gov/places`, Census →
  `census.gov`, BLS → `bls.gov`, CMS → `cms.gov` / `medicare.gov`, marketplace → `healthcare.gov`.
- Add "via the Ambrose Insurance Brain" so the provenance is honest and repeatable.
- For current-year **program rules** (premiums, the Part D OOP cap, AEP/IEP dates, IRMAA brackets),
  confirm with a Medicare.gov / CMS.gov / Federal Register web search — these change annually and a
  cached figure can be wrong.

## Worked example (Medicare "turning 65 in Austin" post)
1. `brain_catalog` → confirm CDC, Census, CMS, economic sources are reachable.
2. `brain_execute` `cdc_county_health` `{state:"TX", county:"Travis", measures:["DIABETES","BPHIGH","OBESITY","CHD","ARTHRITIS","ACCESS2"]}` → chronic-condition bar chart.
3. `brain_execute` `census_market_snapshot` `{state:"TX", county:"453"}` → population 1,289,054; uninsured 12.5% → stat row.
4. `brain_execute` `healthcare_inflation` `{months:12}` → Medical Care CPI +2.16% YoY → "why the 2026 Part D cap matters" stat.
5. Web-search Medicare.gov to confirm the 2026 Part D out-of-pocket cap and AEP dates.
6. Write the post with answer-first formatting, the chart + stat row above, a sources list linking each
   `.gov` authority, and FAQPage/Article schema (see `seo-aeo-publishing`).

## Quotas & failure handling
The Brain enforces per-minute/hour/day quotas (shown in each result's `_meta.quotaHeaders`). Budget your
calls — one good query per figure. If a tool errors, is rate-limited, or the Brain connector isn't
available in the run, fall back to a federal-site web search (Medicare.gov, CMS.gov, CDC, Census, BLS,
SSA, Federal Register) and cite that government URL instead. Either way: real, cited, dated — or it
doesn't go in the post.
