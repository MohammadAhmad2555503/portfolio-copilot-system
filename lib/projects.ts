import { prisma, hasDatabaseUrl } from "@/lib/prisma";
import type { ProjectLike } from "@/lib/types";

export const fallbackProjects: ProjectLike[] = [
  {
    slug: "ai-chat-assistant",
    title: "AI Chat Assistant",
    description: "Streaming AI assistant with RAG, source citations, and workspace history.",
    longDescription:
      "A production-grade AI assistant that combines streaming responses, document ingestion, vector search, and source-aware answers. It includes tenant-safe workspaces and quality feedback loops.",
    thumbnail: "https://picsum.photos/seed/ai-chat-assistant/1200/800",
    techStack: ["Next.js", "TypeScript", "research lab", "PostgreSQL", "Prisma", "AI/ML"],
    liveUrl: "https://example.com/ai-chat-assistant",
    githubUrl: "https://github.com/yourname/ai-chat-assistant",
    featured: true
  },
  {
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    description: "Stripe storefront with cart persistence, admin tools, and inventory workflows.",
    longDescription:
      "A complete shopping experience with product pages, checkout recovery, payment handling, order history, and a restrained admin console for daily operations.",
    thumbnail: "https://picsum.photos/seed/e-commerce-platform/1200/800",
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"],
    liveUrl: "https://example.com/e-commerce-platform",
    githubUrl: "https://github.com/yourname/e-commerce-platform",
    featured: true
  },
  {
    slug: "devcollab",
    title: "DevCollab",
    description: "Real-time collaborative code editor with comments, presence, and rooms.",
    longDescription:
      "A collaborative development workspace that supports live editing, session permissions, cursors, code review comments, and interview-friendly execution panels.",
    thumbnail: "https://picsum.photos/seed/devcollab/1200/800",
    techStack: ["React", "TypeScript", "Node.js", "WebSockets"],
    liveUrl: "https://example.com/devcollab",
    githubUrl: "https://github.com/yourname/devcollab",
    featured: true
  },
  {
    slug: "dataviz-dashboard",
    title: "DataViz Dashboard",
    description: "Interactive analytics dashboard with D3 charts and live operational data.",
    longDescription:
      "A focused reporting surface for comparing cohorts, monitoring real-time metrics, building dashboards, and exporting high-signal summaries for stakeholders.",
    thumbnail: "https://picsum.photos/seed/dataviz-dashboard/1200/800",
    techStack: ["React", "TypeScript", "D3.js", "Python"],
    liveUrl: "https://example.com/dataviz-dashboard",
    githubUrl: "https://github.com/yourname/dataviz-dashboard",
    featured: false
  },
  {
    slug: "taskflow",
    title: "TaskFlow",
    description: "Kanban planning product with automations and rule-assisted prioritization.",
    longDescription:
      "A project management tool shaped for small teams: drag-and-drop boards, saved views, sprint signals, and AI suggestions for sequencing work.",
    thumbnail: "https://picsum.photos/seed/taskflow/1200/800",
    techStack: ["Next.js", "TypeScript", "Prisma", "AI/ML"],
    liveUrl: "https://example.com/taskflow",
    githubUrl: "https://github.com/yourname/taskflow",
    featured: false
  },
  {
    slug: "portfolio-builder",
    title: "Portfolio Builder",
    description: "Drag-and-drop portfolio creator with live preview and deployable exports.",
    longDescription:
      "A portfolio creation tool with structured content, theme controls, reusable sections, live preview, and exportable project metadata.",
    thumbnail: "https://picsum.photos/seed/portfolio-builder/1200/800",
    techStack: ["Next.js", "React", "TypeScript", "Node.js"],
    liveUrl: "https://example.com/portfolio-builder",
    githubUrl: "https://github.com/yourname/portfolio-builder",
    featured: false
  }
];

export async function getProjects(filter?: string | null): Promise<ProjectLike[]> {
  const normalized = filter && filter !== "All" ? filter : null;

  if (!hasDatabaseUrl()) {
    return filterProjects(fallbackProjects, normalized);
  }

  try {
    const projects = await prisma.project.findMany({
      where: normalized ? { techStack: { has: normalized } } : undefined,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });
    return projects;
  } catch {
    return filterProjects(fallbackProjects, normalized);
  }
}

export async function getProject(slug: string): Promise<ProjectLike | null> {
  if (!hasDatabaseUrl()) {
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }

  try {
    return await prisma.project.findUnique({ where: { slug } });
  } catch {
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }
}

export async function getRelatedProjects(slug: string): Promise<ProjectLike[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.slug !== slug).slice(0, 3);
}

function filterProjects(projects: ProjectLike[], filter: string | null) {
  if (!filter) return projects;
  return projects.filter((project) => project.techStack.includes(filter));
}



