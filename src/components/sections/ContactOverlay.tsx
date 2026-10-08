"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

import { sendContact, type ContactState } from "@/app/actions/contact";
import { Eclipse } from "@/components/primitives/Eclipse";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { RevealText } from "@/components/primitives/RevealText";
import { Rule } from "@/components/primitives/motion";
import type { Dictionary } from "@/i18n";
import { CONTACT, whatsappHref, type Locale } from "@/lib/site";

/* ==========================================================================
   Capa de contacto
   No es una sección de la home: se monta sobre todo lo demás desde cualquier
   CTA (ContactProvider la carga en diferido y la desmonta al cerrar).
   Composición: dos columnas en lg —el argumento a la izquierda, el formulario
   a la derecha— sobre el mismo gesto visual del resto del sitio, el eclipse
   asomando desde abajo.
   ========================================================================== */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Flecha del select como background-image: `appearance-none` borra la nativa y
 * no hay forma de estilar la del navegador. Va inline y no en globals.css
 * porque es la única del sitio. El `%23` es el `#` de `#f2f0ea` escapado: sin
 * escapar, el navegador lo lee como fragmento de URL y la flecha no aparece.
 */
const FLECHA_SELECT = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%23f2f0ea' stroke-opacity='.6' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

/**
 * Campos: filete inferior, sin caja. La caja la daría un dashboard.
 * El error se marca con `aria-[invalid=true]` y no con `aria-invalid:`, que no
 * es una variante que Tailwind traiga por defecto.
 * El placeholder va al 50% y no al 45%: 45% da 4.04:1 sobre el negro, por
 * debajo del 4.5:1 de AA; 50% llega a ~4.8:1 y se sigue leyendo como hueco a
 * llenar y no como valor ya escrito.
 */
const CAMPO =
  "w-full border-b border-line bg-transparent py-3 text-[0.9375rem] text-ink transition-colors duration-500 placeholder:text-ink/50 focus:border-gold/70 aria-[invalid=true]:border-gold";

const ETIQUETA = "block text-[10px] tracking-[0.3em] uppercase text-ink-faint";

/** El error se dice en oro: es la paleta de la marca y contrasta 10:1 en negro. */
const ERROR = "mt-2 block text-[11px] leading-[1.5] tracking-[0.12em] uppercase text-gold";

/**
 * Elementos que entran en la trampa de foco. Se filtra además por `tabIndex >= 0`
 * para dejar afuera el honeypot, que es un input real pero fuera del tabulado.
 */
const ENFOCABLES = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function enfocablesDe(raiz: HTMLElement): HTMLElement[] {
  return Array.from(raiz.querySelectorAll<HTMLElement>(ENFOCABLES)).filter(
    (el) =>
      el.tabIndex >= 0 &&
      (el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement)
  );
}

/**
 * El botón de envío vive en su propio componente porque `useFormStatus` sólo
 * lee el estado del <form> que está por encima de él en el árbol: si estuviera
 * en el mismo componente que el <form>, `pending` nunca cambiaría.
 *
 * Es el único botón del sitio escrito a mano: MagneticButton renderiza
 * `type="button"` y no puede enviar el formulario. Se copia su pinta `solid`.
 */
function BotonEnviar({ enviar, enviando }: { enviar: string; enviando: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor="button"
      className="group/btn relative inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-[11px] tracking-[0.2em] text-black uppercase transition-colors duration-500 hover:bg-gold disabled:cursor-wait disabled:bg-ink/60"
    >
      <span>{pending ? enviando : enviar}</span>
      <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-black/25">
        {pending ? (
          <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-black/70" />
        ) : (
          <ArrowRight
            className="h-3 w-3 transition-transform duration-500 group-hover/btn:translate-x-0.5"
            strokeWidth={1.75}
          />
        )}
      </span>
    </button>
  );
}

