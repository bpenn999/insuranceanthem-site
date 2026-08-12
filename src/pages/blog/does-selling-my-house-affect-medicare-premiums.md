---
layout: ../../layouts/BlogLayout.astro
title: 'Does selling my house affect my Medicare premiums?'
seoTitle: 'Does Selling My House Affect Medicare Premiums?'
description: 'Only if the taxable gain pushes your income past the IRMAA threshold — and the higher premium arrives two years after the sale, not the month you close.'
summary: 'Half the people moving into north Peoria sold a house to get here, and a fair number of the people already here are thinking about selling one. The Medicare consequence of that sale is real, it is delayed by two years, and it is far smaller than the internet suggests — but the day it arrives, almost nobody connects it to the closing.'
category: Planning
publishedAt: 2026-08-12
readMinutes: 9
image: /blog/medicare-home-sale-irmaa-2026.png
imageAlt: '602Medicare article card reading "Does selling my house raise my Medicare premium?", with the 602Medicare badge and a byline for Brian Penner, Licensed Independent Medicare Advisor.'
faqs:
  - q: Does selling my house affect my Medicare premiums?
    a: It can, but only if the sale produces a taxable gain large enough to push your modified adjusted gross income past the first income-related threshold Social Security publishes for the plan year. Most home sales never get there, because you can generally exclude up to $250,000 of gain on a main home ($500,000 for a married couple filing jointly) if you owned and lived in it for at least two of the five years before the sale. Only the gain above that exclusion counts.
  - q: How long does IRMAA last?
    a: Normally one year. Social Security sets your surcharge each year from the tax return you filed two years earlier, so a one-time spike affects one year of premiums and then falls off on its own once the next return comes back under the threshold. You do not have to apply to have it removed — the recalculation is automatic and annual. What surprises people is the delay, not the duration.
  - q: Is IRMAA based on gross or net income?
    a: Neither exactly. It is based on modified adjusted gross income — your adjusted gross income plus tax-exempt interest, which for most people is line 11 of Form 1040 plus line 2a. That means municipal bond interest counts even though it is not taxed, and it means deductions taken below the AGI line, including the standard deduction, do not help you.
  - q: Can I appeal IRMAA after selling my house?
    a: A home sale by itself is not one of the eight life-changing events Social Security accepts on Form SSA-44, so the sale alone is generally not appealable. What is appealable is an event attached to it — most often work stoppage or work reduction if you retired around the same time, and also marriage, divorce or annulment, death of a spouse, loss of income-producing property, loss of pension income, or an employer settlement payment. If you also believe the tax data itself is wrong or outdated, that is a separate request worth making.
  - q: How much can you make before Medicare premiums go up?
    a: Social Security sets the thresholds each year and applies them to the tax return you filed two years earlier — the current figures for single and joint filers, and every tier above them, are in the table in this article. It is a cliff rather than a slope — one dollar over a threshold moves you into the entire next tier, which is why the last few thousand dollars of income in a sale year are worth more attention than the first hundred thousand.
  - q: Does selling a rental property or a second home count?
    a: Yes, and more of it counts. The main-home exclusion applies only to a residence you owned and lived in for two of the previous five years, so a rental or a vacation property generally has no exclusion at all — the whole gain lands in your income, and on a rental you may also owe tax on depreciation previously claimed. Arizona second homes and long-held rentals are where I see the largest unexpected surcharges.
sources:
  - label: 'Medicare.gov — Medicare costs, including income-related premium amounts'
    url: https://www.medicare.gov/basics/costs/medicare-costs
  - label: 'CMS — 2026 Medicare Parts A & B premiums and deductibles fact sheet'
    url: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
  - label: 'Social Security — Request to lower an Income-Related Monthly Adjustment Amount'
    url: https://www.ssa.gov/medicare/lower-irmaa
  - label: 'Social Security — Form SSA-44, Life-Changing Event'
    url: https://www.ssa.gov/forms/ssa-44.pdf
  - label: 'IRS — Topic no. 701, Sale of your home (exclusion, ownership and use tests)'
    url: https://www.irs.gov/taxtopics/tc701
  - label: 'IRS — Publication 523, Selling Your Home (including the surviving-spouse rule)'
    url: https://www.irs.gov/publications/p523
