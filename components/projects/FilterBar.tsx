import Link from "next/link";
import { techFilters } from "@/lib/constants";

export function FilterBar({ active }: { active?: string | null }) {
  const current = active ?? "All";

  return (
    <div className="flex flex-wrap gap-2">
      {techFilters.map((filter) => {
        const href = filter === "All" ? "/projects" : `/projects?tech=${encodeURIComponent(filter)}`;
        const selected = current === filter;
        return (
          <Link
            key={filter}
            className={`focus-ring rounded-lg border px-3 py-2 text-sm font-bold transition ${
              selected
                ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                : "border-white/10 bg-slate-950/45 text-slate-300 hover:border-white/30"
            }`}
            href={href}
          >
            {filter}
          </Link>
        );
      })}
    </div>
  );
}

