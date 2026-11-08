// Empaqueta, instala y lanza la app en el TV con el CLI de webOS (ares-*).
// Uso: node scripts/tv.mjs <empaquetar|instalar|lanzar|desplegar|inspeccionar>
// El dispositivo por defecto es "tv" (ver ares-setup-device); se cambia con la variable de entorno TV.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const appinfo = JSON.parse(readFileSync(new URL('../app/appinfo.json', import.meta.url), 'utf8'));
const dispositivo = process.env.TV ?? 'tv';
const ipk = `dist/${appinfo.id}_${appinfo.version}_all.ipk`;
const [accion] = process.argv.slice(2);

const ejecutar = (comando) => {
  console.log(`\n> ${comando}`);
  execSync(comando, { stdio: 'inherit' });
};

const acciones = {
  // Solo la app web: no necesita servicio Node.js.
  empaquetar: () => ejecutar('ares-package app -o dist'),
  instalar: () => ejecutar(`ares-install --device ${dispositivo} ${ipk}`),
  lanzar: () => ejecutar(`ares-launch --device ${dispositivo} ${appinfo.id}`),
  inspeccionar: () => ejecutar(`ares-inspect --device ${dispositivo} --app ${appinfo.id} --open`),
};
acciones.desplegar = () => {
  acciones.empaquetar();
  acciones.instalar();
  acciones.lanzar();
};

if (!acciones[accion]) {
  console.error(`Uso: node scripts/tv.mjs <${Object.keys(acciones).join('|')}>`);
  process.exit(1);
}

try {
  acciones[accion]();
} catch {
  process.exit(1);
}
