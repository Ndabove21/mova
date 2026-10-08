"use client";

import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import type { Dictionary } from "@/i18n";
import { RevealText } from "@/components/primitives/RevealText";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { VideoCard } from "@/components/primitives/VideoCard";
import { Rule } from "@/components/primitives/motion";
import { useContacto } from "@/components/layout/ContactProvider";

/**
 * 02 — SERVICIOS.
 *
 * Cinco verticales 2:3 en una sola fila: no son cards de producto, son el
 * contact sheet de una productora. Por eso no hay caja, ni borde redondeado,
 * ni sombra —sólo la imagen, el número de plano y el título encima—. La
 * jerarquía la hace el recorte vertical y el aire entre piezas, no el relleno.
 *
 * El cuerpo de cada servicio se despliega en hover/foco: en reposo la grilla
 * tiene que leerse como cinco imágenes, no como cinco párrafos. Pero eso vale
 * sólo donde hay puntero fino: Tailwind v4 envuelve toda variante `hover:` en
 * `@media (hover: hover)`, así que en un dispositivo táctil esas reglas no
 * existen y el copy quedaría invisible para siempre. De ahí el par de
 * variantes `[@media(hover:none)]` —sin puntero el cuerpo se muestra fijo—.
 */
export function Services({ t }: { t: Dictionary }) {
  const { abrir } = useContacto();

  return (
    <section
      id="services"
      aria-label={t.services.label}
      className="relative overflow-hidden bg-black py-28 sm:py-40 lg:py-48"
    >
      {/* Luz difusa detrás del titular: el oro entra como halo, nunca como fondo
          de bloque. Va fuera del flujo y el section recorta, así no genera
          scroll horizontal en mobile. */}
      <div
        aria-hidden="true"
        className="glow-gold pointer-events-none absolute -top-24 -left-32 h-[34rem] w-[34rem] opacity-60 blur-[2px]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <header>
          <SectionLabel index={t.services.index} label={t.services.label} />

          <Rule className="mt-7" delay={160} />

          {/* La segunda línea baja de intensidad: el par "idea → imagen →
              movimiento" es una progresión, y la luz tiene que acompañarla. */}
          <RevealText
            as="h2"
            lines={[
              t.services.subtitle[0],
              <span className="text-ink-dim">{t.services.subtitle[1]}</span>,
            ]}
            className="mt-9 font-serif text-[clamp(2rem,5.5vw,4.2rem)] leading-[1.02] tracking-[-0.025em] sm:mt-12"
          />
        </header>

        <ul
          role="list"
          className="mt-14 grid grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-3 sm:gap-4 lg:mt-24 lg:grid-cols-5"
        >
          {SERVICES.map((s, i) => {
            // El orden de SERVICES coincide índice a índice con el diccionario:
            // el media vive en /data y el texto en /i18n, se emparejan acá.
            const item = t.services.items[i];

            return (
              <li
                key={s.id}
                data-reveal
                // Escalonado derivado del índice (no del reloj): así el servidor
                // y el cliente calculan el mismo valor.
                style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
              >
                <VideoCard
                  image={s.image}
                  video={s.video}
                  alt=""
                  aspect="aspect-[2/3]"
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
                  cursorLabel={t.cursor.view}
                  onClick={abrir}
                >
                  {/* Canto de luz superior: el único momento en que el oro toca
                      la pieza. El foco de teclado tiene que ver lo mismo que el
                      puntero, así que cada estado de hover va duplicado con
                      `button:focus-visible &` —el `group` de VideoCard está en
                      el div interno, el botón es el ancestro—. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 [button:focus-visible_&]:opacity-100"
                  />

                  {/* El padding superior es mayor que el resto a propósito: deja
                      libre la esquina donde PlaceholderTag dibuja el nombre de
                      archivo mientras el media sea provisorio. */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-3 pt-7 pb-3 sm:px-4 sm:pt-8 sm:pb-4">
                    <span className="text-ink-faint text-[10px] tracking-[0.3em] transition-colors duration-700 group-hover:text-gold [button:focus-visible_&]:text-gold">
                      {s.n}
                    </span>

                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 [button:focus-visible_&]:-translate-y-1">
                        {/* No es un h3: este título vive dentro del <button> de
                            VideoCard, y role=button aplana a sus descendientes
                            en el árbol de accesibilidad —el encabezado no se
                            expondría—. Además un h3 no es contenido válido
                            dentro de un button. Sigue sumando al nombre
                            accesible, que es lo único que se anuncia. */}
                        <span className="text-ink block font-serif text-[1.15rem] leading-tight">
                          {item.title}
                        </span>

                        {/* max-height en vez de display: hay que poder animar el
                            despliegue, y el texto tiene que seguir contando para
                            el nombre accesible del botón. 9rem es tope, no
                            altura: en las columnas angostas (≈141px útiles en
                            lg a 1024px) el copy más largo necesita cinco
                            renglones, y con 5.5rem se cortaba a mitad de frase
                            sin scroll ni indicio. */}
                        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-h-[9rem] group-hover:opacity-100 [button:focus-visible_&]:max-h-[9rem] [button:focus-visible_&]:opacity-100 [@media(hover:none)]:max-h-none [@media(hover:none)]:opacity-100">
                          <p className="text-ink-dim mt-2 text-[0.8rem] leading-[1.45]">
                            {item.body}
                          </p>
                        </div>

                        {/* El propósito del control no se deduce de su
                            contenido: con alt="" el nombre accesible sale del
                            subárbol y un lector anunciaría cinco botones largos
                            sin decir que abren el contacto. Va fuera del div que
                            se recorta, para que no dependa del hover. */}
                        <span className="sr-only">{t.a11y.openContact}</span>
                      </div>

                      {/* Afordancia de que la pieza es tocable. Debajo de sm
                          sigue en `hidden`: ahí el ancho es el recurso escaso y
                          el cuerpo —que en táctil está siempre visible— se
                          queda con la columna entera. Desde sm el hueco ya
                          estaba reservado, así que en táctil la flecha se
                          muestra fija en vez de quedar invisible para siempre. */}
                      <span
                        aria-hidden="true"
                        className="border-gold/50 text-gold mb-1 hidden h-8 w-8 shrink-0 translate-y-1 place-items-center rounded-full border opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 sm:grid [button:focus-visible_&]:translate-y-0 [button:focus-visible_&]:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                      </span>
                    </div>
                  </div>
                </VideoCard>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
