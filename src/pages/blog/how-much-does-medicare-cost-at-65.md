---
layout: ../../layouts/BlogLayout.astro
title: "How much does Medicare cost at 65?"
seoTitle: "How Much Does Medicare Cost at 65 in Arizona? 2027"
description: "Part B is $202.90 a month in 2026; Part A is $0 for most. Add a 2027 Arizona drug plan ($5.30 to $191.50) and Medigap, or a $0-premium Advantage plan."
summary: "Medicare at 65 is not one bill. It is Part B for nearly everyone, Part A for almost no one, and then a choice between two very differently priced routes. Here is each line for a Peoria household turning 65, what changes on January 1, 2027, and why a first-year bill can be higher than anyone quoted you."
category: Enrollment
publishedAt: 2026-10-18
readMinutes: 9
image: /blog/how-much-does-medicare-cost-at-65-photo.jpg
imageAlt: 'A smiling woman in glasses and a polka-dot blouse talks on her phone while working on a laptop at a small table at home.'
faqs:
  - q: How much does Medicare cost per month at 65?
    a: For most people the only bill Medicare itself sends is the Part B premium, which is $202.90 a month in 2026. Part A is premium-free if you or your spouse worked about ten years. On top of Part B you add either a Medicare Advantage plan, which in Maricopa County usually carries a $0 premium, or a Medicare Supplement plus a stand-alone drug plan, which in Arizona runs $5.30 to $191.50 a month for 2027 before the supplement premium. Higher earners also pay an IRMAA surcharge on Part B and Part D.
  - q: Is Medicare free when you turn 65?
    a: No. Part A is premium-free for most people, but Part B has a monthly premium that almost everyone pays, and nothing in Medicare covers prescriptions until you add a Part D plan or a Medicare Advantage plan with drug coverage. A $0-premium Advantage plan still requires you to keep paying Part B, and it carries copays and an out-of-pocket maximum.
  - q: Do I have to pay for Medicare Part A?
    a: Only if neither you nor your spouse has about 40 quarters of work where Medicare tax was paid. With 30 to 39 quarters the Part A premium is $311 a month in 2026, and with fewer than 30 it is $565. Everyone, premium or not, still faces the Part A hospital deductible of $1,736 per benefit period unless a supplement or Advantage plan picks it up.
  - q: How much is Medicare taken out of Social Security at 65?
    a: If you are drawing Social Security, the Part B premium is deducted from your monthly payment, $202.90 in 2026 for most people, plus any IRMAA surcharge and, if you choose, your Part D or Advantage plan premium. If you are 65 but not yet drawing Social Security, nothing is deducted. Medicare bills you directly instead, every three months for Part B.
  - q: Will Medicare cost more in 2027?
    a: Some of it will. CMS announces the 2027 Part B premium and deductibles in mid-November, so the 2026 figures are the current ones until then. Part D is already set for 2027 - the out-of-pocket drug cap rises to $2,400, the national base premium rises to $41.33, and Arizona no longer has any $0 stand-alone drug plan. The average Medicare Advantage premium in Arizona falls to $2.81 for 2027.
  - q: Why is my Medicare premium higher than the standard amount?
    a: Almost always IRMAA, the income-related surcharge. Social Security sets it from the tax return you filed two years earlier, so someone turning 65 in 2027 is priced on 2025 income, which for most people is a full working year. If your income has since dropped because you retired, Form SSA-44 asks Social Security to use the lower figure instead.
sources:
  - label: 'Medicare.gov — Medicare costs (2026 premiums and deductibles)'
    url: https://www.medicare.gov/basics/costs/medicare-costs
  - label: 'CMS — 2026 Medicare Parts A & B premiums and deductibles fact sheet'
    url: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
  - label: 'CMS — 2027 Medicare Advantage and Part D landscape, state-by-state fact sheets (Arizona average premium)'
    url: https://www.cms.gov/files/document/2027-medicare-advantage-part-d-landscape-state-state-fact-sheets.pdf
  - label: 'CMS — CY2027 MA and Part D landscape files (Maricopa plan counts and Arizona drug plan premiums)'
    url: https://www.cms.gov/files/zip/cy2027-landscape-202609-1.zip
  - label: 'CMS — Medicare Part D 2027 national average monthly bid amount and base beneficiary premium (July 28, 2026)'
    url: https://cms.gov/newsroom/fact-sheets/medicare-part-d-2027-national-average-monthly-bid-amount-information
  - label: 'Social Security Administration — POMS HI 01101.001, income-related monthly adjustment amounts'
    url: https://secure.ssa.gov/poms.nsf/lnx/0601101001
  - label: 'Social Security Administration — Form SSA-44, life-changing event'
    url: https://www.ssa.gov/forms/ssa-44.pdf
---

