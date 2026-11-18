---
layout: ../../layouts/BlogLayout.astro
title: 'How much will Medicare take out of my Social Security in 2027?'
seoTitle: 'How Much Medicare Takes From Social Security in 2027'
description: '$209.40 a month for most people in 2027, up $6.50 from $202.90. Above $112,000 single or $224,000 joint, Part B is $293.10 to $711.80 plus a Part D add-on.'
summary: 'CMS published the 2027 Part B premium on November 17, and for most retirees the deduction from Social Security goes up by $6.50 a month. For households paying the income surcharge it goes up by more, the rule that stops a Medicare increase from shrinking a check does not protect them, and a single large year on the 2025 tax return can move the deduction by hundreds. Here is the full 2027 deduction, tier by tier, with the 2026 numbers beside it.'
category: IRMAA
publishedAt: 2026-11-18
readMinutes: 8
image: /blog/how-much-will-medicare-take-out-of-social-security-2027-photo.jpg
imageAlt: 'A hand taps the keys of a black calculator on a wooden table next to a fanned stack of hundred-dollar bills and an open notebook.'
faqs:
  - q: How much is taken out of Social Security for Medicare in 2027?
    a: For most people, the standard Part B premium of $209.40 a month, which CMS announced on November 17, 2026. That is $6.50 more than the $202.90 withheld in 2026. If your 2025 modified adjusted gross income was above $112,000 as a single filer or $224,000 filing jointly, Part B is $293.10 to $711.80 instead, and a separate Part D surcharge of $15.40 to $96.40 is also withheld. Any Part D or Medicare Advantage plan premium you asked to have deducted comes out as well.
  - q: Will my Social Security check go down because of the Medicare increase?
    a: For most people, no. Federal law limits the Part B increase to the size of the person's cost-of-living raise, so the net deposit cannot fall from December to January because of the standard premium. That protection does not cover people who pay IRMAA, people whose Part B is not deducted from their benefit, or people new to Social Security or Medicare in the year. For an IRMAA household, a move into a higher tier can make the January deposit smaller than December's.
  - q: Does IRMAA come out of my Social Security check?
    a: Yes, if you are collecting Social Security. Both the Part B surcharge and the Part D surcharge are withheld from the monthly benefit along with the standard premium. Part D IRMAA is billed by Social Security, not by your drug plan or Medicare Advantage plan, so it shows up even when the plan itself has no monthly premium. If you are not yet collecting benefits, Medicare sends a bill instead.
  - q: What is the hold harmless provision for Medicare?
    a: It is the rule in section 1839(f) of the Social Security Act that stops an increase in the standard Part B premium from reducing a person's net Social Security payment below the prior year's amount. If the raise is smaller than the premium increase, the premium for that person goes up only by the size of the raise. It applies only to people who had Part B deducted from their benefit in both November and December and who do not pay the income-related surcharge.
  - q: When will I know my 2027 Social Security amount after Medicare?
    a: Social Security sends a yearly notice in December that shows the new benefit, the Medicare premium being withheld and the net amount, and posts the same notice in the Message Center of a my Social Security account. Anyone whose premium includes IRMAA also gets a separate determination letter explaining the tier and the tax year used. The new deduction first appears in the payment you receive in January.
  - q: Can I stop Medicare from being deducted from my Social Security?
    a: Not the Part B premium. Once you collect Social Security, the law requires the Part B premium and any IRMAA to be withheld from it. The only choice is about plan premiums, which you can have deducted or pay directly to the Part D or Medicare Advantage plan. A plan with a Part B giveback reduces the standard premium withheld, but not the surcharge.
sources:
  - label: 'CMS — 2027 Medicare Parts A & B premiums and deductibles, with the 2027 IRMAA tables (Nov 17, 2026)'
    url: https://www.cms.gov/newsroom/fact-sheets/2027-medicare-parts-b-premiums-deductibles
  - label: 'CMS — 2026 Medicare Parts A & B premiums and deductibles (the 2026 comparison figures)'
    url: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
  - label: '42 U.S.C. § 1395r (Social Security Act § 1839), subsection (f): limit on the premium increase, and (i): income-related adjustment'
    url: https://www.law.cornell.edu/uscode/text/42/1395r
  - label: 'CMS — 2027 Medicare Advantage and Part D landscape files (Arizona stand-alone Part D premiums)'
    url: https://www.cms.gov/files/zip/cy2027-landscape-202609-1.zip
  - label: 'Medicare.gov — Ways to pay Part A and Part B premiums'
    url: https://www.medicare.gov/basics/costs/pay-premiums
