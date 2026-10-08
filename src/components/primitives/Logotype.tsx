import Image from "next/image";

/**
 * El logotipo de MOVA.
 *
 * Es un PNG con transparencia extraído del render que mandó el cliente
 * (`media/logo21-source.mp4`): se promedió temporalmente el video para borrar
 * las partículas —se mueven, las letras no— y después se recortó contra el
 * negro, que acá es una clave exacta y no una estimación.
 *
 * Reemplaza al vector dibujado a mano, que no reproducía las letras reales:
 * en el logotipo del cliente la M tiene el vértice del medio curvo y la A es
 * una Λ con swash, no una A con barra.
 *
 * Las zonas oscuras del metal quedan semitransparentes, que es lo correcto
 * sobre el negro del sitio. Para fondos claros hace falta el vectorial —ver
 * `media/LEEME.md`—.
 */
export function Logotype({
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 60vw, 240px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src="/images/logo21-mark.png"
      alt="MOVA"
      width={2354}
      height={504}
      sizes={sizes}
      priority={priority}
      className={`select-none ${className}`}
    />
  );
}
