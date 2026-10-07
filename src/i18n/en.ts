import type { Dictionary } from "./es";

export const en: Dictionary = {
  htmlLang: "en",
  localeLabel: "EN",
  otherLocaleLabel: "ES",

  meta: {
    title: "MOVA — AI Creative Studio",
    titleTemplate: "%s · MOVA",
    description:
      "Creative studio producing video with artificial intelligence. Commercials, social content, music films and AI presenters — with the direction, craft and pacing of cinema.",
    ogTitle: "MOVA — AI Creative Studio",
    ogDescription:
      "The idea no longer waits for production. AI video, directed like film.",
    keywords: [
      "AI creative studio",
      "AI video production",
      "AI commercials",
      "generative video agency",
      "AI music video",
      "AI avatars",
      "social video content",
      "MOVA",
    ],
  },

  nav: {
    links: [
      { id: "trabajos", label: "Work" },
      { id: "servicios", label: "Services" },
      { id: "proceso", label: "Process" },
      { id: "estudio", label: "Studio" },
    ],
    cta: "Get in touch",
    menu: "Menu",
    close: "Close",
  },

  hero: {
    eyebrow: "AI Creative Studio",
    title: ["The idea no longer waits", "for production."],
    body:
      "We produce video with artificial intelligence. The direction, craft and pacing of cinema — at a speed and cost no traditional production house can match.",
    ctaPrimary: "See the work",
    ctaSecondary: "Start a project",
    scroll: "Scroll",
    reelLabel: "Reel 2026",
  },

  manifesto: {
    eyebrow: "01 — Manifesto",
    statement: "Everything you see begins in black.",
    body: [
      "A black screen used to mean a budget, six weeks of shooting and twenty people in sync. Today it can mean a clear direction and a machine that listens.",
      "We chose the second — held to the standards of the first. The tool changed. The bar did not.",
    ],
  },

  services: {
    eyebrow: "02 — Services",
    title: "What we do",
    lead:
      "Six ways to use the same tool. What stays constant is the direction behind every frame.",
    items: [
      {
        n: "01",
        title: "Commercials & campaigns",
        body:
          "Full spots: concept, script, generation and finishing. From approved brief to delivered master in days, not months.",
      },
      {
        n: "02",
        title: "Social content",
        body:
          "Reels, TikToks and vertical ads at volume. Ten variants of the same idea, so you learn what converts before the media spend.",
      },
      {
        n: "03",
        title: "Music films & art pieces",
        body:
          "Show visuals, screen loops, music videos. Where AI stops imitating cinema and starts doing something else entirely.",
      },
      {
        n: "04",
        title: "Avatars & presenters",
        body:
          "Consistent faces that speak your language. For onboarding, courses, support or campaigns that need a face, not a casting call.",
      },
      {
        n: "05",
        title: "Art direction & look dev",
        body:
          "We decide before we generate. Palette, lens, grain and light: a look that holds shot to shot instead of drifting halfway through.",
      },
      {
        n: "06",
        title: "Post & finishing",
        body:
          "Edit, colour, sound and score. AI generates footage; craft is what turns it into something you can actually air.",
      },
    ],
  },

  work: {
    eyebrow: "03 — Work",
    title: "Selected",
    lead: "Recent pieces. Hover to preview, click to open.",
    filterAll: "All",
    play: "Play",
    close: "Close",
    empty: "Coming soon.",
    soon: "Coming soon",
    cta: "Want to see the full reel?",
    ctaLink: "Ask on WhatsApp",
  },

  process: {
    eyebrow: "04 — Process",
    title: "How we work",
    lead: "Four steps. No surprises, no budgets that reopen halfway through.",
    steps: [
      {
        n: "01",
        title: "Brief",
        body:
          "A thirty-minute call. What you want to say, who you're saying it to, the budget and the deadline.",
      },
      {
        n: "02",
        title: "Direction",
        body:
          "Moodboard, script and a locked look. You sign off on the aesthetic before a single frame is generated.",
      },
      {
        n: "03",
        title: "Generation",
        body:
          "We produce and show real progress, not promises. Iteration is cheap here — we use that in your favour.",
      },
      {
        n: "04",
        title: "Delivery",
        body:
          "Master in whatever formats you need, plus cutdowns for every platform. The files are yours to keep.",
      },
    ],
  },

  edge: {
    eyebrow: "05 — Studio",
    title: "Why it works",
    lead:
      "We don't sell technology. We sell the result of using it well — which is a different thing.",
    items: [
      {
        k: "Days, not months",
        v: "A finished spot in five to ten working days from approved brief.",
      },
      {
        k: "No set, no travel",
        v: "Impossible locations, other eras and scales that never fit inside a shooting budget.",
      },
      {
        k: "Changing your mind is cheap",
        v: "A new idea no longer costs a production day. We try, discard and try again.",
      },
      {
        k: "The same old craft",
        v: "Direction, writing, editing, colour. The tool is new; the discipline is a century old.",
      },
    ],
  },

  contact: {
    eyebrow: "06 — Contact",
    title: "Let's make something",
    lead:
      "Tell us what you have in mind. If there's a project in it, you'll hear back within 24 hours with an idea and a number.",
    form: {
      name: "Name",
      namePlaceholder: "What we should call you",
      email: "Email",
      emailPlaceholder: "where-we-reply@mail.com",
      company: "Company / project",
      companyPlaceholder: "Optional",
      type: "What you need",
      typeOptions: [
        "Commercial or campaign",
        "Social content",
        "Music film or art piece",
        "Avatar or presenter",
        "Not sure yet",
      ],
      message: "Tell us a little",
      messagePlaceholder:
        "What you want to say, who you're talking to and when you need it.",
      submit: "Send",
      submitting: "Sending…",
      success: "Done. You'll hear from us within 24 hours.",
      error: "That didn't go through. Message us on WhatsApp and we'll sort it.",
      required: "This field is required",
      invalidEmail: "Check the email address",
      tooShort: "Tell us a bit more",
    },
    whatsapp: "Message on WhatsApp",
    whatsappMessage: "Hi MOVA — I found you on the site and want to talk about a project.",
    or: "or",
    emailLabel: "Email",
  },

  footer: {
    tagline: "AI Creative Studio",
    rights: "All rights reserved.",
    backToTop: "Back to top",
    social: "Follow",
  },
};
