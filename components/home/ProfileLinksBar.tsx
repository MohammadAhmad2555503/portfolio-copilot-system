"use client";

import { motion } from "framer-motion";
import { profileLinks } from "@/lib/constants";

export function ProfileLinksBar() {
  return (
    <motion.div
      className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
    >
      {profileLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            aria-label={link.label}
            className="focus-ring group grid h-12 w-12 place-items-center rounded-lg border border-white/15 bg-slate-950/50 text-slate-200 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/80"
            href={link.href}
            rel="noreferrer"
            style={{ "--link-color": link.color } as React.CSSProperties}
            target="_blank"
            title={link.label}
          >
            <Icon
              aria-hidden
              className="text-xl transition group-hover:scale-110"
              style={{ color: "var(--link-color)" }}
            />
          </a>
        );
      })}
    </motion.div>
  );
}

