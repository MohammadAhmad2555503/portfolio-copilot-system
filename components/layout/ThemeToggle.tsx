"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  const isDark = theme !== "light";

  return (
    <button
      aria-label="Toggle theme"
      className="focus-ring no-print fixed right-5 top-5 z-40 grid h-11 w-11 place-items-center rounded-lg border border-white/15 bg-slate-950/65 text-white backdrop-blur transition hover:border-cyan-300/70"
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
    </button>
  );
}

