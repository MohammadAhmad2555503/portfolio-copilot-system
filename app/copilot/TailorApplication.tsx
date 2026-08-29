"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FaCopy, FaDownload, FaExternalLinkAlt, FaMagic, FaSave, FaUpload } from "react-icons/fa";
import {
  fetchJobDescription,
  generateTailoredPdf,
  saveApplication,
  tailorApplication
} from "@/app/actions/copilot";
import { baseCv } from "@/lib/baseCv";
import type { BaseCv, JobPost, TailoredResult } from "@/lib/types";

export function TailorApplication({ selectedJob }: { selectedJob: JobPost | null }) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<TailoredResult | null>(null);
  const [pending, setPending] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!selectedJob) return;
    const timeout = window.setTimeout(() => {
      setJobTitle(selectedJob.title);
      setCompany(selectedJob.company);
      setLocation(selectedJob.location);
      setSourceUrl(selectedJob.url);
      setJobDescription(selectedJob.description);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [selectedJob]);

  async function fetchFromUrl() {
    if (!sourceUrl) {
      toast.error("Add a job URL first.");
      return;
    }
    setFetching(true);
    const response = await fetchJobDescription({ url: sourceUrl });
    setFetching(false);
    if (response.ok) {
      setJobDescription(response.description);
      toast.success("Job description fetched.");
    } else {
      toast.error(response.message);
    }
  }

  async function generate() {
    setPending(true);
    const response = await tailorApplication({ jobDescription, jobTitle, company, sourceUrl });
    setPending(false);
    if (response.ok && response.result) {
      setResult(response.result);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  async function save(status: "saved" | "pending") {
    if (!result) {
      toast.error("Generate the tailored application first.");
      return;
    }

    const response = await saveApplication({
      jobTitle: jobTitle || "Untitled role",
      company: company || "Unknown company",
      location,
      sourceUrl,
      jobDescription,
      tailoredCv: result.tailoredCv,
      coverLetter: result.coverLetter,
      status
    });

    if (response.ok) toast.success(status === "pending" ? "Queued for local apply agent." : "Saved.");
    else toast.error(response.message);
  }

  async function downloadPdf() {
    if (!result) return;
    const response = await generateTailoredPdf({
      tailoredCv: result.tailoredCv,
      coverLetter: result.coverLetter
    });
    if (!response.ok) {
      toast.error("Could not generate PDF.");
      return;
    }
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${response.base64}`;
    link.download = response.filename;
    link.click();
  }

  async function copyCoverLetter() {
    if (!result?.coverLetter) return;
    await navigator.clipboard.writeText(result.coverLetter);
    toast.success("Cover letter copied.");
  }

  return (
    <div className="grid gap-5">
      <div className="glass-panel rounded-xl p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Job Title" value={jobTitle} onChange={setJobTitle} />
          <Input label="Company" value={company} onChange={setCompany} />
          <Input label="Location" value={location} onChange={setLocation} />
          <div className="grid gap-2 text-sm font-bold text-slate-200">
            Job URL
            <div className="flex gap-2">
              <input
                className="focus-ring min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
              />
              <button className="muted-button" disabled={fetching} type="button" onClick={fetchFromUrl}>
                <FaExternalLinkAlt aria-hidden />
                {fetching ? "Fetching" : "Fetch"}
              </button>
            </div>
          </div>
        </div>
        <label className="mt-4 grid gap-2 text-sm font-bold text-slate-200">
          Job Description
          <textarea
            className="focus-ring min-h-60 resize-y rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />
        </label>
        <button className="cyber-button mt-5 w-full" disabled={pending} type="button" onClick={generate}>
          <FaMagic aria-hidden />
          {pending ? "Generating..." : "Generate Tailored Application"}
        </button>
      </div>

      {result ? (
        <TailoredPreview
          result={result}
          onApply={() => save("pending")}
          onCopy={copyCoverLetter}
          onDownload={downloadPdf}
          onSave={() => save("saved")}
        />
      ) : null}
    </div>
  );
}

function Input({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-200">
      {label}
      <input
        className="focus-ring rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TailoredPreview({
  result,
  onApply,
  onCopy,
  onDownload,
  onSave
}: {
  result: TailoredResult;
  onApply: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onSave: () => void;
}) {
  const changedSkillGroups = useMemo(
    () => Object.keys(result.tailoredCv.skills).filter((group) => group in baseCv.skills),
    [result.tailoredCv.skills]
  );

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <SkillCompare title="Original CV Skills" skills={baseCv.skills} />
        <SkillCompare highlight title="Tailored CV Skills" skills={result.tailoredCv.skills} groups={changedSkillGroups} />
      </div>

      <div className="glass-panel rounded-xl p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-black text-white">Tailored CV Preview</h2>
          <div className="flex flex-wrap gap-2">
            <button className="muted-button" type="button" onClick={onDownload}>
              <FaDownload aria-hidden />
              Download PDF
            </button>
            <button className="muted-button" type="button" onClick={onSave}>
              <FaSave aria-hidden />
              Save
            </button>
            <button className="cyber-button" type="button" onClick={onApply}>
              <FaUpload aria-hidden />
              Apply Now
            </button>
          </div>
        </div>
        <p className="mt-4 leading-7 text-slate-300">{result.tailoredCv.summary}</p>
        <div className="mt-5 grid gap-4">
          {result.tailoredCv.experience.map((entry) => (
            <article key={`${entry.company}-${entry.role}`} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <h3 className="font-black text-white">{entry.role}</h3>
              <p className="text-sm text-cyan-100">
                {entry.company} | {entry.dates}
              </p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-white">Cover Letter</h2>
          <button className="muted-button" type="button" onClick={onCopy}>
            <FaCopy aria-hidden />
            Copy
          </button>
        </div>
        <div className="mt-4 whitespace-pre-line leading-7 text-slate-300">{result.coverLetter}</div>
      </div>
    </div>
  );
}

function SkillCompare({
  title,
  skills,
  highlight = false
}: {
  title: string;
  skills: BaseCv["skills"];
  groups?: string[];
  highlight?: boolean;
}) {
  return (
    <div className="glass-panel rounded-xl p-5">
      <h2 className="text-xl font-black text-white">{title}</h2>
      <div className="mt-4 grid gap-4">
        {Object.entries(skills).map(([group, values]) => (
          <div key={group}>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">{group}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.map((skill, index) => (
                <span
                  key={skill}
                  className={`rounded-md border px-2 py-1 text-xs ${
                    highlight && index < 3
                      ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 bg-white/[0.04] text-slate-300"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

