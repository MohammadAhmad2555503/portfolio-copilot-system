"use server";

import { renderTailoredPdfBase64 } from "@/app/actions/copilotPdf";
import { baseCv } from "@/lib/baseCv";

export async function generateBaseCvPdf() {
  try {
    const base64 = await renderTailoredPdfBase64(baseCv);
    return { ok: true, filename: "cv.pdf", base64 };
  } catch {
    return { ok: false, filename: "", base64: "" };
  }
}

