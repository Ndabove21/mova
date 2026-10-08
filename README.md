# MOVA — AI Creative Studio

Landing cinematográfica del estudio. Next.js 16 (App Router) + React 19 +
TypeScript + Tailwind CSS v4 + Framer Motion. Bilingüe ES/EN. Deploy en Vercel.

```bash
npm install
npm run dev     # http://localhost:3000 → redirige a /es
npm run build
npm run start
```

---

## El criterio

Una productora del futuro que trabaja para marcas premium. El registro es
**A24 + fashion film studio + editorial de lujo + ciencia ficción elegante** —
explícitamente **no** una startup de IA: nada de robots, circuitos, cerebros,
dashboards ni glassmorphism.

Dos reglas sostienen todo lo demás:

1. **El oro y el azul son iluminación, no relleno.** Aparecen como canto de
   luz, acento de hover, foco o halo difuso. Nunca como fondo de un bloque ni
   como color de un párrafo.
2. **La serif sólo en titulares grandes.** Bodoni Moda es una didona de alto
   contraste: a 7rem es editorial de lujo, a 15px es ilegible.

---

## Identidad

| Token | Valor | Para qué |
|---|---|---|
| `bg-black` | `#050505` | Fondo |
| `bg-black-2` / `bg-black-3` | `#080808` / `#0b0b0b` | Bandas y campos |
| `text-ink` | `#f2f0ea` | Texto principal |
| `text-ink-dim` | `ink @ 70%` | Cuerpo |
| `text-ink-faint` | `ink @ 55%` | Etiquetas y micro-texto |
| `text-gray` | `#777777` | Sólo texto grande (en cuerpo no pasa AA) |
| `text-gold` | `#d8b27a` | Luz cálida: acento, hover, foco |
| `text-silver` | `#bfc5cc` | Metal frío |
| `text-blue` | `#8fb9d8` | Contrapunto frío |
| `border-line` / `border-line-soft` | ink 10% / 5.5% | Filetes |

Todo vive en `@theme` dentro de [`src/app/globals.css`](src/app/globals.css).
**No hay `tailwind.config`**: Tailwind v4 es CSS-first. Tocás ahí y cambia el
sitio entero.

**Tipografías**, ambas self-hosted por `next/font` (sin CDN):
**Schibsted Grotesk** para todo lo que se lee y **Bodoni Moda** para los
titulares.

### El isologo

El cliente mandó la **M, el aro, la V y la A como piezas sueltas**, así que el
logotipo no es una imagen: se arma.

- **En la portada**, `MovaLockup.tsx` compone las cuatro letras y las hace
  entrar una por una. La portada se construye delante del visitante en vez de
  aparecer hecha.
- **En el nav y el footer**, el mismo lockup aplanado a un PNG
  (`logo-mova.png`). A 15 px de alto, cuatro peticiones de imagen no se pagan.

Las proporciones no son un reparto en partes iguales — salen de medir las
piezas y ajustar a ojo:

- La **O va un 7% más alta**. Es un círculo, y un círculo a la misma altura que
  una letra de remates rectos se ve más chico.
- El par **V–A lleva un espacio negativo**. Son dos diagonales que se abren en
  direcciones opuestas, así que el hueco óptico entre ellas es mucho mayor que
  el real; sin meterlas una dentro de la otra, "MOVA" se lee "MOV A".

Para regenerar el lockup plano desde las letras, ver `media/LEEME.md`.

### El fondo: metal fundido

`MoltenMetal.tsx` es un fragment shader de WebGL2 —sin three.js, que serían
~150 KB para dibujar un cuadrado— con ruido fractal, deformación de dominio y
un realce especular sobre los pliegues. Va en el **hero** y en la **sección 05**.

No es decoración: el isologo de MOVA ES metal, así que el campo detrás es la
misma materia extendida a la pantalla.

Tres cuidados, porque es un fondo y no puede comerse la página:

- Se pinta a resolución reducida (`quality`), se detiene fuera de pantalla y
  con la pestaña oculta, y con `prefers-reduced-motion` dibuja un solo cuadro.
- En el hero va **enmascarado** para no entrar al centro: ahí va el logotipo y
  necesita negro limpio detrás.
