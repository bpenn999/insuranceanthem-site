---
layout: ../../layouts/BlogLayout.astro
title: 'Does Medicare cover ambulance rides in Peoria, AZ?'
seoTitle: 'Does Medicare Cover Ambulance Rides?'
description: 'Yes — Part B covers a medically necessary ambulance ride, but only to the nearest appropriate facility. You pay the Part B deductible, then 20%.'
summary: 'Medicare pays for the ambulance when travelling any other way would endanger your health — and then adds a condition almost nobody hears until the bill arrives: it covers the trip to the nearest appropriate facility, not to the hospital where your doctor practices. In north Peoria, where a great many households drive to Arrowhead or Sun City for specialist care, that distinction has teeth. Arizona adds a wrinkle no other state does.'
category: Coverage
publishedAt: 2026-09-02
readMinutes: 10
image: /blog/does-medicare-cover-ambulance-rides-peoria-2026.png
imageAlt: '602Medicare article card reading "Does Medicare cover ambulance rides?", with the 602Medicare badge and a byline for Brian Penner, Licensed Independent Medicare Advisor.'
faqs:
  - q: Does Medicare cover ambulance rides?
    a: Yes, within limits. Medicare Part B covers ground ambulance transportation when travelling in any other vehicle could endanger your health and you need medically necessary services from a hospital, a critical access hospital, a rural emergency hospital or a skilled nursing facility. Medicare states the boundary plainly on the same page — it will only cover ambulance services to the nearest appropriate medical facility that is able to give you the care you need. The ride is covered because it is medically necessary transport, not because you called 911.
  - q: How much does an ambulance ride cost with Medicare?
    a: On Original Medicare, after you meet the Part B deductible you pay 20% of the Medicare-approved amount for the ambulance service. The Medicare-approved amount is not the number the ambulance service prints on its own invoice, which is why the bill and the Medicare Summary Notice rarely resemble each other. On a Medicare Advantage plan the arithmetic is different — most plans charge a set copay per one-way trip instead of a percentage, and the amount is written in your plan's benefit summary.
  - q: Can I choose which hospital the ambulance takes me to?
    a: You can ask, and in a genuine emergency the crew will weigh it. What you cannot do is make Medicare pay the extra distance. Medicare's own policy manual is explicit that only mileage to the nearest appropriate facility is covered, that transport to a more distant hospital solely to reach a specific physician does not make that hospital the nearest appropriate one, and that whether your doctor holds staff privileges somewhere is not a factor. The exception is real but narrow — a higher level of trauma care or a specialized service available only at the farther hospital.
  - q: Does Medicare cover an ambulance to a doctor's appointment or dialysis?
    a: Sometimes, and it is treated as a separate category. Medicare may pay for medically necessary non-emergency ambulance transport when you have a written order from your doctor saying the transport is medically necessary — the example Medicare itself gives is a person with end-stage renal disease who needs ambulance transport to and from dialysis. Repetitive scheduled trips can also fall under a prior-authorization demonstration, where the ambulance company asks Medicare in advance whether the service is likely to be covered.
  - q: Does Medicare Advantage cover ambulance rides?
    a: It has to. Medicare Advantage plans deliver your Part A and Part B benefits, so ambulance coverage is not optional for them. What changes is the cost sharing and the paperwork — a flat per-trip copay rather than 20%, plan rules that can require prior authorization for non-emergency transport, and an appeals process that runs through the plan rather than through Medicare. Emergency care is the part you should not have to think about at the moment it happens; the plan documents are where to check the rest.
  - q: Does Medicare pay for a medical helicopter?
    a: It can. Medicare may pay for emergency ambulance transportation by airplane or helicopter if you need immediate and rapid transport that ground transportation cannot provide. That is a medical judgment about your condition and the time involved, not a convenience option you can elect. When it is covered it is covered under Part B on the same terms as a ground trip — the deductible, then 20% of the approved amount.
