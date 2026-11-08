// Íconos de las categorías (SVG 64x64 dibujados a mano).
// - Las partes blancas usan fill="#fff".
// - Los detalles oscuros usan currentColor: cada tarjeta lo tiñe con el tono de
//   su categoría (propiedad CSS `color`).
// - Sin <defs> ni ids: el mismo ícono aparece muchas veces en la página.
// Este archivo no importa CSS para que scripts/iconos.mjs pueda usarlo en Node.

const svg = (contenido) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true">${contenido}</svg>`;

const destello = (x, y, r, color = '#fff') =>
  `<path fill="${color}" d="M${x} ${y - r}l${r * 0.3} ${r * 0.7} ${r * 0.7} ${r * 0.3}-${r * 0.7} ${r * 0.3}-${r * 0.3} ${r * 0.7}-${r * 0.3}-${r * 0.7}-${r * 0.7}-${r * 0.3} ${r * 0.7}-${r * 0.3}z"/>`;

export const ICONOS = {
  // Control de videojuegos con cruceta y cuatro botones de colores.
  videojuegos: svg(`
    <path d="M32 20v-5c0-3 2-5 5-5h4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
    <path fill="#fff" d="M19 20h26c7.5 0 13 5.2 14.6 12.6l2.2 10.6c1.1 5.5-2.8 10.3-8.1 10.3-3.2 0-5.9-1.8-7.4-4.6L44.6 46H19.4l-1.7 2.9c-1.5 2.8-4.2 4.6-7.4 4.6-5.3 0-9.2-4.8-8.1-10.3l2.2-10.6C6 25.2 11.5 20 19 20z"/>
    <path fill="currentColor" d="M17 29h4v5h5v4h-5v5h-4v-5h-5v-4h5z"/>
    <rect x="27.5" y="26" width="9" height="3" rx="1.5" fill="currentColor" opacity=".35"/>
    <circle cx="45" cy="30.5" r="2.9" fill="#ffd23f"/>
    <circle cx="50.5" cy="36" r="2.9" fill="#ff4d5e"/>
    <circle cx="45" cy="41.5" r="2.9" fill="#3ddc84"/>
    <circle cx="39.5" cy="36" r="2.9" fill="#4d8dff"/>
    ${destello(57, 9, 5)}`),

  // Mancuerna inclinada con un rayo de energía.
  ejercicio: svg(`
    <g transform="rotate(-30 32 34)">
      <rect x="14" y="31" width="36" height="6" rx="3" fill="#fff" opacity=".85"/>
      <rect x="11" y="19" width="8" height="30" rx="3.5" fill="#fff"/>
      <rect x="4" y="24" width="7" height="20" rx="3" fill="#fff"/>
      <rect x="45" y="19" width="8" height="30" rx="3.5" fill="#fff"/>
      <rect x="53" y="24" width="7" height="20" rx="3" fill="#fff"/>
      <rect x="13.2" y="22" width="2.4" height="24" rx="1.2" fill="currentColor" opacity=".3"/>
      <rect x="47.2" y="22" width="2.4" height="24" rx="1.2" fill="currentColor" opacity=".3"/>
    </g>
    <path fill="#ffd23f" d="M50 2l-8 12h5.5l-3 9.5 9.5-12.5h-5.5l3.5-9z"/>
    <path d="M6 52c4 4 10 6 16 5M10 60c3 1.5 7 2 11 1.4" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>`),

  // Anime: logo de Crunchyroll (disco naranja con la "C" blanca y su punto).
  // Lleva su propio disco para verse igual sobre cualquier fondo.
  anime: svg(`
    <circle cx="32" cy="32" r="29" fill="#f47521" stroke="#fff" stroke-width="3"/>
    <circle cx="30" cy="34" r="18" fill="#fff"/>
    <circle cx="35.6" cy="28.6" r="10.6" fill="#f47521"/>
    <circle cx="38.6" cy="25.8" r="5" fill="#fff"/>`),

  // Manga: libro abierto con viñetas y un globo de diálogo.
  manga: svg(`
    <path d="M9 9l6 6M4 18l7 3M18 4l2 7" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>
    <path fill="#fff" d="M4 27c9-3 19-2.5 27 2v28c-8-4.5-18-5-27-2z"/>
    <path fill="#fff" opacity=".85" d="M60 27c-9-3-19-2.5-27 2v28c8-4.5 18-5 27-2z"/>
    <path fill="currentColor" opacity=".35" d="M8 31.5c6-1.4 12-1.2 19 1v8c-7-2-13-2.2-19-1z"/>
    <path fill="currentColor" opacity=".35" d="M8 43.5c3-.6 5.6-.7 8-.5v8c-2.4-.2-5 0-8 .5z"/>
    <path fill="currentColor" opacity=".35" d="M19 43.2c2.8.3 5.4 1 8 2v8c-2.6-1-5.2-1.7-8-2z"/>
    <path d="M37 34c5-1.6 11-1.8 18-.8M37 40c5-1.6 11-1.8 18-.8M37 46c5-1.6 11-1.8 18-.8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>
    <path fill="#fff" d="M40 3h16a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6h-8l-7 6 1.5-6H40a6 6 0 0 1-6-6V9a6 6 0 0 1 6-6z"/>
    <rect x="46.5" y="5.8" width="3" height="7.4" rx="1.5" fill="currentColor"/>
    <circle cx="48" cy="16.4" r="1.8" fill="currentColor"/>`),

  // Series: televisor con antena, botón de reproducir y barra del capítulo.
  series: svg(`
    <path d="M25 11l-6-7M39 11l6-7" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <circle cx="18.5" cy="4" r="2.6" fill="#fff"/>
    <circle cx="45.5" cy="4" r="2.6" fill="#fff"/>
    <rect x="4" y="11" width="56" height="40" rx="7" fill="#fff"/>
    <rect x="9" y="16" width="46" height="30" rx="4" fill="currentColor"/>
    <path fill="#fff" d="M27.5 22.5v13l11-6.5z"/>
    <rect x="14" y="40" width="36" height="2.4" rx="1.2" fill="#fff" opacity=".3"/>
    <rect x="14" y="40" width="22" height="2.4" rx="1.2" fill="#ff4d5e"/>
    <circle cx="36" cy="41.2" r="2.6" fill="#fff"/>
    <path d="M22 59h20M28 51v8M36 51v8" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>`),

  // YouTube: pantalla de video con botón de reproducir, campana y "me gusta".
  youtube: svg(`
    <rect x="4" y="12" width="48" height="34" rx="11" fill="#fff"/>
    <path fill="currentColor" d="M22.5 20.5v17l15-8.5z"/>
    <path fill="#ffd23f" stroke="currentColor" stroke-width="3" stroke-linejoin="round" d="M51 34c-5.2 0-8.5 3.7-8.5 8.5v5.5l-3.5 4.5h24l-3.5-4.5v-5.5c0-4.8-3.3-8.5-8.5-8.5z"/>
    <circle cx="51" cy="56.5" r="3" fill="#ffd23f" stroke="currentColor" stroke-width="2"/>
    <path d="M8 55h14M8 60h22" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>
    ${destello(57, 8, 6)}`),

  // Película: claqueta de cine abierta.
  pelicula: svg(`
    <g transform="rotate(-16 7 25)">
      <rect x="6" y="15" width="50" height="10" rx="2.5" fill="#fff"/>
      <path fill="currentColor" d="M14 15h7l-5 10H9zM28 15h7l-5 10h-7zM42 15h7l-5 10h-7z"/>
    </g>
    <rect x="6" y="27" width="52" height="31" rx="4" fill="#fff"/>
    <path fill="currentColor" d="M13 27h7l-4 9H9zM27 27h7l-4 9h-7zM41 27h7l-4 9h-7z"/>
    <rect x="6" y="36" width="52" height="1.6" fill="currentColor" opacity=".25"/>
    <circle cx="9" cy="27" r="3" fill="currentColor"/>
    <rect x="12" y="42" width="22" height="3" rx="1.5" fill="currentColor" opacity=".3"/>
    <rect x="12" y="49" width="32" height="3" rx="1.5" fill="currentColor" opacity=".3"/>
    ${destello(56, 8, 6, '#ffd23f')}`),
};

