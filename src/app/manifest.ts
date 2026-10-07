import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MOVA — AI Creative Studio",
    short_name: "MOVA",
    description:
      "Estudio creativo que produce video con inteligencia artificial.",
    start_url: "/es",
    display: "standalone",
    background_color: "#030305",
    theme_color: "#030305",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
