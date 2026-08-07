---
title: "IRMAA Explained: How Income Affects Your Medicare Premiums"
seoTitle: "IRMAA Explained: 2026 Medicare Income Brackets"
description: "How the Medicare income surcharge works — the 2026 brackets, the two-year lookback, the cliff effect, and the SSA-44 appeal most retirees never file."
summary: "Higher income means a surcharge on Part B and Part D, decided by a tax return you filed two years ago. Here are the 2026 brackets, the cliff nobody warns you about, and the appeal that gets missed."
category: "Costs"
publishedAt: 2026-08-02
readMinutes: 10
featured: true
relatedProducts: [part-d, medicare-advantage]
relatedTools: [irmaa-estimator, medicare-cost-estimator]
faqs:
  - q: "What income does 2026 IRMAA use?"
    a: "Your modified adjusted gross income from your 2024 federal tax return — a two-year lookback. That means your 2026 surcharge was decided by a return you filed in 2025, and nothing you do to your income this year changes it."
  - q: "What is the 2026 IRMAA threshold?"
    a: "The first surcharge tier begins above $109,000 for single filers and above $218,000 for married filing jointly, based on 2024 modified adjusted gross income. At exactly $109,000 you pay the standard premium; at $109,001 you are in tier 1."
  - q: "Can I appeal an IRMAA determination?"
    a: "Yes, if a qualifying life-changing event reduced your income since the tax year used. Social Security lists eight: marriage, divorce or annulment, death of a spouse, you or your spouse stopping work or reducing hours, loss of income-producing property, loss of pension income, and an employer settlement payment. Retirement is the most commonly missed one. You file form SSA-44."
  - q: "Is IRMAA charged per person or per household?"
    a: "Per person. A married couple who are both on Medicare each pay their own surcharge, based on the same joint income — so the household cost is double the bracket figure."
---

IRMAA — the income-related monthly adjustment amount — is the surcharge Medicare adds to your Part B and Part D premiums when your income is above a threshold. It arrives as a letter from Social Security, usually in November, and it surprises people every year.

It surprises them for a specific reason: it is based on a tax return you filed two years ago, so by the time you find out, the income that caused it is long in the past.

## How it works

Every autumn, Social Security looks at your **modified adjusted gross income** from the tax return two years prior. For {{year}}, that is your **{{irmaaTaxYear}}** return, filed in {{nextYear}} minus one.

MAGI here means your adjusted gross income — line 11 of Form 1040 — plus any tax-exempt interest from line 2a. Municipal bond interest counts, which catches out people who chose those investments partly for their tax treatment.

If that figure exceeds the threshold, a surcharge is added to your Part B premium and a second surcharge to your Part D premium. Both are charged **per person**. A married couple both on Medicare each pay their own, based on the same joint income.

## The {{year}} brackets

Based on **{{irmaaTaxYear}}** MAGI. The Part B figure is the total you pay; the Part D figure is a surcharge added to whatever your chosen drug plan charges.

| {{irmaaTaxYear}} MAGI — single | {{irmaaTaxYear}} MAGI — joint | Part B / month | Part D surcharge |
| --- | --- | --- | --- |
| Up to {{irmaa.singleStart}} | Up to {{irmaa.jointStart}} | {{partB.premium}} | — |
| {{irmaa.singleStart}} – {{irmaa.t1.singleMax}} | {{irmaa.jointStart}} – {{irmaa.t1.jointMax}} | {{irmaa.t1.partB}} | +{{irmaa.t1.partD}} |
| {{irmaa.t1.singleMax}} – {{irmaa.t2.singleMax}} | — | {{irmaa.t2.partB}} | +{{irmaa.t2.partD}} |
| {{irmaa.t2.singleMax}} – {{irmaa.t3.singleMax}} | — | {{irmaa.t3.partB}} | +{{irmaa.t3.partD}} |
| {{irmaa.t3.singleMax}} – {{irmaa.topSingle}} | — | {{irmaa.t4.partB}} | +{{irmaa.t4.partD}} |
| {{irmaa.topSingle}} and above | {{irmaa.topJoint}} and above | {{irmaa.t5.partB}} | +{{irmaa.t5.partD}} |

At the top bracket, the surcharge alone comes to roughly {{irmaa.t5.annualExtra}} a year per person over the standard rate.

Two structural details worth knowing. The joint thresholds are double the single ones all the way up — **except at the top**, where single {{irmaa.topSingle}} pairs with joint {{irmaa.topJoint}} rather than double. And **married filing separately** uses a different, much steeper table with only two steps rather than five.

Put your own figure into the [IRMAA estimator](/tools/irmaa-estimator/) and it will place you, including the separate-filer table.

## It is a cliff, not a slope

This is the part that costs people real money.

IRMAA is not phased in. One dollar over a threshold moves you into the entire bracket. Somebody with MAGI of {{irmaa.singleStart}} pays the standard {{partB.premium}}. Somebody one dollar higher pays {{irmaa.t1.partB}}, plus {{irmaa.t1.partD}} on their drug plan — for all twelve months.

That is roughly a $1,150 annual difference triggered by a single dollar of income, per person.

If you are anywhere near a threshold, the December decisions that set your MAGI deserve genuine care:

- **Roth conversions.** Excellent planning tool, and each converted dollar counts toward MAGI two years out.
- **Capital gains.** Realizing a large gain in one year can push you up a bracket or two for a year.
- **Required minimum distributions.** Predictable, and they count.
- **Selling a property.** A one-off event that can put you in the top bracket for a single year.
- **Tax-exempt interest.** Counted despite being tax-exempt.

None of that is a reason to avoid a sensible financial decision. It is a reason to know the number before you act, and to check whether a small timing change crosses a threshold or not. A conversation with whoever prepares your taxes, in November rather than April, is usually where this gets solved.

## The appeal most people never file

If your income has **dropped since {{irmaaTaxYear}}** because of a qualifying life-changing event, you can ask Social Security to use your current income instead. The form is **SSA-44**.

Social Security recognizes exactly eight events:

1. Marriage
2. Divorce or annulment
3. Death of a spouse
4. You or your spouse stopped working
5. You or your spouse reduced working hours
6. Loss of income-producing property (through disaster or other event beyond your control)
7. Loss of pension income
8. Employer settlement payment due to employer closure or bankruptcy

**Number four is the big one.** Retirement counts as a work stoppage, and it is the most commonly missed reason to file.

Think about the timing. Someone who retired in {{irmaaTaxYear}} plus one had a full working salary on their {{irmaaTaxYear}} return. Social Security uses that return to set their {{year}} premium. They are now retired, living on a fraction of that income, paying a surcharge calculated on a salary they no longer earn.

That is precisely what SSA-44 exists for. You file it with proof of the event — a letter from your employer, a retirement date — and an estimate of your current income. It is a two-page form and it is worth real money.

What does **not** qualify: simply having had a good year followed by a worse one, or a one-off capital gain. The event has to be one of the eight.

## What it looks like in practice

Two examples, because the abstract version does not convey the scale.

**A single filer with {{irmaaTaxYear}} MAGI of {{irmaa.singleStart}} exactly.** Standard premium: {{partB.premium}} a month, no Part D surcharge. Nothing to do.

**The same person, one dollar higher.** Part B becomes {{irmaa.t1.partB}}, and {{irmaa.t1.partD}} is added to their drug plan. Over twelve months that single dollar of income costs roughly $1,150.

**A married couple, both 67, both on Medicare, joint MAGI of $280,000.** That lands in the third bracket. Each of them pays {{irmaa.t2.partB}} for Part B and an extra {{irmaa.t2.partD}} on their drug plan. Because IRMAA is charged per person, the household is paying roughly $5,800 a year more than a couple below the first threshold — for identical coverage.

That "identical coverage" point is worth dwelling on. IRMAA buys you nothing. It is not a better plan or a wider network; it is the same Medicare at a higher price. Which is precisely why the timing decisions that set your MAGI are worth getting right, and why the appeal below is worth filing when it applies.

## How you actually pay it

**If you are claiming Social Security**, both the standard premium and the surcharge are deducted from your monthly benefit automatically. You will see the change in your January payment, and the determination letter arrives the preceding November.

**If you are not yet claiming**, you are billed directly — quarterly by default, though you can arrange monthly payment through Medicare Easy Pay. This catches out people who delayed Social Security to age 70 while enrolling in Medicare at 65: the bill arrives as an actual bill, and missing it can eventually mean losing Part B coverage.

**The Part D surcharge is billed separately from your plan premium.** Your drug plan charges its own premium as usual, and Social Security collects the IRMAA portion. People sometimes assume the plan made an error when two amounts appear for what looks like one thing.

## Other things worth knowing

**It is recalculated every year.** IRMAA is not permanent. Each autumn Social Security looks at the return from two years prior. A single high-income year means a single surcharged year — it drops off on its own once that year rolls out of the lookback.

**It is deducted from Social Security automatically.** If you receive Social Security, both the standard premium and the surcharge come out of your benefit. If you are not yet claiming, you are billed directly.

**It applies on both Medicare paths.** Medicare Advantage does not avoid it — you still pay the Part B premium plus surcharge, and the Part D surcharge is added even when the drug coverage is bundled into your Advantage plan. Choosing between [Advantage and Medigap](/learn/medicare-advantage-vs-medigap/) has no effect on IRMAA whatsoever.

**Appeals are also available for errors.** If Social Security used an amended return, or the wrong year, or there is an outright mistake, that is a separate correction rather than an SSA-44 — and worth pursuing.

## What to do about it

**If you are already receiving a surcharge letter:** check whether one of the eight events applies to you since {{irmaaTaxYear}}. If you retired in that window, file SSA-44. That is the single highest-value action available here.

**If you are approaching Medicare and near a threshold:** the income two years before your first Medicare year is the one that matters. That is a planning window, and it is usually still open when people first hear about IRMAA.

**If you are comfortably below:** nothing to do. Run the [estimator](/tools/irmaa-estimator/) once so you know where the edge sits, and revisit it in any year with an unusual event in it.

## The short version

- {{year}} IRMAA is set by your **{{irmaaTaxYear}}** MAGI — already decided, already filed.
- The first threshold is {{irmaa.singleStart}} single, {{irmaa.jointStart}} joint.
- It is a **cliff**. One dollar over moves you into the whole bracket.
- It is **per person** — double it for a couple.
- **Retirement is an appealable life-changing event.** File SSA-44.
- It **recalculates annually**, so a single high year does not follow you permanently.

If you have had a letter and are not sure whether an appeal applies, that is a short conversation with a clear answer — and the form takes about twenty minutes to complete once you know it is worth filing.
