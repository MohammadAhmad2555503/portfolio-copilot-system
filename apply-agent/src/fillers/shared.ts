import type { Locator, Page } from "playwright";
import type { ApplicationData, FillResult } from "../types.js";

export async function fillCommonApplication(
  page: Page,
  application: ApplicationData,
  pdfPath: string
): Promise<FillResult> {
  const notes: string[] = [];
  const personal = extractPersonalInfo(application);

  await fillFirst(page, [
    "input[name='first_name']",
    "input[name='firstName']",
    "input[aria-label*='First']",
    "input[placeholder*='First']"
  ], personal.firstName, notes, "first name");

  await fillFirst(page, [
    "input[name='last_name']",
    "input[name='lastName']",
    "input[aria-label*='Last']",
    "input[placeholder*='Last']"
  ], personal.lastName, notes, "last name");

  await fillFirst(page, [
    "input[name='name']",
    "input[autocomplete='name']",
    "input[placeholder='Name']",
    "input[placeholder='Full name']",
    "input[aria-label='Name']",
    "input[aria-label='Full name']"
  ], personal.fullName, notes, "full name");

  await fillFirst(page, [
    "input[type='email']",
    "input[name='email']",
    "input[autocomplete='email']",
    "input[aria-label*='Email']"
  ], personal.email, notes, "email");

  await fillFirst(page, [
    "input[type='tel']",
    "input[name='phone']",
    "input[autocomplete='tel']",
    "input[aria-label*='Phone']"
  ], personal.phone, notes, "phone");

  await fillFirst(page, [
    "input[name='location']",
    "input[autocomplete='address-level2']",
    "input[aria-label*='Location']",
    "input[placeholder*='Location']"
  ], personal.location, notes, "location");

  await uploadResume(page, pdfPath, notes);
  await fillCoverLetter(page, application.coverLetter ?? "", notes);
  await answerShortQuestions(page, application, notes);

  return { success: true, notes };
}

export async function clickSubmit(page: Page) {
  const selectors = [
    "button[type='submit']",
    "input[type='submit']",
    "button:has-text('Submit')",
    "button:has-text('Apply')",
    "button:has-text('Send application')",
    "button:has-text('Submit application')"
  ];

  for (const selector of selectors) {
    const locator = page.locator(selector).last();
    if ((await locator.count()) > 0 && (await locator.isVisible().catch(() => false))) {
      await locator.click();
      return true;
    }
  }

  return false;
}

async function fillFirst(
  page: Page,
  selectors: string[],
  value: string,
  notes: string[],
  label: string
) {
  if (!value) return;
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) continue;
    if (!(await locator.isVisible().catch(() => false))) continue;
    await locator.fill(value).catch(async () => {
      await locator.type(value, { delay: 10 });
    });
    notes.push(`Filled ${label}.`);
    return;
  }
}

async function uploadResume(page: Page, pdfPath: string, notes: string[]) {
  const inputs = page.locator("input[type='file']");
  const count = await inputs.count();
  for (let index = 0; index < count; index += 1) {
    const input = inputs.nth(index);
    const accepts = ((await input.getAttribute("accept")) ?? "").toLowerCase();
    const name = `${(await input.getAttribute("name")) ?? ""} ${(await input.getAttribute("aria-label")) ?? ""}`.toLowerCase();
    if (accepts.includes("pdf") || name.includes("resume") || name.includes("cv") || count === 1) {
      await input.setInputFiles(pdfPath);
      notes.push("Uploaded tailored CV PDF.");
      return;
    }
  }
}

async function fillCoverLetter(page: Page, coverLetter: string, notes: string[]) {
  if (!coverLetter) return;
  const candidates = [
    "textarea[name*='cover']",
    "textarea[aria-label*='Cover']",
    "textarea[placeholder*='Cover']",
    "textarea"
  ];
  for (const selector of candidates) {
    const textarea = page.locator(selector).first();
    if ((await textarea.count()) === 0 || !(await textarea.isVisible().catch(() => false))) continue;
    const existing = await textarea.inputValue().catch(() => "");
    if (existing.trim().length > 20) continue;
    await textarea.fill(coverLetter);
    notes.push("Pasted cover letter.");
    return;
  }
}

async function answerShortQuestions(page: Page, application: ApplicationData, notes: string[]) {
  const textareas = page.locator("textarea");
  const count = await textareas.count();
  for (let index = 0; index < count; index += 1) {
    const textarea = textareas.nth(index);
    const visible = await textarea.isVisible().catch(() => false);
    if (!visible) continue;
    const current = await textarea.inputValue().catch(() => "");
    if (current.trim()) continue;
    const label = await nearbyText(textarea);
    if (label.toLowerCase().includes("cover")) continue;
    await textarea.fill(buildShortAnswer(label, application));
    notes.push(`Answered custom question: ${label.slice(0, 60)}`);
  }
}

async function nearbyText(locator: Locator) {
  return locator.evaluate((node) => {
    const id = node.getAttribute("id");
    if (id) {
      const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
      if (label?.textContent) return label.textContent.trim();
    }
    return node.closest("label, div, section")?.textContent?.trim() ?? "custom question";
  });
}

function buildShortAnswer(label: string, application: ApplicationData) {
  const prompt = label.toLowerCase();
  if (prompt.includes("why")) {
    return `I am interested in ${application.company} because the role aligns with my full-stack product engineering experience and my focus on building reliable, accessible, user-centered software.`;
  }
  if (prompt.includes("salary")) return "Open to discussing a fair market range for the role.";
  if (prompt.includes("sponsorship")) return "No.";
  return "Please see my CV for relevant experience across React, Next.js, TypeScript, Node.js, PostgreSQL, and applied AI workflows.";
}

function extractPersonalInfo(_application: ApplicationData) {
  const cv = _application.tailoredCv as
    | {
        name?: string;
        email?: string;
        phone?: string;
        location?: string;
      }
    | undefined;
  const fullName = cv?.name ?? "Your Name";
  const [firstName, ...rest] = fullName.split(" ");

  return {
    fullName,
    firstName: firstName || fullName,
    lastName: rest.join(" ") || "Name",
    email: cv?.email ?? "you@example.com",
    phone: cv?.phone ?? "+44 7000 000000",
    location: cv?.location ?? "London, United Kingdom"
  };
}

