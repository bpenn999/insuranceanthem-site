/**
 * Maricopa County health figures — CDC PLACES, verified against the source.
 *
 * WHY THESE LIVE ON THE HUB PAGE AND NOWHERE ELSE
 *
 * The four-pillar location-page standard asks every location page to carry real
 * local data with a figure, a year and an exact `.gov` endpoint. On a normal
 * multi-county site that is what stops city pages reading as templates. Here it
 * would do the opposite: all seven service-area cities sit in Maricopa County,
 * so county figures are IDENTICAL on all seven. Putting them on each city page
 * would add the same block seven times — which is precisely the near-duplicate
 * problem that had 18 pages sitting in "Discovered – currently not indexed" on
 * 2026-08-13. So: the county data appears once, on `/service-area/`, which is
 * the page whose actual subject is the county.
 *
 * PROVENANCE — every number below was read from the CDC API on 2026-08-18:
 *
 *   https://data.cdc.gov/resource/swc5-untb.json
 *     ?$where=locationname='Maricopa' AND stateabbr='AZ'
 *
 * `Crude prevalence` rows only, NOT age-adjusted — the dataset carries both for
 * every measure and they differ. Crude is the right one here: it is the share of
 * actual adults in this county, which is what a reader means when they ask how
 * common something is locally. Age-adjusted exists to compare counties with
 * different age structures, which is not the question this page answers.
 *
 * ⚠️ THESE ARE ADULTS 18 AND OVER, NOT SENIORS. PLACES has no 65+ cut, and the
 * real 65+ rate for most of these is materially higher. Every figure must be
 * labelled "adults 18 and over" wherever it is shown. Implying they describe
 * Medicare-age residents would overstate the case using real numbers, which is
 * the most durable way to be wrong. CLAUDE.md: never invent a statistic — that
 * covers mislabelling one.
 *
 * REFRESH: PLACES publishes annually. Re-run the query, update the values and
 * the `year` on each, and bump `retrieved`. Do not carry a figure forward with a
 * new date attached to it.
 */

export interface HealthMeasure {
  /** CDC PLACES measure id, e.g. BPHIGH — so a refresh can be matched up. */
  id: string;
  label: string;
  /** Crude prevalence, percent of adults 18+. */
  value: number;
  /** The survey year for THIS measure. They are not all the same. */
  year: number;
  /** Why a Medicare shopper should care. Not in the dataset — editorial. */
  soWhat: string;
}

export const countyHealth = {
  county: 'Maricopa County',
  fips: '04013',
  /** CDC's own population figure for the county, from the same rows. */
  population: 4_585_871,
  source: 'CDC PLACES: Local Data for Better Health, County Data',
  sourceUrl: 'https://www.cdc.gov/places/',
  datasetUrl: 'https://data.cdc.gov/d/swc5-untb',
  valueType: 'Crude prevalence, % of adults 18 and over',
  retrieved: '2026-08-18',
  measures: [
    {
      id: 'BPMED',
      label: 'Taking blood-pressure medication',
      value: 72.9,
      year: 2023,
      soWhat:
        'Among adults with high blood pressure. A maintenance prescription is the single most common reason a drug plan that looked cheap in January turns out not to be — formulary tier, not premium, is what decides the cost.',
    },
    {
      id: 'HIGHCHOL',
      label: 'High cholesterol',
      value: 36.5,
      year: 2023,
      soWhat:
        'Another long-term prescription, and another one whose tier can move between plan years without the premium moving at all.',
    },
    {
      id: 'BPHIGH',
      label: 'High blood pressure',
      value: 30.8,
      year: 2023,
      soWhat:
        'Common enough here that it is worth checking your specific medications against a plan formulary rather than assuming they are all covered the same way.',
    },
    {
      id: 'ARTHRITIS',
      label: 'Arthritis',
      value: 23.5,
      year: 2023,
      soWhat:
        'Points at orthopedics and rheumatology — specialties where which practice a plan contracts with matters more than what the plan advertises.',
    },
    {
      id: 'DIABETES',
      label: 'Diagnosed diabetes',
      value: 10.6,
      year: 2023,
      soWhat:
        'Brings both a drug plan question and a supplies question, and the two are not always answered by the same part of your coverage.',
    },
    {
      id: 'CHD',
      label: 'Coronary heart disease',
      value: 5.7,
      year: 2023,
      soWhat:
        'The clearest case for checking a named cardiologist against a network before enrolling rather than after.',
    },
  ] satisfies HealthMeasure[],
};

export default countyHealth;
