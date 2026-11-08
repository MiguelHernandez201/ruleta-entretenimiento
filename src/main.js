import './estilos.css';
import { montarEscenario } from './core/escenario.js';
import { leerTecla, esAtrasDelPc, activacionPermitida } from './core/teclas.js';
import * as sonido from './core/sonido.js';
import { crearConfeti } from './core/confeti.js';
import { crearRuleta } from './ruleta.js';
import { CATEGORIAS } from './datos.js';
import { logoSvg } from './iconos.js';

const escenario = document.getElementById('escenario');
montarEscenario(escenario);

const esc = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const tonos = (t1, t2) => `--t1:${t1};--t2:${t2}`;

/** Achica la letra si la palabra más larga no cabe en `ancho` px (≈0,62 em por letra en negrita). */
function tamanoLetra(texto, maximo, ancho) {
  const larga = Math.max(...String(texto).split(/\s+/).map((palabra) => palabra.length));
  return Math.min(maximo, Math.floor(ancho / (larga * 0.62)));
}

// ---------------------------------------------------------------------------
// Pantalla
// ---------------------------------------------------------------------------
escenario.innerHTML = `
  <div class="fondo">
    <div class="fondo-tinte"></div>
    <div class="fondo-rayos"></div>
    <div class="fondo-estrellas"></div>
    <div class="fondo-piso"></div>
  </div>

  <header class="cabecera">
    <div class="marca">
      ${logoSvg(CATEGORIAS.map((c) => c.t1))}
      <div>
        <h1>Ruleta de Entretenimiento</h1>
        <p class="subtitulo"></p>
      </div>
    </div>
    <ol class="pasos">
      <li class="paso"><span class="paso-numero">1</span>Categoría</li>
      <li class="paso"><span class="paso-numero">2</span>Subcategoría</li>
    </ol>
  </header>

  <div class="zona-ruleta"></div>

  <div class="aguja">
    <svg viewBox="0 0 64 84" aria-hidden="true">
      <path d="M32 80C24 64 7 47 7 30a25 25 0 0 1 50 0c0 17-17 34-25 50z" fill="#ffd23f" stroke="#2a1600" stroke-opacity=".35" stroke-width="3"/>
      <path d="M32 80C24 64 7 47 7 30A25 25 0 0 1 32 5z" fill="#fff" opacity=".25"/>
      <circle cx="32" cy="30" r="10" fill="#fff"/>
      <circle cx="32" cy="30" r="4.5" fill="#ff8a3d"/>
    </svg>
  </div>

  <div class="pie">
    <button class="boton-girar" type="button">Girar</button>
    <div class="anuncio"></div>
    <div class="chips">
      <span><span class="chip">OK</span>Girar</span>
      <span><span class="chip">← →</span>Mover</span>
      <span class="chip-atras" hidden><span class="chip">Atrás</span>Categorías</span>
      <span><span class="chip chip-rojo"></span><span class="texto-sonido">Sonido: sí</span></span>
    </div>
  </div>

  <div class="resultado" hidden></div>
  <canvas class="confeti" width="1920" height="1080"></canvas>
  <div class="aviso"></div>`;

const $ = (selector) => escenario.querySelector(selector);
const zona = $('.zona-ruleta');
const aguja = $('.aguja');
const boton = $('.boton-girar');
const anuncio = $('.anuncio');
const subtitulo = $('.subtitulo');
const resultado = $('.resultado');
const pasos = [...escenario.querySelectorAll('.paso')];
const confeti = crearConfeti($('.confeti'));

// Cielo estrellado: puntos dibujados con box-shadow en un solo elemento.
$('.fondo-estrellas').style.boxShadow = Array.from({ length: 90 }, () => {
  const x = Math.round(Math.random() * 1920);
  const y = Math.round(Math.random() * 760);
  const a = (0.25 + Math.random() * 0.6).toFixed(2);
  return `${x}px ${y}px 0 ${Math.random() < 0.15 ? 1 : 0}px rgba(255,255,255,${a})`;
}).join(',');

