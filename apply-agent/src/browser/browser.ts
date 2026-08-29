import fs from "node:fs/promises";
import path from "node:path";
import { chromium, type BrowserContext, type Page } from "playwright";
import { config, screenshotsDir, userDataDir } from "../config.js";

export async function openBrowser() {
  await fs.mkdir(userDataDir, { recursive: true });
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: config.headless,
    viewport: { width: 1440, height: 960 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    locale: "en-GB",
    acceptDownloads: true
  });

  const page = context.pages()[0] ?? (await context.newPage());
  page.setDefaultTimeout(15000);
  return { context, page };
}

export async function closeBrowser(context: BrowserContext) {
  await context.close();
}

export async function takeScreenshot(page: Page, label: string) {
  await fs.mkdir(screenshotsDir, { recursive: true });
  const filename = `${new Date().toISOString().replace(/[:.]/g, "-")}-${safe(label)}.png`;
  const filePath = path.join(screenshotsDir, filename);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

function safe(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "screenshot";
}

