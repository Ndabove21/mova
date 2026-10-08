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

### El claim

El isologo animado que mandó el cliente trae una línea que no estaba en el
brief: **"Create beyond reality."**. Está en el footer, en inglés en las dos
versiones del sitio — es parte de la marca, no un texto a traducir.

### El isologo

`src/components/primitives/Wordmark.tsx` es **MOVA redibujado como vector**
(trazos monolineales geométricos, no una imagen). Se ve nítido en cualquier
tamaño y hereda los tokens de color.

> ⚠️ Es una reconstrucción y **no reproduce las letras reales**. La versión en
> alta que mandó el cliente (`media/mova-logo-alta-damero.jpg`) muestra que su
> M tiene el vértice del medio redondeado, no en punta, y que la A no lleva
> barra transversal. Con un archivo limpio se puede redibujar fiel; habría que
> actualizar también `src/app/icon.svg`, el `<svg>` de
> `src/app/[lang]/opengraph-image.tsx` y `LogoSting.tsx`.

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

### La recepción

El sitio **abre con el isologo a pantalla completa**, renderizado en vectores
(`src/components/primitives/LogoSting.tsx`). Es la primera pantalla entera:
trazo metálico, un reflejo que lo cruza y partículas en canvas derivando por
detrás. Abajo, el descriptor y el claim.

Después queda fijo (`sticky`) durante la primera pantalla y media: la frase del
estudio entra montada encima mientras un velo negro sube con el scroll, hasta
apagarlo justo cuando arranca el manifiesto — *"todo lo que ves empieza en
negro"*.

**Por qué renderizado y no el video del cliente.** El master del isologo
animado es 1280×720 y el hero lo pintaba a 2880 px físicos en una pantalla
retina: 2,25× de escalado, y se veía blando. No era la compresión —los
derivados daban SSIM 0,993 contra el master—, era la resolución de origen.
Renderizarlo resuelve las tres cosas a la vez:

- **Nítido a cualquier densidad.** Son trazos y gradientes, no píxeles.
- **1,2 MB menos.** La home pasó de ~1,5 MB a ~250 KB.
- **El descriptor y el claim son texto de verdad**, no píxeles quemados: ahora
  los lee Google y los lee un lector de pantalla.

El master sigue en `media/` con sus notas. Si algún día llega uno en 2560 o
3840, volver al video es cambiar `HERO_MODE` a `"video"` y regenerar los
derivados — las instrucciones están en `src/lib/site.ts`.

El reflejo y las partículas se detienen con el botón de pausa (WCAG 2.2.2) y no
arrancan con `prefers-reduced-motion`; el canvas además se congela cuando la
recepción sale de pantalla.

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
- [ ] **Logo limpio** — ver `media/LEEME.md`. Sobre fondo negro sólido, PNG con
      alfa real o, mejor, el vectorial. El que hay tiene el damero quemado.
- [ ] **Logo original** en vectorial, si existe.
- [ ] `SITE_URL` apuntando al dominio definitivo (afecta canonical, hreflang, OG y sitemap).

---

## Calidad verificada

- Build de producción limpio, TypeScript estricto sin errores.
- Peso de la home: ~250 KB comprimido (164 KB de JS, 46 KB de fuentes). Sin video.
- La recepción corre a 60 fps.
- **axe-core: 0 violaciones** WCAG 2.1 A/AA en `/es` y `/en`, desktop y mobile.
- Sin scroll horizontal en 390 / 768 / 1440 px.
- Navegación por teclado completa, skip link y foco visible en todo elemento interactivo.
- `prefers-reduced-motion` respetado: Lenis, grano, parallax, reveals, marquesina,
  brillos y cursor se apagan, y los textos con degradé vuelven a color sólido.
- SEO: canonical, `hreflang` es/en/x-default, Open Graph con imagen generada por idioma,
  Twitter cards, JSON-LD (`ProfessionalService` + `WebSite`), `sitemap.xml`, `robots.txt`.
