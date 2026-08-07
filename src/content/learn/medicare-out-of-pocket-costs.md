---
title: "MOOP & Deductibles: Medicare Out-of-Pocket Costs in 2026"
seoTitle: "Medicare Out-of-Pocket Costs 2026: MOOP & Deductibles"
description: "Every 2026 Medicare cost in one place — Part A and B deductibles, coinsurance, the Part D cap, and what the out-of-pocket maximum really covers."
summary: "What a year on Medicare actually costs in 2026: the deductibles, the coinsurance, the Part D cap, and the out-of-pocket maximum that only exists on one of the two paths."
category: "Costs"
publishedAt: 2026-08-02
readMinutes: 10
relatedProducts: [medicare-advantage, medicare-supplement, long-term-care]
relatedTools: [medicare-cost-estimator, irmaa-estimator]
faqs:
  - q: "What is the Medicare Part B deductible in 2026?"
    a: "The annual Part B deductible for 2026 is $283. After you meet it, Original Medicare generally pays 80% of the approved amount for covered services and you are responsible for the remaining 20%, with no upper limit unless you have a supplement or an Advantage plan."
  - q: "Does Original Medicare have an out-of-pocket maximum?"
    a: "No. Original Medicare on its own has no annual cap on what you can spend — the 20% coinsurance continues indefinitely. That absence is the single strongest argument for pairing it with a Medicare Supplement, and it is why Medicare Advantage plans are required to have a cap."
  - q: "What is the Part A hospital deductible in 2026?"
    a: "$1,736 per benefit period, not per year. A benefit period starts when you are admitted and ends after 60 consecutive days out of a hospital or skilled nursing facility, so two separate admissions far enough apart mean paying the deductible twice in one year."
  - q: "Does the Medicare Advantage out-of-pocket maximum cover everything?"
    a: "No. It covers in-network Part A and Part B services. Prescription drugs run on the separate Part D cap, and supplemental benefits like dental and vision generally sit outside it entirely. Out-of-network care may have a higher cap or none at all depending on the plan."
---

Medicare is not free, and the places it costs money are not always the obvious ones. This is every {{year}} figure in one place, plus the structural point that matters more than any individual number: **only one of the two Medicare paths has a cap on what you can spend.**

All figures below are for plan year {{year}} and come from a single source in this site's code, so they update together when CMS publishes next year's amounts.

## Part B: the everyday costs

**Standard premium: {{partB.premium}} a month** — {{partB.annual}} a year. Almost everyone on Medicare pays this, on either path, and it is deducted automatically from Social Security if you are claiming.

Higher earners pay more. If your {{irmaaTaxYear}} modified adjusted gross income was above {{irmaa.singleStart}} single or {{irmaa.jointStart}} joint, an income-related surcharge applies — up to {{irmaa.t5.partB}} a month at the top bracket. See [IRMAA explained](/learn/irmaa-explained/).

**Annual deductible: {{partB.deductible}}.** You pay this once per calendar year before Part B starts paying.

**Coinsurance: {{partB.coinsurance}}.** After the deductible, Original Medicare generally pays 80% of the approved amount and you pay the rest.

That {{partB.coinsurance}} is the number to pay attention to, because on Original Medicare alone **there is no ceiling on it**. Twenty per cent of a routine office visit is trivial. Twenty per cent of a serious cardiac year is not, and nothing stops it.

## Part A: the hospital costs

Most people pay **no premium** for Part A, having earned it through 40 quarters of work. Those without enough quarters pay up to {{partA.premiumIfUninsured}} a month in {{year}}.

The cost sharing is where it gets structural:

| What | {{year}} amount |
| --- | --- |
| Hospital deductible | {{partA.deductible}} per benefit period |
| Days 1–60 | Covered after the deductible |
| Days 61–90 | {{partA.days61to90}} per day |
| Lifetime reserve days | {{partA.lifetimeReserve}} per day (60 total, once ever) |
| Skilled nursing days 1–20 | Covered in full |
| Skilled nursing days 21–100 | {{partA.snf}} per day |

**"Per benefit period" is not "per year", and this is the detail that surprises people.** A benefit period begins the day you are admitted and ends after you have been out of a hospital or skilled nursing facility for 60 consecutive days. Two admissions far enough apart mean paying the {{partA.deductible}} deductible **twice in the same calendar year**. There is no annual limit on how many benefit periods you can have.

