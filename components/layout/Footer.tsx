import { profileLinks } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print page-shell pb-28 pt-16 text-sm text-slate-400">
      <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
        <p>Built with care using Next.js and TypeScript. {year}</p>
        <div className="flex flex-wrap gap-3">
          {profileLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                aria-label={link.label}
                className="focus-ring grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-300 transition hover:border-cyan-300/70 hover:text-white"
                href={link.href}
                rel="noreferrer"
                target="_blank"
              >
                <Icon aria-hidden />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

