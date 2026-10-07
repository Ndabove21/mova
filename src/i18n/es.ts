export const es = {
  htmlLang: "es-AR",
  localeLabel: "ES",
  otherLocaleLabel: "EN",

  meta: {
    title: "MOVA — AI Creative Studio",
    titleTemplate: "%s · MOVA",
    description:
      "Estudio creativo que produce video con inteligencia artificial. Spots, contenido para redes, videoclips y avatares con dirección, estética y ritmo de cine.",
    ogTitle: "MOVA — AI Creative Studio",
    ogDescription:
      "La idea ya no espera a la producción. Video con IA, con criterio de dirección.",
    keywords: [
      "estudio creativo IA",
      "video con inteligencia artificial",
      "producción audiovisual IA",
      "spots publicitarios IA",
      "videoclip IA",
      "avatares IA",
      "contenido para redes",
      "MOVA",
    ],
  },

  nav: {
    links: [
      { id: "trabajos", label: "Trabajos" },
      { id: "servicios", label: "Servicios" },
    ],
    cta: "Hablemos",
    menu: "Menú",
    close: "Cerrar",
  },

  hero: {
    eyebrow: "AI Creative Studio",
    title: ["La idea ya no espera", "a la producción."],
    body:
      "Producimos video con inteligencia artificial. Dirección, estética y ritmo de cine — en tiempos y costos que ninguna productora tradicional puede igualar.",
    ctaPrimary: "Ver trabajos",
    ctaSecondary: "Empezar un proyecto",
    scroll: "Scroll",
    pause: "Pausar",
    play: "Reproducir",
    soundOn: "Sonido",
    soundOff: "Silenciar",
  },

  manifesto: {
    eyebrow: "Manifiesto",
    statement: ["Todo lo que ves", "empieza en negro."],
    body: [
      "Una pantalla negra solía significar un presupuesto, seis semanas de rodaje y veinte personas coordinadas. Hoy puede significar una dirección clara y una máquina que escucha.",
      "Elegimos lo segundo, pero con el criterio de lo primero. Porque la herramienta cambió; el estándar, no.",
    ],
  },

  work: {
    eyebrow: "Trabajos",
    title: "Selección",
    lead: "Piezas recientes.",
    play: "Reproducir",
    close: "Cerrar",
    empty: "Próximamente.",
    soon: "Próximamente",
    cta: "¿Querés ver el reel completo?",
    ctaLink: "Pedilo por WhatsApp",
  },

  services: {
    eyebrow: "Servicios",
    title: "Lo que hacemos",
    lead: "Seis formas de usar la misma herramienta.",
    items: [
      {
        title: "Spots y campañas",
        body: "De brief aprobado a master entregado en días, no en meses.",
      },
      {
        title: "Contenido para redes",
        body: "Diez variantes de la misma idea, para testear antes de poner la pauta.",
      },
      {
        title: "Videoclip y pieza de arte",
        body: "Donde la IA deja de imitar al cine y empieza a hacer otra cosa.",
      },
      {
        title: "Avatares y presentadores",
        body: "Rostros consistentes que hablan tu idioma, sin convocar un casting.",
      },
      {
        title: "Dirección de arte y look dev",
        body: "Paleta, lente, grano y luz decididos antes de generar el primer plano.",
      },
      {
        title: "Post y finishing",
        body: "Montaje, color, sonido y música. Lo que convierte material en pieza.",
      },
    ],
  },

  contact: {
    eyebrow: "Contacto",
    title: "Contemos algo",
    lead:
      "Contanos qué tenés en la cabeza. Si hay proyecto, en 24 horas te respondemos con una idea y un número.",
    form: {
      name: "Nombre",
      namePlaceholder: "Cómo te llamás",
      email: "Email",
      emailPlaceholder: "donde-te-escribimos@mail.com",
      company: "Empresa / proyecto",
      companyPlaceholder: "Opcional",
      type: "Qué necesitás",
      typeOptions: [
        "Spot o campaña",
        "Contenido para redes",
        "Videoclip o pieza de arte",
        "Avatar o presentador",
        "Todavía no sé",
      ],
      message: "Contanos un poco",
      messagePlaceholder:
        "Qué querés contar, a quién le hablás y para cuándo lo necesitás.",
      submit: "Enviar",
      submitting: "Enviando…",
      success: "Listo. Te respondemos dentro de las próximas 24 horas.",
      error: "No pudimos enviarlo. Escribinos por WhatsApp y lo resolvemos.",
      required: "Este campo es obligatorio",
      invalidEmail: "Revisá el email",
      tooShort: "Contanos un poco más",
    },
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage: "Hola MOVA, vengo de la web y quiero contarles un proyecto.",
    or: "o",
    emailLabel: "Mail",
  },

  footer: {
    tagline: "AI Creative Studio",
    claim: "Create beyond reality.",
    rights: "Todos los derechos reservados.",
    backToTop: "Volver arriba",
    social: "Seguinos",
  },
};

export type Dictionary = typeof es;