The skilled nursing arithmetic is worth spelling out: eighty days at {{partA.snf}} comes to {{partA.snfTotal}}, and that is only for the part Medicare partially covers. Beyond day 100, coverage stops entirely — which is the beginning of a different conversation, covered in [what Medicare doesn't pay for](/learn/what-medicare-does-not-pay-for/).

## Part D: the drug costs

**Plan premiums vary by plan.** Add the income-related surcharge if it applies — {{irmaa.t1.partD}} to {{irmaa.t5.partD}} a month, on top of whatever the plan charges.

**Deductible: up to {{partD.maxDeductible}}** in {{year}}, depending on the plan. Some charge nothing; some charge the maximum; some apply it only to higher tiers.

**Out-of-pocket cap: {{partD.cap}}.** Once your spending on covered drugs reaches it, the plan pays 100% of covered drugs for the rest of the year. Premiums do not count toward it, and the counter resets on 1 January.

This cap is a genuine structural protection. It does not, however, make plan choice less important — *when* you reach it depends entirely on how your plan tiers your specific medications. Two plans with the same premium can put you at the cap in March or in October. More in [Part D explained](/learn/medicare-part-d-explained/).

## The out-of-pocket maximum, and who has one

Here is the part that actually separates the two Medicare paths.

**Original Medicare alone has no out-of-pocket maximum.** None. The {{partB.coinsurance}} coinsurance runs indefinitely, and Part A deductibles recur per benefit period. In an ordinary year this is unremarkable. In a serious year it is unbounded.

**Medicare Advantage plans are required to have one.** Every plan sets an annual cap on in-network Part A and Part B costs; once you hit it, the plan covers the rest of the year. This is the most important number on any Advantage plan and the one most people skip past on the way to comparing premiums and dental allowances.

Three things the Advantage cap does not include:

- **Prescription drugs.** Those run on the separate Part D cap of {{partD.cap}}.
- **Supplemental benefits** — dental, vision, hearing — generally sit outside it.
- **Out-of-network care**, which may have a higher cap or none, depending on the plan.

**A Medicare Supplement takes a different approach** — instead of capping your exposure, it removes most of it. On the most common plan design you pay the {{partB.deductible}} Part B deductible and essentially nothing else for Medicare-covered services. No hospital deductible, no daily coinsurance, no {{partB.coinsurance}}. That is what the monthly premium buys.

So the three positions are: unbounded (Original Medicare alone), capped (Advantage), or largely eliminated in exchange for a premium (Medigap). Which is right for you is the subject of [Advantage vs Medigap](/learn/medicare-advantage-vs-medigap/).

## What a year actually looks like

Rough shapes, for a sense of scale rather than a quote.

**A quiet year, Medicare Advantage.** {{partB.annual}} in Part B premiums, often no plan premium, a few hundred dollars in copays, whatever your drugs cost. Comfortably the cheaper path for someone using little care.

**A quiet year, Medigap plus Part D.** {{partB.annual}} in Part B premiums, the supplement premium, a Part D premium, the {{partB.deductible}} deductible, and drug costs. More than the Advantage column, predictably so.

**A serious year, Medicare Advantage.** {{partB.annual}} plus copays that accumulate to the plan's out-of-pocket maximum, plus up to {{partD.cap}} in drugs. The cap does its job, and the total is knowable in advance.

**A serious year, Medigap plus Part D.** {{partB.annual}}, the premiums, the {{partB.deductible}} deductible, up to {{partD.cap}} in drugs — and effectively nothing else, because the supplement absorbs the hospital and coinsurance costs entirely. Barely different from a quiet year.

That last comparison is the whole argument for a supplement, and the reason the honest question is not "what will this cost?" but "what will a *bad* year cost?"

The [annual cost estimator](/tools/medicare-cost-estimator/) runs both structures against your own expected usage using these {{year}} figures. Run it twice — a normal year and a bad one. If the answer flips, that is the most useful thing it can tell you.

## Not all supplements cover the same things

"Medigap" is not one product. Plans are standardised by federal law and identified by letter, and the letter determines exactly which gaps get filled. Plan G from one carrier covers precisely what Plan G from another covers — that is law, not marketing — so between carriers the only real differences are price, rate history and service.

Between *letters*, though, the differences are substantial. The two most commonly bought today:

**Plan G** covers everything Original Medicare leaves except the {{year}} Part B deductible of {{partB.deductible}}. You pay that once a year and effectively nothing else for Medicare-covered services.

**Plan N** costs less monthly and covers slightly less: you pay the Part B deductible, plus small copays for office and emergency room visits, and it does not cover Part B excess charges — the amount a provider who does not accept Medicare assignment may bill above the approved rate.

Which wins depends on how often you actually see a doctor. Plan N's lower premium is worth more than its copays for someone with a few visits a year; the arithmetic reverses with frequent care. It is a genuine calculation rather than a preference, and it needs your real usage.

One more wrinkle: **Plan F is closed to newcomers.** If you became eligible for Medicare before 1 January 2020 you can still buy it; if you became eligible after, you cannot. People who read older guidance often go looking for a plan they are not permitted to buy.

## Costs that sit outside all of this

Worth naming, because they surprise people:

- **Dental, vision and hearing.** Original Medicare covers essentially none of it. Advantage plans commonly include allowances — read what the allowance actually buys.
- **Long-term custodial care.** Not covered at all, on either path. This is the largest uncovered risk in retirement and it has [its own article](/learn/what-medicare-does-not-pay-for/).
- **Care outside the United States.** Very limited on Original Medicare; varies on Advantage plans.
- **Anything Medicare deems not medically necessary**, regardless of your path.

## Help paying for it

If money is tight, three programs are worth checking, and eligibility limits are higher than most people assume:

- **Medicare Savings Programs** can pay your Part B premium and sometimes your deductibles and coinsurance.
- **Extra Help** (the Part D low-income subsidy) substantially reduces drug premiums, deductibles and copays — and eliminates the Part D late enrollment penalty entirely.
- **Medicaid**, for those who qualify, coordinates with Medicare to cover much of what it leaves.

Plenty of people who qualify never apply. It costs nothing to check.

## The short version

- Part B: {{partB.premium}} a month, {{partB.deductible}} deductible, {{partB.coinsurance}} coinsurance with **no cap** on Original Medicare.
- Part A: {{partA.deductible}} deductible **per benefit period**, not per year.
- Part D: up to {{partD.maxDeductible}} deductible, {{partD.cap}} out-of-pocket cap.
- **Only Advantage plans have a medical out-of-pocket maximum.** Medigap removes the exposure instead.
- The question that matters is what a *bad* year costs, not an average one.

Figures are for plan year {{year}} and change each January. If you are reading this later, confirm the current amounts before planning around them.