sources:
  - label: 'Medicare.gov — Ambulance services coverage'
    url: https://www.medicare.gov/coverage/ambulance-services
  - label: 'CMS — Medicare Benefit Policy Manual, Chapter 10: Ambulance Services'
    url: https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/bp102c10.pdf
  - label: 'CMS — Medicare provider compliance tips: ambulance services'
    url: https://www.cms.gov/training-education/medicare-learning-networkr-mln/compliance/medicare-provider-compliance-tips/ambulance-services
  - label: 'Medicare.gov — Emergency department services'
    url: https://www.medicare.gov/coverage/emergency-department-services
  - label: 'Medicare.gov — Medigap basics'
    url: https://www.medicare.gov/health-drug-plans/medigap/basics
  - label: 'A.R.S. § 36-2232 — Director; regulation of ambulance services; rates'
    url: https://www.azleg.gov/ars/36/02232.htm
  - label: 'A.R.S. § 36-2239 — Ambulance services; rates; charges; civil penalty'
    url: https://www.azleg.gov/ars/36/02239.htm
  - label: 'Arizona Department of Health Services — Ground Ambulance Certificate of Necessity program'
    url: https://www.azdhs.gov/documents/preparedness/emergency-medical-services-trauma-system/ambulance/ground/CONGeneralInformation.pdf
  - label: 'City of Peoria — Fire-Medical ambulance service'
    url: https://www.peoriaaz.gov/government/departments/fire-medical/ambulance-service
---

**Yes — Medicare Part B covers a medically necessary ambulance ride. It covers it to the nearest appropriate medical facility, and that last phrase is the whole article.**

Medicare's own wording is short enough to quote in full. Part B covers ground ambulance transportation "when traveling in any other vehicle could endanger your health," and you need medically necessary care from a hospital, a critical access hospital, a rural emergency hospital or a skilled nursing facility. Then, two sentences later: "Medicare will only cover ambulance services to the nearest appropriate medical facility that's able to give you the care you need."

Nobody reads that second sentence until afterwards. In north Peoria it matters more than in most places, because a great many households here do not use the nearest hospital for anything. They drive to Arrowhead, or south into Sun City, because that is where the cardiologist and the orthopedist sit. Then one morning the ambulance comes to 85383, and the ambulance is not going where the appointments go.

## What Medicare actually pays on Original Medicare

The cost side is the simple half. After you meet the Part B deductible, you pay {{partB.coinsurance}} of the Medicare-approved amount for the ambulance service — the same coinsurance structure as almost everything else under Part B.

<div class="table-scroll">
<table>
  <caption class="sr-only">What Original Medicare pays for ambulance transport in {{year}}, by type of trip</caption>
  <thead>
    <tr><th scope="col">Type of trip</th><th scope="col">Covered by Part B?</th><th scope="col">What you pay</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Emergency ground transport</strong> to a hospital, critical access hospital, rural emergency hospital or SNF</td>
      <td><strong>Yes</strong>, when other transport would endanger your health</td>
      <td>Part B deductible, then {{partB.coinsurance}} of the approved amount</td>
    </tr>
    <tr>
      <td><strong>Mileage beyond the nearest appropriate facility</strong></td>
      <td>Generally no</td>
      <td>The extra distance is not covered</td>
    </tr>
    <tr>
      <td><strong>Non-emergency transport</strong> with a doctor's written order</td>
      <td>Sometimes, when documented as medically necessary</td>
      <td>Part B deductible, then {{partB.coinsurance}} — if it is covered</td>
    </tr>
    <tr>
      <td><strong>Air ambulance</strong> (plane or helicopter)</td>
      <td>Yes, when ground transport cannot provide the speed you need</td>
      <td>Part B deductible, then {{partB.coinsurance}} of the approved amount</td>
    </tr>
    <tr>
      <td><strong>A ride you wanted rather than needed</strong> — no medical necessity</td>
      <td>No</td>
      <td>All of it</td>
    </tr>
  </tbody>
