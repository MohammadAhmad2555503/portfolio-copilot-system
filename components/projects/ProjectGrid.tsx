import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectLike } from "@/lib/types";

export function ProjectGrid({ projects }: { projects: ProjectLike[] }) {
  if (projects.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-10 text-center">
        <div className="mx-auto mb-4 h-20 w-20 rounded-full border border-cyan-300/30 bg-cyan-300/10" />
        <h2 className="text-2xl font-black text-white">No projects found</h2>
        <p className="mt-2 text-slate-400">Try a different technology filter.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} index={index} project={project} />
      ))}
    </div>
  );
}