**For most people turning 65, the only bill Medicare itself sends is the Part B premium: {{partB.premium}} a month in {{year}}.** Part A costs nothing if you or your spouse worked about ten years. Everything after that is a choice. In Maricopa County you can pair Part B with a Medicare Advantage plan that usually carries a $0 premium, or with a Medicare Supplement and a stand-alone drug plan, where Arizona's drug plans alone run $5.30 to $191.50 a month for 2027. And if your income is high, IRMAA adds to both Part B and Part D.

That is why the honest answer to "how much does Medicare cost" is a range, and why two neighbors in the same Vistancia cul-de-sac can be paying a few hundred dollars a month apart. I meet a lot of 64-year-olds in north Peoria, around 85383 and the Happy Valley corridor, who were quoted a single number by a friend and then got a very different first bill. Here is each line, so yours does not surprise you.

## The bills, line by line

<div class="table-scroll">
<table>
  <caption class="sr-only">What each part of Medicare costs a person turning 65 in Arizona</caption>
  <thead>
    <tr><th scope="col">Line</th><th scope="col">Who pays it</th><th scope="col">Amount now</th><th scope="col">2027 status</th></tr>
  </thead>
  <tbody>
    <tr><td>Part A premium</td><td>Only people without 40 work quarters</td><td>$0 for most; {{partA.premiumIfUninsured}} at most</td><td>CMS announces mid-November</td></tr>
    <tr><td>Part B premium</td><td>Nearly everyone</td><td>{{partB.premium}} a month</td><td>CMS announces mid-November</td></tr>
    <tr><td>Part B deductible</td><td>Original Medicare users, once a year</td><td>{{partB.deductible}}</td><td>CMS announces mid-November</td></tr>
    <tr><td>Stand-alone Part D</td><td>Anyone on Original Medicare who wants drug coverage</td><td>Varies by plan</td><td>$5.30 to $191.50 in Arizona; none at $0</td></tr>
    <tr><td>Medicare Supplement</td><td>Optional, Original Medicare only</td><td>Priced by age, ZIP, sex, tobacco and carrier</td><td>Set by each carrier</td></tr>
    <tr><td>Medicare Advantage</td><td>Optional, replaces the supplement route</td><td>Varies by plan</td><td>Arizona average $2.81; 39 of 45 Maricopa drug-inclusive plans at $0</td></tr>
    <tr><td>IRMAA</td><td>Single filers above {{irmaa.singleStart}}, joint above {{irmaa.jointStart}}</td><td>Adds to Part B and Part D</td><td>Priced from your 2025 tax return</td></tr>
  </tbody>
</table>
</div>

<p class="table-source">Sources: Medicare.gov costs page; CMS 2026 Parts A and B fact sheet; CMS CY2027 landscape files and 2027 state fact sheets. Amounts "now" are {{year}} figures.</p>

Notice what is not on that list: a bill from Medicare for drugs, dental, hearing or vision. Original Medicare does not cover routine versions of any of them, which is why nobody stops at Part B.

## Part A: why it costs most people nothing

Part A is the hospital side, and you prepaid it. Forty quarters of work where Medicare tax came out of your paycheck, about ten years, makes it premium-free for life, and a spouse's record counts too. Most people turning 65 in Peoria clear that easily.

The exceptions are real, though, and I see them more often in this part of the Valley than you might guess: someone who spent a career abroad, a spouse who raised children and whose partner's record is the only one available after a divorce, a recent arrival whose work history was mostly self-employed and lightly reported. With 30 to 39 quarters the premium is the reduced rate, and below 30 it is the full {{partA.premiumIfUninsured}} a month. If you are not sure where you stand, [count your quarters](/tools/part-a-premium/) before you count on $0.

Premium-free is not cost-free. A hospital stay still carries the Part A deductible of {{partA.deductible}} per benefit period, and a long one adds daily coinsurance of {{partA.days61to90}} from day 61. That exposure is what the next two sections are really about.

## Part B: the one bill almost nobody avoids

Part B is doctors, outpatient care, labs and imaging, and it carries a premium for everyone: {{partB.premium}} a month in {{year}}, or {{partB.annual}} over the year. For a married couple both on Medicare, double it. There is a {{partB.deductible}} annual deductible, and after that Original Medicare pays 80 percent and leaves you {{partB.coinsurance}} with no annual ceiling.

How you pay depends on whether you have claimed Social Security yet:

- **Drawing Social Security:** the premium comes out of your monthly payment before it reaches your bank.
- **Not drawing it yet**, which describes most people turning 65 now that full retirement age is 67: Medicare bills you directly, every three months. The [direct-billing post](/blog/how-do-i-pay-my-medicare-premium-if-im-not-on-social-security/) covers Easy Pay and the due dates.

The only common way to delay Part B without paying a lifetime penalty later is active coverage through a current employer with 20 or more employees. If that is you, the bill on this line can wait, and [the still-working post](/blog/do-i-need-medicare-at-65-if-still-working/) explains how to prove it.

## Route one: Medigap and a drug plan

This is the route where you keep Original Medicare and buy two private policies on top of it. It costs more each month and buys you a very short list of surprises.

