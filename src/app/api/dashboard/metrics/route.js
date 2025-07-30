import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.resolve(process.cwd(), "src/data/metrics.json");

export async function GET() {
  const data = await fs.readFile(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request) {
  const updates = await request.json();
  const current = JSON.parse(await fs.readFile(filePath, "utf-8"));

  const newMetrics = {
    calls: current.calls + (updates.calls || 0),
    appointments: current.appointments + (updates.appointments || 0),
  };

  await fs.writeFile(filePath, JSON.stringify(newMetrics, null, 2));
  return NextResponse.json(newMetrics);
}
