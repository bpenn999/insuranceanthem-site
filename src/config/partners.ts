// Partner / referral links — ONE place for every off-site product we refer to,
// so the link can be found, audited and changed without grepping the site.
//
// geoBlue: Blue Cross Blue Shield Global Solutions (formerly GeoBlue) travel
// medical insurance. Brian is an appointed producer; `link_id` is his producer
// tracking parameter — keep it on the URL. Used by Footer.astro and the travel
// insurance blog posts. Mark every use rel="sponsored noopener" (referral link).
export const partners = {
  geoBlue: {
    name: 'Blue Cross Blue Shield Global Solutions (GeoBlue)',
    label: 'Travel Medical Insurance (GeoBlue)',
    url: 'https://bcbsglobalsolutions.com/individuals-and-families/?link_id=342181',
    disclosure:
      'Brian Penner is an appointed producer for Blue Cross Blue Shield Global Solutions travel medical plans and may be compensated if you purchase through this link. Travel medical insurance is not a Medicare plan and is not connected with or endorsed by the federal Medicare program.',
  },
  // ncdDental: NCD dental plans (underwritten by MetLife). 589020 is Brian's
  // agent enrollment ID, so keep it on the URL. Used by /dental-insurance/ and the
  // footer. Brian's rule: don't name the plan or carrier in benefit copy, so on
  // the pages this is "dental plans" + "up to $10,000 (select plans)".
  // Plan facts checked 2026-11-18 on ncd.com: the top plan has a $10,000
  // calendar-year max, no waiting periods for preventive/basic/major care,
  // 100% cleanings and $3,000/yr for implants. The lowest-priced plan starts
  // at $35/mo. Prices and availability vary by state.
  ncdDental: {
    name: "NCD dental plans (underwritten by MetLife)",
    label: "Dental Insurance — Enroll Online",
    url: "https://www.enrollment.ncd.com/589020",
    disclosure:
      "Brian Penner is a licensed insurance agent and may be compensated if you enroll through this link. Dental insurance is not a Medicare plan and is not connected with or endorsed by the federal Medicare program. Benefits, waiting periods, limitations, exclusions and prices vary by plan and state; the $10,000 annual maximum and no-waiting-period coverage are available on select plans only. Plans are not available in all states.",
  },
} as const;
