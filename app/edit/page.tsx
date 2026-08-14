import "@puckeditor/core/puck.css";
import "@puckeditor/plugin-ai/styles.css";
import { PuckEditor } from "@/components/puck-editor";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function getData() {
  const DATA_FILE = path.join(process.cwd(), "puck-data.json");
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export default async function EditPage() {
  const initialData = await getData();

  return (
    <div className="min-h-screen bg-background">
      <PuckEditor initialData={initialData} />
    </div>
  );
}
