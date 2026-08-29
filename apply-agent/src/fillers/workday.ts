import type { Page } from "playwright";
import type { ApplicationData, FillResult } from "../types.js";
import { fillCommonApplication } from "./shared.js";

export async function fillWorkday(page: Page, application: ApplicationData, pdfPath: string): Promise<FillResult> {
  const applyButton = page.getByRole("button", { name: /apply|start/i }).first();
  if ((await applyButton.count()) > 0 && (await applyButton.isVisible().catch(() => false))) {
    await applyButton.click().catch(() => undefined);
  }
  return fillCommonApplication(page, application, pdfPath);
}

