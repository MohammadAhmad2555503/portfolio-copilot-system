import type { Metadata } from "next";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { ContactForm } from "@/components/contact/ContactForm";
import { profile, profileLinks } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact form and profile links."
};

export default function ContactPage() {
  return (
    <section className="page-shell section-pad">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-200">Contact</p>
        <h1 className="mt-2 text-4xl font-black text-white md:text-6xl">Let&apos;s Build</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          Send a message for roles, collaborations, or a product idea that needs a calm technical pair of hands.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.68fr]">
        <ContactForm />

        <aside className="grid gap-5">
          <div className="glass-panel rounded-xl p-5">
            <h2 className="text-xl font-black text-white">Find Me On</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {profileLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    className="focus-ring flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-300/60"
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon aria-hidden style={{ color: link.color }} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <h2 className="text-xl font-black text-white">Direct</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <a className="focus-ring flex items-center gap-3 rounded-lg p-2 hover:bg-white/[0.04]" href={`mailto:${profile.email}`}>
                <FaEnvelope aria-hidden className="text-cyan-200" />
                {profile.email}
              </a>
              <a className="focus-ring flex items-center gap-3 rounded-lg p-2 hover:bg-white/[0.04]" href={`tel:${profile.phone}`}>
                <FaPhone aria-hidden className="text-cyan-200" />
                {profile.phone}
              </a>
              <p className="flex items-center gap-3 rounded-lg p-2">
                <FaMapMarkerAlt aria-hidden className="text-cyan-200" />
                {profile.location}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

