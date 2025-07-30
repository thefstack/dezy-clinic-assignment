export const appointmentTools = [
  {
    type: "function",
    name: "check_doctor_availability",
    description: "Checks if a doctor is available during a specific time.",
    parameters: {
      type: "object",
      properties: {
        doctor: {
          type: "string",
          description: "Doctor's name (e.g., Jason, Elizabeth)",
        },
        datetime: {
          type: "string",
          format: "date-time",
          description:
            "Start time in ISO format (e.g., 2025-07-29T14:00:00+05:30)",
        },
        duration_minutes: {
          type: "integer",
          description: "Length of the appointment in minutes",
          default: 30,
        },
      },
      required: ["doctor", "datetime"],
    },
  },
  {
    type: "function",
    name: "book_appointment",
    description: "Books an appointment with a doctor",
    parameters: {
      type: "object",
      properties: {
        patient_name: { type: "string" },
        age: { type: "integer" },
        phone: { type: "string" },
        doctor: { type: "string", enum: ["Jason", "Elizabeth"] },
        datetime: { type: "string", format: "date-time" },
      },
      required: ["patient_name", "age", "phone", "doctor", "datetime"],
    },
  },
  {
    type: "function",
    name: "reschedule_appointment",
    description: "Reschedules an existing appointment to a new time.",
    parameters: {
      type: "object",
      properties: {
        doctor: {
          type: "string",
          description: "Doctor's name",
        },
        appointment_id: {
          type: "string",
          description: "The appointment ID to be rescheduled.",
        },
        new_datetime: {
          type: "string",
          format: "date-time",
          description: "The new datetime to reschedule the appointment to.",
        },
      },
      required: ["doctor", "appointment_id", "new_datetime"],
    },
  },
  {
    type: "function",
    name: "cancel_appointment",
    description: "Cancels an appointment",
    parameters: {
      type: "object",
      properties: {
        appointment_id: { type: "string" },
      },
      required: ["appointment_id"],
    },
  },
  {
    type: "function",
    name: "get_doctor_info",
    description: "Returns info about a doctor",
    parameters: {
      type: "object",
      properties: {
        doctor: { type: "string", enum: ["Jason", "Elizabeth"] },
      },
      required: ["doctor"],
    },
  },
  {
    type: "function",
    name: "get_appointment_details_by_patient_name_and_dateofappointment",
    description: "Returns appointment details for a given patient and time",
    parameters: {
      type: "object",
      properties: {
        patient_name: {
          type: "string",
          description: "Name of the patient",
        },
        datetime: {
          type: "string",
          format: "date-time",
          description: "Appointment datetime in ISO format",
        },
      },
      required: ["patient_name", "datetime"],
    },
  },
  {
    type: "function",
    name: "get_all_doctor_info",
    description: "Returns all doctors name and info",
  },
];
