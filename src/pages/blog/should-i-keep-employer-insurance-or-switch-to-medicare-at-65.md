---
layout: ../../layouts/BlogLayout.astro
title: 'Should I keep my employer insurance or switch to Medicare at 65?'
seoTitle: 'Employer Insurance or Medicare at 65? Arizona 2027'
description: 'Either is allowed at a 20-plus-employee employer. Switching costs $202.90 a month for Part B alone; the average worker pays $120 a month for job coverage.'
summary: 'If you are still on the payroll at 65 and your employer has 20 or more workers, Medicare lets you keep the group plan with no penalty. That makes it a pricing decision, not a deadline. Here is what goes on each side of the ledger for a north Peoria household, using the 2027 Maricopa County plan files, and the four things that usually settle it.'
category: Turning 65
publishedAt: 2026-11-11
readMinutes: 9
image: /blog/should-i-keep-employer-insurance-or-switch-to-medicare-at-65-photo.jpg
imageAlt: 'A gray-bearded man in a tan sweater writes in a red notebook at a marble desk beside an open laptop, a coffee cup and bookshelves.'
faqs:
  - q: Is it better to stay on employer insurance or go on Medicare at 65?
    a: It depends on price and on who else is on the plan. If your employer has 20 or more employees and you are actively working, the group plan pays first and you can keep it without a Medicare penalty. Switching usually wins when your share of the premium and deductible is high and nobody else depends on the plan. Staying usually wins when a younger spouse or child is covered through you, or when your income would put a surcharge on your Medicare premiums.
  - q: Can I drop my employer insurance and go on Medicare?
    a: Yes. You can leave a group plan at 65 or later and enroll in Part B during the eight months after the coverage ends, using form CMS-L564 to show you had employer coverage. Your one-time Medigap open enrollment starts the month Part B starts, and you have two full months after the employer coverage ends to join a drug plan or Medicare Advantage plan without a gap.
  - q: Is Medicare cheaper than employer insurance?
    a: Often not for someone with a generous employer plan. The 2025 KFF employer survey put the average worker's share of single coverage at $1,440 a year, about $120 a month. Part B alone is $202.90 a month in 2026, before a Medicare Supplement or drug plan. Medicare tends to come out ahead when the employer plan carries a high deductible or a large payroll deduction, or when you use a lot of care.
  - q: Should I sign up for Part A if I keep my employer insurance?
    a: Most people can, because Part A is premium-free with 40 quarters of work. The exception is anyone still putting money into a Health Savings Account, since any Medicare enrollment ends HSA contributions and Part A can be backdated up to six months.
  - q: Can my employer pay me to switch to Medicare?
    a: No. Federal rules at 42 CFR §411.103 prohibit an employer with a plan that pays before Medicare from offering cash or other benefits to get a worker over 65 to drop it or not enroll. The employer also has to offer you the same coverage it offers younger workers. Switching has to be your choice.
  - q: What happens to my spouse if I switch to Medicare?
    a: Medicare covers only you. If your spouse is under 65 and on your employer plan as a dependent, dropping the group plan ends their coverage too, and they would need coverage of their own until they reach 65. For many couples that settles the question in favor of staying.
sources:
  - label: 'Medicare.gov — Working past 65'
    url: https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65
  - label: 'Medicare.gov — Which insurance pays first'
    url: https://www.medicare.gov/health-drug-plans/coordination/who-pays-first
  - label: 'Medicare.gov — Medicare costs (2026 Part B premium and deductible)'
    url: https://www.medicare.gov/basics/costs/medicare-costs
  - label: 'Medicare.gov — When can I buy Medigap?'
    url: https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy/when
  - label: 'Cornell LII — 42 CFR §411.103, prohibition against financial and other incentives'
    url: https://www.law.cornell.edu/cfr/text/42/411.103
  - label: 'KFF — 2025 Employer Health Benefits Survey (worker contributions and deductibles)'
    url: https://www.kff.org/health-costs/2025-employer-health-benefits-survey/
  - label: 'CMS — CY2027 Medicare Advantage / Part D Landscape file (Maricopa County and Arizona PDP rows)'
    url: https://www.cms.gov/files/zip/cy2027-landscape-202609-1.zip
  - label: 'CMS — Announcement of Calendar Year 2027 Medicare Advantage Capitation Rates and Part C and Part D Payment Policies (Part D benefit parameters)'
    url: https://www.cms.gov/files/document/2027-announcement.pdf
  - label: 'Social Security Administration — Premiums: rules for higher-income beneficiaries'
    url: https://www.ssa.gov/benefits/medicare/medicare-premiums.html