---

**For most people, Medicare will take {{partB.premium}} a month out of Social Security in {{figYear}} — the standard Part B premium, $6.50 more than the $202.90 withheld in 2026.** CMS published the figure on November 17. If your 2025 tax return showed modified adjusted gross income above {{irmaa.singleStart}} as a single filer or {{irmaa.jointStart}} filing jointly, Part B is {{irmaa.t1.partB}} to {{irmaa.t5.partB}} instead, and Social Security also withholds a Part D surcharge of {{irmaa.t1.partD}} to {{irmaa.t5.partD}}. Any Part D or Medicare Advantage plan premium you asked to have deducted comes out on top of that.

The $6.50 is the headline, and for most retirees it is all that changes: a federal rule keeps the increase from shrinking anyone's net check. That rule has gaps, though, and the people in them are exactly the households I work with most in north Peoria. Below is the full {{figYear}} deduction tier by tier, with 2026 beside it, and what moves the number more than CMS did.

## What comes out of each check in {{figYear}}, per person

Social Security withholds the Part B premium first, then any Part D surcharge, then any plan premium you chose to have deducted. These are the Medicare amounts only, per person per month, set by the 2025 return for {{figYear}} and by the 2024 return for 2026.

<div class="table-scroll">
<table>
  <caption class="sr-only">Monthly Medicare amounts withheld from Social Security per person in 2026 and {{figYear}}, by income tier for single filers</caption>
  <thead>
    <tr><th scope="col">Single filer MAGI ({{irmaaTaxYear}} return)</th><th scope="col">Part B, {{figYear}}</th><th scope="col">Part D surcharge, {{figYear}}</th><th scope="col">Part B + D surcharge, 2026</th><th scope="col">Change per month</th></tr>
  </thead>
  <tbody>
    <tr><td>Up to {{irmaa.singleStart}}</td><td>{{partB.premium}}</td><td>none</td><td>$202.90</td><td>+$6.50</td></tr>
    <tr><td>{{irmaa.singleStart}} to {{irmaa.t1.singleMax}}</td><td>{{irmaa.t1.partB}}</td><td>{{irmaa.t1.partD}}</td><td>$298.60</td><td>+$9.90</td></tr>
    <tr><td>{{irmaa.t1.singleMax}} to {{irmaa.t2.singleMax}}</td><td>{{irmaa.t2.partB}}</td><td>{{irmaa.t2.partD}}</td><td>$443.30</td><td>+$15.20</td></tr>
    <tr><td>{{irmaa.t2.singleMax}} to {{irmaa.t3.singleMax}}</td><td>{{irmaa.t3.partB}}</td><td>{{irmaa.t3.partD}}</td><td>$587.90</td><td>+$20.50</td></tr>
    <tr><td>{{irmaa.t3.singleMax}} to {{irmaa.topSingle}}</td><td>{{irmaa.t4.partB}}</td><td>{{irmaa.t4.partD}}</td><td>$732.50</td><td>+$25.80</td></tr>
    <tr><td>Above {{irmaa.topSingle}}</td><td>{{irmaa.t5.partB}}</td><td>{{irmaa.t5.partD}}</td><td>$780.90</td><td>+$27.30</td></tr>
  </tbody>
</table>
</div>

The "change" column compares the same tier in both years, which is the right comparison only if your income stayed in the same band. Joint filers double the first four lines (the surcharge starts above {{irmaa.jointStart}}) and the top band begins at {{irmaa.topJoint}}. The thresholds themselves rose about 2.75% for {{figYear}}: the first one moved from $109,000 to {{irmaa.singleStart}} single and from $218,000 to {{irmaa.jointStart}} joint.

## The same numbers for a married couple, over a year

Everything above is per person, and a couple on Medicare pays it twice. Here is what the {{figYear}} increase adds up to across twelve months for two people who stay in the same tier, Part B and the Part D surcharge together. I worked these out from the two CMS fact sheets; I have not seen them published this way, and they are the number couples actually ask me for.

