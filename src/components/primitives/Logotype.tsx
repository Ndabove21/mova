import Image from "next/image";

/**
 * El logotipo de MOVA, aplanado.
 *
 * Es el mismo lockup que arma `MovaLockup.tsx` letra por letra, exportado a un
 * solo PNG. Acá conviene plano: a 15 px de alto en el nav, cuatro peticiones
 * de imagen por un logotipo no se pagan, y no hay animación que justifique
 * tener las piezas sueltas.
 *
 * Se regenera desde `public/images/letras/` — ver `media/LEEME.md`.
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
      src="/images/logo-mova.png"
      alt="MOVA"
      width={2527}
      height={449}
      sizes={sizes}
      priority={priority}
      className={`select-none ${className}`}
    />
  );
}
