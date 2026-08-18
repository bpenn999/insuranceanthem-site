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
   * `'native'` — the site's own date grid and time list, fed by
   * **`/api/availability`**, which is the thing that makes this safe. That route
   * fetches GoGuruX's slots server-side and then subtracts Brian's Google
   * Calendar before the browser sees them, and withholds the lot if it cannot
   * read the diary. See functions/api/availability.ts.
   *
   * ⚠️ **`'embed'` is NOT the safer setting, despite what this comment said on
   * 2026-08-18.** GoGuruX computes availability server-side and its widget asks
   * the same endpoint the page did, so a calendar handing back blocked time
   * hands it to both. Under `'embed'` there is no guard at all — an iframe
   * cannot be filtered. Use it only to take this site out of the loop
   * deliberately, never as a way to be careful.
   *
   * The underlying cause is still on the GoGuruX side and still worth fixing:
   * the Google link on this calendar runs one way, writing appointments out
   * without reading busy time back. GoGuruX blocks by PERSON, not by calendar
   * (MOM's src/config/booking.config.ts, verified 2026-08-17), so a calendar
   * with nobody assigned has no diary to consult. Fixing that would make the
   * guard redundant; the guard exists because it has not been fixed, and
   * because a scheduler should not depend on a third party's setting staying
   * right.
   */
  mode: 'native' as 'embed' | 'native',

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