// ---------------------------------------------------------------------------
// Tarjetas
// ---------------------------------------------------------------------------
const tarjetaCategoria = (c) => ({
  estilo: tonos(c.t1, c.t2),
  frente: `<div class="tarjeta-icono">${c.icono}</div><div class="tarjeta-nombre">${esc(c.nombre)}</div>`,
  dorso: `<div class="dorso-icono">${c.icono}</div>`,
});

function tarjetaSubcategoria(c, nombre, i, n) {
  const desvio = n > 1 ? (i / (n - 1) - 0.5) * 50 : 0; // cada subcategoría con un tono algo distinto
  return {
    estilo: tonos(c.t1 + desvio, c.t2 + desvio),
    frente: `
      <div class="tarjeta-marca">${c.icono}</div>
      <div class="tarjeta-etiqueta">${c.icono}<span>${esc(c.nombre)}</span></div>
      <div class="tarjeta-nombre tarjeta-nombre-sub" style="font-size:${tamanoLetra(nombre, 52, 284)}px">${esc(nombre)}</div>
      <div class="tarjeta-numero">${i + 1} / ${n}</div>`,
    dorso: `<div class="dorso-icono">${c.icono}</div>`,
  };
}

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------
let etapa = 'categoria'; // 'categoria' | 'subcategoria'
let estado = 'listo'; // 'listo' | 'girando' | 'anunciando' | 'resultado'
let categoria = null;
let ruleta = null;
let temporizador = 0;
let foco = 0;

function moverAguja() {
  aguja.animate?.(
    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-20deg)', offset: 0.3 }, { transform: 'rotate(0deg)' }],
    { duration: 170, easing: 'ease-out' },
  );
}

function montarRuleta(items, inicial) {
  if (ruleta) {
    const anterior = ruleta;
    anterior.destruir();
    anterior.el.classList.remove('entrando');
    anterior.el.classList.add('saliendo');
    setTimeout(() => anterior.el.remove(), 600);
  }
  ruleta = crearRuleta({
    items,
    inicial,
    alTic: () => {
      sonido.tic();
      moverAguja();
    },
    alClic: clicEnTarjeta,
  });
  ruleta.el.classList.add('entrando');
  zona.append(ruleta.el);
}

function actualizarPantalla() {
  escenario.dataset.estado = estado;
  escenario.dataset.etapa = etapa;
  pasos[0].className = `paso ${etapa === 'categoria' ? 'activo' : 'hecho'}`;
  pasos[1].className = `paso ${etapa === 'subcategoria' ? 'activo' : ''}`;
  $('.chip-atras').hidden = etapa !== 'subcategoria';
  boton.disabled = estado !== 'listo';
  subtitulo.innerHTML =
    etapa === 'categoria'
      ? 'Gira la ruleta para elegir una categoría'
      : `<span class="chip-categoria" style="${tonos(categoria.t1, categoria.t2)}">${categoria.icono}${esc(categoria.nombre)}</span>Ahora gira para la subcategoría`;
}

function mostrarCategorias() {
  clearTimeout(temporizador);
  ocultarResultado();
  escenario.classList.remove('celebrando');
  etapa = 'categoria';
  estado = 'listo';
  escenario.style.setProperty('--tono', 255);
  montarRuleta(CATEGORIAS.map(tarjetaCategoria), categoria ? CATEGORIAS.indexOf(categoria) : 0);
  actualizarPantalla();
}

function mostrarSubcategorias() {
  clearTimeout(temporizador);
  if (etapa === 'subcategoria') return;
  escenario.classList.remove('celebrando');
  etapa = 'subcategoria';
  estado = 'listo';
  escenario.style.setProperty('--tono', categoria.t1);
  const subs = categoria.subcategorias;
  montarRuleta(subs.map((s, i) => tarjetaSubcategoria(categoria, s, i, subs.length)), 0);
  actualizarPantalla();
}

const coloresDe = (c) => [`hsl(${c.t1},90%,62%)`, `hsl(${c.t2},90%,60%)`, '#ffd23f', '#ffffff', `hsl(${c.t1 + 40},90%,65%)`];

