"use client";

import { useEffect, useMemo, useState } from "react";

export function Typewriter() {
  const phrases = useMemo(
    () => ["Full-Stack Developer", "Creative Technologist", "AI Engineer", "Problem Solver"],
    []
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const delay = deleting ? 36 : 72;
    const timeout = window.setTimeout(() => {
      if (!deleting && charIndex === phrase.length) {
        window.setTimeout(() => setDeleting(true), 900);
        return;
      }

      if (deleting && charIndex === 0) {
        setDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
        return;
      }

      setCharIndex((index) => index + (deleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex, phrases]);

  return (
    <span className="font-mono text-cyan-100">
      {phrases[phraseIndex].slice(0, charIndex)}
      <span className="animate-pulse text-cyan-300">|</span>
    </span>
  );
}

