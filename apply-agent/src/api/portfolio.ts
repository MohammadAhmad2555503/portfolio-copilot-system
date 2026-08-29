import fs from "node:fs/promises";
import path from "node:path";
import axios from "axios";
import { config, downloadsDir } from "../config.js";
import type { ApplicationData } from "../types.js";

const client = axios.create({
  baseURL: config.portfolioUrl,
  headers: {
    "x-copilot-key": config.portfolioApiKey
  },
  timeout: 30000
});

export async function getPendingApplications() {
  const response = await client.get<{ applications: ApplicationData[] }>("/api/applications/pending");
  return response.data.applications;
}

export async function downloadTailoredPdf(application: ApplicationData) {
  await fs.mkdir(downloadsDir, { recursive: true });
  const filename = `${safe(application.company)}-${safe(application.jobTitle)}-${application.id}.pdf`;
  const filePath = path.join(downloadsDir, filename);
  const response = await client.get<ArrayBuffer>(`/api/applications/${application.id}/pdf`, {
    responseType: "arraybuffer"
  });
  await fs.writeFile(filePath, Buffer.from(response.data));
  return filePath;
}

export async function updateApplicationStatus(
  applicationId: string,
  payload: { status: string; notes?: string }
) {
  await client.patch(`/api/applications/${applicationId}/status`, payload);
}

function safe(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "application";
}

