"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { baseCv } from "@/lib/baseCv";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { scrapeJobUrl } from "@/lib/scrapeJob";
import { searchJobs as searchJobsProvider } from "@/lib/jobSearch";
import {
  saveApplicationSchema,
  searchJobsSchema,
  tailorApplicationSchema,
  updateApplicationSchema
} from "@/lib/schemas";
import type { ApplicationRecord, BaseCv, TailoredResult } from "@/lib/types";
import { renderTailoredPdfBase64 } from "@/app/actions/copilotPdf";

export async function searchJobs(input: unknown) {
  const parsed = searchJobsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Enter search keywords.", jobs: [] };

  const jobs = await searchJobsProvider(parsed.data.keywords, parsed.data.location);
  return { ok: true, message: `${jobs.length} jobs found.`, jobs };
}

export async function fetchJobDescription(input: { url: string }) {
  try {
    const description = await scrapeJobUrl(input.url);
    return { ok: true, description };
  } catch {
    return { ok: false, description: "", message: "Could not fetch that job page." };
  }
}

export async function tailorApplication(input: unknown) {
  const parsed = tailorApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Add a job description first.",
      result: null
    };
  }

  return {
    ok: true,
    message: "Tailored application prepared.",
    result: buildLocalTailoredResult(parsed.data.jobDescription)
  };
}

export async function saveApplication(input: unknown) {
  const parsed = saveApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Application data is incomplete.", id: null };
  }

  if (!hasDatabaseUrl()) {
    return {
      ok: false,
      message: "Connect DATABASE_URL and run Prisma migrations to save applications.",
      id: null
    };
  }

  try {
    const application = await prisma.jobApplication.create({
      data: {
        jobTitle: parsed.data.jobTitle,
        company: parsed.data.company,
        location: parsed.data.location,
        sourceUrl: parsed.data.sourceUrl || null,
        jobDescription: parsed.data.jobDescription,
        tailoredCv: parsed.data.tailoredCv as Prisma.InputJsonValue,
        coverLetter: parsed.data.coverLetter,
        status: parsed.data.status
      }
    });
    revalidatePath("/copilot");
    return { ok: true, message: "Application saved.", id: application.id };
  } catch {
    return { ok: false, message: "Could not save application.", id: null };
  }
}

export async function listApplications() {
  if (!hasDatabaseUrl()) return [];

  try {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { updatedAt: "desc" }
    });

    return applications.map(serializeApplication);
  } catch {
    return [];
  }
}

export async function updateApplication(input: unknown) {
  const parsed = updateApplicationSchema.safeParse(input);
  if (!parsed.success || !hasDatabaseUrl()) {
    return { ok: false, message: "Could not update application." };
  }

  try {
    await prisma.jobApplication.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.status,
        notes: parsed.data.notes
      }
    });
    revalidatePath("/copilot");
    return { ok: true, message: "Application updated." };
  } catch {
    return { ok: false, message: "Could not update application." };
  }
}

export async function generateTailoredPdf(input: { tailoredCv: BaseCv; coverLetter?: string }) {
  try {
    const base64 = await renderTailoredPdfBase64(input.tailoredCv, input.coverLetter);
    return {
      ok: true,
      filename: "tailored-cv.pdf",
      base64
    };
  } catch {
    return { ok: false, filename: "", base64: "" };
  }
}

function serializeApplication(application: ApplicationRecord) {
  return {
    ...application,
    appliedAt: application.appliedAt.toISOString(),
    updatedAt: application.updatedAt.toISOString()
  };
}

function buildLocalTailoredResult(jobDescription: string): TailoredResult {
  const keywords = extractKeywords(jobDescription);
  const tailoredCv: BaseCv = {
    ...baseCv,
    summary: `${baseCv.summary} Particularly aligned to this role through ${keywords.slice(0, 4).join(", ")}.`,
    skills: prioritizeSkills(baseCv.skills, keywords),
    experience: baseCv.experience.map((entry) => ({
      ...entry,
      bullets: entry.bullets.map((bullet) => emphasizeBullet(bullet, keywords))
    }))
  };

  const coverLetter = [
    `I am excited to apply for this role because it matches the full-stack product engineering work I have been focused on: reliable React and Next.js interfaces, typed backend workflows, and thoughtful AI integrations.`,
    `My experience maps closely to the requirements around ${keywords.slice(0, 5).join(", ")}. I have built production-style projects with TypeScript, PostgreSQL, Prisma, validation, API boundaries, accessibility, and user-centered interface design.`,
    "I would welcome the chance to discuss how this experience can help your team ship practical, polished software. Thank you for your time and consideration."
  ].join("\n\n");

  return { tailoredCv, coverLetter };
}

function prioritizeSkills(skills: BaseCv["skills"], keywords: string[]) {
  return Object.fromEntries(
    Object.entries(skills).map(([group, values]) => [
      group,
      [...values].sort((a, b) => scoreSkill(b, keywords) - scoreSkill(a, keywords))
    ])
  );
}

function scoreSkill(skill: string, keywords: string[]) {
  return keywords.some((keyword) => skill.toLowerCase().includes(keyword.toLowerCase())) ? 1 : 0;
}

function emphasizeBullet(bullet: string, keywords: string[]) {
  const matched = keywords.find((keyword) => bullet.toLowerCase().includes(keyword.toLowerCase()));
  return matched ? bullet : `${bullet} Emphasized outcomes relevant to ${keywords[0] ?? "the role"}.`;
}

function extractKeywords(description: string) {
  const known = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Prisma",
    "AI",
    "accessibility",
    "testing",
    "APIs",
    "product",
    "automation",
    "Python"
  ];

  const lower = description.toLowerCase();
  const matches = known.filter((term) => lower.includes(term.toLowerCase()));
  return matches.length ? matches : ["React", "TypeScript", "Next.js", "Node.js"];
}

