---
layout: ../../layouts/BlogLayout.astro
title: "Do I have to buy Medicare Part A if I don't have 40 quarters?"
seoTitle: "Buying Medicare Part A Without 40 Quarters: Arizona 2027"
description: "No, but skipping it closes doors. Without 40 quarters Part A is $328 or $597 a month in 2027, and buying it means you must take Part B as well."
summary: "Short of the 40 work quarters that make Part A premium-free, you are not required to buy it. But premium Part A comes bundled with Part B, carries its own late penalty, and is the entry ticket to every Medigap and Medicare Advantage plan in Maricopa County. Here is how a Peoria retiree decides, and the ways to stop paying it."
category: Enrollment
publishedAt: 2026-11-19
readMinutes: 8
image: /blog/do-i-have-to-buy-medicare-part-a-without-40-quarters-photo.jpg
imageAlt: 'An older man with a white beard and glasses sits at a white table beside a laptop and a coffee cup, reading through a stack of papers.'
faqs:
  - q: Do I have to buy Medicare Part A if I don't have 40 quarters?
    a: No. Nobody is required to buy premium Part A. But if you skip it you cannot join a Medicare Advantage plan or buy a Medigap policy, because both require Part A and Part B, and you will owe a 10 percent late penalty if you buy it later outside a special enrollment period. If you do buy Part A, Medicare requires you to take Part B too.
  - q: How much is Medicare Part A if you don't have 40 quarters?
    a: For 2027 it is $328 a month with 30 to 39 quarters of Medicare-covered work, and $597 a month with fewer than 30, according to CMS's notice in the Federal Register on November 19, 2026. A spouse's or former spouse's work record can lower or erase that premium, so check both records before you assume you owe it.
  - q: Can I get Medicare Part B without Part A?
    a: Yes. If you are 65 or older and a U.S. citizen, or a lawful permanent resident who has lived here continuously for five years, you can enroll in Part B alone. The trade-off is that Part B alone leaves hospital stays uncovered and keeps you out of Medigap and Medicare Advantage, which both require Part A and Part B.
  - q: What happens if I don't have enough work credits for Medicare?
    a: You are still eligible for Medicare at 65; you simply pay a premium for Part A instead of getting it at no premium. Before paying, check whether a current spouse who is 62 or older, a former spouse from a marriage of at least ten years, or a deceased spouse has 40 quarters, because their record can make your Part A premium-free.
  - q: Can I keep working to get 40 quarters for Medicare?
    a: Yes. Quarters keep accruing on any job where Medicare tax comes out of your pay, at up to four a year, even after 65. When your record reaches 30 quarters the premium drops to the reduced rate, and at 40 it drops to zero. Social Security adjusts the premium once the quarters post to your record.
  - q: Do work credits from another country count toward Medicare?
    a: No. Social Security's operations manual says U.S. and foreign coverage cannot be combined to establish premium-free Part A. Totalization agreements can help you qualify for a Social Security retirement check, but the quarters for Medicare have to come from U.S. work alone, or from a spouse's U.S. record.
sources:
  - label: 'Federal Register — CY 2027 Part A premiums for the uninsured aged (CMS notice, Nov 19, 2026)'
    url: https://www.federalregister.gov/documents/2026/11/19/2026-23604/medicare-program-cy-2027-part-a-premiums-for-the-uninsured-aged-and-for-certain-disabled-individuals
  - label: 'Medicare.gov — Medicare costs (buying Part A requires signing up for Part B)'
    url: https://www.medicare.gov/basics/costs/medicare-costs
  - label: 'Medicare.gov — Avoid late enrollment penalties (Part A: 10% for twice the years you did not sign up)'
    url: https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties
  - label: 'Social Security POMS GN 01701.140 — Totalization claims and premium-free Part A'
    url: https://secure.ssa.gov/POMS.NSF/lnx/0201701140
  - label: '42 CFR § 406.20 — Who may enroll in premium Part A'
    url: https://www.law.cornell.edu/cfr/text/42/406.20
  - label: 'Medicare Interactive — If I do not have Part A, can I still get Part B?'
    url: https://www.medicareinteractive.org/get-answers/introduction-to-medicare/medicare-eligibility/if-i-do-not-have-part-a-can-i-still-get-part-b
  - label: 'CMS — Medicare Advantage and Part D plan landscape files, contract year 2027'
    url: https://www.cms.gov/files/zip/cy2027-landscape-202609-1.zip
