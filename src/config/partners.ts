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
} as const;
