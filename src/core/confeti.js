// Confeti en un <canvas> 2D de 1920x1080. El bucle solo corre mientras quedan
// piezas en pantalla.

const GRAVEDAD = 900;
const ROCE = 1.6; // frenado del aire por segundo

/**
 * @param {HTMLCanvasElement} lienzo
 */
export function crearConfeti(lienzo) {
  const ctx = lienzo.getContext('2d');
  let piezas = [];
  let raf = 0;
  let previo = 0;

  /**
   * Dispara un chorro de confeti.
   * @param {object} o
   * @param {number} o.x  @param {number} o.y   Origen.
   * @param {number} o.angulo   Dirección en radianes (−π/2 = hacia arriba).
   * @param {number} o.apertura Abanico total en radianes.
   * @param {number} o.velocidad
   * @param {number} o.cantidad
   * @param {string[]} o.colores
   */
  function lanzar({ x, y, angulo, apertura, velocidad, cantidad, colores }) {
    for (let i = 0; i < cantidad; i++) {
      const a = angulo + (Math.random() - 0.5) * apertura;
      const v = velocidad * (0.55 + Math.random() * 0.6);
      piezas.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        ancho: 10 + Math.random() * 12,
        alto: 6 + Math.random() * 8,
        rotacion: Math.random() * Math.PI * 2,
        vRotacion: (Math.random() - 0.5) * 12,
        volteo: Math.random() * Math.PI * 2,
        vVolteo: 4 + Math.random() * 8,
        fase: Math.random() * Math.PI * 2,
        color: colores[i % colores.length],
        circulo: Math.random() < 0.25,
      });
    }
    if (!raf) {
      previo = 0;
      raf = requestAnimationFrame(cuadro);
    }
  }

  function cuadro(ahora) {
    const dt = previo ? Math.min((ahora - previo) / 1000, 0.05) : 1 / 60;
    previo = ahora;
    const roce = Math.exp(-ROCE * dt);
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);

    piezas = piezas.filter((p) => p.y < lienzo.height + 40);
    for (const p of piezas) {
      p.vy += GRAVEDAD * dt;
      p.vx *= roce;
      p.vy *= roce;
      p.x += (p.vx + Math.sin(ahora / 300 + p.fase) * 40) * dt;
      p.y += p.vy * dt;
      p.rotacion += p.vRotacion * dt;
      p.volteo += p.vVolteo * dt;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotacion);
      ctx.scale(1, Math.cos(p.volteo));
      ctx.fillStyle = p.color;
      if (p.circulo) {
        ctx.beginPath();
        ctx.arc(0, 0, p.alto * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.ancho / 2, -p.alto / 2, p.ancho, p.alto);
      }
      ctx.restore();
    }

    raf = piezas.length ? requestAnimationFrame(cuadro) : 0;
  }

  function detener() {
    cancelAnimationFrame(raf);
    raf = 0;
    piezas = [];
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  }

  return { lanzar, detener };
}
