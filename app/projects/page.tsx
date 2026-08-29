import type { Metadata } from "next";
import { FilterBar } from "@/components/projects/FilterBar";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Full-stack, AI, and product engineering projects."
};

type Props = {
  searchParams?: Promise<{
    tech?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const tech = params?.tech ?? "All";
  const projects = await getProjects(tech);

  return (
    <section className="page-shell section-pad">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-200">Projects</p>
        <h1 className="mt-2 text-4xl font-black text-white md:text-6xl">Live Workbench</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          A grid of practical builds covering product interfaces, backend systems, collaboration, data, and applied AI.
        </p>
      </div>
      <div className="mb-8">
        <FilterBar active={tech} />
      </div>
      <ProjectGrid projects={projects} />
    </section>
  );
}

