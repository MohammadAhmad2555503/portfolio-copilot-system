"use client";

import { useState } from "react";
import { FaChartBar, FaMagic, FaSearch } from "react-icons/fa";
import { FindJobs } from "@/app/copilot/FindJobs";
import { TailorApplication } from "@/app/copilot/TailorApplication";
import { ApplicationTracker } from "@/app/copilot/ApplicationTracker";
import type { JobPost } from "@/lib/types";

type Tab = "jobs" | "tailor" | "tracker";

const tabs = [
  { id: "jobs" as const, label: "Find Jobs", icon: FaSearch },
  { id: "tailor" as const, label: "Tailor Application", icon: FaMagic },
  { id: "tracker" as const, label: "Application Tracker", icon: FaChartBar }
];

export function CopilotDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("jobs");
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  function handleTailor(job: JobPost) {
    setSelectedJob(job);
    setActiveTab("tailor");
  }

  return (
    <section className="page-shell section-pad">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-200">Private</p>
        <h1 className="mt-2 text-4xl font-black text-white md:text-6xl">AI Job Copilot</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
          Search roles, tailor application material, queue local apply-agent tasks, and track outcomes.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <nav className="glass-panel flex gap-2 overflow-auto rounded-xl p-2 lg:block lg:space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`focus-ring flex min-w-max items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-black transition lg:w-full ${
                  active
                    ? "border border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
                    : "border border-transparent text-slate-300 hover:bg-white/[0.04]"
                }`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon aria-hidden />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div>
          {activeTab === "jobs" ? <FindJobs onTailor={handleTailor} /> : null}
          {activeTab === "tailor" ? <TailorApplication selectedJob={selectedJob} /> : null}
          {activeTab === "tracker" ? <ApplicationTracker /> : null}
        </div>
      </div>
    </section>
  );
}

