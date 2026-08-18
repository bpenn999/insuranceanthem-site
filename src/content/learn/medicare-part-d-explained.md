---
title: "Understanding Medicare Part D Prescription Drug Coverage"
seoTitle: "Medicare Part D Explained: 2026 Costs & Coverage"
description: "How Part D works — formulary tiers, the 2026 $2,100 out-of-pocket cap, pharmacy networks, the late penalty, and why the cheapest premium rarely wins."
summary: "The cheapest premium is almost never the cheapest plan. Here is how formularies, tiers and pharmacy networks decide what you really pay — and how the 2026 out-of-pocket cap changes the math."
category: "Part D"
publishedAt: 2026-08-02
readMinutes: 10
featured: true
relatedProducts: [part-d, medicare-supplement, medicare-advantage]
relatedTools: [medicare-cost-estimator, enrollment-timeline]
faqs:
  - q: "What is the Part D out-of-pocket cap in 2026?"
    a: "It is $2,100. Once your out-of-pocket spending on covered drugs reaches that amount, your plan pays 100% of covered drugs for the rest of the calendar year. Premiums do not count toward the cap, and the amount resets every 1 January."
  - q: "Do I need Part D if I take no medication?"
    a: "Usually yes. If you go more than 63 days after your Initial Enrollment Period without creditable drug coverage, Medicare adds a permanent penalty to your premium — for life, not for a year. A low-cost plan now is almost always cheaper than the penalty later, and it covers you if something changes."
  - q: "Why is my drug more expensive than my neighbor's on the same medication?"
    a: "Because you are almost certainly on different plans. Every Part D plan sets its own formulary and tier structure, so the same drug at the same dose can sit on tier 1 for one plan and tier 3 for another. Preferred pharmacy status adds a second layer of difference on top."
  - q: "Can I change my Part D plan mid-year?"
    a: "Generally no. The Annual Enrollment Period runs 15 October to 7 December for changes effective 1 January. Mid-year changes require a Special Enrollment Period, Extra Help eligibility, or — if you are on a Medicare Advantage plan with drug coverage — the Medicare Advantage Open Enrollment Period between 1 January and 31 March."
sources:
  - label: "Medicare Part D drug coverage"
    url: "https://www.medicare.gov/drug-coverage-part-d"
  - label: "Costs for Medicare drug coverage"
    url: "https://www.medicare.gov/drug-coverage-part-d/costs-for-medicare-drug-coverage"
  - label: "How to get Medicare prescription drug coverage"
    url: "https://www.medicare.gov/drug-coverage-part-d/how-to-get-prescription-drug-coverage"
---

Part D is the part of Medicare people understand least and pay most unnecessarily for. Not because it is complicated in principle — it covers prescription drugs, you buy it from a private insurer, that is the whole concept — but because the thing that determines your cost is buried in a document nobody reads.

Here is how it actually works, and where the money leaks.

## Two ways to get it

**A standalone Part D plan** pairs with Original Medicare. If you have a Medicare Supplement, this is your only option, because Medigap policies sold today never include drug coverage.

**Built into a Medicare Advantage plan.** Most Advantage plans include Part D, which is one of their genuine conveniences — one plan, one card, nothing extra to buy.

Either way the underlying rules are the same. What differs is whether you choose the drug plan separately or inherit whatever your Advantage plan includes. That second point matters more than people expect: choosing an Advantage plan means accepting its formulary as a package deal, so if you take expensive medications the drug side deserves as much weight as the network.

## The formulary is the whole ballgame

Every plan publishes a formulary: the list of drugs it covers, sorted into tiers. Tiers decide your cost.

A rough shape, though the specifics vary by plan:

- **Tier 1** — preferred generics. Often a few dollars, sometimes nothing.
- **Tier 2** — generics. Still inexpensive.
- **Tier 3** — preferred brands. Meaningfully more, often a percentage rather than a flat copay.
- **Tier 4** — non-preferred brands. More again.
- **Tier 5** — specialty. Coinsurance, and it can be substantial.

Two consequences people rarely anticipate.

**The same drug sits on different tiers on different plans.** There is no national tier list. Plans negotiate their own arrangements with manufacturers, so an identical medication at an identical dose can be tier 2 on one plan and tier 4 on another, with a cost difference of hundreds of dollars a year.

**Tiers move every January.** Plans re-file their formularies annually. A drug that was comfortably tier 2 can be tier 3 in the new plan year, with no notice beyond the Annual Notice of Change that arrived in September.

This is the single most common reason for the January phone call I get every year — same drug, same dose, same plan, different tier. There is more on that in [why your drug costs jumped in January](/learn/why-drug-costs-jumped-in-january/).

## Pharmacy networks: the second lever

Most plans have two levels of in-network pharmacy: **preferred** and **standard**. Both are "in network", and the difference between them on the same drug can be substantial.

Pharmacy agreements are renegotiated annually too. The pharmacy you have used for a decade can quietly move from preferred to standard, and nothing about the experience at the counter tells you it happened — until the price does.

Sometimes the fix is genuinely that simple: fill the same prescription at a different in-network pharmacy two miles away and pay a fraction. It is worth checking before concluding anything is wrong with the plan.