---

**Only if the taxable gain is big enough to push your income past the IRMAA threshold — and if it does, the higher premium shows up two years after you close, not this year.** For most people selling a home they have lived in, the answer is no: the capital-gains exclusion absorbs the whole gain and Medicare never notices.

I get this question constantly in north Peoria, from both directions. New arrivals in Vistancia and Trilogy sold something in California, Illinois or Washington to buy here and want to know what it did to them. Longtime owners in the 85345 core and Westbrook Village are looking at what their house is now worth after thirty years and wondering whether cashing that in is going to cost them. Those are two different situations with the same underlying rule, so here is the rule.

## Does selling my house affect my Medicare premiums?

Three things have to happen in order before a home sale changes what you pay for Medicare.

1. **The sale has to produce a gain** — sale price minus what you paid, minus selling costs, minus the capital improvements you made over the years and, ideally, kept receipts for.
2. **That gain has to survive the exclusion.** On a main home you can generally exclude up to $250,000 of gain, or $500,000 on a joint return, if you owned the home and lived in it as your main home for at least two of the five years ending on the sale date. Only what is left after the exclusion becomes taxable income.
3. **The leftover has to push your modified adjusted gross income over the line** — {{irmaa.singleStart}} for a single filer, {{irmaa.jointStart}} for a couple filing jointly.

Miss any one of those and nothing happens to your premium. That is why the honest answer to the question is usually "no", even though every article about it is written as though the answer is yes.

Where it does bite is a specific and predictable set of cases: a home held long enough that appreciation ran past the exclusion, a **surviving spouse filing single** against a $250,000 exclusion instead of $500,000, a rental or second home with no exclusion available at all, and a sale that lands in the same tax year as a Roth conversion, a large distribution or a business sale. Around here it is very often the first two.

## The two-year delay is what makes this invisible

Social Security does not look at what you are earning now. It sets your {{year}} premium from the tax return you filed for **{{irmaaTaxYear}}** — the most recent one the IRS has finished processing. Run the same arithmetic forward on a sale:

- You close on a Peoria house in **{{year}}**.
- The gain appears on your **{{year}}** return, filed in **{{nextYear}}**.
- Social Security uses that return to set your premiums for **2028**.

So the letter arrives roughly two years and a couple of months after the closing, at a point when the sale is long finished and the money is long since spent or reinvested. People call me in January genuinely alarmed, convinced something has gone wrong with their plan, when what actually happened is a house sold in the fall of two years earlier.

The other half of that delay is good news, and it is the half nobody mentions: **the surcharge is normally one year long.** Social Security redetermines it every year from a fresh return. Once your income drops back to its ordinary level, the next return takes the surcharge off automatically. You do not apply, you do not appeal, you do not call. You wait one cycle.

## What the surcharge actually costs

The standard Part B premium for {{year}} is {{partB.premium}} a month. Above the threshold, you pay that plus an adjustment, and a second, smaller adjustment on Part D — which you owe even if your drug coverage is bundled inside a Medicare Advantage plan, and which is billed by Medicare rather than by the plan.

