/**
 * Copy del sitio — inglés.
 *
 * Criterio bilingüe: las ETIQUETAS y los TITULARES quedan en inglés en las dos
 * versiones (son lenguaje de marca: SERVICES, SELECTED WORK, CREATE BEYOND
 * REALITY). Lo que se traduce son las FRASES y el formulario.
 */
export const en = {
  htmlLang: "en",
  localeLabel: "EN",
  otherLocaleLabel: "ES",

  meta: {
    title: "MOVA — AI Creative Studio",
    titleTemplate: "%s · MOVA",
    description:
      "AI creative studio. Films, commercials, visual worlds, digital characters and social content, produced with artificial intelligence and the craft of cinema.",
    ogTitle: "MOVA — Create beyond reality.",
    ogDescription:
      "AI films, commercials, visual worlds and digital characters. A creative studio for a new reality.",
    keywords: [
      "AI creative studio",
      "AI film production",
      "AI commercials",
      "visual worlds",
      "digital characters",
      "generative video",
      "social content",
      "MOVA",
    ],
  },

  /* Etiquetas de marca — iguales en los dos idiomas */
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
    menu: "Menu",
    close: "Close",
  },

  hero: {
    index: "01",
    showreel: "WATCH SHOWREEL",
    tags: ["FILMS", "COMMERCIALS", "VISUAL WORLDS", "AI CONTENT"],
    scroll: "SCROLL",
    pause: "PAUSE",
    play: "PLAY",
  },

  intro: {
    eyebrow: "WE CREATE",
    title: ["WHAT DOESN'T", "EXIST."],
    body:
      "We combine creative direction, artificial intelligence and motion to build visual experiences that traditional production cannot reach.",
    cta: "PLAY VIDEO",
  },

  services: {
    index: "02",
    label: "SERVICES",
    subtitle: ["FROM IDEA TO IMAGE.", "FROM IMAGE TO MOTION."],
    items: [
      {
        title: "AI FILMS",
        body: "Short films and brand pieces with direction, script and a look that holds shot to shot.",
      },
      {
        title: "COMMERCIALS",
        body: "Full spots, from approved brief to delivered master — in days, not months.",
      },
      {
        title: "VISUAL WORLDS",
        body: "Impossible locations, other eras, scales that never fit inside a shooting budget.",
      },
      {
        title: "DIGITAL CHARACTERS",
        body: "Consistent faces that speak your language, with no casting call and no set.",
      },
      {
        title: "SOCIAL CONTENT",
        body: "Vertical at volume. Ten variants of one idea, so you learn what works before the spend.",
      },
    ],
  },

  reality: {
    index: "03",
    label: "REALITY → MOVA",
    lines: ["SAME IDEA.", "A DIFFERENT UNIVERSE."],
    realityLabel: "REALITY",
    generatedLabel: "GENERATED",
    hint: "Drag to compare",
    sliderLabel: "Comparison between the real shot and the generated version",
  },

  work: {
    index: "04",
    label: "SELECTED WORK",
    meta: "AI — FILMS — COMMERCIALS — VISUAL WORLDS",
    viewAll: "VIEW ALL",
    play: "PLAY",
    close: "CLOSE",
    soon: "COMING SOON",
  },

  immersive: {
    index: "05",
    label: "IMMERSIVE EXPERIENCES",
    title: ["IDEAS", "INTO", "WORLDS."],
    body:
      "We turn imagination into cinematic worlds, characters and visual experiences that do not exist anywhere else.",
    cta: "EXPLORE",
  },

  process: {
    index: "06",
    label: "HOW WE CREATE",
    steps: [
      { title: "IDEA", body: "A thirty-minute call. What you want to say, to whom, and by when." },
      { title: "GENERATE", body: "Moodboard, script and a locked look before a single frame exists." },
      { title: "REFINE", body: "We iterate in the open. Changing your mind no longer costs a shooting day." },
      { title: "ANIMATE", body: "Motion, camera and rhythm. Where the footage becomes a film." },
      { title: "DELIVER", body: "Master plus cutdowns for every platform. The files are yours." },
    ],
  },

  about: {
    index: "07",
    label: "ABOUT",
    title: ["A CREATIVE STUDIO", "FOR A NEW REALITY."],
    body:
      "We explore the space between imagination and reality to create visual content that inspires, connects and outlives the brief.",
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
    backToTop: "BACK TO TOP",
  },

  contact: {
    label: "START A PROJECT",
    title: ["TELL US", "WHAT YOU SEE."],
    lead:
      "Tell us what you have in mind. If there is a project in it, you will hear back within 24 hours with an idea and a number.",
    form: {
      name: "NAME",
      namePlaceholder: "What we should call you",
      email: "EMAIL",
      emailPlaceholder: "where-we-reply@mail.com",
      company: "COMPANY / PROJECT",
      companyPlaceholder: "Optional",
      type: "WHAT YOU NEED",
      typeOptions: [
        "AI film",
        "Commercial",
        "Visual world",
        "Digital character",
        "Social content",
        "Not sure yet",
      ],
      message: "TELL US A LITTLE",
      messagePlaceholder: "What you want to say, who you are talking to and when you need it.",
      submit: "SEND",
      submitting: "SENDING…",
      success: "Done. You will hear from us within 24 hours.",
      error: "That did not go through. Message us on WhatsApp and we will sort it.",
      required: "This field is required",
      invalidEmail: "Check the email address",
      tooShort: "Tell us a bit more",
    },
    whatsapp: "WHATSAPP",
    whatsappMessage: "Hi MOVA — I found you on the site and want to talk about a project.",
    or: "or",
    close: "CLOSE",
  },

  cursor: {
    play: "PLAY",
    view: "VIEW",
    explore: "EXPLORE",
    watch: "WATCH",
    drag: "DRAG",
  },

  a11y: {
    skip: "Skip to content",
    openContact: "Open the contact form",
    placeholderNote: "Placeholder image",
  },
};

export type Dictionary = typeof en;
