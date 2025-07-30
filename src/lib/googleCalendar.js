import { google } from "googleapis";
import { JWT } from "google-auth-library";

const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
}

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const auth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: SCOPES,
});

export const calendar = google.calendar({ version: "v3", auth });

export async function createEvent(calendarId, {
  summary,
  description,
  startDateTime,
  endDateTime,
  timeZone = "Asia/Kolkata" // ← Set correct time zone here
}) {
  return await calendar.events.insert({
    calendarId,
    resource: {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: timeZone,
      },
    },
  });
}



export async function deleteEvent(calendarId, eventId) {
  return await calendar.events.delete({ calendarId, eventId });
}

export async function updateEvent(calendarId, eventId, updates) {
  return await calendar.events.patch({
    calendarId,
    eventId,
    resource: updates,
  });
}


export async function checkAvailability(calendarId, startDateTime, endDateTime) {
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startDateTime,
      timeMax: endDateTime,
      timeZone: "Asia/Kolkata",
      items: [{ id: calendarId }],
    },
  });

  const busySlots = response.data.calendars[calendarId].busy;
  return busySlots.length === 0; // true = available
}