**The drug plan.** Arizona has nine stand-alone Part D plans for 2027, priced the same statewide, from $5.30 to $191.50 a month. None is $0 for 2027. The out-of-pocket cap on covered drugs rises from {{partD.cap}} this year to $2,400, which limits what you can owe at the counter but is one reason premiums climbed. [The Arizona Part D plan table](/blog/medicare-part-d-plans-arizona-2027/) lists all nine.

**The supplement.** This is usually the largest line in the household's Medicare budget, and the one I cannot quote in a blog post, because it is not a single price. Supplement carriers in Arizona price by age, ZIP code, sex, tobacco use and their own rate history, and the same lettered plan can differ meaningfully from one carrier to the next even though the coverage is identical by federal law. What you get for that premium is the important part: on Plan G, your yearly exposure for Medicare-covered care is essentially the Part B deductible. [Plan G against Plan N](/blog/plan-g-vs-plan-n-arizona-which-should-i-choose/) is the decision most 65-year-olds on this route end up weighing.

One timing fact changes the cost of this route more than any carrier does. Your six-month Medigap open enrollment starts the month Part B starts, and during it no carrier can decline you or charge more for your health. Arizona has no annual birthday-month do-over, so once that window closes, a supplement can require medical questions for the rest of your life. [When that window opens and closes](/blog/when-is-medicare-supplement-open-enrollment-arizona/) is worth reading before you file for Part B.

## Route two: a Maricopa County Advantage plan

Medicare Advantage replaces the supplement and the drug plan with one plan, and in this county the premium is usually the smallest number on the page. For 2027, 39 of the 45 general Medicare Advantage plans with drug coverage sold in Maricopa carry a $0 premium, and CMS puts Arizona's average Advantage premium at $2.81 a month, down from $4.47.

A $0 premium does not make the plan cost nothing, and anyone who calls it free is skipping three lines:

1. **You still pay Part B.** Every Advantage member keeps paying the {{partB.premium}}, unless the plan has a Part B giveback, which [has its own trade-offs](/blog/is-the-medicare-part-b-giveback-worth-it-peoria-az/).
2. **You pay as you use care.** Copays for visits, specialists, imaging and hospital days replace the supplement's premium. A healthy year costs little. A hard year costs more.
3. **There is a ceiling, and it varies.** Each plan sets an annual in-network out-of-pocket maximum, and among Maricopa's 2027 plans those run from $2,000 to $8,900. That ceiling is the honest worst-case figure to compare against a year of supplement premiums.

The other cost of this route is not in dollars. A network decides whether your Arrowhead cardiologist or the specialists you drive to in Sun City are in or out. Check your own doctors against each plan before comparing premiums, because the plans that are missing your doctors are not really options.

## Why your first year can cost more than the quote

This is the line that surprises the people I work with most, and it hits hardest the year you turn 65.

IRMAA, the income-related surcharge, is set from your tax return two years back. For {{year}}, that is your {{irmaaTaxYear}} return. Turn 65 in 2027 and Social Security looks at 2025, which for most people was a full salary year, possibly with a bonus, deferred comp or a stock sale on top. Above {{irmaa.singleStart}} single or {{irmaa.jointStart}} joint, Part B rises to {{irmaa.t1.partB}} a month at the first tier, and Part D picks up a surcharge of {{irmaa.t1.partD}}. At the top tier Part B is {{irmaa.t5.partB}}. The surcharge applies on either route, Advantage included, and a giveback does not reduce it.

The fix exists, but it is not automatic. Retirement counts as a life-changing event, and Form SSA-44 asks Social Security to price you on this year's lower income instead of the old return. [How to file the SSA-44](/blog/how-do-i-appeal-irmaa-after-retirement/) walks through the documents. If a Roth conversion or a home sale is planned for your first Medicare years, talk it through with your tax advisor first, because that income comes back as IRMAA two years later. You can [estimate your tier](/tools/irmaa-estimator/) in a minute.

## What to do with this before your Part B starts

- **Work out Part A.** If you or your spouse has 40 quarters, it is $0. If not, find out before you enroll.
- **Put Part B in the budget** at {{partB.premium}} a month per person for now, and expect CMS to publish the 2027 figure in mid-November.
- **Price both routes against the same year.** Supplement plus drug plan premiums on one side; $0 to low Advantage premiums plus the plan's out-of-pocket maximum on the other.
- **Check for IRMAA** on your 2025 income, and line up the SSA-44 if your income has already dropped.
- **Mark your Medigap window** before you choose your Part B start date. [The enrollment timeline tool](/tools/enrollment-timeline/) lays the months out for your birthday.

If you would rather see the numbers for your own ZIP, doctors and prescriptions side by side, [book a Turning-65 review](/book/?topic=t65) and I will price both routes with you. I cover Peoria from the Anthem office, about 25 minutes out the Carefree Highway, and the [Peoria page](/service-area/peoria-az/) has more on how the plan menu works on that side of the Valley.
