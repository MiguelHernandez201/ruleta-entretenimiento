# Ruleta de Entretenimiento

App web para televisores LG webOS. Una ruleta 3D elige una **categoría** al azar y luego una segunda ruleta elige la **subcategoría**.

Categorías: Videojuegos, Ejercicio, Anime, Manga, Series, YouTube y Película. Cada una tiene su color y su ícono.

## Cómo se juega

1. **OK** (o el botón *Girar*) hace girar la ruleta de categorías. Al detenerse se anuncia la categoría y aparece sola la ruleta de subcategorías. Si la categoría no tiene subcategorías, la ronda termina ahí y se muestra el resultado.
2. **OK** gira la ruleta de subcategorías. Al detenerse se muestra el resultado con confeti.
3. En el resultado: **Girar otra vez** repite la subcategoría y **Nueva ronda** vuelve a las categorías.

| Control remoto | Teclado del PC | Acción |
|---|---|---|
| OK | Enter | Girar / confirmar |
| ← → | Flechas | Mover la ruleta una tarjeta (o cambiar de botón en el resultado) |
| Atrás | Esc / Retroceso | De subcategorías vuelve a categorías; desde categorías cierra la app |
| Rojo | R | Activar o silenciar el sonido |

Con el puntero del Magic Remote también se puede hacer clic en las tarjetas: la del frente gira la ruleta y las demás pasan al frente.

## Cambiar categorías y subcategorías

Todo está en [`src/datos.js`](src/datos.js). Cada categoría tiene:

- `nombre`, `frase` (aparece en el resultado final)
- `t1`, `t2`: tonos (0–360) del degradado de sus tarjetas
- `icono`: uno de los SVG de [`src/iconos.js`](src/iconos.js)
- `subcategorias`: lista de nombres, cualquier cantidad. La ruleta ajusta su tamaño sola, y si hay menos de 6 repite las tarjetas para que el anillo se vea lleno (cada opción conserva la misma probabilidad).

> Una categoría con `subcategorias: []` no tiene segunda ruleta: la ronda termina en la categoría. Hoy tienen subcategorías Videojuegos, Manga y Series.

Los íconos son SVG de 64×64. Las partes blancas usan `fill="#fff"` y los detalles oscuros `currentColor`, que cada tarjeta tiñe con el tono de su categoría. No usan `<defs>` ni ids porque el mismo ícono se repite muchas veces en la página.

## Estructura

```
src/
  main.js        Pantallas, flujo categoría → subcategoría → resultado, teclas
  ruleta.js      Ruleta 3D (anillo de tarjetas con CSS 3D, animado cuadro a cuadro)
  datos.js       Categorías y subcategorías
  iconos.js      Íconos SVG y logo (también lo usa scripts/iconos.mjs)
  estilos.css    Estilos
  core/          Escenario 1920x1080, teclas del control, sonido (Web Audio), confeti (canvas)
app/             Lo que se empaqueta para el TV (appinfo.json, index.html, íconos, build/)
scripts/         tv.mjs (empaquetar/instalar/lanzar) e iconos.mjs (genera los PNG)
```

El código se compila con esbuild a un solo archivo para **Chromium 87** (motor de webOS 22). No se usan `<script type="module">` porque webOS carga la app desde `file://`.

Notas sobre el 3D:

- La ruleta usa `perspective` + `transform-style: preserve-3d`, como el Carrusel 3D del Laboratorio.
- El giro se anima en JavaScript (no con `transition`) para saber qué tarjeta pasa por la aguja en cada cuadro: así suenan los "tic" y se mueve la aguja.
- La curva del giro acelera durante el primer 8 % del tiempo y luego frena con una curva de cuarto grado. El destino se elige al azar antes de empezar.
- La animación de entrada y salida de la ruleta solo usa `transform`. Una `opacity` menor que 1 aplanaría el 3D.

## Desarrollo en el PC

```powershell
npm install
npm run dev
```

Abre <http://localhost:8082>. La página se recarga sola al guardar cambios.

## Desplegar en el TV

El TV debe estar registrado como dispositivo `tv` (ver el README del Laboratorio).

```powershell
npm run desplegar        # compila, empaqueta, instala y abre la app
npm run inspeccionar     # DevTools conectado a la app del TV
npm run iconos           # regenera app/icon.png y app/largeIcon.png desde el logo
```
