---
layout: ../../layouts/BlogLayout.astro
title: 'Do I pay the Medicare Part A deductible every time I go to the hospital?'
seoTitle: 'Part A Deductible Every Hospital Stay? Arizona 2027'
description: 'No. It is $1,776 per benefit period in 2027, not per stay or per year. Readmitted within 60 days of discharge, you skip it; after that, you pay it again.'
summary: 'CMS published the 2027 Part A hospital figures in the Federal Register on November 19, 2026. The deductible is charged once per benefit period, which ends only after 60 days in a row out of the hospital and out of skilled care. That can mean one deductible for three admissions, or two deductibles in one year. Here is how the clock works, what Medigap and Medicare Advantage do with it, and what a Peoria household should check before December 7.'
category: Original Medicare
publishedAt: 2026-11-19
readMinutes: 8
image: /blog/medicare-part-a-deductible-every-hospital-stay-2027-photo.jpg
imageAlt: 'A rocky dirt trail with stone steps winds between tall saguaro cactus and desert brush toward sunlit hills under a cloudy evening sky.'
faqs:
  - q: Do you have to pay the Medicare Part A deductible every time you go to the hospital?
    a: No. Under Original Medicare the Part A deductible is charged once per benefit period. A benefit period starts the day you are admitted as an inpatient and ends after you have gone 60 days in a row without inpatient hospital care or skilled nursing care. If you are readmitted before those 60 days are up, you are still in the same benefit period and do not pay the deductible again.
  - q: What is the Medicare Part A deductible for 2027?
    a: $1,776 per benefit period, up $40 from $1,736 in 2026. CMS published it in the Federal Register on November 19, 2026, along with the 2027 daily coinsurance of $444 for hospital days 61 through 90, $888 for each lifetime reserve day, and $222 for skilled nursing facility days 21 through 100.
  - q: How many times a year can you pay the Medicare Part A deductible?
    a: There is no annual limit. The deductible follows benefit periods, not the calendar, so someone admitted in February and again in June, with more than 60 days at home in between, pays it twice that year. Original Medicare has no out-of-pocket maximum, which is why most people add a Medigap policy or choose a Medicare Advantage plan.
  - q: Does a Medicare Supplement pay the Part A deductible?
    a: Most do. Medigap Plans B, D, G and N pay all of it, and so do Plans C and F for people eligible for Medicare before 2020. Plan K pays 50 percent, Plan L pays 75 percent and Plan M pays 50 percent. Plan A does not pay it.
  - q: Does Medicare Advantage have a Part A deductible?
    a: Not in the same form. Medicare Advantage plans set their own hospital cost sharing, usually a daily copayment for the first several days of each admission, and every plan has a yearly out-of-pocket maximum. Check whether your plan's copays restart with each admission and how many days they run, because that varies from plan to plan.
  - q: Does going to the ER count toward the Part A deductible?
    a: Not by itself. An emergency room visit that does not end in an inpatient admission is billed under Part B, and so is an observation stay, even overnight. The Part A deductible applies only once a doctor formally admits you as an inpatient.
sources:
  - label: 'Federal Register, November 19, 2026 — CY 2027 Inpatient Hospital Deductible and Hospital and Extended Care Services Coinsurance Amounts (2026-23603)'
    url: https://www.federalregister.gov/documents/2026/11/19/2026-23603/medicare-program-cy-2027-inpatient-hospital-deductible-and-hospital-and-extended-care-services
  - label: '42 CFR § 409.60 — Benefit periods'
    url: https://www.law.cornell.edu/cfr/text/42/409.60
  - label: 'Medicare.gov — Inpatient hospital care'
    url: https://www.medicare.gov/coverage/inpatient-hospital-care
  - label: 'Medicare.gov — Medicare costs'
    url: https://www.medicare.gov/basics/costs/medicare-costs
  - label: 'CMS — Choosing a Medigap Policy: A Guide to Health Insurance for People with Medicare'
    url: https://www.medicare.gov/publications/02110-medigap-guide-health-insurance.pdf
  - label: 'CMS — Medicare Advantage plan landscape files, contract year 2027'
    url: https://www.cms.gov/data-research/statistics-trends-and-reports/medicare-advantagepart-d-contract-and-enrollment-data/ma-plan-landscape-files
---

