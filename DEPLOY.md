# Deploy — MOVA

Hostinger **Business Web Hosting** (compartido, no VPS), cuenta
`u375507609`, dominio `mova.valisconsulting.com` (subdominio de
valisconsulting.com, mismo hosting). Corre con **CloudLinux Node Selector +
Passenger**, el mismo patrón que ya usan `ayrton.valisconsulting.com` y
`norte.valisconsulting.com` en esta cuenta.

No es un VPS: no hay PM2 ni nginx. Passenger (parte de LiteSpeed/Apache)
arranca el proceso de Node directamente a partir de un `.htaccess`.

---

## Carpetas en el servidor

```
~/domains/mova.valisconsulting.com/
├── public_html/
│   └── .htaccess          ← wiring de Passenger (abajo)
└── nodejs/                 ← la app en sí. Esto es lo que se reemplaza en
                               cada deploy — Passenger lo lee a partir del
                               .htaccess, nunca desde public_html/.
    ├── server.js            ← entry point (next build --output standalone)
    ├── package.json
    ├── node_modules/        ← autocontenido, lo genera el build
    ├── public/               ← copiado de /public del repo
    ├── .next/
    │   └── static/           ← copiado de .next/static del build
    └── tmp/
        └── restart.txt      ← tocar este archivo reinicia Passenger
```

---

## Opción A — Deploy manual (la que se usó para el primer deploy)

Cuando el SSH de la cuenta está saturado (hosting compartido con cuota de
procesos/memoria — ver "Problema conocido" más abajo) esta es la vía que
funciona siempre, porque no depende de una sesión SSH estable.

**1. Generar el paquete, en local:**

```bash
cd mova
rm -rf .next
npm run build
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static

# Probar que levanta EXACTAMENTE como va a correr en el servidor:
cd .next/standalone && PORT=4557 node server.js
# otra terminal: curl -I http://localhost:4557/es  → tiene que dar 200
# Ctrl+C para cortar

cd .next/standalone
zip -rq ~/Desktop/mova-nodejs.zip . -x ".*"
```

**2. Subir por hPanel:**

1. hPanel → **Archivos → Administrador de archivos**
2. Navegar a `domains/mova.valisconsulting.com/`
3. Si ya existe una carpeta `nodejs/` de un deploy anterior, renombrarla
   (ej. `nodejs.anterior`) en vez de borrarla — por si hay que volver atrás.
4. Crear una carpeta `nodejs` vacía y entrar en ella
5. **Subir archivo** → `mova-nodejs.zip`
6. Click derecho sobre el zip subido → **Extraer**
7. Borrar el .zip una vez extraído (no debe quedar en el servidor)

**3. Escribir el `.htaccess`:**

Ir a `domains/mova.valisconsulting.com/public_html/`, crear/editar
`.htaccess` con **exactamente** este contenido:

```apache
# MOVA — Next.js standalone bajo Passenger.
# Mismo patrón que ayrton.valisconsulting.com (esta cuenta).
PassengerAppRoot /home/u375507609/domains/mova.valisconsulting.com/nodejs
PassengerAppType node
PassengerNodejs /opt/alt/alt-nodejs22/root/bin/node
PassengerStartupFile server.js
PassengerBaseURI /
PassengerRestartDir /home/u375507609/domains/mova.valisconsulting.com/nodejs/tmp
SetEnv NODE_ENV production
SetEnv LSNODE_CONSOLE_LOG console.log
SetEnv TOKIO_WORKER_THREADS 2
```

**4. Reiniciar Passenger:**

Dentro de `domains/mova.valisconsulting.com/nodejs/`, crear una carpeta
`tmp` si no existe, y dentro un archivo vacío `restart.txt` (Nuevo archivo →
`restart.txt`, sin contenido). Tocar ese archivo en cada deploy es lo que le
avisa a Passenger que recargue.

**5. Verificar:**

```
https://mova.valisconsulting.com/es   → tiene que cargar el sitio
```

Si da 503 o error de Passenger, revisar `nodejs/stderr.log` (Administrador
de archivos, o descargarlo) — ahí queda el motivo.

---

## Opción B — Deploy por SSH (más rápido cuando la cuenta no está saturada)

```bash
ssh -p 65002 u375507609@46.202.145.49
cd ~
rm -rf mova-build
git clone --depth 1 https://github.com/Ndabove21/mova.git mova-build
cd mova-build
export PATH=/opt/alt/alt-nodejs22/root/bin:$PATH
npm ci
npm run build          # si Turbopack falla (ver abajo), usar: npx next build --webpack

rm -rf ~/domains/mova.valisconsulting.com/nodejs
mkdir -p ~/domains/mova.valisconsulting.com/nodejs
cp -r .next/standalone/. ~/domains/mova.valisconsulting.com/nodejs/
cp -r public ~/domains/mova.valisconsulting.com/nodejs/public
cp -r .next/static ~/domains/mova.valisconsulting.com/nodejs/.next/static
mkdir -p ~/domains/mova.valisconsulting.com/nodejs/tmp
touch ~/domains/mova.valisconsulting.com/nodejs/tmp/restart.txt
```

El `.htaccess` (igual que en la Opción A) sólo hace falta escribirlo una vez;
un redeploy no lo toca.

---

## Problema conocido: la cuenta se queda sin recursos durante el build

**Síntoma:** a mitad de un `npm run build` en el servidor, las conexiones SSH
nuevas empiezan a fallar con `Connection closed by remote host` o
`exec request failed on channel 0`, y no vuelven hasta que el build termina
o muere.

**Causa:** Business Web Hosting es compartido, con límites de
procesos/memoria por cuenta (CloudLinux LVE). El build de Next —sobre todo
con **Turbopack**, el bundler por default desde Next 16— puede agotar esa
cuota: en el primer deploy, Turbopack directamente colgó compilando
`globals.css` (timeout esperando un subproceso), y el webpack build de
respaldo tardó tanto y usó tantos recursos que tumbó el SSH de la cuenta
durante varios minutos.

**Por eso la Opción A es la que más conviene en este hosting**: el build
corre en una máquina con recursos normales (tu local), y al servidor sólo
sube el resultado ya compilado — nunca corre `npm run build` ahí.

Si de todas formas se necesita compilar en el servidor (Opción B) y
Turbopack se cuelga, usar `npx next build --webpack`. Sigue siendo más lento
y más pesado que buildear en local.

---

## Variables de entorno — formulario de contacto

El formulario (Server Action, usa Resend) necesita estas tres variables.
**Hoy no están configuradas** — el formulario funciona pero no envía mail
hasta que se carguen:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=...
CONTACT_FROM_EMAIL=...
```

En Passenger/hPanel no hay un `.env` que se lea solo: hay que agregarlas al
`.htaccess` como `SetEnv NOMBRE valor` (una línea por variable, junto a las
que ya están) y volver a tocar `tmp/restart.txt`.

---

## Dominio y SSL

`mova.valisconsulting.com` ya está creado como subdominio en esta cuenta —
el DNS y el certificado SSL los maneja Hostinger automáticamente porque
`valisconsulting.com` ya usa sus nameservers. No hay nada que configurar
aparte de lo de arriba.