---

**No. Medicare does not make anyone buy premium Part A, but deciding not to has costs you can't see on the premium line.** For {{figYear}}, Part A runs {{partA.premiumIfUninsured}} a month if you have fewer than 30 quarters of Medicare-covered work, and 45 percent less if you have 30 to 39, according to the CMS notice published in the Federal Register on November 19, 2026. If you buy it, Medicare requires you to take Part B as well. If you skip it, you also give up Medigap and Medicare Advantage, which both require Part A.

Most people never face this question, because 40 quarters, about ten years of paychecks with Medicare tax taken out, makes Part A premium-free for life. The people who do face it are a group I meet regularly in [Peoria](/service-area/peoria-az/), particularly up in 85383. Vistancia and Trilogy are full of people who came to Arizona from somewhere else, and "somewhere else" is sometimes a twenty-year career in London or Toronto, a family business that paid in dividends rather than wages, or a parent who moved here to be near grandchildren after a working life abroad. They are often comfortable financially. They are also often surprised that comfortable doesn't mean covered.

## What Part A costs without 40 quarters in {{figYear}}

The premium depends only on how many quarters of Medicare-covered work sit on the record you use: yours, or a qualifying spouse's.

<div class="table-scroll">
<table>
  <caption class="sr-only">Monthly Medicare Part A premium in the plan year by number of quarters of Medicare-covered work</caption>
  <thead>
    <tr><th scope="col">Quarters on the record</th><th scope="col">Monthly Part A premium</th><th scope="col">Over a full year</th></tr>
  </thead>
  <tbody>
    <tr><td>40 or more</td><td>$0</td><td>$0</td></tr>
    <tr><td>30 to 39</td><td>The reduced premium, 45% below the full rate</td><td>Roughly 55% of the full-rate year</td></tr>
    <tr><td>Fewer than 30</td><td>{{partA.premiumIfUninsured}}</td><td>Twelve months at {{partA.premiumIfUninsured}}</td></tr>
  </tbody>
</table>
</div>

Part B is separate and everyone pays it regardless of work history: {{partB.premium}} a month in {{figYear}}, more if your income puts you in an IRMAA bracket. So a 65-year-old with 25 quarters who buys both is paying two premiums before any supplement or drug plan, and the Part A one is usually the bigger of the two. The [Part A premium checker](/tools/part-a-premium/) does the quarters arithmetic if you aren't sure which row you're in.

## The Part B rule that comes attached

Medicare.gov puts it in a single sentence: "You also have to sign up for Part B to buy Part A." There is no Part A-only purchase for someone paying the premium.

The reverse is allowed. If you are 65 or over and a U.S. citizen, or a lawful permanent resident with five continuous years of U.S. residence, you can enroll in Part B on its own and leave Part A alone. That is the move people reach for when they first see the premium, and it deserves a hard look before you make it, because of what Part A unlocks.

## What skipping Part A takes off the table

**Every Medicare Advantage plan requires Part A and Part B.** According to CMS's {{figYear}} plan landscape files, Maricopa County has 85 Medicare Advantage plans for {{nextYear}}, special needs plans included. Not one of them is available to someone holding Part B alone.

**Every Medigap policy requires Part A and Part B too.** That includes Plan G and Plan N, and it includes the one-time six-month Medigap open enrollment window that starts with your Part B, the window in which no insurer can ask a health question. Arizona has no birthday rule or annual switch window to fall back on later, so a Peoria retiree who skips Part A at 65 and decides at 68 that they want a supplement may be answering medical questions to get one.