**No. Under Original Medicare you pay the Part A deductible once per benefit period, not once per hospital stay and not once per calendar year. For {{figYear}} the deductible is {{partA.deductible}}, published by CMS in the Federal Register on November 19, 2026. A benefit period starts the day you are admitted as an inpatient and ends only after you have gone 60 days in a row without inpatient hospital care or skilled nursing care.** Come back within those 60 days and you are still in the same benefit period, with no second deductible. Come back after them and a new period, and a new deductible, begins.

That one rule cuts both ways. It can make three admissions cost you a single deductible, and it can make one year cost you two or three of them. I get the question most often from north Peoria clients after a spouse has been admitted at Arrowhead or out toward Sun City and the bill shows up in pieces. Here is how the clock actually runs.

## What changed for 2027

CMS sets the hospital figures by formula each year and publishes them in the Federal Register. The {{figYear}} notice came out today, November 19, 2026:

<div class="table-scroll">
<table>
  <caption class="sr-only">Medicare Part A inpatient hospital and skilled nursing facility cost sharing under Original Medicare, 2026 compared with 2027</caption>
  <thead>
    <tr><th scope="col">What you pay under Original Medicare</th><th scope="col">2026</th><th scope="col">{{figYear}}</th></tr>
  </thead>
  <tbody>
    <tr><td>Inpatient deductible, per benefit period (covers days 1–60)</td><td>$1,736</td><td>{{partA.deductible}}</td></tr>
    <tr><td>Hospital days 61–90, per day</td><td>$434</td><td>{{partA.days61to90}}</td></tr>
    <tr><td>Lifetime reserve days (60 total, used once), per day</td><td>$868</td><td>{{partA.lifetimeReserve}}</td></tr>
    <tr><td>Skilled nursing facility days 21–100, per day</td><td>$217</td><td>{{partA.snf}}</td></tr>
  </tbody>
</table>
</div>
<p class="table-source">Source: Federal Register notice 2026-23603 (CY 2027 amounts); Medicare.gov for the 2026 amounts.</p>

The deductible rose $40, or about 2.3 percent. None of these numbers carries an annual cap. Original Medicare on its own has no out-of-pocket maximum, which matters more than the size of any one figure.

## How the 60-day benefit-period clock works

The rule sits in 42 CFR § 409.60. A benefit period begins the first day you receive inpatient hospital care, or skilled nursing facility care, after your Part A starts. It ends at the close of the first stretch of 60 consecutive days during which you were neither a hospital inpatient nor receiving skilled care in a nursing facility.

Three details trip people up:

- **The clock starts at discharge, not at admission.** A six-day stay that ends on March 10 keeps the benefit period open until 60 full days have passed after March 10.
- **Rehab keeps it open.** Days in a skilled nursing facility, the usual next stop after a hip or knee replacement, count as days in care. A month of rehab after the hospital pushes the 60-day countdown back by a month. Our post on [how long Medicare pays for rehab after a hospital stay](/blog/how-long-does-medicare-pay-for-rehab-after-a-hospital-stay-peoria-az/) covers the 100-day limit that runs on the same clock.
- **The calendar does not matter.** A benefit period that starts in late December and continues into January is still one benefit period with one deductible. A new year does not reset it.

## When one deductible covers several stays, and when you pay twice

Two north Peoria examples, both on Original Medicare with no supplement:

**One deductible, three admissions.** A Vistancia resident is admitted with pneumonia on February 2 and goes home February 8. She is readmitted for 3 days on March 20 and again for 2 days on April 25. Each return falls inside 60 days of her last discharge, so all three stays belong to one benefit period. She pays the {{partA.deductible}} deductible once. Her inpatient days total 11, far short of day 61, so there is no daily coinsurance either.

**Two deductibles, one year.** Her neighbor is admitted for a heart procedure on February 2 and goes home February 6. He stays well through the spring and is admitted for a fall on July 15. More than 60 days passed between stays, so July starts a new benefit period and he pays the full deductible a second time. Nothing in Original Medicare caps how many times that can happen in a year.

The second pattern is the one that surprises people. A planned surgery in the winter and an unrelated admission in the summer are rarely within 60 days of each other.

## Where it gets expensive: day 61 and beyond