<div class="table-scroll">
<table>
  <caption class="sr-only">Annual increase in Medicare deductions for a married couple from 2026 to {{figYear}}, assuming the same income tier both years</caption>
  <thead>
    <tr><th scope="col">Joint MAGI ({{irmaaTaxYear}} return)</th><th scope="col">Couple's withholding, {{figYear}}, per year</th><th scope="col">Increase over 2026, per year</th></tr>
  </thead>
  <tbody>
    <tr><td>Up to {{irmaa.jointStart}}</td><td>$5,025.60</td><td>$156.00</td></tr>
    <tr><td>{{irmaa.jointStart}} to {{irmaa.t1.jointMax}}</td><td>$7,404.00</td><td>$237.60</td></tr>
    <tr><td>$282,000 to $354,000</td><td>$11,004.00</td><td>$364.80</td></tr>
    <tr><td>$354,000 to $424,000</td><td>$14,601.60</td><td>$492.00</td></tr>
    <tr><td>$424,000 to {{irmaa.topJoint}}</td><td>$18,199.20</td><td>$619.20</td></tr>
    <tr><td>Above {{irmaa.topJoint}}</td><td>$19,396.80</td><td>$655.20</td></tr>
  </tbody>
</table>
</div>

So a couple at the top pays about four times the standard couple's increase, and nearly four times the total. None of this includes a drug plan or Medicare Advantage premium, which is separate.

## Who the "hold harmless" rule protects, and who it leaves out

Section 1839(f) of the Social Security Act says a rise in the standard Part B premium cannot push a person's net Social Security payment below what it was the year before. If someone's cost-of-living raise in dollars is smaller than the premium increase, their premium goes up only by the size of the raise. For {{figYear}}, with the raise Social Security announced in October, that will rarely bind: $6.50 is small next to almost any benefit's adjustment. For most people the January deposit will simply be larger than December's.

The protection has three gaps, and they matter here:

- **Anyone paying IRMAA.** The statute applies only when the premium is *not* income-adjusted. A surcharge household gets the full increase however small the raise, and a move up a tier can make January's deposit smaller than December's.
- **Anyone whose Part B is not withheld from Social Security** in both November and December, including people still working and paying Medicare directly.
- **People new to Social Security or Part B** in the year. Someone turning 65 and starting both in {{figYear}} pays {{partB.premium}} from the first check.

## The bigger swing: which tier the 2025 return puts you in

For a surcharge household, CMS's increase is the small part. The large part is which tier the 2025 return lands in, because each step is worth far more than a year's increase. Crossing the first line costs a single person $83.70 a month in Part B plus {{irmaa.t1.partD}} in Part D, about $1,190 a year, and a couple who both cross it pays roughly $2,380. The gap between the second and third tiers is bigger again.

That is why the January deposit surprises people. A retiree whose 2024 income was modest, and who then sold a rental, took a large IRA withdrawal or did a Roth conversion in 2025, paid the standard premium in 2026 and will be priced at a surcharge tier for {{figYear}}. The change in the check is the tier jump plus the increase, and the hold-harmless rule covers neither. If that is you, [the Roth conversion post](/blog/does-a-roth-conversion-affect-medicare-premiums/) and [the home sale post](/blog/does-selling-my-house-affect-medicare-premiums/) cover the two most common causes, and the [IRMAA estimator](/tools/irmaa-estimator/) shows where a given income falls.

It also runs the other way. A household whose 2024 return carried a final salary and whose 2025 return did not can drop a tier or two, and their {{figYear}} deduction falls even with CMS's increase. If a work stoppage is the reason and Social Security still used the older year, the [IRMAA appeal page](/irmaa-appeal/) walks through Form SSA-44.

## Plan premiums you chose to have withheld went up too

Part B is the deduction everyone has. A drug plan or Medicare Advantage premium comes out of Social Security only if you asked for it, and in Arizona that line is moving more than Part B this year.

According to CMS's 2027 plan landscape files, none of the nine stand-alone Part D plans offered in Arizona for {{figYear}} has a $0 premium, where four did in 2026, and the two AARP-branded plans roughly doubled. A Medicare Supplement household that had its drug plan premium withheld will see that line rise in January alongside Part B. [What Arizona Part D plans cost for 2027](/blog/medicare-part-d-plans-arizona-2027/) has the plan-by-plan list.

