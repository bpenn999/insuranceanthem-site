---
layout: ../../layouts/BlogLayout.astro
title: "How do I pay my Medicare premium if I'm not on Social Security?"
seoTitle: 'Pay Medicare If Not on Social Security? Arizona 2026'
description: 'Medicare mails a Part B bill every 3 months, due the 25th: $608.70 a quarter in 2026. Easy Pay can draft it monthly on the 20th from your bank instead.'
summary: "Most people turning 65 in Peoria now are not drawing Social Security yet, so nothing is withheld and Medicare sends a bill. Here is what the bill covers, how often it comes, the four ways to pay it, why the first one looks too big, what a missed payment costs, and how an HSA and a winter address fit in."
category: Enrollment
publishedAt: 2026-10-17
readMinutes: 7
image: /blog/how-do-i-pay-my-medicare-premium-if-im-not-on-social-security-photo.jpg
imageAlt: 'A silver-haired woman in reading glasses and a pink shirt sorts through printed bills and statements at a white desk.'
faqs:
  - q: How do I pay my Medicare premium if I'm not on Social Security?
    a: Medicare bills you directly. If you are not getting Social Security or Railroad Retirement benefits, a Medicare premium bill arrives in the mail, every three months if you only owe the Part B premium. You can pay it through your online Medicare account, sign up for Medicare Easy Pay to have it drafted from your bank each month, pay through your own bank's bill-pay service, or mail a check, money order or card payment with the coupon.
  - q: Can I pay my Medicare premium monthly instead of quarterly?
    a: Yes, through Medicare Easy Pay. It is free, it takes the premium from a checking or savings account on the 20th of each month (or the next business day), and you can sign up in your Medicare account or with the paper form SF-5510. Medicare says it can take 6 to 8 weeks for the drafts to start, so keep paying the paper bill until they do.
  - q: Why is my first Medicare bill so high?
    a: Usually because it covers more than one month. Part B is billed three months at a time when it is not withheld from a Social Security check, and the first bill can also pick up months between the date your coverage started and the date the billing caught up. A Part B or Part D income surcharge (IRMAA) or a late-enrollment penalty also raises it. Check the billing period printed on the bill before assuming it is wrong.
  - q: What happens if you don't pay your Medicare Part B premium?
    a: Part B ends. Under the federal rule the grace period runs to the last day of the third month after the billing month, and if the overdue amount is still unpaid then, that date becomes the termination date. Getting Part B back generally means waiting for the General Enrollment Period, and a gap can also put a Medigap or Medicare Advantage plan at risk, since both require Part B.
  - q: Can I pay Medicare premiums with my HSA?
    a: Yes, once you are 65. IRS Publication 969 counts Medicare premiums as qualified medical expenses for an account holder who is 65 or older, but not premiums for a Medicare supplement (Medigap) policy. You can pay Medicare by HSA card through the mail coupon, or reimburse yourself from the HSA for premiums you paid another way.
  - q: Do I have to take Social Security to get Medicare?
    a: No. You can enroll in Part A and Part B at 65 and leave Social Security until full retirement age or 70. The only difference is how the premium is paid. Without a benefit to withhold it from, Medicare sends the bill to you.
sources:
  - label: 'Medicare.gov — Pay Part A and Part B premiums (who is billed, how often, the four ways to pay, due on the 25th)'
    url: https://www.medicare.gov/basics/costs/pay-premiums
  - label: 'Medicare.gov — Medicare Easy Pay (free, drafted on the 20th, 6–8 weeks to start, form SF-5510)'
    url: https://www.medicare.gov/basics/costs/pay-premiums/medicare-easy-pay
  - label: '42 CFR §408.8 — Part B premium grace period and termination date for non-payment'
    url: https://www.law.cornell.edu/cfr/text/42/408.8
  - label: 'IRS Publication 969 — Health Savings Accounts: Medicare premiums as qualified medical expenses at 65, Medigap excluded'
    url: https://www.irs.gov/publications/p969
  - label: 'Social Security POMS HI 01101.001 — IRMAA, including direct billing when no benefit is being paid'
    url: https://secure.ssa.gov/poms.nsf/lnx/0601101001
  - label: 'CMS — 2026 Medicare Parts A and B premiums and deductibles fact sheet'
    url: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
---