<div class="table-scroll">
<table>
  <caption class="sr-only">{{year}} Medicare Part B and Part D income-related surcharges by modified adjusted gross income, single filer</caption>
  <thead>
    <tr><th scope="col">Your {{irmaaTaxYear}} MAGI (single filer)</th><th scope="col">Part B per month</th><th scope="col">Part D surcharge</th></tr>
  </thead>
  <tbody>
    <tr><td>Up to {{irmaa.singleStart}}</td><td>{{partB.premium}}</td><td>None</td></tr>
    <tr><td>{{irmaa.singleStart}} – {{irmaa.t1.singleMax}}</td><td>{{irmaa.t1.partB}}</td><td>{{irmaa.t1.partD}}</td></tr>
    <tr><td>{{irmaa.t1.singleMax}} – {{irmaa.t2.singleMax}}</td><td>{{irmaa.t2.partB}}</td><td>{{irmaa.t2.partD}}</td></tr>
    <tr><td>{{irmaa.t2.singleMax}} – {{irmaa.t3.singleMax}}</td><td>{{irmaa.t3.partB}}</td><td>{{irmaa.t3.partD}}</td></tr>
    <tr><td>{{irmaa.t3.singleMax}} – {{irmaa.topSingle}}</td><td>{{irmaa.t4.partB}}</td><td>{{irmaa.t4.partD}}</td></tr>
    <tr><td>Above {{irmaa.topSingle}}</td><td>{{irmaa.t5.partB}}</td><td>{{irmaa.t5.partD}}</td></tr>
  </tbody>
</table>
</div>

<p class="table-source">Source: CMS {{year}} Parts A &amp; B premiums and deductibles, and the CMS {{year}} Part D income-related adjustment amounts. Per person, per month.</p>

Filing jointly, every threshold in that table is exactly double — {{irmaa.jointStart}} to enter the first tier, {{irmaa.t1.jointMax}} to leave it — with one exception. The top tier starts at {{irmaa.topJoint}} for a couple rather than at twice {{irmaa.topSingle}}. And the surcharge is **per person**: a married couple both on Medicare each pay it, so the household number is twice what the table shows.

Two features of this system are worth more of your attention than the dollar amounts.

**It is a cliff, not a ramp.** One dollar over a threshold moves you into the entire tier. There is no phase-in and no proration. In a year with a large one-time gain, the last few thousand dollars of income can be worth several thousand dollars of premium — which is exactly the sort of thing your tax advisor can model *before* a closing and cannot do anything about after.

**Tax-exempt interest counts.** MAGI here is adjusted gross income plus tax-exempt interest, so municipal bonds land in the calculation even though they are not taxed. So does the taxable portion of Social Security, and so do IRA distributions and Roth conversions. Deductions taken below the AGI line, including the standard deduction, do not pull you back down.

<div class="stat-callout">
  <p class="stat-callout__figure">{{irmaa.t5.annualExtra}} — the most a single year of surcharges can add, per person, at the top tier</p>
  <p class="stat-callout__body">That is the extreme case. At the first tier the extra is {{irmaa.t1.partB}} for Part B instead of {{partB.premium}}, plus {{irmaa.t1.partD}} on Part D — meaningful, annoying, and gone the following year. None of it changes your actual coverage: the Part B deductible stays {{partB.deductible}}, the Part D out-of-pocket cap stays {{partD.cap}}, and your plan behaves exactly as it did before.</p>
  <p class="stat-callout__cite">Source: CMS {{year}} Parts A &amp; B and Part D income-related monthly adjustment amounts. Verified against cms.gov.</p>
</div>

## Can you appeal it? Usually not for the sale itself

This is where a lot of writing on the subject is wrong, so it is worth being blunt. Social Security will reconsider your surcharge using more recent income, but only after one of **eight specific life-changing events**: marriage, divorce or annulment, death of a spouse, work stoppage, work reduction, loss of income-producing property, loss of pension income, or an employer settlement payment. That list is on Form SSA-44 and it does not include selling a house.

What it does include is the thing that often happens alongside the sale. If you sold the Peoria house because you retired, the appealable event is the **work stoppage**, and the sale is simply part of the income picture in the year you are asking them to disregard. If a spouse died and the house was sold afterward, **death of a spouse** is on the list. Filed correctly, with the closing statement and a reasonable estimate of your current-year income, those go through routinely.

