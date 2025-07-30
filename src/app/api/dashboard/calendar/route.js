import { NextResponse } from "next/server";
import { calendar } from "@/lib/googleCalendar"; // already configured
import { doctorCalendars } from "@/lib/doctorCalendars";

const timeMin = new Date().toISOString();
const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // next 7 days

export async function GET() {
  const allEvents = [];

  for (const doctor in doctorCalendars) {
    const calendarId = doctorCalendars[doctor];
    const res = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items.map((event) => ({
      summary: event.summary,
      start: event.start.dateTime,
      end: event.end.dateTime,
      doctor,
    }));

    allEvents.push(...events);
  }

  return NextResponse.json(allEvents);
}
