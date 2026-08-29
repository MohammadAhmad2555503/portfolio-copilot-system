import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ applications: [] });
  }

  const applications = await prisma.jobApplication.findMany({
    where: { status: "pending" },
    orderBy: { appliedAt: "asc" }
  });

  return NextResponse.json({
    applications: applications.map((application) => ({
      ...application,
      appliedAt: application.appliedAt.toISOString(),
      updatedAt: application.updatedAt.toISOString()
    }))
  });
}