Separately from a life-changing event, you can ask Social Security to correct the determination if the IRS data behind it is wrong, if you amended the return, or if they used an older return than they should have. That is a different request, and it is worth making when it applies.

Everything in this section is a tax and Social Security question rather than an insurance one. I will tell you what triggers a surcharge and what the form is; what to do about a specific gain belongs with your CPA or tax advisor, and it is a genuinely worthwhile conversation to have before you sign anything.

## The Peoria version of this question

North Peoria has an unusual concentration of people for whom this is live. The 85383 corridor — Vistancia, Trilogy, Blackstone and the newer stretches out Lake Pleasant Parkway — filled up with households who sold a home somewhere more expensive and moved here inside the last few years. A lot of them arrived already on Medicare, and a lot of them were carrying a plan bought in the state they left.

If that is you, two things are worth separating, because they get conflated constantly:

- **The sale** is a tax event that may raise your premium for one year, two years out. It does not affect your coverage.
- **The move** is an enrollment event. A permanent move out of your old plan's service area triggers a Special Enrollment Period, and if you did not use it, you are on a plan built around a provider network in a state you no longer live in. That one does affect your coverage, every time you see a doctor. [How networks are actually drawn](/learn/medicare-advantage-networks/) explains why an out-of-state plan tends to fail quietly rather than obviously.

At the other end of town, in the 85345 core and Westbrook Village, the pattern is different: original owners, decades of appreciation, and often a surviving spouse now filing single. That combination is the most common way I see a Peoria household land in an IRMAA tier — a $250,000 exclusion against thirty years of Phoenix-metro appreciation. The IRS does allow a widow or widower to use the full $500,000 exclusion if the home is sold **within two years of the spouse's death** and they have not remarried, along with the usual ownership and residence conditions. That two-year window is easy to miss while grieving and expensive to miss afterward, and it is the single detail on this page I would most want someone in that situation to know.

For the local picture generally — plans, networks and the Peoria–Glendale–Sun City ZIP seam — the [Peoria service-area page](/service-area/peoria-az/) is the place to start.

## What to do before you sign, and after the letter arrives

**Before a sale, while you still have options:**

1. **Estimate the gain honestly**, including the improvements you can document. Thirty years of a new roof, an addition and a pool add to your basis and reduce the gain — if you can show them.
2. **Confirm the exclusion applies to you** — two of the last five years of ownership and use as a main home, and the correct filing status. A surviving spouse should check the two-year window before anything else.
3. **Look at what else is in that tax year.** A Roth conversion, a large IRA distribution and a home sale stacked into one year is the arrangement that produces the surprising letter. Spreading them across two years is a conversation for your tax advisor, and the time to have it is before the closing.
4. **Know which tier you are near.** Being $4,000 under a threshold and being $4,000 over it are very different outcomes for the same house.

**After the letter arrives:**

1. **Read it for the tax year it cites** and match that to the sale. Nine times out of ten the mystery ends there.
2. **Ask whether a life-changing event applies** — retirement in particular. If one does, Form SSA-44 with supporting documents is a short piece of work with a real payoff.
3. **Do not switch plans over it.** The surcharge is charged by Medicare, not by your plan, and changing plans does not reduce it by a dollar. I have watched people leave coverage that suited them because they blamed the wrong thing.
4. **Expect it to end.** Absent another spike, next year's determination will take it off automatically.

You can [check where your income lands](/tools/irmaa-estimator/) in about a minute, and [the full explanation of how IRMAA is calculated](/learn/irmaa-explained/) is on the Learn shelf if you want the mechanics.

If you want a second set of eyes on how a sale, a move or a retirement interacts with your Medicare, that is a short conversation rather than an afternoon of reading. The office is in Anthem — roughly 25 minutes from north Peoria, out the Carefree Highway and down Lake Pleasant Parkway — and most of this gets done by phone anyway. Call **(602) 844-6002**, or [book a time](/book/). Bring your tax advisor's numbers if you have them; if you do not, that is often the first thing I will suggest.
