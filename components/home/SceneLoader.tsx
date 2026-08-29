"use client";

import dynamic from "next/dynamic";

const ThreeBackground = dynamic(
  () => import("@/components/home/ThreeBackground").then((mod) => mod.ThreeBackground),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,.12),transparent_42rem)]" />
  }
);

export function SceneLoader() {
  return <ThreeBackground />;
}

