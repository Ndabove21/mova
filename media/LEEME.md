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
