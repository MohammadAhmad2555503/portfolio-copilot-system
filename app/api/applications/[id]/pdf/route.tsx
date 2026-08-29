import { pdf } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { CvDocument } from "@/lib/CvDocument";
import { baseCv } from "@/lib/baseCv";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import type { BaseCv } from "@/lib/types";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await context.params;
  const application = await prisma.jobApplication.findUnique({ where: { id } });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const cv = (application.tailoredCv as BaseCv | null) ?? baseCv;
  const blob = await pdf(<CvDocument cv={cv} coverLetter={application.coverLetter ?? undefined} />).toBlob();
  const arrayBuffer = await blob.arrayBuffer();

  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${sanitize(application.company)}-${sanitize(application.jobTitle)}-cv.pdf"`
    }
  });
}

function sanitize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "application";
}

