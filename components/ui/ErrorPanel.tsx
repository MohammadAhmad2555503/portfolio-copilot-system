"use client";

export function ErrorPanel({
  title = "Something went sideways.",
  reset
}: {
  title?: string;
  reset?: () => void;
}) {
  return (
    <div className="page-shell grid min-h-[60vh] place-items-center">
      <div className="glass-panel max-w-md rounded-xl p-6 text-center">
        <p className="text-xl font-black text-white">{title}</p>
        <p className="mt-2 text-sm text-slate-400">Retry the page or return to the main navigation.</p>
        {reset ? (
          <button className="cyber-button mt-5" type="button" onClick={reset}>
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}

