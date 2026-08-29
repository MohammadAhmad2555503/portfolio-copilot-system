import type { Page } from "playwright";
import type { AtsType } from "../types.js";

export async function detectAts(page: Page): Promise<AtsType> {
  const url = page.url().toLowerCase();

  if (url.includes("greenhouse.io") || url.includes("boards.greenhouse")) return "greenhouse";
  if (url.includes("myworkdayjobs.com") || url.includes("workday")) return "workday";
  if (url.includes("lever.co")) return "lever";
  if (url.includes("bamboohr.com")) return "bamboohr";
  if (url.includes("recruitee.com")) return "recruitee";
  if (url.includes("smartrecruiters.com")) return "smartrecruiters";

  const markers = await page.locator("form, input, textarea, button").evaluateAll((nodes) =>
    nodes
      .map((node) => `${node.getAttribute("action") ?? ""} ${node.getAttribute("name") ?? ""} ${node.textContent ?? ""}`)
      .join(" ")
      .toLowerCase()
  );

  if (markers.includes("greenhouse")) return "greenhouse";
  if (markers.includes("lever")) return "lever";
  if (markers.includes("workday")) return "workday";

  return "generic";
}

