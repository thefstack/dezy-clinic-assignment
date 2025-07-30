import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data", "appointments.json");

export async function readAppointments() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function writeAppointment(newAppointment) {
  const existing = await readAppointments();
  existing.push(newAppointment);
  await fs.writeFile(DATA_FILE, JSON.stringify(existing, null, 2));
}
