"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FaPaperPlane } from "react-icons/fa";
import { submitContact } from "@/app/actions/contact";
import { contactSchema } from "@/lib/schemas";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const parsed = contactSchema.safeParse(values);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }

    setPending(true);
    const result = await submitContact(parsed.data);
    setPending(false);

    if (result.ok) {
      toast.success(result.message);
      formRef.current?.reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form ref={formRef} className="glass-panel rounded-xl p-5 md:p-7" onSubmit={onSubmit}>
      <div className="grid gap-5">
        {[
          ["name", "Name", "Your name"],
          ["email", "Email", "you@example.com"],
          ["subject", "Subject", "Project, role, or collaboration"]
        ].map(([name, label, placeholder]) => (
          <label key={name} className="grid gap-2 text-sm font-bold text-slate-200">
            {label}
            <input
              className="focus-ring rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500"
              name={name}
              placeholder={placeholder}
              required
              type={name === "email" ? "email" : "text"}
            />
          </label>
        ))}
        <label className="grid gap-2 text-sm font-bold text-slate-200">
          Message
          <textarea
            className="focus-ring min-h-40 resize-y rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500"
            name="message"
            placeholder="Tell me what you are building or hiring for."
            required
          />
        </label>
      </div>
      <button className="cyber-button mt-6 w-full" disabled={pending} type="submit">
        <FaPaperPlane aria-hidden />
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

