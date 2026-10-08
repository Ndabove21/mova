import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MOVA — AI Creative Studio",
    short_name: "MOVA",
    description:
      "AI creative studio. Films, commercials, visual worlds and digital characters.",
    start_url: "/es",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
