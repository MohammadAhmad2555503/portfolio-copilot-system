import { cookies } from "next/headers";
import type { Metadata } from "next";
import { CopilotGate } from "@/components/copilot/CopilotGate";
import { CopilotDashboard } from "@/app/copilot/CopilotDashboard";

export const metadata: Metadata = {
  title: "Copilot",
  robots: { index: false, follow: false }
};

type Props = {
  searchParams?: Promise<{
    invalid?: string;
  }>;
};

export default async function CopilotPage({ searchParams }: Props) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const authenticated =
    Boolean(process.env.COPILOT_ACCESS_KEY) && cookieStore.get("copilot_access")?.value === "1";

  if (!authenticated) {
    return <CopilotGate invalid={params?.invalid === "1"} />;
  }

  return <CopilotDashboard />;
}

