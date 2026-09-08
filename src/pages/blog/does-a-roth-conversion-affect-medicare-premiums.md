---
layout: ../../layouts/BlogLayout.astro
title: 'Does a Roth conversion affect Medicare premiums?'
seoTitle: 'Does a Roth Conversion Affect Medicare Premiums?'
description: 'Yes. Every dollar you convert counts as income for IRMAA, and a conversion this year sets your Part B and Part D premiums two years out. Here is the math.'
summary: 'A Roth conversion is taxable income, and Medicare reads that income two years later to set your premium. Convert in the wrong year, or one dollar too far, and the surcharge lands on both spouses for twelve months. Here is how the 2026 brackets work, what a conversion this year does to your 2028 premium, why it cannot be appealed or undone, and how north Peoria retirees who just rolled over a 401(k) are handling it before December 31.'
category: IRMAA
publishedAt: 2026-09-08
readMinutes: 9
image: /blog/medicare-roth-conversion-irmaa-2026.png
imageAlt: '602Medicare article card reading "Does a Roth conversion affect Medicare premiums?", with the 602Medicare badge and a byline for Brian Penner, Licensed Independent Medicare Advisor.'
faqs:
  - q: Does a Roth conversion affect Medicare premiums?
    a: Yes. The amount you convert from a traditional IRA or 401(k) to a Roth is taxed as ordinary income in the year you convert, and it is included in the modified adjusted gross income Social Security uses to set your Medicare Part B and Part D premiums. If the conversion pushes your income past an IRMAA threshold, you pay a higher premium for the full year, two years after the conversion.
  - q: Does a Roth conversion count as income for IRMAA?
    a: It does, dollar for dollar. IRMAA is based on modified adjusted gross income, which is your adjusted gross income plus tax-exempt interest, and a Roth conversion sits inside adjusted gross income like any other IRA distribution. Converting $100,000 raises your MAGI by $100,000 for that tax year, exactly as if you had earned it as wages.
  - q: Will a $100k Roth conversion raise my Medicare premiums?
    a: It depends on where your income already sits. If you are a married couple filing jointly with other income well below the first threshold, a $100,000 conversion may keep you under it and change nothing. If you are already near a threshold, the same conversion can move you up one or two brackets. The surcharge is a cliff, not a slope, so one dollar over the line costs the whole bracket. Put your projected total into an IRMAA estimator before you convert, not after.
  - q: How long does IRMAA last after a Roth conversion?
    a: One year, as a rule. Social Security sets each year's premium from the tax return filed two years earlier, so a conversion in 2026 shows up in your 2028 premium and then drops away in 2029 if your 2027 income was lower. A conversion spread across several years produces a surcharge in each of the matching years two years later.
  - q: Can I appeal IRMAA because of a Roth conversion?
    a: No. Social Security only reconsiders a premium for a specific list of life-changing events, such as retirement, reduced work hours, marriage, divorce, or the death of a spouse. A Roth conversion, a large IRA withdrawal, or a capital gain is a financial decision rather than a life event and does not qualify for Form SSA-44. And since 2018 a conversion cannot be recharacterized, so it cannot be undone either.
  - q: Should I do Roth conversions before I turn 65?
    a: Often the cleanest window is before age 63, because income at 63 sets the premium at 65. Conversions after that are still worth considering when they shrink future required minimum distributions enough to hold you under a threshold for years to come, since qualified Roth withdrawals do not count toward MAGI. That is a tax-planning decision, and it belongs with your tax advisor with the IRMAA brackets in front of them.
sources:
  - label: 'Medicare.gov — Medicare costs, including the Part B premium by income'
    url: https://www.medicare.gov/basics/costs/medicare-costs
  - label: 'CMS — 2026 Medicare Parts A and B premiums and deductibles'
    url: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
  - label: 'Social Security — What to do if your income has gone down (life-changing events)'
    url: https://www.ssa.gov/medicare/lower-irmaa
  - label: 'Social Security — Form SSA-44, Medicare IRMAA life-changing event'
    url: https://www.ssa.gov/forms/ssa-44.pdf
  - label: 'IRS — Publication 590-A: no recharacterizations of conversions made in 2018 or later'
    url: https://www.irs.gov/publications/p590a
  - label: 'IRS — Required minimum distribution FAQs'
    url: https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs
  - label: 'IRS — IRA distribution FAQs, including qualified charitable distributions'
    url: https://www.irs.gov/retirement-plans/retirement-plans-faqs-regarding-iras-distributions-withdrawals
