/**
 * GET /api/month?from=YYYY-MM-DD&days=N — a whole picker month of X's open
 * starts in one request (2026-10-24, Brian: "make sure the booking calendar is
 * lightning fast").
 *
 * The picker used to call /api/availability once per weekday, four at a time,
 * before it would draw the month — 20+ round trips. gx-availability-cache's
 * /month answers every day from its warmed store in ~0.2s. Same-origin proxy so
 * the CSP's connect-src does not need another host. X only, like
 * /api/availability: X holds Brian's Google diary.
 *
 *   200 { success: true, calendar: {id, time_zone, slot_duration}, days: {date: [{startUtc, endUtc}]} }
 */
const GX_CACHE = 'https://gx-availability-cache.brianinsuranceservices.workers.dev';
const CALENDAR_SLUG = '602-medicare';
/** Every 602 appointment is 45 minutes — see functions/api/availability.ts. */
const APPOINTMENT_MINUTES = 45;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const onRequest = async ({ request }: { request: Request }): Promise<Response> => {
  const u = new URL(request.url);
  const from = u.searchParams.get('from') ?? '';
  const days = Math.min(Math.max(Number(u.searchParams.get('days')) || 31, 1), 62);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) return json(400, { success: false, error: 'from must be YYYY-MM-DD' });
  try {
    const res = await fetch(`${GX_CACHE}/month?calendar_slug=${CALENDAR_SLUG}&from=${from}&days=${days}`, {
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`month ${res.status}`);
    const body = (await res.json()) as {
      calendar?: { id?: string; time_zone?: string; slot_duration?: number };
      days?: Record<string, Array<{ startUtc: string }>>;
    };
    if (!body?.days || !body.calendar) throw new Error('month: unexpected shape');
    // X answers for its own length; a shorter answer would sell starts that run
    // into the next call, so it is refused rather than trusted.
    if ((Number(body.calendar.slot_duration) || 0) < APPOINTMENT_MINUTES) throw new Error('calendar shorter than 45');
    const now = Date.now();
    const out: Record<string, Array<{ startUtc: string; endUtc: string; available: true }>> = {};
    for (const [d, list] of Object.entries(body.days)) {
      out[d] = list
        .map((s) => Date.parse(s.startUtc))
        .filter((t) => Number.isFinite(t) && t > now)
        .map((t) => ({
          startUtc: new Date(t).toISOString(),
          endUtc: new Date(t + APPOINTMENT_MINUTES * 60_000).toISOString(),
          available: true as const,
        }));
    }
    return json(200, { success: true, calendar: { ...body.calendar, slot_duration: APPOINTMENT_MINUTES }, days: out });
  } catch (err) {
    console.error('month:', String(err));
    return json(502, { success: false, error: 'scheduler unavailable' });
  }
};
