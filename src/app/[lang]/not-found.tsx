import Link from "next/link";
import { Eclipse } from "@/components/primitives/Eclipse";
import { Wordmark } from "@/components/primitives/Wordmark";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2 opacity-70"
      >
        <Eclipse className="w-full" rimWidth={2} />
      </div>

      <div className="relative">
        <Wordmark className="mx-auto w-[min(52vw,300px)]" title="MOVA" />
        <p className="text-metal mt-12 font-serif text-[clamp(2.2rem,6vw,3.4rem)] leading-none">
          404
        </p>
        <p className="text-ink-dim mt-4 text-[1.0625rem]">
          Esta página no existe. / This page doesn&apos;t exist.
        </p>
        <Link
          href="/es"
          className="border-line text-ink hover:border-gold hover:text-gold mt-10 inline-block rounded-full border px-7 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors"
        >
          Inicio / Home
        </Link>
      </div>
    </main>
  );
}
