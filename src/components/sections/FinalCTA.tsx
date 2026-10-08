"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CineImage } from "@/components/primitives/CineImage";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { RevealText } from "@/components/primitives/RevealText";
import { useContacto } from "@/components/layout/ContactProvider";
import type { Dictionary } from "@/i18n";

/* ==========================================================================
   Sección 08 — CIERRE
   El último plano antes de los créditos: un solo gesto en pantalla completa,
   sin grilla ni columnas. Acá no se explica nada más —el sitio ya dijo todo—,
   así que la sección tiene exactamente tres cosas: el número del plano, el
   titular más grande del sitio y el botón. Cualquier elemento extra le sacaría
   peso al final.
   ========================================================================== */

/**
 * Posición horizontal de la columna de luz dentro de `cta.jpg`, en porcentaje
 * del ancho del archivo (medido sobre la imagen).
 *
 * Se usa para dos cosas a la vez: como `object-position` del recorte y como
 * centro del halo. Con `object-cover`, el porcentaje de `object-position`
 * alinea ese punto de la imagen con el mismo porcentaje del contenedor, así
 * que la columna cae siempre en el 68% del ancho visible —sea 390 o 1440— y
 * el halo no necesita reposicionarse por breakpoint. Sin esto, en mobile el
 * recorte centrado se comería la columna entera.
 *
 * ⚠️ El valor está repetido como literal en la clase `object-[68%_center]` de
 * la imagen: Tailwind escanea el código como texto y no genera las clases
 * armadas por interpolación. Si cambia uno, cambiar el otro.
 */
const COLUMNA = "68%";

export function FinalCTA({ t }: { t: Dictionary }) {
  const { abrir } = useContacto();
  const seccion = useRef<HTMLElement>(null);

  /* La preferencia se lee en un efecto, no durante el render: acá condiciona
     un `style` que se serializa en el HTML, y en el servidor no hay matchMedia.
     Leerla al pintar daría `false` en el build y `true` en el primer render del
     cliente, rompiendo la hidratación justo para quien pidió menos movimiento.
     Mismo patrón que IntroSection y RealityMova. */
  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const alCambiar = (e: MediaQueryListEvent) => setReducido(e.matches);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  /* Zoom de entrada atado al scroll: el plano termina de asentarse justo
     cuando queda centrado, y a partir de ahí se queda quieto. Es al revés que
     el resto del sitio —acá la imagen se frena en lugar de seguir creciendo—
     porque un plano final tiene que dar la sensación de aterrizar. */
  const { scrollYProgress } = useScroll({
    target: seccion,
    offset: ["start end", "center center"],
  });
  const escala = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <section
      ref={seccion}
      aria-labelledby="final-cta-titulo"
      // overflow-hidden: el halo y el plano escalado se desbordan del marco;
      // sin esto el halo empujaría scroll horizontal en mobile.
      className="relative flex min-h-[85svh] items-end overflow-hidden bg-black"
    >
      {/* ── Plano ─────────────────────────────────────────────────────── */}
      {/* `isolate`: el halo de abajo mezcla en `screen` y sin un contexto de
          apilado propio subiría a mezclarse con el fondo de la página. Acota el
          grupo de mezcla al plano, igual que la caja del objeto en Immersive. */}
      <div aria-hidden="true" className="absolute inset-0 isolate">
        {/* El escalado va en la capa y no en el <img>: `.img-cine` ya usa
            transform para su propio hover y pisarlo desde acá rompería los
            dos efectos. Como la escala nunca baja de 1, la capa no necesita
            margen extra: a 1 cubre exacto el marco.

            Con movimiento reducido se fija en 1 —el valor de reposo— en vez de
            sacar el `style`: si se quitara la propiedad, el transform que Motion
            ya escribió en el nodo podría quedar pegado en 1.05 y el plano se
            vería recortado de más para siempre. */}
        <motion.div
          style={reducido ? { scale: 1 } : { scale: escala }}
          className="absolute inset-0 will-change-transform"
        >
          <CineImage
            src="/images/cta.jpg"
            alt=""
            className="absolute inset-0 h-full w-full"
            // La imagen entra al final de la página: nunca es LCP, y pedirla
            // con prioridad le robaría ancho de banda al hero.
            priority={false}
            sizes="100vw"
            // Sin `quality`: `images.qualities` de next.config.ts no declara
            // otros valores, así que el loader recorta a 75 cualquier número
            // que se pida acá. Ponerlo sería afirmar algo que no pasa.
            //
            // Velo propio abajo, no el de CineImage: el degradado de la
            // primitiva es más corto y acá el texto apoya muy al pie.
            overlay={false}
            imgClassName="object-[68%_center]"
          />
        </motion.div>

        {/* Velo vertical: el texto se apoya abajo a la izquierda, pero el
            botón y el número pueden quedar sobre la zona iluminada según el
            recorte, así que el velo cierra arriba y abajo y deja respirar la
            franja del medio, que es donde vive la línea del horizonte. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/80" />

        {/* Halo cálido sobre la columna: el oro del archivo es un filete de
            unos pocos píxeles y el velo lo apaga. Esto le devuelve el aire
            alrededor —la luz contamina la atmósfera, no pinta un bloque—.
            Va DESPUÉS del velo a propósito: debajo quedaría atenuado.

            `mix-blend-screen` es lo que lo convierte en iluminación: en mezcla
            normal el oro a ~0.17 de alfa también TIRA PARA ABAJO los píxeles
            más brillantes de la columna, que ya pasan el oro del token, y el
            resultado es un film parejo sobre un bloque del cuadro. En `screen`
            el negro queda intacto y sólo suma donde ya hay luz, así que se lee
            como el bloom de la propia columna. */}
        <div
          className="glow-gold pointer-events-none absolute top-[-20%] h-[140%] w-[clamp(240px,38vw,660px)] -translate-x-1/2 opacity-80 blur-[80px] mix-blend-screen"
          style={{ left: COLUMNA }}
        />
      </div>

      {/* ── Cierre ────────────────────────────────────────────────────── */}
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pt-32 pb-24 sm:px-8 sm:pt-40 sm:pb-32 lg:px-12 lg:pb-40">
        <span
          data-reveal
          className="block text-[10px] tracking-[0.3em] text-ink-faint"
        >
          {t.finalCta.index}
        </span>

        {/* El id va en el envoltorio y no en el <h2>: RevealText arma el
            encabezado por dentro y no expone un id propio. */}
        <div id="final-cta-titulo" className="mt-8 sm:mt-10">
          <RevealText
            as="h2"
            lines={t.finalCta.title}
            className="max-w-[16ch] font-serif text-[clamp(2.6rem,8vw,7rem)] leading-[0.95] tracking-[-0.03em]"
            // Una línea de retraso: el titular entra después del número, que
            // es lo que anuncia el plano.
            delay={1}
          />
        </div>

        <div
          data-reveal
          style={{ "--reveal-delay": "520ms" } as React.CSSProperties}
          className="mt-12 sm:mt-14"
        >
          {/* Único botón sólido del cierre: es la última acción de la página,
              tiene que ganarle en peso a todo lo anterior. `strength` más alto
              que el resto del sitio para que atraiga desde más lejos. */}
          <MagneticButton variant="solid" icon="arrow" onClick={abrir} strength={0.5}>
            {t.finalCta.cta}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