---

**If you are still working at 65 for an employer with 20 or more employees, Medicare lets you keep the group plan as your main coverage and sign up for Part B later with no penalty. So the question is not whether you may stay, but whether staying is cheaper and covers the people and doctors you need.** Part B alone is {{partB.premium}} a month in {{year}}. The average worker's share of single employer coverage was about $120 a month in KFF's 2025 survey. That gap is the first thing to beat.

Below the 20-employee line the answer is different. Medicare pays first, the group plan pays second, and you should enroll in Part A and Part B at 65. The rules for that case, and for COBRA and retiree plans, are in [Do I need to sign up for Medicare at 65 if I'm still working?](/blog/do-i-need-medicare-at-65-if-still-working/). This post is for the people who have a real choice.

That describes a lot of north Peoria right now. Plenty of the 65-year-olds in Vistancia, Blackstone and the 85383 ZIP along Lake Pleasant Parkway are still drawing a paycheck. Some work for a Valley hospital system or a school district, and some draw it remotely from a company headquartered back East. Their benefits office sends one letter and Medicare sends another, and neither one does the arithmetic.

## Price both sides for the same twelve months

Put the two options next to each other for one plan year, using your own pay stub and the 2027 Medicare figures where they are already published. Here is what goes in each column.

<div class="table-scroll">
<table>
  <caption class="sr-only">What to compare between an employer group health plan and Medicare at 65, line by line</caption>
  <thead>
    <tr><th scope="col">Line</th><th scope="col">Stay on the employer plan</th><th scope="col">Switch to Medicare</th></tr>
  </thead>
  <tbody>
    <tr><td>Monthly premium</td><td>Your payroll deduction. KFF's 2025 average for single coverage: $1,440 a year</td><td>Part B {{partB.premium}} in {{year}} (2027 figure not yet announced), plus a Medigap and drug plan, or a Medicare Advantage plan</td></tr>
    <tr><td>Deductible</td><td>KFF's 2025 average for single coverage: $1,886</td><td>Part B {{partB.deductible}} in {{year}}. Plan G leaves you that and very little else</td></tr>
    <tr><td>Worst-year limit</td><td>Your plan's out-of-pocket maximum</td><td>Medigap Plan G: about the Part B deductible. Maricopa Advantage plans: $2,000 to $8,900 in 2027</td></tr>
    <tr><td>Prescriptions</td><td>Your plan's formulary and tiers</td><td>Part D caps your drug spending at $2,400 in 2027, with a deductible of up to $700</td></tr>
    <tr><td>Spouse or children</td><td>Can stay on as dependents</td><td>Not covered. Medicare is one person at a time</td></tr>
    <tr><td>Tax treatment</td><td>Usually deducted from pay before tax</td><td>Paid with after-tax dollars</td></tr>
    <tr><td>Income surcharge</td><td>None</td><td>IRMAA on Part B and Part D if your income two years back is high</td></tr>
  </tbody>
</table>
</div>

The Medicare column has two routes in it, and they price very differently. One is a Medicare Supplement plus a stand-alone drug plan. Arizona has nine of those drug plans for 2027, at $5.30 to $191.50 a month, and none at $0 ([the full Arizona list](/blog/medicare-part-d-plans-arizona-2027/)). The other is a Medicare Advantage plan with drug coverage built in. According to CMS's 2027 plan landscape files, Maricopa County has 45 general Medicare Advantage plans with drug coverage from 13 companies, and 39 of them charge no plan premium. You still pay Part B either way. [How much does Medicare cost at 65?](/blog/how-much-does-medicare-cost-at-65/) adds up both routes line by line.

## When switching usually comes out ahead

- **Your payroll deduction is large.** Some employers pass a big share of the premium to the worker, especially at small firms or on richer plan tiers. If you pay several hundred dollars a month for single coverage, Part B plus a supplement can come in under it.
- **The plan has a high deductible.** On a high-deductible plan, a $3,000 or $4,000 deductible paid every January is real money. Medigap Plan G caps what most people pay for covered medical care at the Part B deductible.
- **You use a lot of care or expensive drugs.** The 2027 Part D limit of $2,400 is a hard ceiling. Some employer drug plans have no ceiling that low.
- **You see doctors your group network does not.** Original Medicare with a supplement works with any doctor in the country who takes Medicare. That matters to a household that splits the year between Peoria and somewhere else.

## When staying usually comes out ahead

- **Someone else is on your plan.** This settles more of these conversations than any number. If a 61-year-old spouse or a college-age child is covered through your job, dropping it drops them, and their replacement coverage belongs in the Medicare column of your table. [Can my spouse get Medicare when I turn 65?](/blog/can-my-spouse-get-medicare-when-i-turn-65/) covers the age question.
- **Your income is high.** Medicare premiums carry a surcharge, IRMAA, based on your tax return from two years earlier. In {{year}} it starts above {{irmaa.singleStart}} for a single filer and {{irmaa.jointStart}} for a joint return, and it pushes Part B to {{irmaa.t1.partB}} a month at the first tier, plus an add-on to your drug plan. A senior executive or physician still earning a full salary can pay several times the standard Part B premium. Your share of a group plan has no surcharge at all. The [IRMAA explainer](/learn/irmaa-explained/) has the full tier table.
- **Your employer funds an HSA.** Enrolling in any part of Medicare ends your ability to put money into a Health Savings Account, and that includes the employer's deposit. [Can I contribute to an HSA while on Medicare?](/blog/can-i-contribute-to-an-hsa-while-on-medicare/) has the six-month look-back.
- **You already met this year's deductible.** If it is October and you have paid your employer plan's deductible and most of its out-of-pocket maximum, switching on November 1 starts Medicare's deductibles from zero for the last two months. Leaving in January makes more sense.

## Can my employer nudge me toward Medicare?

No. Under [42 CFR §411.103](https://www.law.cornell.edu/cfr/text/42/411.103), an employer whose plan pays before Medicare cannot offer a worker on Medicare money, a stipend, or any other benefit to drop the group plan or skip enrolling in it. It also has to offer you the same plan, at the same terms, that it offers younger workers. If someone in HR suggests that "everybody goes on Medicare at 65", that is a misunderstanding, not a policy. You can still choose to leave. The choice just has to be yours.

## Can I keep both?

You can, and a few people should. If your employer has 20 or more employees and you take Part B anyway, the group plan pays first and Medicare picks up some of what is left. For most people that means paying two premiums to get a little extra coverage. It also starts your six-month Medigap open enrollment while you are still on the group plan. If you later want a Medicare Supplement, that window may already be closed, and Arizona has no birthday rule to reopen it. Taking premium-free Part A alone is the common middle ground, unless an HSA is in the picture.

## If you decide to switch, do it in this order

1. **Ask HR for two things in writing:** that the plan counts as coverage from current employment at a company with 20 or more employees, and whether its drug coverage is creditable. Both protect you from penalties later.
2. **Pick a start date.** The first of a month works best, and January 1 avoids losing a deductible you already paid. Use the [enrollment timeline tool](/tools/enrollment-timeline/) to set the dates.
3. **Apply for Part B** through Social Security with form CMS-L564, signed by the employer, so the delay carries no penalty. Our [Part B after 65 walkthrough](/blog/how-do-i-sign-up-for-medicare-part-b-when-i-retire-after-65/) covers the forms.
4. **Line up the plan behind it.** A Medigap policy can be bought without health questions for six months from your Part B start. A drug plan or Advantage plan has to begin within about two months of the group plan ending, or a late penalty can start to build.
5. **End the group coverage last,** once the Medicare start date is confirmed in writing.

If the ledger is close, or a spouse, an HSA or a high income complicates it, that is a short conversation. I cover Peoria from the Anthem office, about 25 minutes out the Carefree Highway and down Lake Pleasant Parkway, and much of this work is done by phone. You can [book a Turning-65 call](/book/?topic=t65) or read more about how I work with [Peoria households](/service-area/peoria-az/). Sometimes the honest answer is to keep the employer plan for two more years, and that is what I will tell you.
