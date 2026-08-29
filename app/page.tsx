import Link from "next/link";
import { FaChevronDown, FaDownload, FaRocket } from "react-icons/fa";
import { SceneLoader } from "@/components/home/SceneLoader";
import { Typewriter } from "@/components/home/Typewriter";
import { StatsCard } from "@/components/home/StatsCard";
import { ProfileLinksBar } from "@/components/home/ProfileLinksBar";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getProjects } from "@/lib/projects";
import { profile } from "@/lib/constants";

export default async function HomePage() {
  const projects = await getProjects();
  const featured = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <>
      <section className="relative min-h-screen overflow-hidden px-4">
        <SceneLoader />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center pb-20 pt-24 text-center">
          <p className="mb-4 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-cyan-100">
            Portfolio System
          </p>
          <h1 className="glitch-text text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl">
            {profile.name}
          </h1>
          <p className="mt-5 min-h-8 text-xl text-slate-200 md:text-2xl">
            <Typewriter />
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            I build precise web products, AI workflows, and full-stack systems that feel sharp from the first click.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="cyber-button" href="#featured-projects">
              <FaRocket aria-hidden />
              View My Projects
            </Link>
            <a className="muted-button" href="/api/cv/pdf">
              <FaDownload aria-hidden />
              Download My CV
            </a>
          </div>
          <div className="mt-10 w-full">
            <StatsCard projects={projects.length} technologies={profile.technologiesCount} years={profile.yearsExperience} />
          </div>
          <div className="mt-8">
            <ProfileLinksBar />
          </div>
          <a
            aria-label="Scroll to featured projects"
            className="focus-ring absolute bottom-8 grid h-11 w-11 animate-bounce place-items-center rounded-full border border-white/15 bg-slate-950/50 text-cyan-100"
            href="#featured-projects"
          >
            <FaChevronDown aria-hidden />
          </a>
        </div>
      </section>

      <section className="page-shell section-pad" id="featured-projects">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-200">Selected Work</p>
            <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">Featured Projects</h2>
          </div>
          <Link className="muted-button self-start" href="/projects">
            All Projects
          </Link>
        </div>
        <ProjectGrid projects={featured.length ? featured : projects.slice(0, 3)} />
      </section>
    </>
  );
}

