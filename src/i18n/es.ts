import type { Dictionary } from "./en";

/**
 * Copy del sitio — español (AR, voseo).
 *
 * Las etiquetas y los titulares quedan en inglés a propósito: son lenguaje de
 * marca, igual que el claim del isologo. Lo que cambia son las frases.
 */
export const es: Dictionary = {
  htmlLang: "es-AR",
  localeLabel: "ES",
  otherLocaleLabel: "EN",

  meta: {
    title: "MOVA — AI Creative Studio",
    titleTemplate: "%s · MOVA",
    description:
      "Estudio creativo de IA. Films, comerciales, mundos visuales, personajes digitales y contenido para redes, producidos con inteligencia artificial y oficio de cine.",
    ogTitle: "MOVA — Create beyond reality.",
    ogDescription:
      "AI films, comerciales, mundos visuales y personajes digitales. Un estudio creativo para una realidad nueva.",
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
    descriptor: "AI CREATIVE STUDIO",
    claim: "CREATE BEYOND REALITY.",
  },

  nav: {
    links: [
      { id: "work", label: "WORK" },
      { id: "services", label: "SERVICES" },
      { id: "about", label: "ABOUT" },
    ],
    contact: "CONTACT",
    cta: "START A PROJECT",
    menu: "Menú",
    close: "Cerrar",
  },

  hero: {
    index: "01",
    showreel: "WATCH SHOWREEL",
    tags: ["FILMS", "COMMERCIALS", "VISUAL WORLDS", "AI CONTENT"],
    scroll: "SCROLL",
    pause: "PAUSAR",
    play: "REPRODUCIR",
  },

  intro: {
    eyebrow: "WE CREATE",
    title: ["WHAT DOESN'T", "EXIST."],
    body:
      "Combinamos dirección creativa, inteligencia artificial y movimiento para construir experiencias visuales a las que la producción tradicional no llega.",
    cta: "PLAY VIDEO",
  },

  services: {
    index: "02",
    label: "SERVICES",
    subtitle: ["FROM IDEA TO IMAGE.", "FROM IMAGE TO MOTION."],
    items: [
      {
        title: "AI FILMS",
        body: "Cortos y piezas de marca con dirección, guion y un look que se sostiene plano a plano.",
      },
      {
        title: "COMMERCIALS",
        body: "Comerciales completos: de brief aprobado a master entregado en días, no en meses.",
      },
      {
        title: "VISUAL WORLDS",
        body: "Locaciones imposibles, otras épocas y escalas que no entran en un presupuesto de rodaje.",
      },
      {
        title: "DIGITAL CHARACTERS",
        body: "Rostros consistentes que hablan tu idioma, sin convocar un casting y sin set.",
      },
      {
        title: "SOCIAL CONTENT",
        body: "Vertical en volumen. Diez variantes de una idea para saber cuál convierte antes de pautar.",
      },
    ],
  },

  reality: {
    index: "03",
    label: "REALITY → MOVA",
    lines: ["SAME IDEA.", "A DIFFERENT UNIVERSE."],
    realityLabel: "REALITY",
    generatedLabel: "GENERATED",
    hint: "Arrastrá para comparar",
    sliderLabel: "Comparación entre la toma real y la versión generada",
  },

  work: {
    index: "04",
    label: "SELECTED WORK",
    meta: "AI — FILMS — COMMERCIALS — VISUAL WORLDS",
    viewAll: "VIEW ALL",
    play: "PLAY",
    close: "CERRAR",
    soon: "PRÓXIMAMENTE",
  },

  immersive: {
    index: "05",
    label: "IMMERSIVE EXPERIENCES",
    title: ["IDEAS", "INTO", "WORLDS."],
    body:
      "Convertimos la imaginación en mundos cinematográficos, personajes y experiencias visuales que no existen en ningún otro lado.",
    cta: "EXPLORE",
  },

  process: {
    index: "06",
    label: "HOW WE CREATE",
    steps: [
      { title: "IDEA", body: "Una llamada de treinta minutos. Qué querés decir, a quién y para cuándo." },
      { title: "GENERATE", body: "Moodboard, guion y look cerrado antes de que exista un solo frame." },
      { title: "REFINE", body: "Iteramos a la vista. Cambiar de idea ya no cuesta un día de rodaje." },
      { title: "ANIMATE", body: "Movimiento, cámara y ritmo. Donde el material se vuelve película." },
      { title: "DELIVER", body: "Master y cortes para cada plataforma. Los archivos quedan a tu nombre." },
    ],
  },

  about: {
    index: "07",
    label: "ABOUT",
    title: ["A CREATIVE STUDIO", "FOR A NEW REALITY."],
    body:
      "Exploramos el límite entre la imaginación y la realidad para crear contenido visual que inspira, conecta y trasciende el brief.",
    cta: "OUR APPROACH",
  },

  finalCta: {
    index: "08",
    title: ["LET'S CREATE", "BEYOND REALITY."],
    cta: "START A PROJECT",
  },

  footer: {
    studio: "STUDIO",
    social: "SOCIAL",
    rights: "© 2026 MOVA. CREATE BEYOND REALITY.",
    backToTop: "VOLVER ARRIBA",
  },

  contact: {
    label: "START A PROJECT",
    title: ["TELL US", "WHAT YOU SEE."],
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
        "AI film",
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
    play: "PLAY",
    view: "VER",
    explore: "EXPLORE",
    watch: "WATCH",
    drag: "DRAG",
  },

  a11y: {
    skip: "Saltar al contenido",
    openContact: "Abrir el formulario de contacto",
    placeholderNote: "Imagen placeholder",
  },
};
