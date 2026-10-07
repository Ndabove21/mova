# Deploy — MOVA

Vercel, un proyecto propio para este repo. Build estándar de Next.js: no hace
falta configuración especial.

## 1. Repo

```bash
git remote add origin <url-del-repo>
git push -u origin main
```

## 2. Vercel

1. **Add New → Project** → importar el repo.
2. Framework: **Next.js** (lo detecta solo). Build `npm run build`, output por defecto.
3. **Environment Variables** — cargar en Production y Preview:

   | Variable | Valor |
   |---|---|
   | `RESEND_API_KEY` | API key de resend.com |
   | `CONTACT_TO_EMAIL` | mail del estudio donde llegan las consultas |
   | `CONTACT_FROM_EMAIL` | remitente en un dominio verificado en Resend |

4. Deploy.

Auto-deploy desde `main`; cada branch o PR genera su preview.

## 3. Dominio

1. Vercel → Settings → Domains → agregar el dominio.
2. Apuntar el DNS como indique Vercel (`A 76.76.21.21` o el `CNAME` que muestre).
3. **Actualizar `SITE_URL` en `src/lib/site.ts`** con el dominio final y volver a
   deployar. De ahí salen el canonical, los `hreflang`, el Open Graph y el sitemap:
   si queda `mova.studio` por defecto, el SEO apunta a un dominio equivocado.

## 4. Resend

1. Crear cuenta en resend.com y **verificar el dominio** (registros SPF/DKIM).
2. Generar la API key y cargarla en Vercel.
3. `CONTACT_FROM_EMAIL` tiene que estar en el dominio verificado — si no, Resend rechaza el envío.
4. Probar con un envío real desde el formulario en producción.

## 5. Checklist post-deploy

- [ ] `/` redirige a `/es`; `/en` carga en inglés.
- [ ] El switcher de idioma mantiene al usuario en el sitio.
- [ ] Formulario: llega el mail y el **Reply-To** es el del visitante.
- [ ] Botón de WhatsApp abre el chat con el número correcto.
- [ ] `/sitemap.xml` y `/robots.txt` muestran el dominio real.
- [ ] Compartir el link en WhatsApp/LinkedIn y verificar que aparezca la imagen OG.