- Si no hay WebGL2 cae a un degradé CSS en vez de romper.

Se evaluó también un mosaico de vidrio (`GlassTiles.tsx`, queda en el repo como
alternativa): se descartó porque la retícula es geométrica y regular, y leía
como patrón de interfaz en vez de material.

---

## Estructura de la página

Nueve bloques numerados, como planos de un guion técnico:

| | Sección | Qué hace |
|---|---|---|
| | `Navbar` | Transparente sobre el hero; se vuelve sólida al scrollear |
| 01 | `Hero` | Metal fundido + planeta eclipsado + isologo animado + WATCH SHOWREEL |
| | `IntroSection` | WE CREATE WHAT DOESN'T EXIST — imagen a sangre |
| 02 | `Services` | Cinco verticales tipo thumbnail de productora |
| 03 | `RealityMova` | Comparador arrastrable REALITY → GENERATED |
| 04 | `SelectedWork` | Portfolio editorial con modal de video |
| 05 | `Immersive` | Metal fundido recortado en una silueta orgánica, reacciona al puntero |
| 06 | `Process` | IDEA → GENERATE → REFINE → ANIMATE → DELIVER |
| 07 | `About` | Imagen editorial vertical + manifiesto corto |
| 08 | `FinalCTA` | El último plano antes de los créditos |
| | `Footer` | |

**El contacto no es una sección: es una capa.** Todos los "START A PROJECT" del
sitio abren el mismo overlay (`ContactOverlay`), que se carga en diferido. Así
la home conserva la secuencia pedida sin perder la captura de consultas.

---

## Componentes

```
src/
├── app/
│   ├── [lang]/              ← es | en (el layout raíz vive acá)
│   │   ├── layout.tsx       ← fuentes, metadata, hreflang, JSON-LD, providers
│   │   ├── page.tsx         ← arma la secuencia de bloques
│   │   ├── not-found.tsx · opengraph-image.tsx
│   ├── actions/contact.ts   ← server action del formulario (Zod + Resend)
│   ├── globals.css          ← tokens + utilidades + revelados
│   └── icon.svg · manifest.ts · robots.ts · sitemap.ts
├── components/
│   ├── layout/   Navbar · Footer · ContactProvider · SmoothScroll · Reveals
│   ├── sections/ Hero · IntroSection · Services · RealityMova · SelectedWork
│   │             Immersive · Process · About · FinalCTA · ContactOverlay
│   └── primitives/
│       Wordmark · Eclipse · LogoSting     ← la marca
│       MagneticButton · RevealText        ← acción y texto
│       CineImage · VideoCard              ← media
│       CustomCursor · SectionLabel · ProcessGlyph · PlaceholderTag · motion
├── data/        services · works · process   ← sólo media e ids
├── i18n/        en.ts (fuente) · es.ts       ← TODO el texto
└── lib/site.ts  ← contacto, dominio, flags
```

### Las primitivas que importan

- **`MagneticButton`** — todos los CTA pasan por acá. El botón se corre hacia el
  puntero y la etiqueta lo sigue un poco menos. No escribas botones a mano.
- **`RevealText`** — titulares que entran línea por línea resolviendo un
  desenfoque. Cada entrada del array es una línea: dónde corta es decisión de
  composición, no del navegador.
- **`CustomCursor`** — punto de 8px + anillo que lo persigue. Los elementos se
  declaran con `data-cursor="link|button|media"` y `data-cursor-label`.
- **`VideoCard`** — poster en reposo, loop en hover. `preload="none"` a
  propósito: una grilla que precargara video serían varios MB sin que nadie
  toque nada.

---

## Bilingüe

Rutas `/es` y `/en`. El criterio:

**Todo se traduce**: etiquetas, titulares, rubros, CTA y formulario. La única
palabra que no cambia es el nombre de la marca.

Los **títulos de las piezas** del portfolio viven en `src/data/works.ts` y no en
el diccionario, porque son nombres propios de cada trabajo —como el título de
una película—. Las **categorías** sí salen del diccionario: son taxonomía del
sitio, así que siguen el idioma elegido.