**A hospital admission is simply uncovered.** Without Part A, Medicare pays nothing toward the room, the nursing or the skilled nursing stay afterward. Part B still pays the doctors who see you in the hospital, but the facility bill for even a short Banner or HonorHealth admission is the part that runs into five figures.

Who does skip it? Usually someone with large employer coverage still in force, or a retiree with substantial assets who is deliberately self-insuring the hospital risk for a few years while they earn the remaining quarters. Both can be reasonable. Neither should be an accident.

## The Part A late penalty works differently from Part B's

If you have to buy Part A and don't buy it when you are first eligible, Medicare.gov says your premium "may go up 10%," and you pay that penalty "for twice the number of years you didn't sign up." Skip two years and you pay the higher premium for four.

That is a different shape from the Part B penalty, which is 10 percent for each full 12 months you went without and lasts as long as you have Part B. The Part A penalty ends; the Part B one does not. For someone who expects to reach 40 quarters within a couple of years, that difference matters, because once the record hits 40 the Part A premium, and the penalty on it, goes to zero.

The penalty doesn't apply if you delay under a Special Enrollment Period, which in practice means coverage from a current job, yours or your spouse's, at an employer with 20 or more employees. Retiree coverage and COBRA don't count. The [late enrollment penalty calculator](/tools/late-enrollment-penalty-calculator/) shows both penalties side by side.

## Ways to stop paying the Part A premium

**Use a spouse's record.** A current spouse who is 62 or older with 40 quarters, after at least a year of marriage, makes your Part A premium-free at 65. A former spouse from a marriage of ten years or more can do the same if you are unmarried now. Those rules are laid out in [Can my spouse get Medicare when I turn 65?](/blog/can-my-spouse-get-medicare-when-i-turn-65/) and [Can I get Medicare on my ex-spouse's record?](/blog/can-i-get-medicare-on-my-ex-spouses-record/), and they are the first thing I check because they solve the problem outright.

**Keep earning quarters.** Any job where Medicare tax comes out of your pay adds quarters, up to four a year, at any age. Consulting for a former employer as a W-2 employee, a part-time role at one of the hospitals off Lake Pleasant Parkway, self-employment income reported on Schedule SE: all of it counts. At 30 quarters the premium drops to the reduced rate; at 40 it drops to nothing.

**Don't count on foreign work.** This is the one that catches recent arrivals. Social Security's operations manual is direct: "U.S. and foreign coverage cannot be combined to establish entitlement to premium-free HI." A totalization agreement with the country you worked in may help you qualify for a Social Security retirement check, but the quarters for premium-free Part A have to be U.S. quarters alone.

**If income is limited, ask about help.** Arizona's Medicaid agency, AHCCCS, runs the Medicare Savings Programs, which can pay the Part A premium for people under the income and resource limits. Most of the households I work with in north Peoria are well above them, but it is worth knowing the door exists for a parent you are helping.

## What to do before your 65th birthday

1. **Pull your Social Security earnings record** from your my Social Security account and count the quarters. Don't estimate from years worked; count what posted.
2. **Check every record you could use:** yours, a current spouse's, a former spouse's from a ten-year marriage, a late spouse's.
3. **If you are short, decide on purpose.** Buy Part A and Part B together in your initial enrollment period, or take Part B alone knowing what that rules out, or delay both under employer coverage from current work.
4. **Map the date you hit 30 or 40 quarters** if you plan to keep working, and set a reminder to confirm Social Security lowered the premium.
5. **Line up your Medigap window.** It opens with Part B, so the Part B start date you choose here sets the six months you will never get back.

The [enrollment timeline tool](/tools/enrollment-timeline/) builds your dates from your birthday. If you'd rather go through your quarters and options with someone, you can [book a Turning 65 review](/book/?topic=t65). I'm based in Anthem and work with people across Peoria and the rest of the northwest Valley by phone or by appointment.
