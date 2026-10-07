# MOVA — AI Creative Studio

Sitio one-page bilingüe (ES/EN) del estudio. Next.js 16 (App Router) + React 19 +
Tailwind CSS v4 + TypeScript. Deploy pensado para Vercel.

Cinco bloques, en este orden: **hero · manifiesto · trabajos · servicios ·
contacto**. Sin dependencias de animación: sólo Lenis para el scroll.

```bash
npm install
npm run dev     # http://localhost:3000 → redirige a /es
npm run build
npm run start
```

---

## Identidad

Todo el sistema visual sale del isologo: **un eclipse**. Disco negro, canto de luz
cálida (oro) del lado derecho, canto frío (halo azul) del izquierdo. El sitio no
tiene "color de marca" plano: tiene vacío y luz de canto.

| Token | Valor | Para qué |
|---|---|---|
| `--color-void` | `#030305` | Fondo |
| `--color-void-2` | `#08080c` | Bandas y campos de formulario |
| `--color-ink` | `#f4efe8` | Texto principal (blanco cálido) |
| `--color-ink-dim` | `ink @ 70%` | Cuerpo de texto |
| `--color-ink-faint` | `ink @ 56%` | Eyebrows y micro-labels (mínimo que pasa AA) |
| `--color-gold` | `#e4b27a` | Luz cálida — acento, hover, foco |
| `--color-halo` | `#a6c6e2` | Luz fría — contrapunto |

Están en [`src/app/globals.css`](src/app/globals.css) dentro de `@theme`.
Tocá ahí y cambia todo el sitio.

**Una sola tipografía para todo el sitio**: **Schibsted Grotesk**, por
`next/font` (self-hosted, sin CDN), en tres pesos.

No hay serif, no hay segunda familia, no hay pareja tipográfica. Lo que ordena
la página es el **contraste de escala**: una etiqueta de 10px al lado de una
frase de 7rem, y mucho vacío entre las dos. La letra es deliberadamente calma
—lo extraño tiene que pasar en la composición, no en la tipografía—.

La clase `.text-eclipse` aplica el degradé metálico frío→cálido sobre texto y
se usa **una sola vez en todo el sitio**: la segunda línea del titular del
hero. Es el único momento en que una letra no es simplemente tinta sobre
negro.

### El isologo

`src/components/primitives/Wordmark.tsx` es **MOVA redibujado como vector**
(trazos monolineales geométricos, no una imagen). Se ve nítido en cualquier
tamaño y hereda los tokens de color.

> ⚠️ Es una reconstrucción a partir del PNG. Si existe el original en SVG/AI,
> reemplazalo y actualizá también `src/app/icon.svg` y el `<svg>` embebido en
> `src/app/[lang]/opengraph-image.tsx`.

---

## Lo surrealista

Un solo gesto, repetido dos veces: **el eclipse crece hasta no entrar en la
pantalla**. En el manifiesto y en el contacto la esfera asoma desde abajo,
demasiado grande para el cuadro que la contiene, y la frase se lee por dentro
de ella.

Magritte pintaba una manzana que ocupaba la habitación entera, y la pintaba
plano, sin efectos: lo irreal no está en cómo está hecho sino en la escala.
Acá es lo mismo — tipografía quieta, mucho negro, y un objeto fuera de lugar.

La escala del objeto se calcula contra el viewport (`vw`), no contra un ancho
fijo: con los valores de desktop, en un teléfono la cúpula caía debajo del
texto y el gesto se perdía.

## Movimiento

Lo mínimo para que la página respire. Sin librería de animación: todo es CSS
más un único `IntersectionObserver` en `layout/Reveals.tsx` que le pone
`.is-revealed` a cualquier cosa con `[data-reveal]`.

| Qué | Dónde |
|---|---|
| El canto del eclipse respira y un anillo fino deriva muy lento | Hero, manifiesto, contacto |
| Parallax: el eclipse del hero se hunde al scrollear | Hero |
| `LineReveal` — el titular entra línea por línea desde abajo del renglón | Hero, manifiesto |
| `Rule` — el filete de 1px se dibuja de izquierda a derecha | Footer |
| Bloques que suben al entrar en cuadro (`[data-reveal]`) | Todo el sitio |
| Scroll suave (Lenis) | Global |
| Grano de película y viñeta | Global |

Todo respeta `prefers-reduced-motion`.

---

## Estructura

