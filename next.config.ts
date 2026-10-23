import type { NextConfig } from "next";

/**
 * output: "standalone" — produce un server.js autocontenido que Passenger
 * puede arrancar directo, sin necesitar el árbol completo de node_modules de
 * desarrollo en el servidor. Es el mismo patrón que ya corre en
 * ayrton.valisconsulting.com y norte.valisconsulting.com, en esta misma
 * cuenta de Hostinger (CloudLinux Node Selector + Passenger).
 *
 * images.unoptimized: true — el hosting es compartido (Business, no VPS), con
 * cuotas de CPU/memoria por proceso. El optimizador de next/image necesita
 * sharp (binario nativo) o cae a un fallback WASM más lento; en un entorno
 * con esas cuotas, resize on-demand es un punto de fallo que no vale la pena
 * correr. Todas las imágenes del sitio ya salen pre-optimizadas al tamaño que
 * se sirven (ver README, sección "Las imágenes y los videos"), así que
 * desactivar el optimizador en runtime no cuesta calidad acá.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560],
  },
  async redirects() {
    return [{ source: "/", destination: "/es", permanent: false }];
  },
};

export default nextConfig;
