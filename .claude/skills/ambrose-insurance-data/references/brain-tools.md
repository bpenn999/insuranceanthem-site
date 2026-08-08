# Ambrose Brain — insurance-relevant tool catalog

Reference for the Ambrose Insurance Brain MCP. Always run `brain_catalog` live for the current,
complete list (it returns every source + tool with descriptions) and `brain_tool_schema` for exact
args before `brain_execute`. This file is a curated index of the sources most useful for insurance
content. As of last catalog read: **30 sources, ~179 tools.**

## Table of contents
- CMS.gov (Medicare & Medicaid)
- CMS Marketplace + Healthcare.gov (ACA)
- Medicaid.gov
- CDC Health Outcomes (PLACES)
- US Census Bureau
- Economic (BLS / FRED)
- Drug pricing (FDA / NADAC)
- Providers (hospitals, NPI, density)
- Federal Register (rules)
- Social determinants / HRSA
- HealthSherpa (ACA quoting)

## CMS.gov (Medicare & Medicaid) — `cms-gov`
- `cms_data_query` — query ANY CMS dataset (enrollment, drug spending, geographic variation).
- `cms_drug_spending` — Part D / Part B drug spending: total spend, beneficiary count, per-unit cost.
- `cms_medicare_enrollment` / `medicare_enrollment` — enrollment by facility type; drug-plan data.
- `cms_hospitals` — hospital star ratings, ownership, ER services (args: state, city, county, min_rating, hospital_type).
- `cms_nursing_homes`, `cms_hospice`, `cms_dialysis` — certified facilities with quality ratings.
- `cms_provider_query` / `cms_provider_schema` / `cms_search_provider_datasets` — DKAN provider data.
- `cms_search_data_datasets` — search the CMS Data API catalog.

## CMS Marketplace + Healthcare.gov (ACA) — `cms-marketplace`, `healthcare-gov`
- `aca_marketplace_plans` / `hcgov_aca_plans` — marketplace plans by state, metal level, year.
- `aca_premium_rates` / `hcgov_aca_rates` — premium rates by plan, age, rating area (Rate PUF).
- `hcgov_plan_attributes` — deductibles, OOP max, HSA eligibility, formulary URL, network type.
- `aca_service_areas` / `hcgov_service_areas` — which issuers serve which counties / rating areas.
- `hcgov_aca_benefits` — plan benefits & cost-sharing detail.
- `hcgov_search_datasets` / `hcgov_dataset_schema` / `hcgov_query` — discover & query any HC.gov dataset.

## Medicaid.gov — `medicaid-gov`
- `medicaid_eligibility` — FPL income thresholds by state & coverage group.
- `medicaid_enrollment` — Medicaid & CHIP enrollment / determinations.
- `medicaid_managed_care` — managed-care enrollment by program/plan.
- `medicaid_nadac_prices` — pharmacy acquisition cost (NADAC).

## CDC Health Outcomes (PLACES) — `health-outcomes`
- `cdc_county_health` — PLACES measures for a county (args: state, county, measures[], limit). Returns
  rates for diabetes, obesity, high blood pressure, coronary heart disease, arthritis, uninsured, etc.
  **The workhorse for chronic-disease charts.**
- `cdc_zip_health` — same, by ZIP (ZCTA).
- `cdc_health_snapshot` — comprehensive snapshot across categories for a county/zip.
- `cdc_list_measures` — all 47 PLACES measure IDs (call once to pick measure codes).
- `cdc_compare_counties` / `cdc_high_risk_areas` — rank counties by a measure.

Common measure IDs: `DIABETES`, `OBESITY`, `BPHIGH` (high blood pressure), `CHD` (coronary heart
disease), `ARTHRITIS`, `ACCESS2` (uninsured 18–64), `CSMOKING`, `DEPRESSION`.

## US Census Bureau — `census`
- `census_market_snapshot` — one-call profile for a county/zip: population, median age, median income,
  poverty rate, **uninsured count + rate**, insurance-agency establishment counts (args: state, county
  as 3-digit FIPS, or zip_code; year). Best single source for a "by the numbers" stat row.
- `census_demographics` — population, age, race/ethnicity, housing.
- `census_health_insurance` — insured/uninsured counts & rates, by coverage type.
- `census_income` — median household income, per-capita income, poverty.
- `census_business_counts` — establishments/employees/payroll by NAICS (e.g., insurance agencies 5242).

## Economic (BLS / FRED) — `economic`
- `healthcare_inflation` — Medical Care CPI vs All-Items CPI vs Medical Services vs Medical Commodities,
  with YoY change (args: months). Drives the "costs keep rising" narrative.
- `fred_series` / `fred_search` — FRED economic series (CPIMEDSL = medical care CPI, etc.).
- `bls_county_employment` — employment, establishments, wages by industry for a county.

## Drug pricing (FDA / NADAC) — `drug-pricing`
- `nadac_drug_costs` — National Average Drug Acquisition Cost (what pharmacies pay).
- `fda_drug_labels` — labels by brand/generic/manufacturer/ingredient.
- `fda_adverse_events` / `fda_adverse_event_counts` — FAERS adverse-event reports ("most common side effects").
- `fda_drug_recalls`, `fda_ndc_lookup` — recalls and NDC directory.

## Providers — `providers`
- `hospital_search` — Medicare-certified hospitals with 1–5 star ratings.
- `npi_provider_search` — NPPES NPI registry lookup for individual/organization providers.
- `provider_density` — count providers by specialty in an area ("how many PCPs near me").
- `nursing_home_search`, `home_health_search` — certified facilities with quality ratings.

## Federal Register (rules) — `federal-register`
- `federal_register_cms_latest` — latest CMS/HHS rules & notices (AEP, Part D, IRMAA, star-rating changes).
- `federal_register_ichra_rules` — ICHRA/HRA rulemaking (life/employer-benefit posts).
- `federal_register_marketplace_rules` — ACA/exchange rules.
- `federal_register_search` / `federal_register_document` — search / fetch by document number.

## Social determinants / HRSA — `social-determinants`
- `hrsa_shortage_areas` — Health Professional Shortage Areas (HPSAs) by state/county.
- `hrsa_health_centers` — Federally Qualified Health Centers (FQHCs).
- `hrsa_underserved_areas` — Medically Underserved Areas/Populations.
- `sdoh_indicators` — poverty, no-vehicle access, food access for a county/zip.

## HealthSherpa (ACA quoting) — `healthsherpa`
- `get_quote` — subsidy-aware household quotes (zip, income, ages).
- `plan_search` — ACA plans by state/county/metal level (no household).
- `list_enrollments` / `sync_clients` — agent's HealthSherpa book of business.

## Notes
- Results include `_meta.quotaHeaders` showing remaining per-minute/hour/day/week/month calls — budget accordingly.
- County args vary: CDC takes a county **name** ("Travis"); Census takes a 3-digit **FIPS** ("453").
  Always check `brain_tool_schema` first.
- For anything not covered here (FEMA, VA, SAM.gov, USAspending, NHTSA), run `brain_catalog` — the Brain
  reaches more sources than this index lists.
