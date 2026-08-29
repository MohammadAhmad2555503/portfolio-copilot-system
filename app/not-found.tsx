import Link from "next/link";
import { SceneLoader } from "@/components/home/SceneLoader";

export default function NotFound() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden px-4 text-center">
      <SceneLoader />
      <div className="relative z-10">
        <p className="glitch-text text-8xl font-black tracking-tight text-white md:text-9xl">404</p>
        <h1 className="mt-4 text-3xl font-black text-white">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-300">
          The route you opened is not part of this portfolio.
        </p>
        <Link className="cyber-button mt-7" href="/">
          Take me home
        </Link>
      </div>
    </section>
  );
}

