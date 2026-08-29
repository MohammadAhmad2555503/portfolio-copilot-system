import type { Prisma } from "@prisma/client";

export type ProjectLike = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type BaseCv = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  links: {
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  experience: Array<{
    role: string;
    company: string;
    dates: string;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    dates: string;
    details: string;
  }>;
  skills: Record<string, string[]>;
  certifications: string[];
  languages: string[];
};

export type TailoredResult = {
  tailoredCv: BaseCv;
  coverLetter: string;
};

export type JobPost = {
  id: string;
  title: string;
  company: string;
  location: string;
  tags: string[];
  url: string;
  description: string;
  source: string;
  postedAt?: string;
};

export type ApplicationStatus =
  | "saved"
  | "pending"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "failed";

export type ApplicationRecord = {
  id: string;
  jobTitle: string;
  company: string;
  location: string | null;
  sourceUrl: string | null;
  jobDescription: string | null;
  tailoredCv: Prisma.JsonValue | null;
  coverLetter: string | null;
  status: string;
  appliedAt: Date;
  updatedAt: Date;
  notes: string | null;
};

