/**
 * Booking backend for the site's "Book a discovery call" flow.
 *
 * GET  ?action=slots → free 30-minute slots, read from Google Calendar free/busy.
 * POST (JSON body)   → re-checks the slot, creates the event with a Google Meet link,
 *                      sends the visitor a calendar invite and emails you the details.
 *
 * Setup: integrations/google-calendar/README.md. The only line you must change is OWNER_EMAIL.
 */
const CONFIG = {
  /** Where the "new booking" email goes. */
  OWNER_EMAIL: 'YOUR_EMAIL@gmail.com',
  /** 'primary' = the main calendar of the account that deploys this script. */
  CALENDAR_ID: 'primary',
  /** Your working hours are read in this zone; visitors see slots in their own. */
  TIME_ZONE: 'Europe/Bucharest',
  /** 1 = Monday … 7 = Sunday. */
  WORK_DAYS: [1, 2, 3, 4, 5],
  WORK_START: '10:00',
  WORK_END: '17:00',
  SLOT_MINUTES: 30,
  /** No bookings sooner than this. */
  MIN_NOTICE_HOURS: 12,
  DAYS_AHEAD: 30,
  EVENT_TITLE: 'Discovery call',
  MAX_BOOKINGS_PER_EMAIL_PER_DAY: 2,
};

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'slots';
    if (action !== 'slots') return json_({ ok: false, error: 'invalid' });
    return json_({ ok: true, slotMinutes: CONFIG.SLOT_MINUTES, slots: freeSlots_().map((d) => d.toISOString()) });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const req = JSON.parse(e.postData.contents);
    // Honeypot filled: a bot. Answer like a success so it doesn't retry.
    if (req.website) return json_({ ok: true, start: req.start });

    const name = clean_(req.name, 100);
    const email = clean_(req.email, 200).toLowerCase();
    const phone = clean_(req.phone, 40);
    const interest = clean_(req.interest, 100);
    const note = clean_(req.note, 2000);
    const visitorTz = clean_(req.timeZone, 64);
    const start = new Date(req.start);
    const digits = phone.replace(/\D/g, '').length;
    // Phone is optional; when given it must look like a number.
    const badPhone = phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits < 7 || digits > 15);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || badPhone
        || !interest || isNaN(start.getTime())) {
      return json_({ ok: false, error: 'invalid' });
    }

    const cache = CacheService.getScriptCache();
    const key = 'bookings:' + email;
    const count = Number(cache.get(key) || 0);
    if (count >= CONFIG.MAX_BOOKINGS_PER_EMAIL_PER_DAY) return json_({ ok: false, error: 'rate_limited' });

    // One booking at a time, so two visitors can't take the same slot.
    lock.waitLock(20000);
    if (!freeSlots_().some((d) => d.getTime() === start.getTime())) return json_({ ok: false, error: 'slot_taken' });

    const end = new Date(start.getTime() + CONFIG.SLOT_MINUTES * 60000);
    const description = [
      'Booked from the website.',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Phone: ' + (phone || 'not given'),
      'Topic: ' + interest,
      note ? '\nNotes:\n' + note : '',
    ].join('\n');

    const event = Calendar.Events.insert({
      summary: CONFIG.EVENT_TITLE + ' · ' + name,
      description: description,
      start: { dateTime: start.toISOString(), timeZone: CONFIG.TIME_ZONE },
      end: { dateTime: end.toISOString(), timeZone: CONFIG.TIME_ZONE },
      attendees: [{ email: email, displayName: name }],
      conferenceData: { createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
      reminders: { useDefault: true },
    }, CONFIG.CALENDAR_ID, { conferenceDataVersion: 1, sendUpdates: 'all' });

    cache.put(key, String(count + 1), 24 * 60 * 60);

    const meetLink = event.hangoutLink || '';
    MailApp.sendEmail({
      to: CONFIG.OWNER_EMAIL,
      replyTo: email,
      subject: 'New booking: ' + name + ', ' + fmt_(start, CONFIG.TIME_ZONE),
      body: [
        'When: ' + fmt_(start, CONFIG.TIME_ZONE) + ' (' + CONFIG.TIME_ZONE + ')',
        visitorTz && visitorTz !== CONFIG.TIME_ZONE ? 'Their time: ' + fmt_(start, visitorTz) + ' (' + visitorTz + ')' : '',
        'Name: ' + name,
        'Email: ' + email,
        'Phone: ' + (phone || 'not given'),
        'Topic: ' + interest,
        note ? '\nNotes:\n' + note : '',
        meetLink ? '\nMeet: ' + meetLink : '',
        event.htmlLink ? 'Event: ' + event.htmlLink : '',
      ].filter(Boolean).join('\n'),
    });

    return json_({ ok: true, start: start.toISOString(), meetLink: meetLink });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  } finally {
    lock.releaseLock();
  }
}

/** Every slot inside working hours, past the minimum notice, that doesn't overlap a busy block in the calendar. */
function freeSlots_() {
  const tz = CONFIG.TIME_ZONE;
  const slotMs = CONFIG.SLOT_MINUTES * 60000;
  const earliest = Date.now() + CONFIG.MIN_NOTICE_HOURS * 3600000;
  // Step from today's noon, so daylight saving changes never skip or repeat a date.
  const noon = Utilities.parseDate(Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd') + ' 12:00', tz, 'yyyy-MM-dd HH:mm');

  const candidates = [];
  for (let i = 0; i <= CONFIG.DAYS_AHEAD; i++) {
    const day = new Date(noon.getTime() + i * 86400000);
    if (CONFIG.WORK_DAYS.indexOf(Number(Utilities.formatDate(day, tz, 'u'))) === -1) continue;
    const date = Utilities.formatDate(day, tz, 'yyyy-MM-dd');
    const open = Utilities.parseDate(date + ' ' + CONFIG.WORK_START, tz, 'yyyy-MM-dd HH:mm').getTime();
    const close = Utilities.parseDate(date + ' ' + CONFIG.WORK_END, tz, 'yyyy-MM-dd HH:mm').getTime();
    for (let t = open; t + slotMs <= close; t += slotMs) if (t >= earliest) candidates.push(new Date(t));
  }
  if (!candidates.length) return [];

  const fb = Calendar.Freebusy.query({
    timeMin: candidates[0].toISOString(),
    timeMax: new Date(candidates[candidates.length - 1].getTime() + slotMs).toISOString(),
    items: [{ id: CONFIG.CALENDAR_ID }],
  });
  const cal = fb.calendars[CONFIG.CALENDAR_ID] || Object.keys(fb.calendars).map((k) => fb.calendars[k])[0] || {};
  const busy = (cal.busy || []).map((b) => [new Date(b.start).getTime(), new Date(b.end).getTime()]);

  return candidates.filter((c) => {
    const s = c.getTime();
    const e = s + slotMs;
    return !busy.some((b) => s < b[1] && e > b[0]);
  });
}

function clean_(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function fmt_(d, tz) {
  return Utilities.formatDate(d, tz, "EEE d MMM yyyy, HH:mm");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor: it asks for Calendar and Gmail access and logs your free slots. */
function testSetup() {
  const slots = freeSlots_();
  console.log(slots.length + ' free slots. First: ' + (slots[0] ? fmt_(slots[0], CONFIG.TIME_ZONE) : 'none'));
  if (CONFIG.OWNER_EMAIL.indexOf('YOUR_EMAIL') === 0) console.warn('Set CONFIG.OWNER_EMAIL before deploying.');
}
