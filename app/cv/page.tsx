import type { Metadata } from "next";
import { DownloadCvButton } from "@/components/cv/DownloadCvButton";
import { baseCv } from "@/lib/baseCv";

export const metadata: Metadata = {
  title: "CV",
  description: "A print-friendly CV and downloadable PDF."
};

export default function CvPage() {
  const cv = baseCv;

  return (
    <section className="page-shell section-pad">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-200">CV</p>
          <h1 className="mt-2 text-4xl font-black text-white md:text-6xl">{cv.name}</h1>
          <p className="mt-3 text-xl text-cyan-100">{cv.title}</p>
        </div>
        <DownloadCvButton />
      </div>

      <div className="glass-panel rounded-xl p-5 md:p-8">
        <header className="border-b border-white/10 pb-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
            <span>{cv.email}</span>
            <span>{cv.phone}</span>
            <span>{cv.location}</span>
            <a className="text-cyan-100" href={cv.links.linkedin}>
              LinkedIn
            </a>
            <a className="text-cyan-100" href={cv.links.github}>
              GitHub
            </a>
          </div>
        </header>

        <CvSection title="Professional Summary">
          <p className="leading-7 text-slate-300">{cv.summary}</p>
        </CvSection>

        <CvSection title="Experience">
          <div className="relative grid gap-6 border-l border-cyan-300/30 pl-5">
            {cv.experience.map((item) => (
              <article key={`${item.company}-${item.role}`} className="relative">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_#00f0ff]" />
                <h3 className="text-xl font-black text-white">{item.role}</h3>
                <p className="mt-1 text-sm font-bold text-cyan-100">
                  {item.company} | {item.dates}
                </p>
                <ul className="mt-3 grid gap-2 text-slate-300">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="leading-7">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </CvSection>

        <CvSection title="Education">
          <div className="grid gap-4">
            {cv.education.map((item) => (
              <article key={`${item.school}-${item.degree}`}>
                <h3 className="text-lg font-black text-white">{item.degree}</h3>
                <p className="mt-1 text-sm font-bold text-cyan-100">
                  {item.school} | {item.dates}
                </p>
                <p className="mt-2 text-slate-300">{item.details}</p>
              </article>
            ))}
          </div>
        </CvSection>

        <CvSection title="Skills">
          <div className="grid gap-5 md:grid-cols-2">
            {Object.entries(cv.skills).map(([group, skills]) => (
              <div key={group}>
                <h3 className="font-black text-white">{group}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={skill}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
                      style={{
                        background: `linear-gradient(90deg, rgba(0,240,255,.16) ${Math.max(42, 92 - index * 7)}%, rgba(255,255,255,.04) 0)`
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title="Certifications">
          <div className="flex flex-wrap gap-2">
            {cv.certifications.map((item) => (
              <span key={item} className="rounded-md border border-purple-300/20 bg-purple-300/10 px-3 py-2 text-sm text-purple-100">
                {item}
              </span>
            ))}
          </div>
        </CvSection>

        <CvSection title="Languages">
          <p className="text-slate-300">{cv.languages.join(", ")}</p>
        </CvSection>
      </div>
    </section>
  );
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 border-b border-white/10 pb-2 text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

