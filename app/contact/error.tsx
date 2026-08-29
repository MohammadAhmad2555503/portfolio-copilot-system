"use client";

import { ErrorPanel } from "@/components/ui/ErrorPanel";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorPanel title="Contact could not load." reset={reset} />;
}

