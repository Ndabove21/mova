# Masters del cliente

Archivos originales que mandó MOVA. **No se sirven**: viven acá para poder
regenerar derivados cuando haga falta.

## `mova-logo-sting-source.mp4`

Isologo animado, 10s, 1280×720, con audio. Fue la recepción del sitio por un
rato y se sacó: a 1280 de ancho, el hero lo pintaba a 2880 px físicos en una
pantalla retina (2,25× de escalado) y se veía blando. No es culpa de la
compresión — los derivados daban SSIM 0,993 contra este master—, es la
resolución de origen.

Hoy la recepción es el isologo **renderizado en vectores**
(`src/components/primitives/LogoSting.tsx`): nítido a cualquier densidad y sin
1,2 MB de descarga. Si llega un master en 2560 o 3840, vuelve a convenir el
video: ver las instrucciones en `src/lib/site.ts`.

## `mova-logo-alta-damero.jpg`

Isologo en alta (2752×1536) con el **damero de transparencia quemado en
píxeles**: es un JPEG, no tiene canal alfa. Encima, el trazo del logo quedó
semitransparente, así que el damero se ve *a través* del metal.

Se intentó recuperar el alfa resolviendo `O = α·C + (1−α)·B` contra la grilla
—que mide 45,868 px, no 46, y se corre 7,8 px a lo ancho de la imagen—. El
fondo sale limpio, pero adentro de las letras la textura del metal y el damero
comparten frecuencia espacial y no se separan: queda fantasma.

**Lo que hace falta pedirle al cliente**, en orden de preferencia:

1. El logo **sobre fondo negro sólido** (`#030305`). Para este sitio es lo
   ideal: no hace falta transparencia y la calidad es perfecta.
2. Un **PNG con canal alfa real** (no un JPEG con damero dibujado).
3. El **vectorial** (SVG o AI). Es lo mejor de todo: sirve para el isologo del
   nav, el favicon y la imagen de Open Graph al mismo tiempo.

> Ojo: esta imagen en alta muestra que el vector dibujado a mano en
> `Wordmark.tsx` **no reproduce las letras reales**. En el logo del cliente la
> M tiene el vértice del medio redondeado (no en punta) y la A no lleva barra
> transversal. Con un archivo limpio se puede redibujar fiel.

## `logo21-source.mp4`

Segunda animación del isologo, la buena: 10s, 1280×720, con audio. **De acá
sale el logotipo que usa el sitio.**

El PNG con transparencia (`public/images/logo21-mark.png`) se extrajo así:

1. **Mediana temporal del clip.** Las partículas se mueven y las letras no, así
   que la mediana de ~50 cuadros las borra y deja el logotipo limpio.
2. **Clave de luminancia contra el negro.** Acá sí es una clave exacta: el
   fondo es negro puro, así que el alfa ES la luminancia. Nada que ver con el
   problema del damero.

```bash
ffmpeg -ss 4 -t 6 -i media/logo21-source.mp4 -vf "fps=8,scale=1280:-1" fr/f%03d.png
# después: mediana por píxel + clave de luminancia (ver historial de git)
```

Las zonas oscuras del metal quedan semitransparentes, que es lo correcto sobre
el negro del sitio. **Para fondos claros sigue haciendo falta el vectorial.**

## Por qué no se usó `mova-logo-alta-damero.jpg` (alias `logo21.jpg`)

Es el de mayor resolución (2752×1536) y por eso se intentó varias veces. No se
pudo:

- La grilla del damero mide **45,8679 px**, no 46, y arranca en x=44,87 /
  y=38,87. Con esa medida exacta el fondo se recupera perfecto: donde no hay
  logo, el residuo contra la grilla da **1,8** sobre 255.
- El problema es el logo en sí: **se exportó semitransparente**. El damero se
  ve *a través* del metal, así que el gris del fondo queda mezclado con el
  color real y su textura comparte frecuencia espacial con la grilla.
- Restando iterativamente la componente correlacionada con el damero (ventana
  de un período, 5 pasadas) el residuo baja de **15,3 a 1,3** — un 92% menos—,
  pero el fantasma sigue siendo visible a tamaño de portada.

**Lo que hay que pedir**, en orden de preferencia:

1. El **vectorial** (SVG o AI). Resuelve logotipo, favicon y Open Graph de una.
2. El logo **sobre fondo negro sólido** (`#050505`). Para este sitio alcanza y
   la calidad es perfecta.
3. Un **PNG con canal alfa real** — no un JPEG con el damero dibujado encima.


## `letras-fuente/` — las piezas del logotipo

Las cuatro letras que mandó el cliente, cada una sobre un damero de
transparencia quemado en píxeles. **De acá sale el logotipo del sitio.**

A diferencia del lockup completo, estas piezas son **opacas**, así que el
damero sólo está alrededor y el recorte es exacto:

1. El damero es neutro y claro (tonos ~208 y ~254, saturación cero); el metal
   es saturado y/o oscuro. Esa doble condición separa fondo de letra sin tocar
   la geometría.
2. Una **apertura morfológica** mata la mota que deja el ruido de compresión
   en el damero, y el resultado se usa como compuerta del alfa fino, que es el
   que conserva el antialias del borde.
3. Se desmultiplica contra el gris del fondo para que el canto no quede claro.

Resultado en `public/images/letras/` con un alfa residual en el fondo de
0,0013 sobre 1.

El lockup aplanado (`public/images/logo-mova.png`) se compone desde esas
cuatro piezas con las proporciones que documenta `MovaLockup.tsx`.

## `mova-logo-alfa.png`

El lockup completo exportado **con canal alfa real** (2752×1536, 88%
transparente). Es mejor que el JPEG con damero, pero el RGB todavía arrastra
cuadros del damero donde el logo era semitransparente, así que no se usa.

## `publicidad-modulos-master.mov`

**Material real del cliente**: comercial de módulos habitacionales en montaña.
2560×1440, 60 fps, 34,8s, HEVC, 88 MB. Está en `.gitignore` por peso; los
derivados optimizados sí están versionados:

```bash
# Showreel (sólo se descarga al hacer click)
ffmpeg -i media/publicidad-modulos-master.mov -vf "scale=1920:-2,fps=30" \
  -c:v libx264 -crf 25 -preset slow -c:a aac -b:a 128k \
  -movflags +faststart public/videos/showreel.mp4

# Loop mudo para el hover de la tarjeta
ffmpeg -ss 7 -t 6 -i media/publicidad-modulos-master.mov \
  -vf "scale=1280:-2,fps=25" -an -c:v libx264 -crf 28 public/videos/project-01.mp4
```
