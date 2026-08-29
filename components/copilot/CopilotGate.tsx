"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaLock, FaSignInAlt } from "react-icons/fa";

export function CopilotGate({ invalid = false }: { invalid?: boolean }) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [shake, setShake] = useState(invalid);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!key.trim()) {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return;
    }
    router.push(`/copilot?key=${encodeURIComponent(key.trim())}`);
  }

  return (
    <section className="grid min-h-screen place-items-center px-4">
      <form
        className={`glass-panel w-full max-w-md rounded-xl p-7 ${shake ? "animate-[shake_.42s_ease-in-out]" : ""}`}
        onSubmit={onSubmit}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
          <FaLock aria-hidden />
        </div>
        <h1 className="mt-5 text-center text-3xl font-black text-white">Copilot Access</h1>
        <p className="mt-2 text-center text-sm leading-6 text-slate-400">
          This dashboard is private and hidden from the public portfolio.
        </p>
        <label className="mt-6 grid gap-2 text-sm font-bold text-slate-200">
          Passkey
          <input
            className="focus-ring rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white"
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
          />
        </label>
        {invalid ? <p className="mt-3 text-sm font-bold text-red-300">Invalid key.</p> : null}
        <button className="cyber-button mt-6 w-full" type="submit">
          <FaSignInAlt aria-hidden />
          Enter
        </button>
      </form>
    </section>
  );
}

