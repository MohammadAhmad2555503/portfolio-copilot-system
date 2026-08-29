import type { Page } from "playwright";
import type { ApplicationData, FillResult } from "../types.js";
import { fillCommonApplication } from "./shared.js";

export async function fillGeneric(page: Page, application: ApplicationData, pdfPath: string): Promise<FillResult> {
  return fillCommonApplication(page, application, pdfPath);
}