async function girar() {
  if (estado !== 'listo') return;
  estado = 'girando';
  actualizarPantalla();
  sonido.arranque();

  const esta = ruleta;
  const indice = await esta.girar();
  if (esta !== ruleta) return; // se cambió de pantalla durante el giro

  escenario.classList.add('celebrando');
  if (etapa === 'categoria' && !CATEGORIAS[indice].subcategorias.length) {
    // Categoría sin subcategorías: la ronda termina aquí.
    categoria = CATEGORIAS[indice];
    estado = 'resultado';
    history.pushState({ etapa: 'resultado' }, ''); // Atrás cierra el resultado
    mostrarResultado(null);
  } else if (etapa === 'categoria') {
    categoria = CATEGORIAS[indice];
    estado = 'anunciando';
    sonido.acierto();
    anuncio.innerHTML = `<span class="anuncio-icono" style="${tonos(categoria.t1, categoria.t2)}">${categoria.icono}</span><span class="anuncio-texto">¡${esc(categoria.nombre)}!</span>`;
    confeti.lanzar({ x: 960, y: 480, angulo: -Math.PI / 2, apertura: 2.2, velocidad: 1100, cantidad: 90, colores: coloresDe(categoria) });
    // Atrás desde aquí en adelante vuelve a las categorías.
    history.pushState({ etapa: 'subcategoria' }, '');
    temporizador = setTimeout(mostrarSubcategorias, 2300);
  } else {
    estado = 'resultado';
    mostrarResultado(categoria.subcategorias[indice]);
  }
  actualizarPantalla();
}

/** @param {string|null} subcategoria  null si la categoría no tiene subcategorías. */
function mostrarResultado(subcategoria) {
  const c = categoria;
  const titulo = subcategoria
    ? `<p class="resultado-categoria">${esc(c.nombre)}</p>
      <h2 class="resultado-sub" style="font-size:${tamanoLetra(subcategoria, 104, 660)}px">${esc(subcategoria)}</h2>`
    : `<p class="resultado-categoria">Te tocó</p>
      <h2 class="resultado-sub" style="font-size:${tamanoLetra(c.nombre, 104, 660)}px">${esc(c.nombre)}</h2>`;
  // Sin subcategoría solo hay una acción: volver a girar las categorías.
  const botones = subcategoria
    ? `<button class="boton" type="button" data-accion="otra">Girar otra vez</button>
      <button class="boton" type="button" data-accion="nueva">Nueva ronda</button>`
    : '<button class="boton" type="button" data-accion="otra">Girar otra vez</button>';
  resultado.innerHTML = `
    <div class="resultado-tarjeta" style="${tonos(c.t1, c.t2)}">
      <div class="cara-brillo"></div>
      <div class="resultado-icono">${c.icono}</div>
      ${titulo}
      <p class="resultado-frase">${esc(c.frase)}</p>
    </div>
    <div class="resultado-botones">${botones}</div>`;
  resultado.hidden = false;
  foco = 0;
  pintarFoco();
  sonido.fanfarria();
  const colores = coloresDe(c);
  confeti.lanzar({ x: 0, y: 1080, angulo: -1.05, apertura: 0.6, velocidad: 2300, cantidad: 140, colores });
  confeti.lanzar({ x: 1920, y: 1080, angulo: -Math.PI + 1.05, apertura: 0.6, velocidad: 2300, cantidad: 140, colores });
}

function ocultarResultado() {
  resultado.hidden = true;
  resultado.replaceChildren();
}

function pintarFoco() {
  resultado.querySelectorAll('.boton').forEach((b, i) => b.classList.toggle('enfocado', i === foco));
}

const botonesResultado = () => [...resultado.querySelectorAll('.boton')];

function accionResultado(accion) {
  if (accion === 'otra') {
    ocultarResultado();
    escenario.classList.remove('celebrando');
    estado = 'listo';
    // El resultado de una categoría sin subcategorías tiene su propia entrada en el historial.
    if (etapa === 'categoria') history.back();
    girar();
  } else {
    history.back(); // vuelve a las categorías (popstate)
  }
}