On the Advantage side, a plan with a Part B giveback lowers the amount withheld, but only from the standard premium. It never touches IRMAA: a surcharge household on a giveback plan still has the full surcharge withheld. [Is the Part B giveback worth it](/blog/is-the-medicare-part-b-giveback-worth-it-peoria-az/) goes through that trade.

## Why this shows up most in north Peoria

Of all the households I work with across the Valley, the ones in 85383 are the most likely to be in one of the hold-harmless gaps. Trilogy at Vistancia, Vistancia itself and the Blackstone side of the Happy Valley corridor have a high share of couples whose retirement income alone sits near the first IRMAA line, and a surprising number of them did something large in 2025: sold the house they came from, started required distributions, or converted part of an IRA in a low-bracket year. Each is sensible. Each also shows up on the return Social Security is using to set the {{figYear}} deduction.

The other common case is the couple where one spouse is on Medicare and still working, paying Part B directly, and the other is already collecting Social Security. They are on two different footings for the same increase, and only one of them gets the hold-harmless protection.

Down in 85345 and Westbrook Village the picture is mostly the standard tier, the $6.50, and a January deposit that goes up. Same city, very different January. [Medicare in Peoria](/service-area/peoria-az/) has more on how the north and south ends of the city differ.

## When you will see the new number

Social Security sends each beneficiary a yearly notice in December showing the new gross benefit, the Medicare premium being withheld and the net payment, and posts the same notice in the Message Center of a my Social Security account. Anyone whose premium includes IRMAA also receives a separate determination letter that names the tax year used and the tier. The new deduction first shows up in the payment you receive in January.

Read both. The yearly notice tells you the amount; the IRMAA letter tells you why. If the year named on it is not the year you expected, or the income on it is wrong, that is the moment to act, not April.

## What to check before January

1. **Find your 2025 MAGI** — adjusted gross income plus tax-exempt interest — and compare it with the {{figYear}} lines: {{irmaa.singleStart}} single, {{irmaa.jointStart}} joint.
2. **Compare it with your 2024 figure.** If the two returns fall in different tiers, expect the deduction to move by much more than $6.50, in one direction or the other.
3. **List any plan premiums you have withheld** and check their {{figYear}} amounts in the plan's Annual Notice of Change. Open enrollment runs to December 7 if a drug plan's new premium is reason to switch.
4. **Open the December notice and any IRMAA letter** the week they arrive, and check the tax year shown.
5. **If income fell because you stopped or cut back work**, look at Form SSA-44 before paying a surcharge you may not owe. If you are still working at 65 and paying Medicare directly, none of this comes out of a check yet; [this post covers paying without Social Security](/blog/how-do-i-pay-my-medicare-premium-if-im-not-on-social-security/).

This is Medicare education, not tax advice. Questions about how a conversion, sale or distribution is reported belong with your tax advisor.

## The short version

- **Standard deduction:** {{partB.premium}} a month in {{figYear}}, up $6.50 from $202.90, for anyone under {{irmaa.singleStart}} single or {{irmaa.jointStart}} joint on the 2025 return.
- **With IRMAA:** Part B of {{irmaa.t1.partB}} to {{irmaa.t5.partB}}, plus a Part D surcharge of {{irmaa.t1.partD}} to {{irmaa.t5.partD}}, per person.
- **Hold harmless** stops the increase shrinking most checks, but not for IRMAA payers, new enrollees or anyone not paying Part B through Social Security.
- **The tier matters more than the increase.** One step up the brackets costs more in a month than a year of CMS's increase.
- **Plan premiums are separate** and, for Arizona stand-alone drug plans, rising faster than Part B.
- **Watch for the December notice** and, if you pay a surcharge, the IRMAA letter with it.

## Want someone to check the numbers with you?

If your 2025 return looks different from 2024, it is worth fifteen minutes before January to see what the deduction will be and whether anything can be done about it. I go through the Medicare side at no cost: which tier, which year, which plan premiums are withheld, and whether a plan change before December 7 makes sense. The tax side stays with your tax advisor.

The office is in Anthem, about 25 minutes from north Peoria, and most of these conversations happen by phone. [Book a time here](/book/?topic=irmaa) and I will call you at the time you pick.