</table>
</div>
<p class="table-source">Sources: Medicare.gov ambulance services coverage page and the CMS Medicare Benefit Policy Manual, Chapter 10.</p>

Two numbers underneath that table are worth holding onto, because they are the ones people get wrong. The Part B deductible in {{year}} is {{partB.deductible}} for the year — not per trip, and not per emergency. And the coinsurance is {{partB.coinsurance}} of the *Medicare-approved amount*, which is not the figure the ambulance service prints on its own paperwork. Those two documents arriving a fortnight apart, saying different things, is the single most common reason somebody calls me about an ambulance bill.

## "Nearest appropriate facility" is stricter than it sounds

This is the part that catches people, and CMS has written it out at unusual length. The Medicare Benefit Policy Manual sets the general rule first: only local transportation by ambulance is covered, and therefore only mileage to the nearest appropriate facility equipped to treat the patient.

Then it closes the doors people try.

- **Your doctor's hospital is not automatically the right hospital.** The manual states that whether a particular physician has staff privileges at a hospital "is not a consideration" in deciding whether that hospital has appropriate facilities. Ambulance service to a more distant hospital "solely to avail a patient of the service of a specific physician or physician specialist" does not make that hospital the nearest appropriate one.
- **Better is not the same as necessary.** The fact that a more distant institution is better equipped, "either qualitatively or quantitatively," does not mean the closer one lacks appropriate facilities.
- **There is a real exception, and it is narrow.** A finding for the farther hospital *is* warranted if your condition requires a higher level of trauma care or another specialized service available only there. A stroke or trauma protocol that routes past the nearest emergency department is that exception working as designed, not a billing problem.
- **If two hospitals both qualify, you are fine.** Where two or more facilities can treat you appropriately and each one's locality takes in the place where the ambulance picked you up, full mileage to either is covered.

That last bullet is why this is less alarming in central Peoria than it sounds, and more consequential at the northern edge. The further out toward Vistancia, Blackstone and the Lake Pleasant Parkway corridor you go, the more the map thins, and the more the ambulance's answer and your calendar's answer come apart.

The practical version: **an ambulance is a medical decision, and the hospital it chooses is a medical decision too.** Your plan's network, your specialist's admitting privileges and your own preference are not inputs to it. Which is exactly why the network question belongs in October, when you can still do something about it, rather than in the back of the ambulance. If you have never checked how far your plan's network actually reaches, [how Medicare Advantage networks work](/learn/medicare-advantage-networks/) is the twenty minutes that pays for itself.

## Arizona sets the price of the ride, and most states do not

Here is something genuinely local, and it is the reason ambulance bills in Arizona behave differently from the horror stories you read about elsewhere.

Ground ambulance services in Arizona operate under a Certificate of Necessity issued by the Arizona Department of Health Services — a license describing the geographic service area, the level of service, hours of operation and response times. And under state law, the department does not merely license them. It prices them.

<div class="stat-callout">
  <p class="stat-callout__figure">Arizona fixes ambulance rates by statute — the base rate, the mileage and the waiting time</p>
  <p class="stat-callout__body">A.R.S. § 36-2232 directs the department to "determine, fix, alter and regulate just, reasonable and sufficient rates and charges for the provision of ambulances," naming advanced life support, basic life support, patient loaded mileage and standby waiting. A.R.S. § 36-2239 then closes the loop: an ambulance service "shall not charge, demand or collect any remuneration for any service greater or less than or different from the rate or charge determined and fixed by the department."</p>
  <p class="stat-callout__cite">Source: Arizona Revised Statutes §§ 36-2232 and 36-2239, via azleg.gov. Verified September 2026.</p>
</div>

Read that carefully, because it cuts both ways. It means an Arizona ambulance service cannot invent a number for your ride — the ceiling is set by the state, publicly, in a rate proceeding. It does **not** mean the state rate and the Medicare-approved amount are the same figure. They are set by two different governments for two different purposes, and where the state-approved charge sits above what Medicare approves, the gap is what your supplement or your plan is for.

