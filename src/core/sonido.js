// Efectos de sonido sintetizados con Web Audio (sin archivos de audio).
// El AudioContext se crea en la primera pulsación: los navegadores exigen un
// gesto del usuario para reproducir sonido.

let ctx = null;
let salida = null;
let ruido = null;
let activo = true;

function audio() {
  if (!activo) return null;
  if (!ctx) {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) return null;
    ctx = new Contexto();
    salida = ctx.createGain();
    salida.gain.value = 0.55;
    salida.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function nota(frecuencia, inicio, duracion, { tipo = 'triangle', volumen = 0.3 } = {}) {
  const oscilador = ctx.createOscillator();
  const envolvente = ctx.createGain();
  oscilador.type = tipo;
  oscilador.frequency.value = frecuencia;
  envolvente.gain.setValueAtTime(0.0001, inicio);
  envolvente.gain.exponentialRampToValueAtTime(volumen, inicio + 0.012);
  envolvente.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
  oscilador.connect(envolvente);
  envolvente.connect(salida);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracion + 0.02);
}

/** Clic corto cada vez que una tarjeta pasa por la aguja. */
export function tic() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const oscilador = c.createOscillator();
  const envolvente = c.createGain();
  oscilador.type = 'square';
  oscilador.frequency.setValueAtTime(2200, t);
  oscilador.frequency.exponentialRampToValueAtTime(700, t + 0.03);
  envolvente.gain.setValueAtTime(0.0001, t);
  envolvente.gain.exponentialRampToValueAtTime(0.1, t + 0.002);
  envolvente.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  oscilador.connect(envolvente);
  envolvente.connect(salida);
  oscilador.start(t);
  oscilador.stop(t + 0.06);
}

/** Soplido al arrancar el giro: ruido blanco por un filtro que sube de tono. */
export function arranque() {
  const c = audio();
  if (!c) return;
  if (!ruido) {
    ruido = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const datos = ruido.getChannelData(0);
    for (let i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;
  }
  const t = c.currentTime;
  const fuente = c.createBufferSource();
  fuente.buffer = ruido;
  const filtro = c.createBiquadFilter();
  filtro.type = 'bandpass';
  filtro.Q.value = 1.2;
  filtro.frequency.setValueAtTime(300, t);
  filtro.frequency.exponentialRampToValueAtTime(2600, t + 0.5);
  const envolvente = c.createGain();
  envolvente.gain.setValueAtTime(0.0001, t);
  envolvente.gain.exponentialRampToValueAtTime(0.5, t + 0.12);
  envolvente.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  fuente.connect(filtro);
  filtro.connect(envolvente);
  envolvente.connect(salida);
  fuente.start(t);
  fuente.stop(t + 0.75);
}

/** Tres notas ascendentes: salió una categoría. */
export function acierto() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  [659.25, 987.77, 1318.51].forEach((f, i) => nota(f, t + i * 0.09, 0.4));
}

/** Fanfarria del resultado final: arpegio y acorde. */
export function fanfarria() {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => nota(f, t + i * 0.1, 0.3, { volumen: 0.28 }));
  [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f) => nota(f, t + 0.45, 1.3, { volumen: 0.12 }));
  [261.63, 392].forEach((f) => nota(f, t + 0.45, 1.3, { tipo: 'sine', volumen: 0.2 }));
}

/** Activa o silencia los sonidos. Devuelve el nuevo estado. */
export function alternar() {
  activo = !activo;
  return activo;
}
