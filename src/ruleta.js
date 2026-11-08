// Ruleta 3D: un anillo de tarjetas hecho con CSS 3D (perspective + preserve-3d),
// como el Carrusel 3D del laboratorio. La posición se anima en JavaScript cuadro
// a cuadro para saber en todo momento qué tarjeta pasa por el frente (sonido de
// "tic", aguja y resaltado).

const ANCHO_TARJETA = 340;
const SEPARACION = 50;
const RADIO_MINIMO = 560;
const INCLINACION = -4; // grados: se ve el anillo un poco desde arriba
const MINIMO_TARJETAS = 6;

const mod = (a, n) => ((a % n) + n) % n;
const salidaCubica = (t) => 1 - (1 - t) ** 3;

// Curva del giro: arranca con aceleración constante durante el primer 8 % del
// tiempo y luego frena con una curva de cuarto grado (frenado largo = suspenso).
// V se elige para que la velocidad sea continua en el empalme.
const A = 0.08;
const K = 4;
const V = K / (1 - A + (K * A) / 2);
const SA = (V * A) / 2;
const curvaGiro = (t) => (t < A ? (V * t * t) / (2 * A) : SA + (1 - SA) * (1 - (1 - (t - A) / (1 - A)) ** K));

/**
 * @param {object} opciones
 * @param {{ estilo: string, frente: string, dorso: string }[]} opciones.items
 * @param {number} [opciones.inicial]  Índice de la tarjeta que empieza al frente.
 * @param {(indice: number) => void} [opciones.alTic]   Otra tarjeta pasó al frente.
 * @param {(indice: number) => void} [opciones.alClic]  Clic con el puntero en una tarjeta
 *   (índice interno del anillo: se compara con actual() y se pasa a irA()).
 */
export function crearRuleta({ items, inicial = 0, alTic, alClic }) {
  // Con menos de MINIMO_TARJETAS opciones el anillo se vería vacío (con 4, las
  // laterales quedan de canto), así que se repite la lista. Cada opción sigue
  // teniendo la misma probabilidad porque todas aparecen el mismo número de veces.
  const opciones = items.length;
  const copias = Math.ceil(MINIMO_TARJETAS / opciones);
  const anilloItems = Array.from({ length: copias }, () => items).flat();
  const n = anilloItems.length;
  const paso = 360 / n;
  const radio = Math.max(RADIO_MINIMO, Math.round((ANCHO_TARJETA / 2 + SEPARACION) / Math.tan(Math.PI / n)));

  const el = document.createElement('div');
  el.className = 'ruleta';
  el.innerHTML = `<div class="ruleta-anillo">${anilloItems
    .map(
      (item, i) => `
      <div class="tarjeta" style="${item.estilo};transform:rotateY(${i * paso}deg) translateZ(${radio}px)">
        <div class="tarjeta-cuerpo">
          <div class="tarjeta-halo"></div>
          <div class="cara cara-frente"><div class="cara-brillo"></div>${item.frente}</div>
          <div class="cara cara-dorso">${item.dorso}</div>
        </div>
      </div>`,
    )
    .join('')}</div>`;

  const anillo = el.firstElementChild;
  const tarjetas = [...anillo.children];

  let pos = 0; // posición continua, en tarjetas (sin límite: siempre gira por el camino corto)
  let objetivo = 0;
  let frente = -1;
  let raf = 0;
  let girando = false;

  function fijar(p, avisar = true) {
    pos = p;
    anillo.style.transform = `translateZ(${-radio}px) rotateX(${INCLINACION}deg) rotateY(${-p * paso}deg)`;
    const f = mod(Math.round(p), n);
    if (f === frente) return;
    if (frente >= 0) tarjetas[frente].classList.remove('frente');
    tarjetas[f].classList.add('frente');
    frente = f;
    if (avisar) alTic?.(f);
  }

  function animar(desde, hasta, duracion, curva) {
    cancelAnimationFrame(raf);
    return new Promise((resolver) => {
      const inicio = performance.now();
      const cuadro = (ahora) => {
        const t = Math.min(1, (ahora - inicio) / duracion);
        fijar(desde + (hasta - desde) * curva(t));
        if (t < 1) {
          raf = requestAnimationFrame(cuadro);
        } else {
          raf = 0;
          resolver();
        }
      };
      raf = requestAnimationFrame(cuadro);
    });
  }

  const limpiar = () => tarjetas.forEach((t) => t.classList.remove('ganadora'));

  /** Gira la ruleta `pasos` tarjetas (negativo = hacia la izquierda). */
  function mover(pasos) {
    if (girando || !pasos) return;
    limpiar();
    objetivo = (raf ? objetivo : Math.round(pos)) + pasos;
    animar(pos, objetivo, 550, salidaCubica);
  }

  /** Lleva la tarjeta `indice` al frente por el camino más corto. */
  function irA(indice) {
    let delta = mod(indice - mod(raf ? objetivo : Math.round(pos), n), n);
    if (delta > n / 2) delta -= n;
    mover(delta);
  }

  /**
   * Gira varias vueltas y se detiene en una tarjeta al azar (entre todas las
   * copias). Devuelve el índice de la opción en la lista original `items`.
   */
  async function girar() {
    const destino = Math.floor(Math.random() * n);
    limpiar();
    girando = true;
    el.classList.add('girando');
    const base = Math.round(raf ? objetivo : pos);
    const vueltas = 4 + Math.floor(Math.random() * 2);
    objetivo = base + vueltas * n + mod(destino - mod(base, n), n);
    await animar(pos, objetivo, 5600 + Math.random() * 1400, curvaGiro);
    girando = false;
    el.classList.remove('girando');
    tarjetas[destino].classList.add('ganadora');
    return destino % opciones;
  }

  el.addEventListener('click', (evento) => {
    const tarjeta = evento.target.closest('.tarjeta');
    if (tarjeta) alClic?.(tarjetas.indexOf(tarjeta));
  });

  objetivo = inicial;
  fijar(inicial, false);

  return {
    el,
    actual: () => frente,
    mover,
    irA,
    girar,
    limpiar,
    destruir: () => cancelAnimationFrame(raf),
  };
}