```
src/
├── app/
│   ├── [lang]/              ← es | en (el layout raíz vive acá)
│   │   ├── layout.tsx       ← fuentes, metadata, hreflang, JSON-LD
│   │   ├── page.tsx         ← arma la one-page
│   │   ├── not-found.tsx
│   │   └── opengraph-image.tsx
│   ├── actions/contact.ts   ← server action del formulario (Resend)
│   ├── globals.css          ← tokens + utilidades de marca
│   ├── icon.svg · manifest.ts · robots.ts · sitemap.ts
├── components/
│   ├── layout/   Nav · Footer · SmoothScroll (Lenis) · Reveals
│   ├── sections/ Hero · Manifesto · Work · Services · Contact
│   └── primitives/ Wordmark · Eclipse · SectionHead · motion (LineReveal, Rule)
├── data/works.ts            ← el portfolio
├── i18n/                    ← es.ts · en.ts (todo el copy del sitio)
└── lib/site.ts              ← contacto, dominio, HERO_VIDEO
```

**Todo el texto del sitio está en `src/i18n/`.** No hay strings sueltos en los
componentes. `en.ts` está tipado contra `es.ts`: si agregás una clave en español
y no en inglés, no compila.

---

## Cargar los videos

### Reel de fondo del hero

1. Dejá el archivo en `public/video/hero.mp4` — mudo, loop, ≤1920px, **≤6 MB**
   (se descarga en toda visita).
2. Poné un poster en `public/img/hero-poster.jpg`.
3. En `src/lib/site.ts`:
   ```ts
   export const HERO_VIDEO = "/video/hero.mp4";
   export const HERO_POSTER = "/img/hero-poster.jpg";
   ```

El hero funciona perfecto sin video (queda el eclipse solo). El video es un plus.

### Portfolio

Editá `src/data/works.ts`. Por cada pieza, sacá `placeholder: true` y agregá:

```ts
{
  slug: "lanzamiento-x",
  title: { es: "Spot de lanzamiento", en: "Launch commercial" },
  client: "Nombre del cliente",
  year: 2026,
  category: "spot",          // spot | social | music | avatar
  aspect: "16/9",            // 16/9 | 9/16 | 4/5
  wide: true,                // opcional: destacada a ancho completo (21:9 en desktop)
  poster: "/img/work/lanzamiento-x.jpg",
  preview: "/video/lanzamiento-x-preview.mp4",   // loop mudo 4–8s, <2 MB
  full: { kind: "vimeo", src: "76979871" },      // o { kind: "file", src: "/video/..." }
}
```

- `preview` arranca en hover y en foco de teclado; `full` abre el modal.
- Si la pieza vive en Vimeo/YouTube no hace falta subir nada: `kind: "vimeo" | "youtube"` + el ID.
- Las tarjetas se acomodan en columnas (masonry), así que mezclar vertical y horizontal no rompe nada.
- Si reemplazás un archivo, **usá un nombre nuevo** para no pelear con el caché.

---

## Formulario de contacto

Server action en `src/app/actions/contact.ts`. Valida con Zod del lado del
servidor, tiene honeypot anti-bot y manda el mail por **Resend**.

Variables (ver `.env.example`):

```
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=...     # a dónde llegan las consultas
CONTACT_FROM_EMAIL=...   # remitente en un dominio verificado en Resend
```

Sin esas variables: en **desarrollo** el formulario simula un envío exitoso y
loguea la consulta en consola; en **producción** devuelve error y manda al
usuario a WhatsApp. Configurar Resend antes de publicar.

---

## Pendiente antes de publicar

- [ ] **Datos de contacto reales** en `src/lib/site.ts` — todo lo marcado `TODO_CLIENTE`
      (WhatsApp, mail, Instagram, dominio).
- [ ] **Resend** configurado y probado con un envío real.
- [ ] **Videos del portfolio** cargados (hoy son 6 slots con `placeholder: true`).
- [ ] **Reel del hero** si se decide usarlo.
- [ ] **Logo original** en vectorial, si existe.
- [ ] `SITE_URL` apuntando al dominio definitivo (afecta canonical, hreflang, OG y sitemap).

---

## Calidad verificada

- Build de producción limpio, TypeScript estricto sin errores.
- Peso de la home: ~247 KB comprimido (163 KB de JS, 46 KB de fuentes).
- **axe-core: 0 violaciones** WCAG 2.1 A/AA en `/es` y `/en`, desktop y mobile.
- Sin scroll horizontal en 390 / 768 / 1440 px.
- Navegación por teclado completa, skip link y foco visible en todo elemento interactivo.
- `prefers-reduced-motion` respetado: Lenis, grano, parallax, reveals, marquesina,
  brillos y cursor se apagan, y los textos con degradé vuelven a color sólido.
- SEO: canonical, `hreflang` es/en/x-default, Open Graph con imagen generada por idioma,
  Twitter cards, JSON-LD (`ProfessionalService` + `WebSite`), `sitemap.xml`, `robots.txt`.