---

**Yes. Every dollar you convert to a Roth is ordinary income in the year you convert it, Medicare counts that income when it sets your premium, and the bill arrives two years later.** A conversion you sign in {{year}} sets your Part B and Part D premiums for 2028. Cross a threshold by a dollar and both spouses pay the higher rate for all twelve months of that year, with no appeal available and no way to reverse the conversion.

That is the whole answer. The rest of this is about the size of the number, why it hits harder in north Peoria than most places, and what to decide before December 31.

## Why a Roth conversion counts against Medicare

Medicare charges an income surcharge called IRMAA, the income-related monthly adjustment amount, on top of the standard Part B premium of {{partB.premium}} and on top of whatever your drug plan charges. Whether you owe it is decided by your **modified adjusted gross income**, which is your adjusted gross income plus any tax-exempt interest.

A Roth conversion is a distribution from a traditional IRA or 401(k). It lands in adjusted gross income the same way a withdrawal would, and the fact that you moved the money into another retirement account rather than into your checking account makes no difference to the calculation. Convert $100,000 and your MAGI rises by $100,000 that year.

The part that catches people is the delay. Social Security does not look at this year's income. For {{year}} premiums it read your **{{irmaaTaxYear}}** tax return. For 2028 premiums it will read your {{year}} return. So the conversion you make this autumn is invisible on your Medicare bill until January 2028, and by then the money is long since moved.

## The {{year}} IRMAA brackets, and what a conversion does to them

Here is what Social Security is working from this year. The income column is {{irmaaTaxYear}} MAGI. The Part B figure is what you pay per month per person; the Part D figure is added to your drug plan's own premium.

<div class="table-scroll">
<table>
  <caption class="sr-only">2026 Medicare IRMAA brackets by modified adjusted gross income, single and joint filers, with monthly Part B premium and Part D surcharge</caption>
  <thead>
    <tr><th scope="col">Single filer MAGI</th><th scope="col">Joint filer MAGI</th><th scope="col">Part B per month</th><th scope="col">Part D surcharge</th></tr>
  </thead>
  <tbody>
    <tr><td>Up to {{irmaa.singleStart}}</td><td>Up to {{irmaa.jointStart}}</td><td>{{partB.premium}}</td><td>None</td></tr>
    <tr><td>{{irmaa.singleStart}} to {{irmaa.t1.singleMax}}</td><td>{{irmaa.jointStart}} to {{irmaa.t1.jointMax}}</td><td>{{irmaa.t1.partB}}</td><td>+{{irmaa.t1.partD}}</td></tr>
    <tr><td>{{irmaa.t1.singleMax}} to {{irmaa.t2.singleMax}}</td><td>Double the single band</td><td>{{irmaa.t2.partB}}</td><td>+{{irmaa.t2.partD}}</td></tr>
    <tr><td>{{irmaa.t2.singleMax}} to {{irmaa.t3.singleMax}}</td><td>Double the single band</td><td>{{irmaa.t3.partB}}</td><td>+{{irmaa.t3.partD}}</td></tr>
    <tr><td>{{irmaa.t3.singleMax}} to {{irmaa.topSingle}}</td><td>Up to {{irmaa.topJoint}}</td><td>{{irmaa.t4.partB}}</td><td>+{{irmaa.t4.partD}}</td></tr>
    <tr><td>{{irmaa.topSingle}} and above</td><td>{{irmaa.topJoint}} and above</td><td>{{irmaa.t5.partB}}</td><td>+{{irmaa.t5.partD}}</td></tr>
  </tbody>
</table>
</div>

<p class="table-source">Source: Medicare.gov, "Medicare costs", and the CMS 2026 Parts A and B premiums fact sheet. Married filing separately uses a steeper two-step table not shown here.</p>

Three things about that table matter more than the figures in it.

**It is a cliff.** There is no phase-in. A couple with {{irmaa.jointStart}} of MAGI pays the standard {{partB.premium}} each. A couple one dollar higher pays {{irmaa.t1.partB}} each, plus {{irmaa.t1.partD}} each on their drug plans, for the whole year. That single dollar costs roughly $1,150 per person, or about $2,300 for the household.

