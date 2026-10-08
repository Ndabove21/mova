/**
 * Cómo creamos.
 *
 * Cada etapa lleva una visualización abstracta dibujada en SVG/CSS —no una
 * imagen— para que sea nítida a cualquier densidad y no sume descargas.
 * El texto vive en `src/i18n` (clave `process.steps[i]`).
 */
export type ProcessStep = {
  id: "idea" | "generate" | "refine" | "animate" | "deliver";
  n: string;
  /** Qué figura dibuja ProcessGlyph. */
  glyph: "sphere" | "scatter" | "facet" | "ribbon" | "cube";
};

export const PROCESS: ProcessStep[] = [
  { id: "idea", n: "01", glyph: "sphere" },
  { id: "generate", n: "02", glyph: "scatter" },
  { id: "refine", n: "03", glyph: "facet" },
  { id: "animate", n: "04", glyph: "ribbon" },
  { id: "deliver", n: "05", glyph: "cube" },
];
