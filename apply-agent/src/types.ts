export type ApplicationStatus =
  | "saved"
  | "pending"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "failed";

export type ApplicationData = {
  id: string;
  jobTitle: string;
  company: string;
  location: string | null;
  sourceUrl: string | null;
  jobDescription: string | null;
  tailoredCv: unknown;
  coverLetter: string | null;
  status: ApplicationStatus | string;
  appliedAt: string;
  updatedAt: string;
  notes: string | null;
};

export type AtsType =
  | "greenhouse"
  | "workday"
  | "lever"
  | "bamboohr"
  | "recruitee"
  | "smartrecruiters"
  | "generic";

export type AgentConfig = {
  portfolioUrl: string;
  portfolioApiKey: string;
  headless: boolean;
  confirmBeforeSubmit: boolean;
  pollIntervalSeconds: number;
};

export type FillResult = {
  success: boolean;
  notes: string[];
};

