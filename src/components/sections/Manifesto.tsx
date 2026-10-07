import type { Dictionary } from "@/i18n";
import { Eclipse } from "@/components/primitives/Eclipse";
import { LineReveal } from "@/components/primitives/motion";

/**
 * El centro surrealista del sitio.
 *
 * Un solo gesto: el eclipse crece hasta no entrar en la pantalla y asoma desde
 * abajo, demasiado grande para el cuadro que lo contiene. Magritte pintaba una
 * manzana que ocupaba la habitación entera y la pintaba plano, sin efectos: lo
 * irreal no está en cómo está hecho sino en la escala. Acá es lo mismo — la
 * tipografía es la misma de todo el sitio, quieta, y el objeto es el que está
 * fuera de lugar.
 */
export function Manifesto({ t }: { t: Dictionary }) {
  return (
    <section
      id="manifiesto"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* El objeto que no entra en la habitación */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-18%] left-1/2 w-[190vw] -translate-x-1/2 opacity-65 sm:bottom-[-55%] sm:w-[min(130vw,1350px)]"
      >
        <Eclipse className="w-full" rimWidth={4} />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-32 sm:px-8 sm:py-40 lg:px-12">
        <p
          data-reveal
          className="text-ink-faint text-[10px] tracking-[0.34em] uppercase"
        >
          {t.manifesto.eyebrow}
        </p>

        <LineReveal
          as="h2"
          className="mt-10 text-[clamp(2.5rem,8.6vw,7.4rem)] leading-[0.95] tracking-[-0.042em]"
          lines={t.manifesto.statement}
          delay={1}
        />

        <div className="mt-20 grid gap-8 sm:mt-28 sm:grid-cols-2 sm:gap-12 lg:max-w-[70%]">
          {t.manifesto.body.map((p, i) => (
            <p
              key={i}
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
              className="text-ink-dim text-[1.0625rem] leading-[1.65]"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
