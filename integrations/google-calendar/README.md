# Booking → Google Calendar

The site is a static export, so it has no server of its own. Booking goes through a small Google Apps Script
web app that runs in your Google account and calls the Google Calendar API:

- `GET ?action=slots` returns your free 30-minute slots (working hours minus anything busy in your calendar).
- `POST` re-checks the slot, creates the event with a Google Meet link, sends the visitor a calendar invite
  and emails you the name, email, phone, topic and notes.

There is no API key or token to manage: Google asks you once for Calendar and Gmail access when you authorize
the script, and the web app runs as you. Nothing secret ends up in the website's code.

## Setup (about 10 minutes)

1. Go to <https://script.google.com> → **New project**. Name it "Website booking".
2. Replace the contents of `Code.gs` with [`Code.gs`](./Code.gs) from this folder.
3. **Project Settings** (gear icon) → tick **Show "appsscript.json" manifest file in editor**. Back in the
   editor, replace `appsscript.json` with [`appsscript.json`](./appsscript.json). This turns on the
   Google Calendar API (advanced service).
4. In `Code.gs`, set `OWNER_EMAIL` to the address where you want the booking emails. Adjust the working
   hours, days and time zone in `CONFIG` if you want.
5. Pick `testSetup` in the function dropdown → **Run**. Approve the permissions (Google warns that the app
   isn't verified: **Advanced → Go to Website booking**). The log shows how many free slots it found.
6. **Deploy → New deployment** → type **Web app**. *Execute as:* **Me**. *Who has access:* **Anyone**.
   → **Deploy** and copy the **Web app URL** (ends in `/exec`).
7. Put the URL in the site, either:
   - `src/content/content.ts` → `site.bookingUrl`, or
   - the `NEXT_PUBLIC_BOOKING_URL` environment variable on your host.
8. Rebuild and deploy the site.

Check it: open `<Web app URL>?action=slots` in a browser. You should see `{"ok":true,...,"slots":[...]}`.

## Changing the script later

Edit the code, then **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
The URL stays the same. (Saving alone does not update the live web app.)

## Notes

- Without a URL, `npm run dev` shows demo slots so you can try the flow; a production build tells visitors
  that online booking isn't connected and offers your email.
- Spam protection: a hidden honeypot field, server-side validation, at most 2 bookings per email per day, and
  a lock so two people can't book the same slot.
- Free Gmail accounts can send about 100 emails a day from Apps Script, far more than this needs.
