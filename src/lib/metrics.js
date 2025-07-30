import fs from "fs/promises";
import path from "path";

const filePath = path.resolve(process.cwd(), "src/data/metrics.json");

export async function incrementMetric(type) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);

    if (type === "calls") json.calls += 1;
    else if (type === "appointments") json.appointments += 1;

    await fs.writeFile(filePath, JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("❌ Failed to update metrics:", err);
  }
}
