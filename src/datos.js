// Categorías y subcategorías de la ruleta.
//
// - t1 / t2: tonos (0–360) del degradado de la tarjeta, de arriba hacia abajo.
//   El orden de la lista es el orden en el anillo: conviene que dos categorías
//   vecinas tengan tonos bien distintos.
// - frase: aparece en la pantalla del resultado final.
// - subcategorias: cualquier cantidad; la ruleta ajusta su radio sola y repite
//   las tarjetas si hay menos de 6. Lista vacía = la ronda termina en la
//   categoría (no hay segunda ruleta).

import { ICONOS } from './iconos.js';

export const CATEGORIAS = [
  {
    id: 'videojuegos',
    nombre: 'Videojuegos',
    t1: 272,
    t2: 240,
    icono: ICONOS.videojuegos,
    frase: '¡Toma el control!',
    subcategorias: ['Switch', 'PC', 'GBA', 'iOS', 'PS5'],
  },
  {
    id: 'ejercicio',
    nombre: 'Ejercicio',
    t1: 140,
    t2: 115,
    icono: ICONOS.ejercicio,
    frase: '¡A moverse!',
    subcategorias: [],
  },
  {
    id: 'anime',
    nombre: 'Anime',
    t1: 26,
    t2: 8,
    icono: ICONOS.anime,
    frase: '¡Hora de un maratón!',
    subcategorias: [],
  },
  {
    id: 'manga',
    nombre: 'Manga',
    t1: 325,
    t2: 292,
    icono: ICONOS.manga,
    frase: '¡A leer se dijo!',
    subcategorias: ['Kagurabachi', 'Witches War', 'Hunter x Hunter', 'Comic'],
  },
  {
    id: 'series',
    nombre: 'Series',
    t1: 182,
    t2: 205,
    icono: ICONOS.series,
    frase: '¡Solo un capítulo más!',
    subcategorias: ['Xuper TV', 'Amazon Prime', 'Netflix'],
  },
  {
    id: 'youtube',
    nombre: 'YouTube',
    t1: 0,
    t2: 340,
    icono: ICONOS.youtube,
    frase: '¡Dale play!',
    subcategorias: [],
  },
  {
    id: 'pelicula',
    nombre: 'Película',
    t1: 228,
    t2: 252,
    icono: ICONOS.pelicula,
    frase: '¡Luces, cámara, acción!',
    subcategorias: [],
  },
];
