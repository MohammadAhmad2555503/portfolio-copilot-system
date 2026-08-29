import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AgentConfig } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
export const rootDir = path.resolve(path.dirname(__filename), "..");
export const userDataDir = path.join(rootDir, "user-profiles");
export const downloadsDir = path.join(rootDir, "downloads");
export const screenshotsDir = path.join(rootDir, "screenshots");

export const config: AgentConfig = {
  portfolioUrl: requiredEnv("PORTFOLIO_URL").replace(/\/$/, ""),
  portfolioApiKey: requiredEnv("PORTFOLIO_API_KEY"),
  headless: parseBoolean(process.env.HEADLESS, false),
  confirmBeforeSubmit: parseBoolean(process.env.CONFIRM_BEFORE_SUBMIT, true),
  pollIntervalSeconds: Number(process.env.POLL_INTERVAL_SECONDS ?? 30)
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

