/**
 * The scheduler behind /book/.
 *
 * The calendar is GoGuruX's, and until now it reached the site as a
 * cross-origin `<iframe>` from my.gogurux.com. That worked, but it put the two
 * controls that matter most to a 65-plus visitor — the date grid and the time
 * picker — inside a document this site cannot style, size or test. The embed's
 * own time picker is a scroll list and its date grid collapses at phone widths,
 * and no amount of CSS here could reach either of them: a cross-origin frame is
 * opaque by design.
 *
 * So the page talked to the same endpoints the embed does and drew its own
 * controls. **That is no longer what ships — see `mode` below: the widget is
 * primary again because the hand-rolled picker offered times Brian had blocked
 * in Google Calendar.** The rest of this note still describes how the native
 * path works, and stays because that path is still here behind the flag.
 *
 * GoGuruX is a Supabase application; its public booking widget calls
 * two edge functions, both of which answer a plain cross-origin request from
 * this site (verified 2026-08-08 — the preflight returns
 * `access-control-allow-origin: https://602medicare.com`):
 *
 *   GET  /functions/v1/get-availability?date=&duration=&location_slug=&calendar_slug=
 *   POST /functions/v1/create-booking
 *
 * ⚠️ THIS IS AN UNDOCUMENTED, UNVERSIONED API. It is the same one GoGuruX's own
 * widget uses, so it will not vanish quietly, but nothing obliges them to keep
 * its shape. That is why `BookingPicker.astro` falls back to the original
 * iframe when a request fails or returns a shape it does not recognise, and why
 * the phone number sits under the calendar in every state. If bookings ever go
 * quiet, check these two endpoints first.
 *
 * The anon key below is a PUBLIC Supabase key with the `anon` role. It is not a
 * secret and never was: GoGuruX ships this exact string to every visitor inside
 * its own JavaScript bundle. It grants only what the two edge functions above
 * choose to expose. Do not treat finding it here as a leak, and do not move it
 * into an environment variable and think that has hidden it — it has to reach
 * the browser to work.
 */