**It is per person.** The income is joint, but the surcharge is charged to each spouse on Medicare. Every bracket you climb, you climb twice.

**It applies even on a $0-premium plan.** The Part D surcharge is billed by Medicare, not by your plan, so a Medicare Advantage plan with drug coverage and no monthly premium still produces a monthly IRMAA bill. People who chose that plan for the premium line are the ones most surprised by the letter.

Put your own projected {{year}} total, conversion included, into the [IRMAA estimator](/tools/irmaa-estimator/) and it will show you which row you land in. The longer explanation of how the brackets work is in [IRMAA explained](/learn/irmaa-explained/).

## Two rules that make this different from other income

A capital gain or a big year of consulting income has the same effect on IRMAA as a conversion. Two things make the conversion version less forgiving.

**You cannot appeal it.** Social Security will recalculate a premium when your income has fallen because of a life-changing event: marriage, divorce, the death of a spouse, stopping or reducing work, loss of income-producing property, loss of a pension, or an employer settlement. That is the whole list, and it is the list on Form SSA-44. A Roth conversion is a decision you made about your own money. It is not on the list, and Social Security will not treat it as one.

**You cannot undo it.** Before 2018 you could recharacterize a conversion, which meant unwinding it if the numbers turned out badly. IRS Publication 590-A now says it in one line: no recharacterizations of conversions made in 2018 or later. Once the transfer settles, the income is on your return and the premium two years out is set.

Between them, those two rules mean the IRMAA math has to be done **before** the conversion, with this year's other income already estimated, and not in April when the return is prepared.

## Why this is a north Peoria question

I get asked about this more in 85383 than anywhere else in the service area, and the reason is who lives there.

Vistancia, Trilogy at Vistancia and Blackstone are full of households who arrived in the last few years from higher-tax states, and a great many of them rolled a large 401(k) into an IRA on the way out. Now they are sitting in a state with a low flat income tax, no state tax on Social Security, and a traditional IRA that will start producing required minimum distributions in their seventies whether they want the income or not. Converting some of it to a Roth while the tax rate is agreeable is a perfectly sensible thought, and their financial advisor has usually raised it.

The piece that gets missed is that the person suggesting the conversion is looking at the income-tax brackets, and the Medicare brackets sit in a different place. A couple can convert an amount that stays inside the same federal tax bracket and still cross an IRMAA threshold, because the IRMAA line for joint filers starts at {{irmaa.jointStart}} of MAGI and does not care what the federal rate is. I have sat with more than one couple who did the conversion, filed the return, and then opened a letter from Social Security two Novembers later that nobody had warned them about.

The other local wrinkle is the seasonal crowd. A household in Trilogy that spends the summer in Minnesota or Michigan often has a tax preparer up there and a financial advisor down here, and the conversion decision falls between them. Both of them need the same number: your projected {{year}} MAGI, all sources, and how far it sits from the next line.

If you are on the 85345 side of the city, or in Westbrook Village, the same rule applies, but the accounts are more often already in distribution and the conversion question comes up less. It is the newer arrivals at the north end who are making this decision right now. The [Peoria page](/service-area/peoria-az/) has the rest of the local picture.

## What a conversion this year actually costs in 2028

Work it as a single example. A married couple, both on Medicare, with {{year}} income of $190,000 from Social Security, a pension and dividends. They convert $60,000 in December.

- **Without the conversion**, their MAGI is under {{irmaa.jointStart}} and each pays {{partB.premium}} for Part B in 2028, with no drug-plan surcharge.
- **With the conversion**, their MAGI is $250,000. That is the second row. Each pays {{irmaa.t1.partB}} for Part B and an extra {{irmaa.t1.partD}} on their drug plan, every month of 2028.

The household cost of the surcharge is roughly $2,300 for the year. Whether that is a good trade depends on what the conversion saves them over the following twenty years in taxes on required minimum distributions, and that is a question for the person who does their return, not for me. What I can tell you is that a couple who converted $28,000 instead of $60,000 would have stayed under the line and paid nothing extra, and that the difference between those two figures is the kind of thing a fifteen-minute conversation in October sorts out.