In Peoria specifically, the ambulance that comes is generally the city's own: Peoria Fire-Medical runs the municipal ambulance service under that state certificate, across a service area that reaches from the 85345 core all the way north through Vistancia. So the vehicle is a city asset, the rate is a state number, and the coverage is a federal rule. Three levels of government in one ride, which is a fair summary of Medicare generally.

## Non-emergency transport is a different animal

Most of what goes wrong financially is not the 911 call. It is the scheduled trip.

Medicare may pay for medically necessary non-emergency ambulance transport when you have a **written order from your doctor** stating that the transport is medically necessary. The example Medicare gives is someone with end-stage renal disease needing transport to and from dialysis. The order is not a formality — it is the document the claim rests on, and its absence is the usual reason a non-emergency trip is denied.

Two mechanisms exist to warn you before the money is spent, and both are worth knowing:

1. **The Advance Beneficiary Notice of Noncoverage.** The ambulance company must give you an ABN when the service is non-emergency *and* the company believes Medicare may not pay for it. An ABN is not a bill and not a denial. It is a heads-up, and it is your cue to ask why before you get in.
2. **Prior authorization for repetitive trips.** If you are getting scheduled non-emergency transport three or more round trips in ten days, or at least weekly for three weeks or more, a Medicare demonstration program applies. The ambulance company may request prior authorization before your fourth round trip in a 30-day period, so that both of you learn early whether Medicare is likely to cover it. If the request is not approved and the trips continue, Medicare will deny the claim and the company may bill you for all charges.

That second one is where families get hurt, and it is nearly always someone in a recovery stretch — after a stroke, during a course of dialysis, in the weeks after a hospital discharge. It sits right next to the other question people ask me in that same fortnight, which is [how many hours a day Medicare will pay for home health care](/blog/how-many-hours-will-medicare-pay-for-home-health-care/). The honest answer in both cases is that Medicare pays for skilled, medically necessary, documented care and stops at the edge of convenience.

## What changes on an Advantage plan or with a supplement

The federal rule about the destination does not change. What changes is who pays the remainder and how you argue about it.

<div class="table-scroll">
<table>
  <caption class="sr-only">How ambulance cost sharing differs between Original Medicare, a Medigap policy and a Medicare Advantage plan</caption>
  <thead>
    <tr><th scope="col">What you have</th><th scope="col">Who pays the ambulance</th><th scope="col">What to check now</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Original Medicare alone</strong></td>
      <td>Part B pays 80% of the approved amount after the deductible; the rest is yours, with no annual cap</td>
      <td>Nothing to check — this is the baseline the other two are measured against</td>
    </tr>
    <tr>
      <td><strong>Original Medicare + a Medigap policy</strong></td>
      <td>Part B pays its share; the lettered plan picks up the Part B coinsurance according to its standardized benefits</td>
      <td>Which letter you hold. Medicare says the benefits in each lettered plan are the same no matter which company sells it</td>
    </tr>
    <tr>
      <td><strong>Medicare Advantage</strong></td>
      <td>The plan covers it — Advantage plans deliver your Part A and Part B benefits — usually at a flat copay per one-way trip</td>
      <td>The per-trip copay, whether it differs for air transport, and any prior-authorization rule on non-emergency transport</td>
    </tr>
  </tbody>
</table>
</div>
<p class="table-source">Sources: Medicare.gov ambulance services, Medigap basics and Medicare Advantage plan pages.</p>

If you are on an Advantage plan, the ambulance copay is one of the line items that can move on January 1 without anything being wrong — the same annual reset that changes networks and formularies. It is disclosed in the Annual Notice of Change your plan mails you every autumn, which is [the one piece of post you should not file unopened](/blog/medicare-annual-notice-of-change-letter-2027/). Those letters are landing this month.

## Seasonal residents, and the four-month problem

Peoria's 55-plus communities — Westbrook Village, Trilogy at Vistancia — hold a lot of households who are somewhere else for part of the year, and ambulances do not care where you are registered to vote.

