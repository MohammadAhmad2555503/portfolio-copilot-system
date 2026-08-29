"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const formatter = new Intl.NumberFormat("en-GB");

function Counter({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setCurrent(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return <span ref={ref}>{formatter.format(current)}</span>;
}

export function StatsCard({
  projects,
  years,
  technologies
}: {
  projects: number;
  years: number;
  technologies: number;
}) {
  const stats = [
    { label: "Projects", value: projects },
    { label: "Years", value: years },
    { label: "Technologies", value: technologies }
  ];

  return (
    <motion.div
      className="glass-panel mx-auto grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-xl"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white/[0.035] px-3 py-5 text-center">
          <p className="text-3xl font-black text-white md:text-4xl">
            <Counter value={stat.value} />
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}

