import fs from "node:fs/promises";
import process from "node:process";
import boxen from "boxen";
import chalk from "chalk";
import { config, downloadsDir, screenshotsDir } from "./config.js";
import {
  downloadTailoredPdf,
  getPendingApplications,
  updateApplicationStatus
} from "./api/portfolio.js";
import { openBrowser, closeBrowser, takeScreenshot } from "./browser/browser.js";
import { detectAts } from "./detectors/atsDetector.js";
import { fillGeneric } from "./fillers/generic.js";
import { fillGreenhouse } from "./fillers/greenhouse.js";
import { fillLever } from "./fillers/lever.js";
import { fillWorkday } from "./fillers/workday.js";
import { fillBambooHr } from "./fillers/bamboohr.js";
import { clickSubmit } from "./fillers/shared.js";
import type { ApplicationData, AtsType } from "./types.js";

let lastApplicationAt = 0;

async function main() {
  await fs.mkdir(downloadsDir, { recursive: true });
  await fs.mkdir(screenshotsDir, { recursive: true });

  logBox("Apply Agent", [
    `Portfolio: ${config.portfolioUrl}`,
    `Headless: ${String(config.headless)}`,
    `Confirm before submit: ${String(config.confirmBeforeSubmit)}`,
    `Poll interval: ${config.pollIntervalSeconds}s`
  ]);

  while (true) {
    try {
      const pending = await getPendingApplications();
      if (pending.length === 0) {
        log(chalk.gray("Waiting for pending applications..."));
      }

      for (const application of pending) {
        await respectRateLimit();
        await processApplication(application);
        lastApplicationAt = Date.now();
      }
    } catch (error) {
      log(chalk.red(`Polling error: ${readError(error)}`));
    }

    await sleep(config.pollIntervalSeconds * 1000);
  }
}

async function processApplication(application: ApplicationData) {
  log(chalk.cyan(`Processing: ${application.jobTitle} at ${application.company}`));

  if (!application.sourceUrl) {
    await updateApplicationStatus(application.id, {
      status: "failed",
      notes: "No application URL was saved."
    });
    return;
  }

  let context: Awaited<ReturnType<typeof openBrowser>>["context"] | null = null;

  try {
    const pdfPath = await downloadTailoredPdf(application);
    const opened = await openBrowser();
    context = opened.context;
    const page = opened.page;

    await page.goto(application.sourceUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => undefined);

    const ats = await detectAts(page);
    log(chalk.blue(`Detected ATS: ${ats}`));
    const fillResult = await fillByAts(ats, page, application, pdfPath);
    fillResult.notes.forEach((note) => log(chalk.gray(`- ${note}`)));

    const readyScreenshot = await takeScreenshot(page, `${application.company}-${application.jobTitle}-ready`);
    log(chalk.yellow(`Ready screenshot: ${readyScreenshot}`));

    const confirmed = config.confirmBeforeSubmit ? await waitForConfirmation() : true;
    if (!confirmed) {
      await updateApplicationStatus(application.id, {
        status: "saved",
        notes: "Skipped before submission by user."
      });
      log(chalk.yellow("Skipped by user."));
      return;
    }

    const submitted = await clickSubmit(page);
    if (!submitted) {
      await updateApplicationStatus(application.id, {
        status: "failed",
        notes: "Could not locate a submit button after filling the form."
      });
      log(chalk.red("No submit button found."));
      return;
    }

    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => undefined);
    const confirmationScreenshot = await takeScreenshot(page, `${application.company}-${application.jobTitle}-submitted`);
    await updateApplicationStatus(application.id, {
      status: "applied",
      notes: `Submitted by apply-agent. Confirmation screenshot: ${confirmationScreenshot}`
    });
    log(chalk.green("Applied successfully."));
  } catch (error) {
    await updateApplicationStatus(application.id, {
      status: "failed",
      notes: `Agent error: ${readError(error)}`
    }).catch(() => undefined);
    log(chalk.red(`Application failed: ${readError(error)}`));
  } finally {
    if (context) await closeBrowser(context);
  }
}

async function fillByAts(
  ats: AtsType,
  page: Awaited<ReturnType<typeof openBrowser>>["page"],
  application: ApplicationData,
  pdfPath: string
) {
  switch (ats) {
    case "greenhouse":
      return fillGreenhouse(page, application, pdfPath);
    case "lever":
      return fillLever(page, application, pdfPath);
    case "workday":
      return fillWorkday(page, application, pdfPath);
    case "bamboohr":
      return fillBambooHr(page, application, pdfPath);
    default:
      return fillGeneric(page, application, pdfPath);
  }
}

async function waitForConfirmation() {
  process.stdout.write(chalk.yellow("Ready to submit. Press Enter to confirm, Esc or s to skip... "));

  return new Promise<boolean>((resolve) => {
    const stdin = process.stdin;
    const cleanup = () => {
      stdin.off("data", onData);
      if (stdin.isTTY) stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write("\n");
    };
    const onData = (data: Buffer) => {
      const key = data.toString("utf8");
      if (key === "\r" || key === "\n") {
        cleanup();
        resolve(true);
      } else if (data[0] === 27 || key.toLowerCase() === "s") {
        cleanup();
        resolve(false);
      }
    };

    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function respectRateLimit() {
  const elapsed = Date.now() - lastApplicationAt;
  const oneMinute = 60_000;
  if (elapsed > oneMinute) return;
  await sleep(oneMinute - elapsed);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(message: string) {
  console.log(`${chalk.gray(new Date().toLocaleTimeString())} ${message}`);
}

function logBox(title: string, lines: string[]) {
  console.log(
    boxen([chalk.bold(title), "", ...lines].join("\n"), {
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round"
    })
  );
}

function readError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