// ---------------------------------------------------------------------------
// Logo: una ruleta con un gajo por categoría y la aguja arriba.
// ---------------------------------------------------------------------------

function hslAHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return `#${[f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * @param {number[]} tonos  Tono (0–360) de cada gajo.
 * @param {boolean} fondo   Con el cuadro redondeado oscuro (para el ícono de la app).
 */
export function logoSvg(tonos, { fondo = false } = {}) {
  const cx = 65;
  const cy = 70;
  const r = 47;
  const n = tonos.length;
  const punto = (grados, radio) => {
    const a = ((grados - 90) * Math.PI) / 180;
    return [(cx + radio * Math.cos(a)).toFixed(2), (cy + radio * Math.sin(a)).toFixed(2)];
  };

  const gajos = tonos
    .map((tono, i) => {
      const [x0, y0] = punto((i - 0.5) * (360 / n), r);
      const [x1, y1] = punto((i + 0.5) * (360 / n), r);
      return `<path d="M${cx} ${cy}L${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}Z" fill="${hslAHex(tono, 85, 58)}"/>`;
    })
    .join('');
  const lineas = tonos
    .map((_, i) => {
      const [x, y] = punto((i - 0.5) * (360 / n), r);
      return `<path d="M${cx} ${cy}L${x} ${y}" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>`;
    })
    .join('');
  const focos = tonos
    .map((_, i) => {
      const [x, y] = punto((i - 0.5) * (360 / n), r + 4);
      return `<circle cx="${x}" cy="${y}" r="2.6" fill="#ffd23f"/>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="130" height="130" aria-hidden="true">
    ${fondo ? '<rect x="3" y="3" width="124" height="124" rx="28" fill="#120f33"/><circle cx="65" cy="62" r="62" fill="#2a1f6b" opacity=".55"/>' : ''}
    ${gajos}${lineas}
    <circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="none" stroke="#fff" stroke-width="5"/>
    ${focos}
    <circle cx="${cx}" cy="${cy}" r="12" fill="#fff"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#2a1f6b"/>
    <path d="M65 34L53 10h24z" fill="#ffd23f" stroke="#120f33" stroke-width="3" stroke-linejoin="round"/>
  </svg>`;
}
