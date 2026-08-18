---
name: booking-calendar-integration
description: >
  Wire a booking/scheduling calendar into a site without ever offering a time the
  advisor is not free. Use when adding or debugging a scheduler, a "book a call"
  page, availability slots, or a Google/Outlook calendar sync — and ALWAYS when
  someone reports "it is showing times I am blocked" or "it double-booked me".
  Covers GoGuruX, GoHighLevel, and the Cloudflare Pages deploy trap that makes a
  fix look like it did not work.
user-invokable: true
license: MIT
metadata:
  author: 602Medicare / Medicare On Main
  version: "1.0.0"
  learned-the-hard-way: 2026-08-17, 2026-08-18
---

# Booking calendars: never offer a time that is already taken

Written after two consecutive evenings lost to the same bug on two sites. Read
this **before** touching a scheduler, not after.

## The one rule

**Offer only what the vendor positively lists as free. Never filter a list of
"all slots" by an `available` flag.**

A feed that returns every slot with a flag has two failure modes that both end
with a client booking over a blocked day:

- the flag is absent on some slots, and `available !== false` lets them through
- the vendor never applied the calendar block at all, and says `available: true`

A free-slots-style feed has neither, because a blocked day simply is not in the
response. There is no flag to misread. Prefer that feed even if it means talking
to a different system than the one you write the booking to.

**Corollary: open nothing by rule.** Do not enable a weekday because it is a
weekday and then close it when a lookup comes back empty. Open only the days the
feed named. Anything else — a holiday, a blocked morning, a day that filled
while the page was open — closes itself for free.

## Fail closed, always

If availability cannot be read: serve **no slots** and fall back to a phone
number or the vendor's own widget. Never fall through to an unchecked list.

An empty calendar under a phone number is a visible, ordinary state someone will
report in an hour. A calendar quietly offering blocked time is invisible until a
client turns up to an appointment that was never real.

Same rule for a calendar the API cannot read: an empty busy list plus an
`errors` entry is **not** a clear day. Throw, do not treat as free.

## "Connected" does not mean conflict-checked

A sync can run one way. Seeing a booking appear in Google Calendar proves the
**write** half works and says nothing about the read half.

Before blaming code, establish which direction is broken:

- **Write works?** Book a test appointment, see if it lands in the calendar.
- **Read works?** Block a day in the calendar, then ask the availability feed
  about that day. If the slots are still there, the vendor is not consulting the
  diary — and no site-side code can overrule a vendor that says "free".

Two more vendor-side causes worth checking before writing anything:
- the calendar may not be **assigned to a person** — some platforms block by
  person, not by calendar, so an unassigned calendar has no diary to consult
- the sync may be pointed at a **different Google account** than the one holding
  the blocks

## Read from one system, write to another — that is normal

The system with the trustworthy availability feed and the system the advisor
actually works in are often not the same. That is fine, and it is what both
sites here do:

- **READ** availability from GoHighLevel's free-slots feed:
  `GET backend.leadconnectorhq.com/calendars/{calendarId}/free-slots?startDate={ms}&endDate={ms}&timezone={tz}`
  Unauthenticated, CORS-open, lists only free time, keyed by `YYYY-MM-DD`, with
  a `traceId` alongside the days that must be skipped. **Range is capped at 31
  days** — ask for 32 and it returns nothing at all rather than an error, which
  reads as "no availability".
- **WRITE** the booking to GoGuruX `create-booking` (public anon key, no token).

The loop closes on its own: booking → GoGuruX → the advisor's Google Calendar →
the free-slots feed reads Google → the slot disappears.

⚠️ **GoGuruX and GoHighLevel are completely separate platforms.** A setting in
one is invisible in the other. GoGuruX has **no documented API** — its endpoints
are reverse-engineered from its own widget. Do not go looking in one for a
problem in the other, and do not expect GoGuruX's `get-availability` to honour a
Google block.

⚠️ **Serving the vendor's own iframe widget is NOT a safe fallback for this bug.**
The widget asks the same endpoint the page did, and an iframe cannot be filtered.

## Verifying — two days, not one

Always check **both**, or "it works" is meaningless:

```bash
curl -s 'https://SITE/api/availability?date=A-DAY-YOU-BLOCKED'   # expect: slots: []
curl -s 'https://SITE/api/availability?date=AN-ORDINARY-WORKDAY' # expect: a list
```

Both empty means the integration is broken, not that the fix worked.

## Cloudflare Pages: the branch decides production

`wrangler pages deploy` reads the **current git branch**. On a feature branch it
publishes a **preview** and leaves production untouched — it still prints
"Deployment complete", so it looks like it worked. The tell is a
`Deployment alias URL:` line; a production deploy has none.

```bash
npm run verify
npx wrangler pages deploy dist --project-name=PROJECT --branch=main   # from the REPO ROOT
```

Repo root, not `dist` — wrangler picks `functions/` up from the working
directory, and running it elsewhere ships the site with no API routes at all.

## Say "deployed", never "fixed"

Passing tests against stubs is not a working website. On a manually-published
site, nothing you write changes anything a client sees until someone runs the
deploy. Report what is true: written, tested, pushed, **not yet live** — and
confirm on the live host before calling it done.
