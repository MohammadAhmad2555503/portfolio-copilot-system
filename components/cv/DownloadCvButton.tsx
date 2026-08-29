"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FaDownload } from "react-icons/fa";
import { generateBaseCvPdf } from "@/app/actions/cvPdf";

export function DownloadCvButton() {
  const [pending, setPending] = useState(false);

  async function download() {
    setPending(true);
    const response = await generateBaseCvPdf();
    setPending(false);

    if (!response.ok) {
      toast.error("Could not generate CV PDF.");
      return;
    }

    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${response.base64}`;
    link.download = response.filename;
    link.click();
  }

  return (
    <button className="cyber-button no-print self-start" disabled={pending} type="button" onClick={download}>
      <FaDownload aria-hidden />
      {pending ? "Preparing..." : "Download PDF"}
    </button>
  );
}

