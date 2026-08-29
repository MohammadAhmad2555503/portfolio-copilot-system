"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import type { ProjectLike } from "@/lib/types";

export function ProjectCard({ project, index = 0 }: { project: ProjectLike; index?: number }) {
  return (
    <motion.article
      className="glass-panel overflow-hidden rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          alt=""
          className="object-cover transition duration-500 hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={project.thumbnail}
        />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-black text-white">{project.title}</h2>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-300">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.slice(0, 5).map((tech) => (
            <span key={tech} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-cyan-100">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="cyber-button flex-1" href={`/projects/${project.slug}`}>
            View Project
          </Link>
          <a className="muted-button" href={project.liveUrl} rel="noreferrer" target="_blank">
            <FaExternalLinkAlt aria-hidden />
            Demo
          </a>
        </div>
      </div>
    </motion.article>
  );
}

