# JSON-LD Schema Library

Verbatim, copy-ready JSON-LD templates. Emit them in the shared layout's head slot (in Astro:
`<script type="application/ld+json" set:html={JSON.stringify(obj)} />`). Always build absolute URLs from
the site's canonical base (`site`/`Astro.site`). **Fill every `BRAND.*` placeholder from the project's
`BRAND.md`** — do not hardcode brand strings here.

**Contents**
1. Which schema for which content type
2. Organization (site-wide)
3. WebSite (site-wide)
4. WebPage (per page)
5. BreadcrumbList
6. Service (offer/landing pages)
7. FAQPage
8. Person (author)
9. BlogPosting / Article
10. HowTo
11. ItemList (related articles)
12. Validation notes

---

## 1. Which schema for which content type

| Content type | Required | Add when relevant |
| --- | --- | --- |
| Site-wide (shared layout) | Organization, WebSite | — |
| Marketing/info **Page** | WebPage, BreadcrumbList | Service, FAQPage |
| Offer / pricing / community page | WebPage, BreadcrumbList, Service, FAQPage | — |
| **Blog post** | BlogPosting, BreadcrumbList | FAQPage, HowTo, Person (author), ItemList |

Multiple JSON-LD blocks per page are valid and expected. Keep each block self-valid.

---

## 2. Organization (site-wide — emit once in the shared layout)

```js
const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': new URL('/#organization', site).href,
  name: BRAND.name,            // BRAND.md → Organization facts
  legalName: BRAND.legalName,
  url: site.href,
  logo: new URL(BRAND.logoPath, site).href,
  description: BRAND.description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BRAND.addressLocality,
    addressRegion: BRAND.addressRegion,
    addressCountry: BRAND.addressCountry,
  },
  sameAs: BRAND.sameAs,        // [] until profiles exist
};
```

## 3. WebSite (site-wide — emit once in the shared layout)

```js
const siteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': new URL('/#website', site).href,
  name: BRAND.name,
  url: site.href,
  publisher: { '@id': new URL('/#organization', site).href },
  inLanguage: 'en-US',
};
```

## 4. WebPage (per page)

```js
const pageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': new URL(Astro.url.pathname, site).href + '#webpage',
  url: new URL(Astro.url.pathname, site).href,
  name: title,             // the page <title> (brand suffix optional)
  description: description, // the meta description
  isPartOf: { '@id': new URL('/#website', site).href },
  about: { '@id': new URL('/#organization', site).href },
  inLanguage: 'en-US',
  breadcrumb: { '@id': new URL(Astro.url.pathname, site).href + '#breadcrumb' },
};
```

## 5. BreadcrumbList

```js
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': new URL(Astro.url.pathname, site).href + '#breadcrumb',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: site.href },
    // Blog example — add the section before the leaf:
    // { '@type': 'ListItem', position: 2, name: 'Blog', item: new URL('/blog/', site).href },
    { '@type': 'ListItem', position: 2, name: title, item: new URL(Astro.url.pathname, site).href },
  ],
};
```

## 6. Service (offer/community/training pages)

```js
const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: BRAND.serviceName,          // e.g. "<Brand> Community & AI Platform"
  serviceType: BRAND.serviceType,
  provider: { '@id': new URL('/#organization', site).href },
  areaServed: { '@type': 'Country', name: BRAND.areaServed },
  audience: { '@type': 'Audience', audienceType: BRAND.audienceType },
  description: BRAND.serviceDescription,
  offers: {
    '@type': 'Offer',
    price: BRAND.offerPrice,        // e.g. "97.00"
    priceCurrency: BRAND.offerCurrency, // e.g. "USD"
    url: BRAND.ctaUrl,              // primary CTA destination
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: BRAND.offerPrice,
      priceCurrency: BRAND.offerCurrency,
      billingDuration: 1,
      billingIncrement: 1,
      unitCode: 'MON',              // per month (drop for one-time offers)
    },
  },
};
```

## 7. FAQPage (build from the visible FAQ block — text MUST match)

```js
// faqItems: Array<{ question: string, answer: string }>
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};
```

Derive `faqItems` from the SAME data you render in the accordion (in Astro the blog reads `faq`
frontmatter) so schema and visible text never drift.

## 8. Person (blog author — when a real person is credited)

```js
const authorLd = {
  '@type': 'Person',
  name: post.data.author,
  description: post.data.authorBio, // optional, from frontmatter
  url: post.data.authorUrl,         // optional
  worksFor: { '@id': new URL('/#organization', site).href },
};
// If the author is just the brand, use { '@type': 'Organization', '@id': '.../#organization' } instead.
```

## 9. BlogPosting / Article

```js
const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.data.title,        // keep <= 110 chars
  description: post.data.description,
  datePublished: post.data.pubDate.toISOString(),
  dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
  author: authorLd,                 // Person (sec 8) or Organization @id
  publisher: {
    '@type': 'Organization',
    name: BRAND.name,
    logo: { '@type': 'ImageObject', url: new URL(BRAND.logoPath, site).href },
  },
  image: [coverSrc],
  mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  keywords: post.data.tags.join(', '),
  articleSection: post.data.tags[0] ?? BRAND.defaultSection,
  wordCount: wordCount,             // compute from rendered text
  inLanguage: 'en-US',
};
```

## 10. HowTo (ordered procedure on a post/page)

```js
// steps: Array<{ name: string, text: string }>
const howToLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: howToTitle,
  description: howToIntro,
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
};
```

## 11. ItemList (related articles, optional)

```js
const relatedLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: related.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: new URL(`/blog/${p.id}/`, site).href,
    name: p.data.title,
  })),
};
```

---

## 12. Validation notes
- Every JSON-LD block must be valid JSON and reflect content visible on the page. Mismatched FAQ/HowTo
  schema can trigger Google manual actions.
- Use stable `@id`s (`/#organization`, `…#webpage`, `…#breadcrumb`) so nodes reference each other.
- `headline` ≤ 110 chars; `image` ≥ 1200px wide; dates ISO 8601.
- Test with Google's Rich Results Test and the Schema.org validator before deploy.
- Keep site-wide nodes (Organization, WebSite) in the shared layout so they appear once per page.