The deductible covers days 1 through 60 of a benefit period. Longer stays, which are uncommon but do happen after strokes and complicated surgeries, move into daily coinsurance: {{partA.days61to90}} a day for days 61 through 90, then {{partA.lifetimeReserve}} a day for any of your 60 lifetime reserve days. Those reserve days never come back once used. After they run out, Original Medicare pays nothing for further hospital days in that benefit period.

## Does a Medicare Supplement pay the Part A deductible?

Most Medigap plans do. Medigap benefits are set by federal law, so a given plan letter covers the same thing whichever company sells it:

<div class="table-scroll">
<table>
  <caption class="sr-only">Which Medigap plan letters pay the Medicare Part A deductible</caption>
  <thead>
    <tr><th scope="col">Medigap plan</th><th scope="col">Part A deductible</th></tr>
  </thead>
  <tbody>
    <tr><td>B, D, G, N</td><td>Pays 100%</td></tr>
    <tr><td>C, F (only if eligible for Medicare before January 1, 2020)</td><td>Pays 100%</td></tr>
    <tr><td>L</td><td>Pays 75%</td></tr>
    <tr><td>K, M</td><td>Pays 50%</td></tr>
    <tr><td>A</td><td>Does not pay it</td></tr>
  </tbody>
</table>
</div>
<p class="table-source">Source: CMS, "Choosing a Medigap Policy" (Medigap plan benefits chart).</p>

Every Medigap plan also pays the day-61-to-90 and lifetime-reserve coinsurance and adds 365 more hospital days over your lifetime. On Plan G, the plan most people turning 65 ask me about, a second or third benefit period in a year adds nothing to the hospital's Part A bill. The doctors' charges during the stay fall under Part B, where Plan G leaves you only the {{partB.deductible}} Part B deductible once a year. [Plan G vs Plan N in Arizona](/blog/plan-g-vs-plan-n-arizona-which-should-i-choose/) goes through how those two plans differ elsewhere.

Arizona has no Medigap birthday rule. If you already have Medicare and want to change to a plan that pays the deductible, you will usually have to answer health questions, unless you are in your first six months with Part B or have a guaranteed-issue right, such as your Medicare Advantage plan being discontinued for 2027.

## How Medicare Advantage handles a hospital stay instead

Medicare Advantage plans do not use the Part A deductible. Each plan sets its own inpatient cost sharing, which in most plans I see is a daily copayment for the first several days of each admission and then nothing more for that stay. Every plan also has a yearly in-network out-of-pocket maximum, and that cap is the real protection.

According to CMS's {{figYear}} plan landscape files, the 45 general Medicare Advantage plans with drug coverage in Maricopa County have in-network maximums that run from $2,000 to $8,900 for {{figYear}}. That is a wide range for plans sold in the same county. The [Peoria out-of-pocket maximum post](/blog/medicare-advantage-out-of-pocket-maximum-peoria-az-2027/) breaks it down.

When you compare plans, read three lines in the Summary of Benefits rather than the premium:

1. **How many days the inpatient copay runs**, and the daily amount.
2. **Whether the copay restarts with each admission.** On some plans a readmission a week later starts the copays over. Ask, and get the answer from the Evidence of Coverage, not a phone call.
3. **The in-network maximum.** Two admissions in one year can reach it on some plans.

If a gap between the copays and the maximum worries you, a hospital indemnity policy pays you a set cash amount per admission. [Is hospital indemnity insurance worth it with Medicare Advantage?](/blog/is-hospital-indemnity-insurance-worth-it-with-medicare-advantage/) explains when it makes sense.

## Before you count the deductible, check that you were admitted

The Part A deductible applies only to an inpatient admission. An emergency room visit that sends you home, and an overnight observation stay, are both outpatient care billed under Part B at {{partB.coinsurance}} after the {{partB.deductible}} Part B deductible, even if you spent the night in a hospital bed. [Does Medicare cover a hospital observation stay?](/blog/does-medicare-cover-hospital-observation-stay/) explains why that difference shows up on the bill.

## What to check before December 7

Annual Enrollment ends December 7, 2026. If you are on Original Medicare without a supplement, or on a Medicare Advantage plan whose hospital copays you have never read, now is the time to look. That is especially true if a surgery is already on the calendar for {{nextYear}}. If you want to go through your plan's inpatient lines with someone who knows the Maricopa plans, I cover Peoria from the Anthem office. See our [Peoria service-area page](/service-area/peoria-az/), or [book a time](/book/) that suits you.
