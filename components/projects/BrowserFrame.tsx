export function BrowserFrame({ url }: { url?: string | null }) {
  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-300" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <div className="ml-3 min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-400">
          <span className="block truncate">{url ?? "Demo coming soon"}</span>
        </div>
      </div>
      {url ? (
        <iframe
          className="aspect-video w-full bg-white"
          loading="lazy"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
          src={url}
          title="Live demo"
        />
      ) : (
        <div className="grid aspect-video place-items-center bg-slate-950/55 text-slate-300">
          Demo Coming Soon
        </div>
      )}
    </div>
  );
}

