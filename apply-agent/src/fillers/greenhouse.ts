import type { Page } from "playwright";
import type { ApplicationData, FillResult } from "../types.js";
import { fillCommonApplication } from "./shared.js";

export async function fillGreenhouse(page: Page, application: ApplicationData, pdfPath: string): Promise<FillResult> {
  await page.locator("#application, form").first().waitFor({ state: "visible", timeout: 15000 }).catch(() => undefined);
  return fillCommonApplication(page, application, pdfPath);
}