export function ContactOverlay({
  t,
  lang,
  onClose,
}: {
  t: Dictionary;
  lang: Locale;
  onClose: () => void;
}) {
  const quieto = useReducedMotion();

  const [state, action] = useActionState<ContactState, FormData>(sendContact, {
    status: "idle",
  });

  /**
   * React 19 vacía el formulario en CADA envío: `startHostTransition` llama
   * siempre a `requestFormReset` antes de ejecutar la action, pase lo que pase
   * con lo que la action devuelva. Sin esto, un error de validación —un mail
   * mal escrito, el camino más probable— dejaba los cinco campos en blanco y
   * había que retipear el mensaje entero.
   *
   * La salida es guardar lo tipeado y devolverlo por `defaultValue`:
   * `form.reset()` lleva cada control a su atributo `value`, que es exactamente
   * lo que React sincroniza desde `defaultValue`, así que el reset restaura en
   * vez de borrar. A propósito NO son campos controlados: `reset()` no dispara
   * el evento de cambio de React y quedarían vacíos en pantalla con el estado
   * lleno.
   */
  const [valores, setValores] = useState({
    name: "",
    email: "",
    company: "",
    type: "",
    message: "",
  });

  const recordar = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setValores((v) => ({ ...v, [e.target.name]: e.target.value }));

  /**
   * El <select> es la excepción al párrafo anterior: React sólo aplica su
   * `defaultValue` al montarlo —en las actualizaciones lo vuelve a mirar sólo
   * si cambió `multiple`—, así que el `defaultSelected` de la opción, que es lo
   * único que lee `form.reset()`, lo muevo a mano.
   */
  const recordarTipo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const elegido = e.currentTarget.value;
    for (const op of Array.from(e.currentTarget.options)) {
      op.defaultSelected = op.value === elegido;
    }
    recordar(e);
  };

  const capa = useRef<HTMLDivElement | null>(null);
  const cerrar = useRef<HTMLButtonElement | null>(null);
  const exito = useRef<HTMLDivElement | null>(null);
  const formulario = useRef<HTMLFormElement | null>(null);

  // Foco inicial en el botón de cerrar: es la salida, y es lo primero que
  // necesita saber quien entra acá con teclado o lector de pantalla.
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    cerrar.current?.focus();
    return () => {
      // Al cerrar, el foco vuelve al CTA que abrió la capa. Sin esto queda al
      // principio del documento y hay que volver a recorrer la página.
      if (anterior && document.contains(anterior)) anterior.focus();
    };
  }, []);

  // Escape se escucha en el documento y no sólo en la capa: así cierra incluso
  // si el foco se escapó (extensión, autocompletado del navegador).
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [onClose]);

  // El formulario se reemplaza por el mensaje de éxito: como el bloque recién
  // se inserta, una región aria-live puede no anunciarse. Mover el foco al
  // mensaje lo garantiza.
  useEffect(() => {
    if (state.status === "ok") exito.current?.focus();
  }, [state.status]);

  // Un error por campo no se anunciaba: el foco se quedaba en SEND, los <span>
  // de error son texto estático y el aria-describedby sólo se lee si el campo
  // se vuelve a enfocar, cosa que nadie hace si nada le dijo que falló algo
  // (WCAG 3.3.1). Mover el foco al primer campo inválido lo resuelve: al
  // llegar, el lector lee etiqueta, estado inválido y descripción.
  // La dependencia es `state` entero y no `state.status`: cada envío devuelve
  // un objeto nuevo, así que el efecto vuelve a correr incluso con dos errores
  // idénticos seguidos.
  useEffect(() => {
    if (state.status !== "error") return;
    const orden = ["name", "email", "message"] as const;
    const primero = orden.find((k) => state.fieldErrors?.[k]);
    if (primero) {
      formulario.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
    }
  }, [state]);

  const campos = state.status === "error" ? state.fieldErrors : undefined;
  const errorGeneral =
    state.status === "error" && !(campos && Object.keys(campos).length > 0);

  /**
   * Texto de la región aria-live. Con `errorGeneral` sola quedaba MUDA justo
   * cuando hay errores por campo —es false precisamente en ese caso—, así que
   * el envío terminaba en silencio absoluto. Ahora, si el fallo es de
   * validación, la región resume qué campos fallaron; cada mensaje se nombra
   * con su etiqueta porque "This field is required" suelto, sin campo, no dice
   * nada. El resumen cubre el segundo y el tercer error, que el foco —que va al
   * primero— no alcanza a anunciar.
   */
  const mensajeEstado = errorGeneral
    ? t.contact.form.error
    : [
        campos?.name && `${t.contact.form.name}: ${t.contact.form.required}`,
        campos?.email && `${t.contact.form.email}: ${t.contact.form.invalidEmail}`,
        campos?.message && `${t.contact.form.message}: ${t.contact.form.tooShort}`,
      ]
        .filter(Boolean)
        .join(" · ");

  const atraparTab = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const raiz = capa.current;
    if (!raiz) return;

    const lista = enfocablesDe(raiz);
    if (lista.length === 0) return;

    const primero = lista[0];
    const ultimo = lista[lista.length - 1];
    const activo = document.activeElement;
    const adentro = raiz.contains(activo);

    if (e.shiftKey && (activo === primero || !adentro)) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && (activo === ultimo || !adentro)) {
      e.preventDefault();
      primero.focus();
    }
  };

  /**
   * Sólo cierra si el gesto EMPEZÓ y TERMINÓ en el fondo.
   *
   * `target === currentTarget` en el click no alcanza: el click se despacha en
   * el ancestro común más cercano entre el target del mousedown y el del
   * mouseup, así que arrastrar una selección desde el <textarea> del mensaje
   * —el gesto normal para releer o corregir un párrafo largo— y soltar sobre el
   * padding salía con `target === currentTarget` y cerraba la capa. Como
   * ContactProvider la desmonta, se perdía la consulta entera sin confirmación,
   * y el área de riesgo es grande: a 1440 el margen lateral del contenido ronda
   * los 130px por lado. Comprobar las dos puntas distingue "cliqué el fondo" de
   * "arrastré sobre el fondo".
   */
  const inicioEnFondo = useRef(false);

  const alPresionar = (e: React.MouseEvent<HTMLDivElement>) => {
    inicioEnFondo.current = e.target === e.currentTarget;
  };

  const alSoltar = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) inicioEnFondo.current = false;
  };

  const clickEnElFondo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inicioEnFondo.current && e.target === e.currentTarget) onClose();
  };

  return (
    <motion.div
      ref={capa}
      role="dialog"
      aria-modal="true"
      aria-label={t.contact.label}
      onKeyDown={atraparTab}
      initial={quieto ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      /* z-[210] y no el z-[140] de la spec: la viñeta (.vignette::before, fixed
         sobre <body>, z-index 190) y el grano (.grain::after, 200) le ganaban a
         140 y le tiraban hasta 0.6 de negro encima. A 1440x900 el borde
         izquierdo del contenido cae en alfa ≈0.41 y se satura arriba: el
         text-ink-faint de la etiqueta y de las labels bajaba de 5.6:1 a ~2.6:1,
         por debajo de AA en toda la columna izquierda. Es el mismo problema que
         documenta Navbar.tsx con su panel móvil. 210 queda por encima de las
         dos decorativas, por debajo del cursor propio (250) y de los lightboxes
         (240), y sigue tapando el nav, que vuelve a z-[90] porque el CTA cierra
         el menú antes de abrir esta capa. */
      className="fixed inset-0 z-[210] bg-black/97 backdrop-blur-xl"
    >
      {/* Capa decorativa: no scrollea con el contenido y recorta el eclipse.
          El overflow-hidden vive acá y no en la raíz porque la raíz necesita
          dejar scrollear la columna de contenido. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Halo cálido abajo: la única fuente de luz de la capa. */}
        <div className="glow-gold absolute bottom-[-16vh] left-1/2 h-[52vh] w-[140vw] -translate-x-1/2 opacity-70 blur-[110px]" />

        {/* El eclipse asoma desde abajo, el mismo gesto del hero y del CTA
            final. translate-y en porcentaje de su propio alto: así deja
            siempre visible el mismo arco, sea 390 o 1440 de ancho. */}
        <div className="absolute bottom-0 left-1/2 w-[min(1100px,160vw)] -translate-x-1/2 translate-y-[72%] opacity-85">
          <Eclipse disc={false} rimWidth={2} className="w-full" />
        </div>
      </div>

      <button
        ref={cerrar}
        type="button"
        onClick={onClose}
        data-cursor="link"
        className="absolute top-4 right-4 z-20 inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2.5 text-[10px] tracking-[0.3em] text-ink-faint uppercase transition-colors duration-500 hover:border-gold/60 hover:text-gold sm:top-6 sm:right-6 lg:top-8 lg:right-8"
      >
        {t.contact.close}
        <X className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
      </button>

      {/* Capa de contenido. El padding vive acá —y no en el hijo— para que el
          click en ese margen cuente como click en el fondo. data-lenis-prevent
          evita que el scroll suave global se coma el scroll interno. */}
      <div
        onMouseDown={alPresionar}
        onMouseUp={alSoltar}
        onClick={clickEnElFondo}
        data-lenis-prevent
        className="absolute inset-0 z-10 overflow-y-auto overscroll-contain px-5 pt-28 pb-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36 lg:pb-32"
      >
        <motion.div
          initial={quieto ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
          className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0"
        >
          {/* ---------------------------------------------------------------
              Izquierda — el argumento
              --------------------------------------------------------------- */}
          <div className="lg:col-span-5">
            <p data-reveal className={ETIQUETA}>
              {t.contact.label}
            </p>

            <Rule className="mt-6" delay={120} />

            {/* La última línea en metal: es el remate del titular y el único
                lugar de la capa donde el degradé aparece. */}
            <RevealText
              as="h2"
              lines={t.contact.title.map((linea, i) =>
                i === t.contact.title.length - 1 ? (
                  <span key={linea} className="text-metal">
                    {linea}
                  </span>
                ) : (
                  linea
                )
              )}
              className="mt-10 font-serif text-[clamp(2rem,5.5vw,4.2rem)] leading-[1.02] tracking-[-0.025em]"
            />

            <p
              data-reveal="blur"
              style={{ "--reveal-delay": "260ms" } as React.CSSProperties}
              className="mt-8 max-w-[44ch] text-[1.0625rem] leading-[1.65] text-ink-dim"
            >
              {t.contact.lead}
            </p>

            <div
              data-reveal
              style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
              className="mt-12"
            >
              <MagneticButton
                variant="outline"
                icon="arrow"
                href={whatsappHref(t.contact.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.contact.whatsapp}
              </MagneticButton>

              <p className="mt-7 text-[11px] tracking-[0.2em] text-ink-faint">
                <span className="uppercase">{t.contact.or}</span>{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  data-cursor="link"
                  className="text-ink underline decoration-ink/25 decoration-1 underline-offset-[6px] transition-colors duration-500 hover:text-gold hover:decoration-gold/60"
                >
                  {CONTACT.email}
                </a>
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              Derecha — el formulario
              El filete vertical sólo en lg: en mobile las columnas se apilan y
              una línea entre ellas leería como corte de sección.
              --------------------------------------------------------------- */}
          <div className="lg:col-span-6 lg:col-start-7 lg:border-l lg:border-line-soft lg:pl-12">
            {state.status === "ok" ? (
              <div
                ref={exito}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="flex min-h-[20rem] flex-col justify-center"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-gold">
                  {t.contact.label}
                </span>
                <p className="mt-7 font-serif text-[clamp(2rem,4vw,2.8rem)] leading-[1.08] tracking-[-0.02em] text-ink">
                  {t.contact.form.success}
                </p>
                <div className="mt-10">
                  <MagneticButton variant="ghost" icon="none" onClick={onClose}>
                    {t.contact.close}
                  </MagneticButton>
                </div>
              </div>
            ) : (
              /* noValidate a propósito: la validación real es la de la server
                 action (nombre de 2 caracteres, mensaje de 10), que el
                 `required` nativo no puede comprobar. Si dejáramos actuar al
                 navegador, nunca se verían esos mensajes. Los `required` se
                 mantienen por semántica y para los lectores de pantalla. */
              <form ref={formulario} action={action} noValidate className="relative">
                <input type="hidden" name="locale" value={lang} />

                {/* Honeypot: lo completan los bots, nunca una persona. Sale del
                    cuadro por la izquierda —no con display:none, que los bots
                    detectan— y queda fuera del tabulado y del árbol de
                    accesibilidad. En LTR el desborde hacia la izquierda no
                    genera scroll horizontal. */}
                <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                  <label htmlFor="mova-website">Website</label>
                  <input
                    id="mova-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
                  <div>
                    <label htmlFor="mova-name" className={ETIQUETA}>
                      {t.contact.form.name}
                    </label>
                    <input
                      id="mova-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder={t.contact.form.namePlaceholder}
                      defaultValue={valores.name}
                      onChange={recordar}
                      aria-invalid={campos?.name === true}
                      aria-describedby={campos?.name ? "mova-name-error" : undefined}
                      className={`mt-3 ${CAMPO}`}
                    />
                    {campos?.name && (
                      <span id="mova-name-error" className={ERROR}>
                        {t.contact.form.required}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="mova-email" className={ETIQUETA}>
                      {t.contact.form.email}
                    </label>
                    <input
                      id="mova-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder={t.contact.form.emailPlaceholder}
                      defaultValue={valores.email}
                      onChange={recordar}
                      aria-invalid={campos?.email === true}
                      aria-describedby={campos?.email ? "mova-email-error" : undefined}
                      className={`mt-3 ${CAMPO}`}
                    />
                    {campos?.email && (
                      <span id="mova-email-error" className={ERROR}>
                        {t.contact.form.invalidEmail}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="mova-company" className={ETIQUETA}>
                      {t.contact.form.company}
                    </label>
                    <input
                      id="mova-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder={t.contact.form.companyPlaceholder}
                      defaultValue={valores.company}
                      onChange={recordar}
                      className={`mt-3 ${CAMPO}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="mova-type" className={ETIQUETA}>
                      {t.contact.form.type}
                    </label>
                    <select
                      id="mova-type"
                      name="type"
                      defaultValue=""
                      onChange={recordarTipo}
                      className={`mt-3 cursor-pointer appearance-none pr-8 ${CAMPO}`}
                      style={{
                        backgroundImage: FLECHA_SELECT,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 2px center",
                        backgroundSize: "12px 8px",
                        /* Mientras no haya elección el select se atenúa al tono
                           de las etiquetas: la opción vacía repite palabra por
                           palabra el label del campo y en text-ink pleno leía
                           como un valor ya elegido. Va por style y no por una
                           clase porque `text-ink-faint` chocaría con el
                           `text-ink` de CAMPO y el ganador lo decidiría el orden
                           del CSS compilado, no el del JSX. */
                        color: valores.type === "" ? "var(--color-ink-faint)" : undefined,
                      }}
                    >
                      {/* Primera opción vacía: elegir por el visitante sesgaría
                          la respuesta, y el campo es opcional en la action. */}
                      <option value="" className="bg-black-3 text-ink">
                        {t.contact.form.type}
                      </option>
                      {t.contact.form.typeOptions.map((opcion) => (
                        <option key={opcion} value={opcion} className="bg-black-3 text-ink">
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="mova-message" className={ETIQUETA}>
                      {t.contact.form.message}
                    </label>
                    <textarea
                      id="mova-message"
                      name="message"
                      required
                      rows={5}
                      placeholder={t.contact.form.messagePlaceholder}
                      defaultValue={valores.message}
                      onChange={recordar}
                      aria-invalid={campos?.message === true}
                      aria-describedby={campos?.message ? "mova-message-error" : undefined}
                      className={`mt-3 resize-y ${CAMPO}`}
                    />
                    {campos?.message && (
                      <span id="mova-message-error" className={ERROR}>
                        {t.contact.form.tooShort}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                  <BotonEnviar
                    enviar={t.contact.form.submit}
                    enviando={t.contact.form.submitting}
                  />

                  {/* La región se renderiza siempre, vacía mientras no haya
                      nada que decir: un aria-live que recién se inserta en el
                      DOM no se anuncia de forma confiable.
                      Se ve cuando el envío falló —no hay otro lugar donde ese
                      mensaje aparezca— y queda sólo para lectores cuando el
                      fallo es de validación: ahí el detalle ya está impreso al
                      pie de cada campo, en su contexto, y repetirlo al lado del
                      botón sería ruido visual. */}
                  <p
                    role="status"
                    aria-live="polite"
                    className={
                      errorGeneral
                        ? "max-w-[34ch] text-[11px] leading-[1.6] tracking-[0.12em] uppercase text-gold"
                        : "sr-only"
                    }
                  >
                    {mensajeEstado}
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
