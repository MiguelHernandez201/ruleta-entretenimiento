// Genera los PNG que pide webOS a partir del logo de src/iconos.js:
// app/icon.png (80x80) y app/largeIcon.png (130x130).
// Uso: npm run iconos
import { writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { logoSvg } from '../src/iconos.js';
import { CATEGORIAS } from '../src/datos.js';

const svg = logoSvg(
  CATEGORIAS.map((c) => c.t1),
  { fondo: true },
);

for (const [archivo, lado] of [['icon.png', 80], ['largeIcon.png', 130]]) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: lado } }).render().asPng();
  writeFileSync(new URL(`../app/${archivo}`, import.meta.url), png);
  console.log(`app/${archivo} (${lado}x${lado})`);
}