## What the {{year}} numbers look like

**The out-of-pocket cap is {{partD.cap}}.** Once your out-of-pocket spending on covered drugs reaches it, the plan pays 100% of covered drugs for the rest of the year. Premiums do not count toward it. The counter resets every 1 January.

This is a real structural improvement. Before the cap existed, catastrophic drug costs had no ceiling at all, and people with serious conditions faced genuinely unbounded exposure.

But it does not make plan choice less important — it makes it more important. The cap tells you the *worst* case. **When** you reach it depends entirely on how your plan tiers your specific drugs. Two plans with identical premiums can put you at the cap in March or in October. That is seven months of difference in what you actually pay, on the same medication list.

**A plan deductible may apply**, up to {{partD.maxDeductible}} in {{year}}. Some plans charge nothing; some charge the full amount; some apply it only to higher tiers. If your January fill looks like full retail, an unmet deductible is usually why — and unlike a tier change, that one settles down once satisfied.

**Higher income adds a surcharge.** If your {{irmaaTaxYear}} modified adjusted gross income was above {{irmaa.singleStart}} filing single or {{irmaa.jointStart}} jointly, an income-related amount is added to your Part D premium in {{year}} — from {{irmaa.t1.partD}} to {{irmaa.t5.partD}} a month depending on bracket. It is added to whatever your plan charges, not instead of it. See [IRMAA explained](/learn/irmaa-explained/).

## The late enrollment penalty

This one deserves plain language because it is permanent and widely misunderstood.

If you go **more than 63 consecutive days** after your Initial Enrollment Period without creditable prescription drug coverage, Medicare adds a penalty to your Part D premium. It is calculated as 1% of the national base beneficiary premium for every month you went without, and it is added for **as long as you have Part D**. Not for a year. Permanently, and it is recalculated upward each year as the base premium rises.

"Creditable coverage" means drug coverage at least as good as Part D — typically employer or union coverage. Your plan administrator can confirm in writing whether yours qualifies, and it is worth getting that in writing rather than assuming.

The trap is the person who takes no medication at 65, reasonably concludes a drug plan is a waste of money, and enrolls at 72 when something changes. They now pay the penalty for the rest of their life on top of the premium. A minimal plan at 65 would have cost less.

More detail, including how the arithmetic works, is in [late enrollment penalties](/learn/late-enrollment-penalties/).

## Choosing a plan, honestly

There is exactly one correct method, and it is arithmetic rather than judgement.

Take your exact medication list with dosages. Take your preferred pharmacy. Then, for every plan available in your ZIP, calculate the full year: **premium, plus deductible, plus what each of your drugs costs on that plan's tier structure at that pharmacy.**

Compare those totals. Not the premiums — the totals.

That comparison routinely turns up differences of several hundred dollars a year between plans whose premiums sit within a few dollars of each other. It is the highest-value twenty minutes in Medicare, and almost nobody does it, because the tooling is tedious and the Annual Notice of Change is unreadable by design.

The [annual cost estimator](/tools/medicare-cost-estimator/) will show you how drug spending interacts with the rest of your year. For the plan-by-plan drug pricing itself you need current formulary data, which is what a conversation is for — deliberately, this site does not publish plan names, premiums or counts, because a stale number is worse than no number.

## Things worth knowing before you need them

**Prior authorization and step therapy.** Some drugs require your prescriber to justify the prescription first, or to try a cheaper alternative before the plan covers the one you were prescribed. Both are appealable, and both are worth checking before you enroll if you take a drug likely to trigger them.

**Formulary exceptions.** If a plan does not cover a drug you need, or places it on a tier that makes it unaffordable, your prescriber can request an exception with clinical justification. Plans must have a process, and it works more often than people expect.

**Transition fills.** If you join a plan that does not cover something you are already taking, you are generally entitled to a temporary supply — usually one month — while you and your prescriber sort out an alternative or file an exception. Do not let a pharmacy send you away empty-handed in January without asking about this.

**Extra Help.** The low-income subsidy substantially reduces or eliminates Part D premiums, deductibles and copays, and it comes with a Special Enrollment Period allowing plan changes outside the usual windows. The income limits are higher than most people assume, and plenty of people who qualify never apply. It costs nothing to check.

## The annual habit worth forming

Re-price your drug plan every autumn against your actual medication list. Every single year, even when nothing about your health has changed — because the plan changes even when you do not.

The Annual Enrollment Period runs **15 October to 7 December**, with changes effective 1 January. That is the window. Outside it you generally need a Special Enrollment Period; the qualifying events are covered in [special enrollment periods](/learn/special-enrollment-periods/).

Put a note in your calendar for 1 October. Then when the Annual Notice of Change arrives, you already know what to do with it.

## The short version

- The formulary and your pharmacy decide your cost, not the premium.
- Tiers and pharmacy status reset every 1 January, whether or not your health does.
- The {{year}} out-of-pocket cap is {{partD.cap}}; *when* you reach it is plan-dependent.
- The late penalty is permanent — take a plan at 65 even if you take nothing.
- Price the whole year across every available plan, then re-price it every autumn.

If your costs jumped and you want somebody to look at the actual list rather than guess, bring the bottle labels — the dosages are what matter.
