"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FaExternalLinkAlt, FaMagic, FaSearch } from "react-icons/fa";
import { searchJobs } from "@/app/actions/copilot";
import type { JobPost } from "@/lib/types";

export function FindJobs({ onTailor }: { onTailor: (job: JobPost) => void }) {
  const [keywords, setKeywords] = useState("Frontend Developer React");
  const [location, setLocation] = useState("Remote");
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await searchJobs({ keywords, location });
    setPending(false);

    if (result.ok) {
      setJobs(result.jobs);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="grid gap-5">
      <form className="glass-panel grid gap-4 rounded-xl p-5 md:grid-cols-[1fr_0.7fr_auto]" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-bold text-slate-200">
          Keywords
          <input
            className="focus-ring rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white"
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-200">
          Location
          <input
            className="focus-ring rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>
        <button className="cyber-button self-end" disabled={pending} type="submit">
          <FaSearch aria-hidden />
          {pending ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <article key={job.id} className="glass-panel rounded-xl p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">{job.title}</h2>
                <p className="mt-1 font-bold text-cyan-100">{job.company}</p>
                <p className="mt-2 text-sm text-slate-400">{job.location}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="muted-button" href={job.url} rel="noreferrer" target="_blank">
                  <FaExternalLinkAlt aria-hidden />
                  Open
                </a>
                <button className="cyber-button" type="button" onClick={() => onTailor(job)}>
                  <FaMagic aria-hidden />
                  Tailor CV
                </button>
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{job.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

