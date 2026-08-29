"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export type ContactActionState = {
  ok: boolean;
  message: string;
};

export async function submitContact(raw: unknown): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the form and try again."
    };
  }

  const data = parsed.data;

  try {
    if (hasDatabaseUrl()) {
      await prisma.contactMessage.create({ data });
    }

    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("placeholder")) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: process.env.CONTACT_TO_EMAIL ?? data.email,
        subject: `Portfolio contact: ${data.subject}`,
        text: `From: ${data.name} <${data.email}>\n\n${data.message}`
      });
    }

    revalidatePath("/contact");
    return { ok: true, message: "Message sent. I will get back to you soon." };
  } catch {
    return { ok: false, message: "The message could not be sent right now." };
  }
}

