import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().min(4, "Subject must be at least 4 characters."),
  message: z.string().min(10, "Message must be at least 10 characters.")
});

export const searchJobsSchema = z.object({
  keywords: z.string().min(1).max(120),
  location: z.string().max(120).optional().default("")
});

export const tailorApplicationSchema = z.object({
  jobDescription: z.string().min(80, "Paste a fuller job description first."),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal(""))
});

export const saveApplicationSchema = z.object({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  jobDescription: z.string().optional(),
  tailoredCv: z.unknown().optional(),
  coverLetter: z.string().optional(),
  status: z.enum(["saved", "pending"]).default("saved")
});

export const updateApplicationSchema = z.object({
  id: z.string().min(1),
  status: z.string().optional(),
  notes: z.string().optional()
});