**If you are not drawing Social Security, Medicare sends you a bill. For most people that is a Part B bill every three months, due on the 25th, covering three months of the {{partB.premium}} monthly premium for {{year}}. You can pay it online in your Medicare account, have it drafted monthly with Medicare Easy Pay, use your bank's bill pay, or mail a check or card payment with the coupon. Signing up for Medicare does not require you to start Social Security.**

That last sentence is the reason this comes up so often now. Full retirement age is 67 for anyone born in 1960 or later, and a lot of the people I sit down with in north Peoria (Vistancia, Trilogy, the new streets off Lake Pleasant Parkway) are deliberately leaving Social Security alone until 70. They sign up for Part A and Part B at 65, which is the right call when there is no employer plan behind them, and then a few weeks later an envelope from Medicare arrives asking for money. Nobody told them it would. Here is how the billing works so the envelope is not a surprise.

## What Medicare bills you for, and how often

When a benefit check exists, Medicare takes its premiums out of it before the money reaches you. When none exists, Medicare bills the same amounts directly. The schedule depends on what you owe.

<div class="table-scroll">
<table>
  <caption class="sr-only">Which Medicare premiums are billed directly to someone not receiving Social Security, and how often each bill comes</caption>
  <thead>
    <tr><th scope="col">What you owe</th><th scope="col">Who bills it</th><th scope="col">How often</th></tr>
  </thead>
  <tbody>
    <tr><td>Part B premium only (standard {{partB.premium}} a month in {{year}})</td><td>Medicare</td><td>Every 3 months</td></tr>
    <tr><td>Part B plus a Part B income surcharge (IRMAA)</td><td>Medicare, on the same bill</td><td>Every 3 months</td></tr>
    <tr><td>Part A premium (only if you have fewer than 40 work quarters; up to {{partA.premiumIfUninsured}} a month)</td><td>Medicare</td><td>Every month</td></tr>
    <tr><td>Part D income surcharge (IRMAA)</td><td>Medicare</td><td>Every month</td></tr>
    <tr><td>Medicare Advantage or Part D plan premium</td><td>The plan</td><td>Whatever the plan offers</td></tr>
    <tr><td>Medigap premium</td><td>The insurance company</td><td>Whatever the company offers</td></tr>
  </tbody>
</table>
</div>

Two things stand out for the clients I work with. First, Medicare's bill and your plan's bill are separate. A Plan G premium or an Advantage plan premium never shows up on the Medicare bill, and the Medicare bill never includes them. Second, the drug-plan income surcharge is the odd one out. If your {{irmaaTaxYear}} income was above {{irmaa.singleStart}} single or {{irmaa.jointStart}} joint, the Part D surcharge (starting at {{irmaa.t1.partD}} a month) is billed by Medicare every month, even though your drug plan's own premium goes to the insurance company. People who set up autopay with their drug plan are surprised to get a second monthly bill for drugs from the government. Both have to be paid.

## Four ways to pay the bill

Medicare lists four routes, and none of them cost anything from Medicare's side.

1. **Your online Medicare account.** Log in, choose "Pay my premium now," and pay by card or from a bank account. Medicare calls this the fastest way; card payments clear sooner, bank payments take about five business days.
2. **Medicare Easy Pay.** A recurring draft from checking or savings on the 20th of every month (or the next business day). This is how you turn a quarterly bill into a monthly one. Sign up in your account under "My Premiums," or mail form SF-5510. It can take 6 to 8 weeks to start, and you pay the paper bill until it does.
3. **Your own bank's bill pay.** You send it from your bank's online bill-pay service using the account number on the bill. Some banks charge for this; most do not.
4. **By mail.** A check, money order, or credit, debit or HSA card number written on the payment coupon, mailed to the address printed on that coupon. Leave at least five business days before the 25th.

For a retiree who travels or splits the year, I suggest Easy Pay almost every time. It takes the mail out of it, and it adjusts by itself in January when the premium changes.

## Why the first bill looks too big

The most common call I get about this is "Medicare billed me for three months, and I've only had it for one." That is usually correct. A Part B-only bill covers a quarter at a time, and the first one can also pick up any months between the day your coverage started and the day the billing system caught up with you. Before you call anyone, read the billing period printed on the bill and count the months.

If the months are right and the amount still looks high, the usual explanations are:

- **An income surcharge.** If Social Security sent you an IRMAA determination, your Part B line is higher than the standard premium. A recent retirement can be grounds to ask for a lower amount; see [how do I appeal IRMAA after retirement?](/blog/how-do-i-appeal-irmaa-after-retirement/)
- **A late-enrollment penalty.** If Part B started later than it should have, a permanent penalty is added to every bill. The [late enrollment penalty calculator](/tools/late-enrollment-penalty-calculator/) shows what it comes to.
- **A Part A premium.** Rare among the people I meet, but it applies if you or your spouse did not reach 40 quarters of Medicare-covered work.

## What happens if a bill gets missed

This is the part that deserves a calendar reminder. Under the federal rule for Part B, the grace period ends on the last day of the third month after the billing month. If the overdue amount is still unpaid then, that day becomes the date Part B ends. Each later bill shows the past-due amount, and Medicare's own wording is plain: pay the total, or you lose your coverage.

Losing Part B is far worse than the late fee it sounds like. A Medigap policy pays only alongside Part B, and a Medicare Advantage plan requires you to keep Part B. Getting Part B back generally means waiting for the General Enrollment Period, with a gap in between. The Part D surcharge works the same way: leave it unpaid past its grace period and Medicare ends your drug coverage, which inside an Advantage plan is the plan you rely on.

The scenario I worry about is ordinary: a bill goes to an old address after a move, or sits in a stack while you are away for a month. That is why the next two sections matter.

## Paying Medicare from an HSA

Many of the households I work with retire with a health savings account still holding money. Once you are 65, IRS Publication 969 counts Medicare premiums as qualified medical expenses, which takes in Part B, Part D and Medicare Advantage premiums. The exception is a Medicare supplement: Medigap premiums are not qualified, so a Plan G premium paid from the HSA is a taxable distribution.

You can use the HSA card directly on the mailed coupon, or pay Medicare from checking and reimburse yourself from the HSA later; just keep the bills. One spouse detail catches people out. Pub 969 says Medicare premiums for a spouse are generally not qualified if the account holder is under 65. If you are 63 and your husband is 66, his Part B premium is not a qualified HSA expense for your account until you turn 65 yourself.

You cannot keep contributing to the HSA once Medicare starts, which is a separate decision covered in [can I contribute to an HSA while on Medicare?](/blog/can-i-contribute-to-an-hsa-while-on-medicare/)

## Snowbirds: the bill goes to one address

Medicare mails the bill to the address Social Security has on file. If you spend October to April in Peoria and the rest of the year in Wisconsin or Michigan, only one of those houses gets the mail, and a quarterly bill that lands while you are at the other one can sit for weeks. Three things fix this:

- Put Easy Pay in place before you leave for the season, given the 6 to 8 weeks it can take to start.
- Create your online Medicare account even if you never plan to pay through it, so you can see what has been billed from either house.
- If your main address changes, change it with Social Security, not only the Post Office.

## When you do start Social Security

Nothing about Medicare has to be redone. Once your Social Security benefit starts, the Part B premium and any income surcharges are normally taken out of the payment the way they are for everyone else, and the bills stop. Changing over can take a cycle, so pay any direct bill that still arrives until a premium deduction shows up on your benefit statement. If you set up Easy Pay, check that it stopped drafting once the withholding began.

If you are deciding between starting Social Security at 65 and waiting, the Medicare premium is not a reason either way. It is the same amount whether it is withheld or billed. Whether your Medicare starts by itself or needs an application is a separate question, answered in [do you automatically get Medicare when you turn 65?](/blog/do-you-automatically-get-medicare-when-you-turn-65/)

## What to do before your Part B starts

1. **Confirm your start date** with the [Medicare enrollment timeline](/tools/enrollment-timeline/), so you know which month the first bill covers.
2. **Open your Medicare account** as soon as your Medicare number arrives.
3. **Set up Easy Pay** right away, or put a reminder for the 25th in your calendar for each quarter until the drafts start.
4. **Decide how the HSA fits**: pay from it directly, or reimburse yourself and keep the paper trail.
5. **Keep a note of what bills you separately**: Medicare for Part B and any surcharges, your drug or Advantage plan for its premium, your Medigap company for Plan G or N.

I am an independent broker based in Anthem who covers [Peoria](/service-area/peoria-az/) and the rest of the north Valley, and premium logistics is a normal part of a turning-65 conversation. If you want to go through it with your own dates, [book a time here](/book/?topic=t65). This page is education, not tax or financial advice; for HSA reimbursement timing and anything on your return, check with your tax advisor.