Emergency and urgently needed care travels with you on an Advantage plan. Routine care generally does not, and that gap is the reason a Medicare Supplement so often fits a seasonal household better than a network plan does: a supplement pairs with Original Medicare and works with any provider in the country who accepts Medicare, so four months in Michigan is a non-event rather than a coverage question. If you are away part of the year, that is the conversation to have before January, not after — and the [Peoria service-area page](/service-area/peoria-az/) walks through how it usually goes. If your ZIP sits on the seam, [Glendale](/service-area/glendale-az/) is the other half of the same picture.

## What an ambulance bill costs next to everything else

It is worth keeping the scale honest. An ambulance ride is a real expense and an unpleasant surprise. It is not, for most households, the expensive part of a bad year.

<div class="stat-callout">
  <p class="stat-callout__figure">{{partA.deductible}} — the Part A hospital deductible per benefit period in {{year}}, which the ambulance ride is usually the prelude to</p>
  <p class="stat-callout__body">The ride gets billed under Part B at {{partB.coinsurance}} after the {{partB.deductible}} deductible. What follows it is billed under Part A, per benefit period, and a second admission after a new benefit period starts means a second deductible. Meanwhile Part D carries a hard annual out-of-pocket cap of {{partD.cap}} on covered drugs, and the standard Part B premium runs {{partB.premium}} a month regardless. Sort the coverage that governs the hospital stay, and the ambulance takes care of itself.</p>
  <p class="stat-callout__cite">Source: CMS {{year}} Medicare Parts A &amp; B premiums and deductibles, and the CMS Part D {{year}} figures. Verified against cms.gov.</p>
</div>

The same logic applies to the thing that follows an ambulance more often than an admission does — being kept in the hospital [under observation rather than admitted](/blog/does-medicare-cover-hospital-observation-stay/), which is billed under Part B and has consequences of its own. And if you want the wider map of where Medicare simply stops, [what Medicare does not pay for](/learn/what-medicare-does-not-pay-for/) is the page to read once, properly, before you need it.

## The short version

- **Yes, Part B covers a medically necessary ambulance ride** — when travelling any other way would endanger your health.
- **Only to the nearest appropriate facility.** Mileage beyond it is generally not covered.
- **Your doctor's hospital is not automatically the destination.** Staff privileges are explicitly not a factor; a higher level of trauma or specialized care is.
- **You pay the Part B deductible, then {{partB.coinsurance}}** of the approved amount — which is not the number on the ambulance service's own invoice.
- **In Arizona the state fixes the rate.** The department determines the charges by statute, and an ambulance service may not collect more than the fixed rate.
- **Non-emergency transport needs a doctor's written order,** and repetitive scheduled trips can require prior authorization before the fourth round trip in 30 days.
- **On an Advantage plan it is a per-trip copay,** and that copay can change every January 1.

## If you would rather have someone check it for you

Nobody chooses a Medicare plan because of the ambulance copay, and nobody should. But it belongs on the list you go through once a year alongside the things that actually decide it — whether your doctors are in the network, what your prescriptions cost on the formulary, and what happens if you are out of state when something goes wrong. That review takes a long afternoon on your own and about twenty minutes with someone who does it weekly, and there is no charge for it.

Bring your insurance cards and the actual pill bottles rather than a remembered list, and bring the Annual Notice of Change letter if it has arrived. If you would like to see the arithmetic yourself first, the [Medicare cost estimator](/tools/medicare-cost-estimator/) will put rough numbers on the year before we talk.

The office is in Anthem, roughly 25 minutes from north Peoria out the Carefree Highway and down Lake Pleasant Parkway, and most of this gets done by phone anyway. Call **(602) 844-6002** or [book a time](/book/) — and if you call or text, that is your consent for me to reply the same way.

None of the above changes what happens when you dial 911. Dial it. Sort the coverage out afterwards, and sort the plan out in October.