function alternarSonido() {
  const activo = sonido.alternar();
  $('.texto-sonido').textContent = `Sonido: ${activo ? 'sí' : 'no'}`;
  const aviso = $('.aviso');
  aviso.textContent = activo ? 'Sonido activado' : 'Sonido silenciado';
  aviso.classList.remove('visible');
  void aviso.offsetWidth; // reinicia la animación
  aviso.classList.add('visible');
}

// ---------------------------------------------------------------------------
// Entrada: control remoto, teclado y puntero del Magic Remote
// ---------------------------------------------------------------------------
function tecla(nombre) {
  if (nombre === 'rojo') return alternarSonido();

  if (estado === 'resultado') {
    const botones = botonesResultado();
    if (nombre === 'izquierda' || nombre === 'derecha') {
      foco = (foco + 1) % botones.length;
      pintarFoco();
    } else if (nombre === 'ok') {
      accionResultado(botones[foco].dataset.accion);
    }
    return;
  }

  switch (nombre) {
    case 'ok':
      return estado === 'anunciando' ? mostrarSubcategorias() : girar();
    case 'izquierda':
      return estado === 'listo' && ruleta.mover(-1);
    case 'derecha':
      return estado === 'listo' && ruleta.mover(1);
    default:
  }
}

function clicEnTarjeta(indice) {
  if (estado !== 'listo' || !activacionPermitida()) return;
  if (indice === ruleta.actual()) girar();
  else ruleta.irA(indice);
}

boton.addEventListener('click', () => {
  if (activacionPermitida()) tecla('ok');
});

resultado.addEventListener('click', (evento) => {
  const b = evento.target.closest('.boton');
  if (b && activacionPermitida()) accionResultado(b.dataset.accion);
});
resultado.addEventListener('mouseover', (evento) => {
  const b = evento.target.closest('.boton');
  if (!b) return;
  foco = botonesResultado().indexOf(b);
  pintarFoco();
});

document.addEventListener('keydown', (evento) => {
  if (esAtrasDelPc(evento)) {
    if (history.state && history.state.etapa !== 'categoria') {
      evento.preventDefault();
      history.back();
    }
    return;
  }
  const t = leerTecla(evento);
  if (!t) return;
  evento.preventDefault();
  if (t.nombre === 'ok' && !activacionPermitida()) return;
  tecla(t.nombre);
});

/**
 * El botón Atrás del control (webOS lo convierte en history.back()) vuelve de
 * la subcategoría a las categorías. En las categorías no hay historial, así que
 * Atrás cierra la app.
 */
addEventListener('popstate', () => {
  if (etapa === 'subcategoria') {
    mostrarCategorias();
  } else if (estado === 'resultado') {
    // Resultado de una categoría sin subcategorías: se cierra y se queda en la ruleta.
    ocultarResultado();
    escenario.classList.remove('celebrando');
    ruleta.limpiar();
    estado = 'listo';
    actualizarPantalla();
  } else if (estado === 'anunciando') {
    clearTimeout(temporizador);
    escenario.classList.remove('celebrando');
    ruleta.limpiar();
    estado = 'listo';
    actualizarPantalla();
  }
});

// ---------------------------------------------------------------------------
// Errores visibles en pantalla (en el TV no hay consola a la vista)
// ---------------------------------------------------------------------------
function mostrarError(texto) {
  const aviso = document.createElement('div');
  aviso.className = 'aviso-error';
  aviso.textContent = `Error: ${texto}`;
  escenario.append(aviso);
  setTimeout(() => aviso.remove(), 8000);
}
addEventListener('error', (evento) => mostrarError(evento.message));
addEventListener('unhandledrejection', (evento) => mostrarError(String(evento.reason)));

history.replaceState({ etapa: 'categoria' }, '');
mostrarCategorias();

// Recarga automática al guardar cambios mientras se usa `npm run dev`.
if (location.hostname === 'localhost') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload());
}
