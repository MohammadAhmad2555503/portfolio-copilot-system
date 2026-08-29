"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaEnvelope, FaFolderOpen, FaHome, FaTimes, FaUserTie } from "react-icons/fa";

const navItems = [
  { href: "/", label: "Home", icon: FaHome },
  { href: "/projects", label: "Projects", icon: FaFolderOpen },
  { href: "/cv", label: "CV", icon: FaUserTie },
  { href: "/contact", label: "Contact", icon: FaEnvelope }
];

export function NavigationDock() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="no-print fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 shadow-2xl backdrop-blur md:block"
      >
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                aria-label={item.label}
                className="focus-ring group relative grid h-12 w-12 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
                href={item.href}
              >
                <Icon aria-hidden className="text-lg transition group-hover:scale-110" />
                {active ? (
                  <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_16px_#00f0ff]" />
                ) : null}
                <span className="pointer-events-none absolute bottom-16 rounded-md bg-slate-900 px-2 py-1 text-xs opacity-0 shadow-lg transition group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <button
        aria-label="Open navigation"
        className="focus-ring no-print fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-lg border border-white/15 bg-slate-950/75 text-white backdrop-blur md:hidden"
        type="button"
        onClick={() => setOpen(true)}
      >
        <FaBars aria-hidden />
      </button>

      {open ? (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur md:hidden">
          <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Navigate</span>
              <button
                aria-label="Close navigation"
                className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-white/15"
                type="button"
                onClick={() => setOpen(false)}
              >
                <FaTimes aria-hidden />
              </button>
            </div>
            <div className="grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    className="focus-ring flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 text-slate-100"
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <Icon aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

