import { NextRequest, NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    status?: string;
    notes?: string;
  };

  const application = await prisma.jobApplication.update({
    where: { id },
    data: {
      status: body.status,
      notes: body.notes
    }
  });

  return NextResponse.json({
    application: {
      ...application,
      appliedAt: application.appliedAt.toISOString(),
      updatedAt: application.updatedAt.toISOString()
    }
  });
}

