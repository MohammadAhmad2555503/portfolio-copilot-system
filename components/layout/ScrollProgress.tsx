"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="no-print fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-[#00f0ff] via-[#7b2ff7] to-[#ff00e5]"
      style={{ scaleX }}
    />
  );
}

