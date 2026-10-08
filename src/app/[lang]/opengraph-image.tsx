import { ImageResponse } from "next/og";
import { isLocale } from "@/lib/site";
import { getDictionary } from "@/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MOVA — AI Creative Studio";

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "es");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          position: "relative",
          padding: 72,
        }}
      >
        {/* Resplandor cálido, arriba a la derecha */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(216,178,122,0.30) 0%, rgba(216,178,122,0.06) 45%, rgba(5,5,5,0) 70%)",
          }}
        />
        {/* Resplandor frío, abajo a la izquierda */}
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -180,
            width: 700,
            height: 700,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(143,185,216,0.20) 0%, rgba(143,185,216,0.04) 45%, rgba(5,5,5,0) 70%)",
          }}
        />

        {/* Eclipse */}
        <div
          style={{
            position: "absolute",
            top: 95,
            left: 460,
            width: 440,
            height: 440,
            borderRadius: 999,
            border: "3px solid rgba(216,178,122,0.55)",
            boxShadow:
              "0 0 60px rgba(216,178,122,0.28), inset 0 0 90px rgba(5,5,5,1)",
            background: "#050505",
          }}
        />

        <div style={{ display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <svg width="420" height="115" viewBox="0 0 875 240" fill="none">
            <defs>
              <linearGradient id="m" x1="0" y1="0.1" x2="1" y2="0.9">
                <stop offset="0%" stopColor="#456b85" />
                <stop offset="14%" stopColor="#8fb9d8" />
                <stop offset="40%" stopColor="#fffaf2" />
                <stop offset="68%" stopColor="#d8b27a" />
                <stop offset="100%" stopColor="#9a7338" />
              </linearGradient>
            </defs>
            <g stroke="url(#m)" strokeWidth="20" strokeLinejoin="miter" strokeMiterlimit="12">
              <polyline points="15,220 15,22 105,205 195,22 195,220" />
              <circle cx="320" cy="121" r="99" />
              <polyline points="460,22 545,218 630,22" />
              <polyline points="690,220 775,22 860,220" />
              <line x1="721" y1="152" x2="829" y2="152" />
            </g>
          </svg>

          <div
            style={{
              marginTop: 26,
              color: "rgba(242,240,234,0.62)",
              fontSize: 22,
              letterSpacing: 14,
              textTransform: "uppercase",
            }}
          >
            AI Creative Studio
          </div>

          <div
            style={{
              marginTop: 34,
              color: "#f2f0ea",
              fontSize: 40,
              letterSpacing: 6,
              textTransform: "uppercase",
              lineHeight: 1.18,
              maxWidth: 900,
            }}
          >
            {t.brand.claim}
          </div>
        </div>
      </div>
    ),
    size
  );
}