Todo el texto está en [`src/i18n/`](src/i18n/). `en.ts` es la fuente y `es.ts`
está tipado contra él: si agregás una clave en uno y no en el otro, no compila.

---

## Las imágenes y los videos

**Material real del cliente** (no reemplazar):

| Archivo | Qué es |
|---|---|
| `images/letras/{M,O,V,A}.png` | Las cuatro piezas del logotipo, recortadas |
| `images/logo-mova.png` | El lockup aplanado, generado desde las anteriores |
| `videos/showreel.mp4` | El comercial de módulos, 35s |
| `videos/project-01.mp4` | Loop de hover de esa misma pieza |
| `images/work-01.jpg` · `poster-showreel.jpg` · `poster-project-01.jpg` · `cta.jpg` | Fotogramas del comercial |

**El resto de `public/images` y `public/videos` es placeholder generado**: abstracto, en la paleta de la marca, para sostener la maqueta hasta
que llegue el material real. Con `SHOW_PLACEHOLDER_LABELS = true` en
`src/lib/site.ts` cada media lleva una etiqueta discreta con su nombre de
archivo, para saber exactamente qué reemplazar. Apagá el flag cuando entren los
assets definitivos.

| Archivo | Qué tiene que ser |
|---|---|
| `images/hero.jpg` | Planeta/esfera eclipsada vista desde el espacio |
| `images/intro.jpg` + `videos/intro.mp4` | Persona flotando bajo agua, reflejos azules y dorados |
| `images/service-01..05.jpg` | Verticales: film, comercial, mundo, personaje, social |
| `images/reality.jpg` | Foto real: auto en un paisaje desértico |
| `images/generated.jpg` | **La misma escena** transformada. El encuadre tiene que coincidir o el comparador no funciona |
| `images/work-01..04.jpg` | Portfolio. La 01 es la pieza grande |
| `images/immersive.jpg` | Forma 3D abstracta, negra y metálica |
| `images/about.jpg` | Vertical: figura caminando en un paisaje surrealista |
| `images/cta.jpg` | Montañas oscuras + columna de luz dorada |
| `videos/showreel.mp4` | El showreel del estudio |
| `videos/project-01.mp4` | La pieza 01 completa |
| `images/logo21-mark.png` | **Material real**: el logotipo extraído de ese video |

Para cada video conviene además un poster (`images/poster-*.jpg`) con el mismo
encuadre que el primer frame.

**Presupuesto de peso:** el hero se descarga en toda visita. Todo lo demás es
`loading="lazy"` y los videos `preload="none"`.

---

## Formulario de contacto

Server action en [`src/app/actions/contact.ts`](src/app/actions/contact.ts):
valida con Zod del lado del servidor, tiene honeypot anti-bot y manda por
**Resend**.

```
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=...     # a dónde llegan las consultas
CONTACT_FROM_EMAIL=...   # remitente en un dominio verificado en Resend
```

Sin esas variables: en desarrollo simula un envío exitoso y loguea la consulta
en consola; en producción devuelve error y manda a WhatsApp.

---

## Pendiente antes de publicar

- [ ] **Material real** — todas las imágenes y videos son placeholders.
- [ ] **Datos de contacto** en `src/lib/site.ts` (todo lo marcado `TODO_CLIENTE`).
- [ ] **Resend** configurado y probado con un envío real.
- [ ] **Logo limpio** — ver `media/LEEME.md`.
- [ ] `SHOW_PLACEHOLDER_LABELS = false`.

## Calidad verificada

- Build de producción limpio, TypeScript estricto sin errores.
- **axe-core: 0 violaciones** WCAG 2.1 AA en `/es` y `/en`, a 390 / 768 / 1440.
- Sin scroll horizontal en 390 / 768 / 1024 / 1440 / 1920.
- 60 fps con los dos canvas de WebGL montados.
- Peso de la home: **~1 MB** comprimido. El showreel (11 MB) sólo se descarga
  al hacer click.
- Interacciones probadas: comparador por teclado, modal de proyecto, capa de
  contacto, envío del formulario, cierre con Escape.
- [ ] `SITE_URL` con el dominio definitivo (afecta canonical, hreflang, OG y sitemap).
