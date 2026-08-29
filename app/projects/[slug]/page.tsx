import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaGithub } from "react-icons/fa";
import { BrowserFrame } from "@/components/projects/BrowserFrame";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getProject, getRelatedProjects } from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const related = await getRelatedProjects(project.slug);

  return (
    <article className="page-shell section-pad">
      <Link className="muted-button mb-8" href="/projects">
        <FaArrowLeft aria-hidden />
        Back to projects
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-200">Project Detail</p>
          <h1 className="mt-2 text-4xl font-black text-white md:text-6xl">{project.title}</h1>
          <p className="mt-5 text-xl leading-8 text-slate-300">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-white/10">
          <Image alt="" className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 40vw" src={project.thumbnail} />
        </div>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-4">
        {[
          ["Overview", project.longDescription],
          [
            "Features",
            "Responsive interface, typed data models, resilient form states, production-style deployment settings, and accessible interactive flows."
          ],
          [
            "Tech Stack",
            `Built with ${project.techStack.join(", ")} and a focus on clear boundaries between data, UI, and business logic.`
          ],
          [
            "Challenges & Solutions",
            "The main challenge was balancing polish with maintainability. The solution uses composable components, small service helpers, and typed content contracts."
          ]
        ].map(([title, body]) => (
          <section key={title} className="glass-panel rounded-xl p-5">
            <h2 className="text-lg font-black text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-12">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-200">Live Demo</p>
            <h2 className="mt-2 text-3xl font-black text-white">Interactive Preview</h2>
          </div>
          <a className="muted-button self-start" href={project.githubUrl} rel="noreferrer" target="_blank">
            <FaGithub aria-hidden />
            View Source Code
          </a>
        </div>
        <BrowserFrame url={project.liveUrl} />
      </section>

      <section className="mt-14">
        <h2 className="mb-5 text-3xl font-black text-white">Related Projects</h2>
        <ProjectGrid projects={related} />
      </section>
    </article>
  );
}

