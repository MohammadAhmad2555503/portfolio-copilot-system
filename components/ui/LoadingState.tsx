export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="page-shell grid min-h-[60vh] place-items-center">
      <div className="glass-panel rounded-xl px-6 py-5 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
        <p className="font-semibold text-slate-200">{label}</p>
      </div>
    </div>
  );
}