export const booking = {
  /**
   * Which picker `/book/` shows.
   *
   * ⚠️ **`'embed'` — but do NOT read this as "the widget fixes the blocked-time
   * bug". It probably does not.** GoGuruX computes availability server-side and
   * its widget asks the same endpoint this page did, so a calendar that hands
   * back blocked time hands it to both. The widget is here because it is the
   * vendor's own rendering of the vendor's own answer, which is the least
   * surprising thing to serve while the calendar itself is being sorted out.
   *
   * The real cause is almost certainly on the calendar record: **GoGuruX blocks
   * by PERSON, not by calendar** (MOM's src/config/booking.config.ts, verified
   * 2026-08-17). A calendar with no team member assigned has nobody whose Google
   * Calendar to check, so it returns every slot inside its open hours. MOM hit
   * this same class of thing — its site was pointed at a calendar with "none of
   * the hours, team assignment or meeting-format work" done on it.
   *
   * So before touching any code here: open the **602 Medicare** calendar in
   * GoGuruX and check it is assigned to Brian, next to a MOM calendar that
   * works.
   *
   * The Google Calendar connection on this calendar in GoGuruX is live, and the
   * widget honours it: MOM books against the same location and never offers a
   * blocked time. The native picker did, because `get-availability` called
   * cold, with the four parameters below, does not come back filtered the way
   * the widget's own call does — something in what the widget sends, or does
   * with the answer, we never reproduced. Nobody outside GoGuruX can say what,
   * because **there is no API here to read**: those endpoints are undocumented
   * and unversioned, which the header above already said and this is the bill
   * for. The result was a scheduler that let people book over Brian's blocked
   * time, which is worse than any layout problem the native picker solved.
   *
   * So the widget is primary again, exactly as MOM has it, and the native
   * picker stays behind this flag rather than being deleted — its date grid and
   * time list are still the better controls for a 65-plus visitor, and none of
   * that work is wrong. Flipping this back to `'native'` needs one thing first:
   * a real `get-availability` response for a day with a known Google block,
   * showing the busy slot either absent or flagged. Until that exists, this
   * stays where it is.
   */
  mode: 'embed' as 'embed' | 'native',

  /**
   * ── THE MOM ARRANGEMENT, WAITING ON ONE VALUE (2026-08-18)
   *
   * Medicare On Main hit this same bug and fixed it by splitting the two halves
   * of booking apart (its src/config/booking.config.ts, 2026-08-13 and -17):
   *
   *   · READ availability from GoHighLevel's free-slots feed. No auth, CORS-open,
   *     one request per month. It lists ONLY what is free, so there is no flag to
   *     misread and nothing can be offered that the vendor did not name.
   *   · WRITE the appointment to GoGuruX `create-booking`, which is the diary
   *     Brian actually works in and the one his Google Calendar syncs with.
   *
   * `src/lib/booking.ts` already carries that read path, ported and unit-tested:
   * `monthWindow`, `parseFreeSlots`, `monthGridFromFeed`. The ONLY thing missing
   * is the calendar id below.
   *
   * ⚠️ IT IS NOT IN THE GHL SUB-ACCOUNT THIS FLEET CAN SEE. That account
   * (`YPFEoiE6fdPPaZYn6j7G`) holds MOM's calendars only — Phone Appointment,
   * Moab, Monticello, Grand Junction, IRMAA — and `search-locations` is 403 from
   * here, so 602's calendar cannot be discovered, only supplied. It is in
   * whichever GHL account 602Medicare's own booking lives in, which is a
   * different system from GoGuruX and always was.
   *
   * To finish this: put the calendar id here, set `mode` to `'native'`, and wire
   * `BookingPicker.astro`'s feed to
   *   `${ghl.api}/calendars/${ghl.calendarId}/free-slots?startDate=&endDate=&timezone=`
   * Do NOT flip `mode` before the id is real — an empty id would ask GHL for
   * `/calendars//free-slots` and fall the page back to the embed on every load.
   */
  ghl: {
    api: 'https://backend.leadconnectorhq.com',
    /** Empty until 602Medicare's own GHL calendar id is supplied. */
    calendarId: '',
    /** Arizona, which never observes DST — see src/lib/booking.ts. */
    timezone: 'America/Phoenix',
  },

  supabaseUrl: 'https://roiypxggqlgbzrspkeoo.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvaXlweGdncWxnYnpyc3BrZW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNDY3NTUsImV4cCI6MjA2MTYyMjc1NX0.KBULK0GoGRIXOW0uRFya8kLuiXaxpTsA5RW2tUlDOPY',

  /** The path segments of https://my.gogurux.com/book/<location>/<calendar> */
  locationSlug: 'medicareonmain-com',
  calendarSlug: '602-medicare',

  /** The embed, kept only as the fallback when the native picker cannot load. */
  embedUrl: 'https://my.gogurux.com/book/medicareonmain-com/602-medicare?embed=1',

  /**
   * The only meeting format this calendar offers
   * (`native_booking_allowed_meeting_formats: ["phone"]`).
   */
  locationType: 'phone',

  /**
   * Fallback slot length in minutes, used only to form the first availability
   * request. The real value comes back on the calendar object and takes over.
   *
   * ⚠️ The calendar is configured for 30-minute slots, while every CTA on this
   * site offers a "free 15-minute call" (`site.consult.minutes`). The two do not
   * agree. The picker shows the real start and end times rather than either
   * number, so the page never states a length it cannot keep — but the mismatch
   * is Brian's to settle in GoGuruX, not something to paper over here.
   */
  defaultDuration: 30,

  /**
   * How many bookable days to look up in the background on load, so a
   * fully-booked day is greyed out before someone taps it rather than after.
   * Each one is a request to a third party, so this covers the fortnight people
   * actually book in rather than the whole month.
   */
  warmDays: 10,
} as const;

export default booking;
