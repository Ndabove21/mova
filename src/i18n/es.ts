import type { Dictionary } from "./en";

/**
 * Copy del sitio — español (AR, voseo).
 *
 * Acá va TODO en español: etiquetas, titulares, rubros y formulario. La única
 * palabra que no se traduce es el nombre de la marca.
 *
 * Nota: los títulos y categorías de las piezas del portfolio viven en
 * `src/data/works.ts`, no acá, porque son nombres propios de cada trabajo.
 * Hoy son de relleno; cuando entren los reales habrá que decidir si van en
 * inglés o en castellano.
 */
export const es: Dictionary = {
  htmlLang: "es-AR",
  localeLabel: "ES",
  otherLocaleLabel: "EN",

  meta: {
    title: "MOVA — Estudio creativo de IA",
    titleTemplate: "%s · MOVA",
    description:
      "Estudio creativo de IA. Films, comerciales, mundos visuales, personajes digitales y contenido para redes, producidos con inteligencia artificial y oficio de cine.",
    ogTitle: "MOVA — Crear más allá de lo real.",
    ogDescription:
      "Films de IA, comerciales, mundos visuales y personajes digitales. Un estudio creativo para una realidad nueva.",
    keywords: [
      "estudio creativo IA",
      "producción audiovisual con IA",
      "spots publicitarios IA",
      "mundos visuales",
      "personajes digitales",
      "video generativo",
      "contenido para redes",
      "MOVA",
    ],
  },

  brand: {
    name: "MOVA",
    descriptor: "ESTUDIO CREATIVO DE IA",
    claim: "CREAR MÁS ALLÁ DE LO REAL.",
  },

  nav: {
    links: [
      { id: "work", label: "TRABAJOS" },
      { id: "services", label: "SERVICIOS" },
      { id: "about", label: "ESTUDIO" },
    ],
    contact: "CONTACTO",
    cta: "EMPEZAR UN PROYECTO",
    menu: "Menú",
    close: "Cerrar",
  },

  hero: {
    index: "01",
    showreel: "VER EL SHOWREEL",
    tags: ["FILMS", "COMERCIALES", "MUNDOS VISUALES", "CONTENIDO IA"],
    scroll: "SCROLL",
    pause: "PAUSAR",
    play: "REPRODUCIR",
  },

  intro: {
    eyebrow: "CREAMOS",
    title: ["LO QUE TODAVÍA", "NO EXISTE."],
    body:
      "Combinamos dirección creativa, inteligencia artificial y movimiento para construir experiencias visuales a las que la producción tradicional no llega.",
    cta: "VER EL VIDEO",
  },

  services: {
    index: "02",
    label: "SERVICIOS",
    subtitle: ["DE LA IDEA A LA IMAGEN.", "DE LA IMAGEN AL MOVIMIENTO."],
    items: [
      {
        title: "FILMS DE IA",
        body: "Cortos y piezas de marca con dirección, guion y un look que se sostiene plano a plano.",
      },
      {
        title: "COMERCIALES",
        body: "Comerciales completos: de brief aprobado a master entregado en días, no en meses.",
      },
      {
        title: "MUNDOS VISUALES",
        body: "Locaciones imposibles, otras épocas y escalas que no entran en un presupuesto de rodaje.",
      },
      {
        title: "PERSONAJES DIGITALES",
        body: "Rostros consistentes que hablan tu idioma, sin convocar un casting y sin set.",
      },
      {
        title: "CONTENIDO PARA REDES",
        body: "Vertical en volumen. Diez variantes de una idea para saber cuál convierte antes de pautar.",
      },
    ],
  },

  reality: {
    index: "03",
    label: "REALIDAD → MOVA",
    lines: ["LA MISMA IDEA.", "OTRO UNIVERSO."],
    realityLabel: "REALIDAD",
    generatedLabel: "GENERADO",
    hint: "Arrastrá para comparar",
    sliderLabel: "Comparación entre la toma real y la versión generada",
  },

  work: {
    index: "04",
    label: "TRABAJOS SELECCIONADOS",
    meta: "IA — FILMS — COMERCIALES — MUNDOS VISUALES",
    viewAll: "VER TODO",
    play: "REPRODUCIR",
    close: "CERRAR",
    soon: "PRÓXIMAMENTE",
  },

  immersive: {
    index: "05",
    label: "EXPERIENCIAS INMERSIVAS",
    title: ["IDEAS", "HECHAS", "MUNDOS."],
    body:
      "Convertimos la imaginación en mundos cinematográficos, personajes y experiencias visuales que no existen en ningún otro lado.",
    cta: "EXPLORAR",
  },

  process: {
    index: "06",
    label: "CÓMO CREAMOS",
    steps: [
      { title: "IDEA", body: "Una llamada de treinta minutos. Qué querés decir, a quién y para cuándo." },
      { title: "GENERAR", body: "Moodboard, guion y look cerrado antes de que exista un solo frame." },
      { title: "REFINAR", body: "Iteramos a la vista. Cambiar de idea ya no cuesta un día de rodaje." },
      { title: "ANIMAR", body: "Movimiento, cámara y ritmo. Donde el material se vuelve película." },
      { title: "ENTREGAR", body: "Master y cortes para cada plataforma. Los archivos quedan a tu nombre." },
    ],
  },

  about: {
    index: "07",
    label: "ESTUDIO",
    title: ["UN ESTUDIO CREATIVO", "PARA UNA REALIDAD NUEVA."],
    body:
      "Exploramos el límite entre la imaginación y la realidad para crear contenido visual que inspira, conecta y trasciende el brief.",
    cta: "NUESTRO ENFOQUE",
  },

  finalCta: {
    index: "08",
    title: ["CREEMOS MÁS ALLÁ", "DE LO REAL."],
    cta: "EMPEZAR UN PROYECTO",
  },

  footer: {
    studio: "ESTUDIO",
    social: "REDES",
    rights: "© 2026 MOVA. CREAR MÁS ALLÁ DE LO REAL.",
    backToTop: "VOLVER ARRIBA",
  },

  contact: {
    label: "EMPEZAR UN PROYECTO",
    title: ["CONTANOS", "QUÉ ESTÁS VIENDO."],
    lead:
      "Contanos qué tenés en la cabeza. Si hay proyecto, en 24 horas te respondemos con una idea y un número.",
    form: {
      name: "NOMBRE",
      namePlaceholder: "Cómo te llamás",
      email: "EMAIL",
      emailPlaceholder: "donde-te-escribimos@mail.com",
      company: "EMPRESA / PROYECTO",
      companyPlaceholder: "Opcional",
      type: "QUÉ NECESITÁS",
      typeOptions: [
        "Film de IA",
        "Comercial",
        "Mundo visual",
        "Personaje digital",
        "Contenido para redes",
        "Todavía no sé",
      ],
      message: "CONTANOS UN POCO",
      messagePlaceholder: "Qué querés contar, a quién le hablás y para cuándo lo necesitás.",
      submit: "ENVIAR",
      submitting: "ENVIANDO…",
      success: "Listo. Te respondemos dentro de las próximas 24 horas.",
      error: "No pudimos enviarlo. Escribinos por WhatsApp y lo resolvemos.",
      required: "Este campo es obligatorio",
      invalidEmail: "Revisá el email",
      tooShort: "Contanos un poco más",
    },
    whatsapp: "WHATSAPP",
    whatsappMessage: "Hola MOVA, vengo de la web y quiero contarles un proyecto.",
    or: "o",
    close: "CERRAR",
  },

  cursor: {
    play: "VER",
    view: "VER",
    explore: "EXPLORAR",
    watch: "VER",
    drag: "ARRASTRAR",
  },

  a11y: {
    skip: "Saltar al contenido",
    openContact: "Abrir el formulario de contacto",
    placeholderNote: "Imagen placeholder",
  },
};
