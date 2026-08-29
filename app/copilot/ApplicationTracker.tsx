"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FaChevronDown, FaSave } from "react-icons/fa";
import { listApplications, updateApplication } from "@/app/actions/copilot";

type Row = Awaited<ReturnType<typeof listApplications>>[number];

const statuses = ["all", "saved", "pending", "applied", "interview", "offer", "rejected", "failed"];

const badgeClass: Record<string, string> = {
  saved: "bg-slate-400/15 text-slate-200 border border-slate-300/20",
  pending: "bg-yellow-300/15 text-yellow-100 border border-yellow-300/25",
  applied: "bg-blue-300/15 text-blue-100 border border-blue-300/25",
  interview: "bg-green-300/15 text-green-100 border border-green-300/25",
  offer: "bg-purple-300/15 text-purple-100 border border-purple-300/25",
  rejected: "bg-red-300/15 text-red-100 border border-red-300/25",
  failed: "bg-red-300/15 text-red-100 border border-red-300/25"
};

export function ApplicationTracker() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(showLoading = true) {
    if (showLoading) setLoading(true);
    const applications = await listApplications();
    setRows(applications);
    setLoading(false);
  }

  useEffect(() => {
    let canceled = false;
    listApplications().then((applications) => {
      if (canceled) return;
      setRows(applications);
      setLoading(false);
    });
    return () => {
      canceled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.status === filter)),
    [filter, rows]
  );

  if (loading) {
    return <div className="glass-panel rounded-xl p-5 text-slate-300">Loading applications...</div>;
  }

  return (
    <div className="grid gap-5">
      <div className="glass-panel flex flex-wrap gap-2 rounded-xl p-3">
        {statuses.map((status) => (
          <button
            key={status}
            className={`focus-ring rounded-lg px-3 py-2 text-sm font-bold capitalize transition ${
              filter === status ? "bg-cyan-300/15 text-cyan-100" : "text-slate-300 hover:bg-white/[0.04]"
            }`}
            type="button"
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-slate-300">
            No applications yet. Save or queue one from the tailoring tab.
          </div>
        ) : null}
        {filtered.map((row) => (
          <ApplicationRow
            key={row.id}
            expanded={expanded === row.id}
            row={row}
            onReload={load}
            onToggle={() => setExpanded(expanded === row.id ? null : row.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ApplicationRow({
  row,
  expanded,
  onToggle,
  onReload
}: {
  row: Row;
  expanded: boolean;
  onToggle: () => void;
  onReload: () => void;
}) {
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState(row.notes ?? "");

  async function save() {
    const response = await updateApplication({ id: row.id, status, notes });
    if (response.ok) {
      toast.success(response.message);
      await onReload();
    } else {
      toast.error(response.message);
    }
  }

  return (
    <article className="glass-panel overflow-hidden rounded-xl">
      <button
        className="focus-ring flex w-full flex-col gap-3 p-5 text-left md:grid md:grid-cols-[1.1fr_0.8fr_auto_auto] md:items-center"
        type="button"
        onClick={onToggle}
      >
        <div>
          <h2 className="font-black text-white">{row.jobTitle}</h2>
          <p className="mt-1 text-sm text-cyan-100">{row.company}</p>
        </div>
        <p className="text-sm text-slate-400">{new Date(row.appliedAt).toLocaleDateString()}</p>
        <span className={`status-badge ${badgeClass[row.status] ?? badgeClass.saved}`}>{row.status}</span>
        <FaChevronDown aria-hidden className={`transition ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded ? (
        <div className="border-t border-white/10 p-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <h3 className="font-black text-white">Job Description</h3>
              <p className="mt-2 line-clamp-6 text-sm leading-6 text-slate-300">
                {row.jobDescription ?? "No description saved."}
              </p>
            </div>
            <div>
              <h3 className="font-black text-white">Cover Letter</h3>
              <p className="mt-2 line-clamp-6 whitespace-pre-line text-sm leading-6 text-slate-300">
                {row.coverLetter ?? "No cover letter saved."}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[180px_1fr_auto]">
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              Status
              <select
                className="focus-ring rounded-lg border border-white/10 bg-slate-950/80 px-3 py-3 text-white"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {statuses.filter((item) => item !== "all").map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              Notes
              <input
                className="focus-ring rounded-lg border border-white/10 bg-slate-950/80 px-3 py-3 text-white"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>
            <button className="cyber-button self-end" type="button" onClick={save}>
              <FaSave aria-hidden />
              Save
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {row.sourceUrl ? (
              <a className="muted-button" href={row.sourceUrl} rel="noreferrer" target="_blank">
                Open Source URL
              </a>
            ) : null}
            <a className="muted-button" href={`/api/applications/${row.id}/pdf`}>
              Download Tailored CV
            </a>
          </div>
        </div>
      ) : null}
    </article>
  );
}

