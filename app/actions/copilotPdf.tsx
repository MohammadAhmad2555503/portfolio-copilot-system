"use server";

import { pdf } from "@react-pdf/renderer";
import { CvDocument } from "@/lib/CvDocument";
import type { BaseCv } from "@/lib/types";

export async function renderTailoredPdfBase64(cv: BaseCv, coverLetter?: string) {
  const blob = await pdf(<CvDocument cv={cv} coverLetter={coverLetter} />).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

