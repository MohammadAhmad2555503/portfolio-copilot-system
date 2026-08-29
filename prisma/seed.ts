import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    slug: "ai-chat-assistant",
    title: "AI Chat Assistant",
    description: "Streaming AI assistant with retrieval augmented generation and multi-tenant chat history.",
    longDescription:
      "A production-grade AI chat platform with token streaming, source-grounded responses, document ingestion, and a composable RAG pipeline. The system includes workspace isolation, feedback collection, and observability hooks for evaluating answer quality.",
    thumbnail: "https://picsum.photos/seed/ai-chat-assistant/1200/800",
    techStack: ["Next.js", "TypeScript", "research lab", "PostgreSQL", "Prisma", "RAG"],
    liveUrl: "https://example.com/ai-chat-assistant",
    githubUrl: "https://github.com/yourname/ai-chat-assistant",
    featured: true
  },
  {
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    description: "Full storefront, Stripe checkout, cart persistence, inventory tools, and admin workflows.",
    longDescription:
      "A polished commerce system covering product discovery, cart flows, Stripe payments, stock management, order history, and an admin console. It emphasizes resilient checkout state, responsive catalog pages, and clean operational screens.",
    thumbnail: "https://picsum.photos/seed/e-commerce-platform/1200/800",
    techStack: ["Next.js", "React", "Stripe", "Node.js", "PostgreSQL"],
    liveUrl: "https://example.com/e-commerce-platform",
    githubUrl: "https://github.com/yourname/e-commerce-platform",
    featured: true
  },
  {
    slug: "devcollab",
    title: "DevCollab",
    description: "Collaborative code editor with WebSockets, presence, comments, and shareable sessions.",
    longDescription:
      "A real-time engineering workspace for pair programming and technical interviews. It includes collaborative editing, live cursors, execution panes, room-level permissions, and an activity trail for handoffs.",
    thumbnail: "https://picsum.photos/seed/devcollab/1200/800",
    techStack: ["React", "TypeScript", "Node.js", "WebSockets", "Monaco"],
    liveUrl: "https://example.com/devcollab",
    githubUrl: "https://github.com/yourname/devcollab",
    featured: true
  },
  {
    slug: "dataviz-dashboard",
    title: "DataViz Dashboard",
    description: "Real-time analytics surface with D3 visualizations, alerts, and executive summaries.",
    longDescription:
      "An analytics dashboard that turns event streams into operational insight. Users can compare cohorts, filter metrics, watch live charts, and export board-ready summaries from complex datasets.",
    thumbnail: "https://picsum.photos/seed/dataviz-dashboard/1200/800",
    techStack: ["React", "TypeScript", "D3.js", "Python", "FastAPI"],
    liveUrl: "https://example.com/dataviz-dashboard",
    githubUrl: "https://github.com/yourname/dataviz-dashboard",
    featured: false
  },
  {
    slug: "taskflow",
    title: "TaskFlow",
    description: "Project management tool with Kanban boards, automations, and AI prioritization.",
    longDescription:
      "A focused team planning tool with drag-and-drop boards, sprint health signals, rule-assisted prioritization, and clean notification flows for async delivery teams.",
    thumbnail: "https://picsum.photos/seed/taskflow/1200/800",
    techStack: ["Next.js", "TypeScript", "Prisma", "AI/ML", "PostgreSQL"],
    liveUrl: "https://example.com/taskflow",
    githubUrl: "https://github.com/yourname/taskflow",
    featured: false
  },
  {
    slug: "portfolio-builder",
    title: "Portfolio Builder",
    description: "Drag-and-drop portfolio creator with live preview, theme tokens, and deploy exports.",
    longDescription:
      "A meta portfolio tool for creators who want a fast, elegant web presence. It offers structured sections, live preview, theme controls, exportable content, and project templates.",
    thumbnail: "https://picsum.photos/seed/portfolio-builder/1200/800",
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind"],
    liveUrl: "https://example.com/portfolio-builder",
    githubUrl: "https://github.com/yourname/portfolio-builder",
    featured: false
  }
];

async function main() {
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });



