import { unstable_cache } from "next/cache";
import type { JobPost } from "@/lib/types";

type ArbeitnowJob = {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags?: string[];
  location?: string;
  created_at?: number;
};

const mockJobs: JobPost[] = [
  {
    id: "mock-frontend-ai",
    title: "Frontend Engineer, AI Products",
    company: "Northstar Labs",
    location: "Remote - UK",
    tags: ["React", "TypeScript", "Next.js", "AI"],
    url: "https://example.com/jobs/frontend-ai",
    source: "mock",
    description:
      "We are looking for a frontend engineer with React, TypeScript, accessibility, product instincts, and experience integrating AI APIs into polished user workflows."
  },
  {
    id: "mock-fullstack-platform",
    title: "Full-Stack Developer",
    company: "BrightOps",
    location: "London",
    tags: ["Node.js", "PostgreSQL", "Prisma", "Next.js"],
    url: "https://example.com/jobs/fullstack-platform",
    source: "mock",
    description:
      "Build internal platform features with Next.js, Node.js, PostgreSQL, Prisma, validation, API design, and thoughtful collaboration with product teams."
  }
];

const fetchArbeitnow = unstable_cache(
  async () => {
    const response = await fetch("https://www.arbeitnow.com/api/job-board-api", {
      headers: { accept: "application/json" },
      next: { revalidate: 900 }
    });

    if (!response.ok) {
      throw new Error("Arbeitnow request failed");
    }

    const json = (await response.json()) as { data?: ArbeitnowJob[] };
    return json.data ?? [];
  },
  ["arbeitnow-job-board"],
  { revalidate: 900 }
);

export async function searchJobs(keywords: string, location?: string): Promise<JobPost[]> {
  const keywordTerms = keywords
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const locationTerm = location?.toLowerCase().trim();

  try {
    const jobs = await fetchArbeitnow();
    return jobs
      .map((job): JobPost => ({
        id: job.slug,
        title: job.title,
        company: job.company_name,
        location: job.location || (job.remote ? "Remote" : "Not listed"),
        tags: job.tags?.slice(0, 6) ?? [],
        url: job.url,
        source: "arbeitnow",
        postedAt: job.created_at ? new Date(job.created_at * 1000).toISOString() : undefined,
        description: stripHtml(job.description)
      }))
      .filter((job) => {
        const haystack = `${job.title} ${job.company} ${job.location} ${job.tags.join(" ")} ${job.description}`.toLowerCase();
        const keywordMatch = keywordTerms.every((term) => haystack.includes(term));
        const locationMatch = !locationTerm || haystack.includes(locationTerm);
        return keywordMatch && locationMatch;
      })
      .slice(0, 20);
  } catch {
    return mockJobs.filter((job) => {
      const haystack = `${job.title} ${job.company} ${job.location} ${job.tags.join(" ")} ${job.description}`.toLowerCase();
      return keywordTerms.every((term) => haystack.includes(term));
    });
  }
}

function stripHtml(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

