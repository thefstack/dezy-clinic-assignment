import { doctorCalendars } from "@/lib/doctorCalendars";
import {
  checkAvailability,
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/lib/googleCalendar";
import { incrementMetric } from "./metrics";
import { readAppointments, writeAppointment } from "./appointmentStorage";

export async function handleFunctionCall(name, args) {
  console.log(`🔧 Invoked function: ${name}`);
  console.log("📦 Arguments:", args);
  await incrementMetric("calls");

  try {
    switch (name) {
      case "check_doctor_availability": {
        const { doctor, datetime, duration_minutes = 30 } = args;
        const calendarId = doctorCalendars[doctor];

        if (!calendarId) {
          console.warn(`⚠️ Calendar ID not found for doctor: ${doctor}`);
          return { message: `❌ Doctor ${doctor} not found.` };
        }

        const startDateTime = datetime;
        const endDateTime = new Date(
          new Date(datetime).getTime() + duration_minutes * 60000
        ).toISOString();

        const isFree = await checkAvailability(
          calendarId,
          startDateTime,
          endDateTime
        );
        console.log(`🕓 Availability check result: ${isFree}`);

        return {
          message: isFree
            ? `✅ Dr. ${doctor} is available at ${datetime}.`
            : `⛔ Dr. ${doctor} is not available at ${datetime}. Please choose another time.`,
          available: isFree,
        };
      }

      case "book_appointment": {
        const calendarId = doctorCalendars[args.doctor];
        if (!calendarId) {
          console.warn(`⚠️ Calendar ID not found for doctor: ${args.doctor}`);
          return { message: `❌ Doctor ${args.doctor} not found.` };
        }

        const start = new Date(args.datetime);
        const end = new Date(start.getTime() + 30 * 60000); // 30-minute slot

        const isFree = await checkAvailability(
          calendarId,
          start.toISOString(),
          end.toISOString()
        );
        console.log(
          `📅 Booking availability for ${args.doctor} at ${args.datetime}:`,
          isFree
        );

        if (!isFree) {
          return {
            message: `⛔ Dr. ${args.doctor} is unavailable at ${args.datetime}. Please choose another time.`,
          };
        }

        const event = await createEvent(calendarId, {
          summary: `Appointment with ${args.patient_name}`,
          description: `Patient: ${args.patient_name}\nAge: ${args.age}\nPhone: ${args.phone}`,
          startDateTime: args.datetime, // 👈 already in correct ISO with time zone
          endDateTime: new Date(
            new Date(args.datetime).getTime() + 30 * 60000
          ).toISOString(),
          timeZone: "Asia/Kolkata",
        });
        await incrementMetric("appointments");
        await writeAppointment({
          appointment_id: event.data.id,
          patient_name: args.patient_name,
          phone: args.phone,
          age: args.age,
          doctor: args.doctor,
          datetime: args.datetime,
        });

        console.log("✅ Appointment created. Event ID:", event.data.id);

        return {
          message: `✅ Appointment booked with Dr. ${args.doctor} at ${args.datetime}`,
          appointment_id: event.data.id,
        };
      }

      case "cancel_appointment": {
        const calendarId = doctorCalendars[args.doctor];
        console.log(
          `🗑️ Cancelling appointment ID ${args.appointment_id} for ${args.doctor}`
        );
        await deleteEvent(calendarId, args.appointment_id);
        return { message: "🗑️ Appointment cancelled successfully." };
      }

      case "reschedule_appointment": {
        const calendarId = doctorCalendars[args.doctor];

        const newStart = args.new_datetime;
        const newEnd = new Date(
          new Date(args.new_datetime).getTime() + 30 * 60000
        ).toISOString();

        console.log(
          `🔁 Rescheduling appointment ${args.appointment_id} to ${args.new_datetime}`
        );
        await updateEvent(calendarId, args.appointment_id, {
          start: { dateTime: newStart, timeZone: "Asia/Kolkata" },
          end: { dateTime: newEnd, timeZone: "Asia/Kolkata" },
        });

        return {
          message: `🕒 Appointment rescheduled to ${args.new_datetime}`,
        };
      }

      case "get_doctor_info": {
        const bios = {
          Jason: "👨‍⚕️ Dr. Jason specializes in Rhinoplasty & Lip Fillers.",
          Elizabeth:
            "👩‍⚕️ Dr. Elizabeth specializes in Tummy Tuck & Upper Arm Lift.",
        };
        console.log(`📖 Doctor bio requested: ${args.doctor}`);
        return { message: bios[args.doctor] || "Doctor not found." };
      }


      case "get_all_doctor_info": {
        const bios = {
          Jason: "👨‍⚕️ Dr. Jason specializes in Rhinoplasty & Lip Fillers.",
          Elizabeth:
            "👩‍⚕️ Dr. Elizabeth specializes in Tummy Tuck & Upper Arm Lift.",
        };
        console.log(`📖 all Doctor bio requested`);
        return { message: JSON.stringify(bios) || "Doctor not found." };
      }


      case "get_appointment_details_by_patient_name_and_dateofappointment": {
        const { patient_name, datetime } = args;
        const appointments = await readAppointments();

        const matched = appointments.find(
          (appt) =>
            appt.patient_name.toLowerCase() === patient_name.toLowerCase() &&
            new Date(appt.datetime).toISOString() ===
              new Date(datetime).toISOString()
        );

        if (!matched) {
          return {
            message: `❌ No appointment found for ${patient_name} at ${datetime}.`,
          };
        }

        return {
          message: `📋 Appointment found:\nDoctor: ${matched.doctor}\nTime: ${matched.datetime}\nPatient: ${matched.patient_name}\nPhone: ${matched.phone}`,
          details: matched,
        };
      }

      default:
        console.error(`❓ Unknown function called: ${name}`);
        return { message: "❓ Unknown function requested." };
    }
  } catch (error) {
    console.error(`❌ Error in function ${name}:`, error);
    return { message: `❌ An error occurred while processing ${name}.` };
  }
}