That is the idea behind **filling the bracket**: work out the distance between your projected MAGI and the next IRMAA line, and convert up to that distance rather than past it. If the number you want to convert is larger than the room, split it across two tax years. Two conversions of $30,000 in December and January do the same work as one of $60,000, and they can land in two different Medicare years or in none at all.

## The case for converting anyway

None of this means a Roth conversion is a mistake for someone on Medicare. There are two reasons it can be the right move even when it triggers a surcharge.

**The surcharge is temporary. The RMDs are not.** A single year in a higher bracket costs you one year of IRMAA. A traditional IRA that keeps growing costs you larger required minimum distributions every year once they begin in your seventies, and every one of those distributions counts toward MAGI. Households who convert steadily in their sixties often pay a surcharge or two and then spend their late seventies and eighties under the threshold, because qualified Roth withdrawals do not count toward MAGI at all. That is the arithmetic the conversion is meant to win.

**It protects the survivor.** When one spouse dies, the survivor files single the following year, and the single-filer thresholds are half the joint ones. A couple comfortably under {{irmaa.jointStart}} can leave a widow or widower comfortably over {{irmaa.singleStart}} on the same income, with the same IRA. Money already converted to a Roth does not do that to them.

There is also a quieter tool for people who give to charity. From age 70½ you can send money from a traditional IRA directly to a qualified charity as a **qualified charitable distribution**, and it counts toward your required minimum distribution without ever entering your adjusted gross income. It is one of the few ways to reduce MAGI after the fact in a year where a conversion has used up the room.

## What to decide before December 31

The two Medicare deadlines of the autumn sit on top of each other this year, and it is worth handling them in order.

1. **Between now and October 15**, get a projected {{year}} MAGI on paper: Social Security, pension, dividends, interest including municipal bond interest, any capital gains, any RMD already taken. Add the conversion you are considering. Check the total against the table above or the [IRMAA estimator](/tools/irmaa-estimator/).
2. **October 15 to December 7** is the [Annual Enrollment Period](/learn/medicare-enrollment-periods/) for your {{nextYear}} plan. That decision is separate from the conversion, but if you are looking at a Part D surcharge two years out, a plan's own premium matters a little less and its drug coverage matters exactly as much.
3. **Before December 31**, convert up to the room you have, or split the conversion across the year boundary. After December 31 the {{year}} return is what it is.

If you retired this year or reduced your hours, there is one more step. You can file Form SSA-44 now and ask Social Security to use your current income instead of {{irmaaTaxYear}}'s, because a work stoppage is one of the qualifying events. Remember that the estimate you give them includes the conversion. Retiring and converting in the same year can leave you with a premium that is lower than the old salary would have produced but higher than you were expecting, and the two decisions are worth planning together.

## The short version

- **A Roth conversion is ordinary income, and IRMAA counts it in full.** A {{year}} conversion sets your 2028 Part B and Part D premiums.
- **The surcharge is a cliff, charged per person.** One dollar over {{irmaa.jointStart}} joint or {{irmaa.singleStart}} single costs roughly $1,150 a year each.
- **It cannot be appealed or reversed.** A conversion is not a life-changing event on Form SSA-44, and conversions have not been recharacterizable since 2018.
- **It lasts one year** unless you keep converting in each following year.
- **Fill the bracket, do not cross it.** Convert up to the room between your projected MAGI and the next line, or split across December and January.
- **Converting can still win** by shrinking future RMDs and protecting a surviving spouse, and qualified charitable distributions can reduce MAGI after 70½.
- **Do the math before December 31, with your tax advisor**, and with the IRMAA table open next to the tax table.

## If you would rather have someone walk through it with you

I am not a tax advisor and I will not tell you how much to convert. What I can do is put the IRMAA brackets next to your actual income, show you where the line is and what crossing it costs both of you, and give you the number to take back to whoever prepares your return. That conversation takes about twenty minutes and it costs nothing.

The office is in Anthem, roughly 25 minutes from north Peoria out the Carefree Highway and down Lake Pleasant Parkway, and most of this happens by phone or over a shared screen anyway. Call **(602) 844-6002** or [book a time](/book/). If you call or text, that is your consent for me to reply the same way.

The conversion decision has a hard deadline and the Medicare bill it creates arrives two years later. Look at both before you sign.
