"use client";

import { ErrorPanel } from "@/components/ui/ErrorPanel";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorPanel reset={reset} />;
}

