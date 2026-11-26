# ALTURA · Sesión 16 — Material Design

Proyecto de la Sesión 16 del curso **Hojas de Estilo en Cascada Avanzado (UTP)**.
En lugar de entregar ejercicios sueltos, el conjunto forma el sitio de una
cafetería de especialidad ficticia —**ALTURA**, en Barranco, Lima— para mostrar
cómo un mismo sistema de diseño sostiene pantallas distintas sin que parezcan
plantillas.

**Autor:** César Huaripaucar
**Docente:** Antonio Arroyo Paz
**Curso:** Hojas de Estilo en Cascada Avanzado — Sesión 16: Material Design

---

## 1. Cómo abrir el proyecto

La forma correcta es servir la carpeta con un servidor local. No abras los HTML
con doble clic (`file://`) porque los módulos de JavaScript y los componentes de
Material Web no se cargan así.

### Opción A · Python (recomendada)

Abre una terminal en la **raíz del proyecto** (la carpeta que contiene
`index.html`) y ejecuta:

```bash
python -m http.server 8080
```

Luego abre en el navegador:

```
http://localhost:8080
```

Para detener el servidor, vuelve a la terminal y pulsa `Ctrl` + `C`.

### Opción B · Node.js

Si tienes Node instalado, desde la misma carpeta:

```bash
npx http-server -p 8080
```

Abre `http://localhost:8080`. La primera vez puede preguntar si deseas instalar
el paquete; responde `y`.

### Qué significa cada comando

| Comando | Qué hace |
|---|---|
| `cd ruta\de\altura-sesion16` | Entra a la carpeta del proyecto (en Windows puedes arrastrar la carpeta a la terminal). |
| `python -m http.server 8080` | Levanta un servidor estático de Python en el puerto 8080. |
| `npx http-server -p 8080` | Hace lo mismo con un paquete de Node; no requiere instalación previa. |
| `Ctrl` + `C` | Detiene el servidor. |

**Requisitos:** navegador actualizado (Chrome o Edge), conexión a internet para
las fuentes de Google y para los componentes de Material Web (solo en las
páginas 4 y en el resuelto 3).

---

## 2. Qué contiene cada carpeta

| Página | Ejercicio de la guía | Qué demuestra |
|---|---|---|
| `index.html` | Menú / portada | Presentación del sistema, accesos a todo y muestras de color, elevación y tema. |
| `resueltos/tarjeta/` | **Resuelto 1** | Tarjeta con elevación, botones relleno/contorno/texto y FAB con contador. |
| `resueltos/formulario/` | **Resuelto 2** | Campos con etiqueta flotante y cambio de tema claro/oscuro solo con variables. |
| `resueltos/material-web/` | **Resuelto 3** | Componentes `md-*` con tema propio y explicación del servidor local. |
| `propuesto-1-contacto/` | **Propuesto 1** | Página de contacto con barra, panel elevado, formulario, chips y aviso. |
| `propuesto-2-carta/` | **Propuesto 2** | Lista de seis lotes, filtros, FAB con contador y diálogo de pedido. |
| `propuesto-3-temas/` | **Propuesto 3** | Comparador claro/oscuro, tabla de roles y contraste WCAG calculado en vivo. |
| `propuesto-4-registro/` | **Propuesto 4** | Registro con Material Web (campos, select, checkbox, switch, diálogo). |

### Organización de archivos

```
altura-sesion16/
├── index.html                  Menú principal
├── README.md                   Este archivo
├── CUESTIONARIO.md             Respuestas del cuestionario
├── assets/
│   ├── css/
│   │   ├── tokens.css          Roles de color, tipografía, elevación, movimiento
│   │   └── components.css      Botones, campos, chips, barra, FAB, diálogo, pie
│   ├── js/
│   │   ├── theme.js            Tema claro/oscuro (se carga en el <head>)
│   │   └── ui.js               Barra, menú móvil, fotos, revelado, reloj y avisos
│   └── img/                    Fotografías locales y favicon
├── resueltos/
│   ├── tarjeta/                index.html + tarjeta.css + tarjeta.js
│   ├── formulario/             index.html + formulario.css + formulario.js
│   └── material-web/           index.html + material-web.css + material-web.js
├── propuesto-1-contacto/       index.html + contacto.css + contacto.js
├── propuesto-2-carta/          index.html + carta.css + carta.js
├── propuesto-3-temas/          index.html + temas.css + temas.js
└── propuesto-4-registro/       index.html + registro.css + registro.js
```

Cada página tiene su propio CSS y su propio JS. Lo compartido vive en
`assets/`: los tokens, los componentes, el tema y el comportamiento general.

---

## 3. Decisiones de diseño

**Un mismo sistema, siete pantallas.** Todo sale de `assets/css/tokens.css`:
roles de color, escala tipográfica, radios, sombras y curvas de movimiento.
Cambiar una variable cambia las siete páginas a la vez.

**Paleta de café.** El tema claro usa papel crema (`--surface: #faf4ea`), tinta
marrón (`--on-surface: #211a13`) y un primario de café tostado (`#6a4327`). El
tema oscuro invierte los valores y sube el brillo del primario para conservar el
contraste. Los nombres de los roles no cambian nunca.

**Tipografía con contraste.** `Fraunces` para títulos (serif variable, con
cursivas) y `Roboto` para la interfaz. Esa mezcla evita el aspecto de plantilla
y acerca el sitio a una carta editorial de cafetería.

**Elevación honesta.** Cinco niveles (`--elev-1` a `--elev-5`) con dos sombras
cada uno: una cercana y nítida, otra amplia y suave. En oscuro las sombras se
apagan y la jerarquía se apoya en el tono de superficie y el borde, como explica
la guía.

**Formas y movimiento.** Radios de 4 a 28 px, FAB de 16 px, botones de 20 px.
Las transiciones usan una curva suave de 220–380 ms y se desactivan si el
usuario prefiere movimiento reducido.

**Contenido concreto.** Los lotes son de Cajamarca, Cusco, Amazonas, Villa Rica,
San Martín y Huánuco, con altitud, proceso y notas de cata. La ficción se sostiene
en todas las páginas: mismo local, mismos precios, mismas fechas.

**Diseño adaptable.** Las rejillas pasan de dos o tres columnas a una sola en
1040, 960, 860, 680 y 560 px. Las tablas anchas se desplazan dentro de su caja
en lugar de romper la página.

**Accesibilidad.**
- Enlace «Saltar al contenido» y foco visible en todos los controles.
- Áreas táctiles de al menos 48 px en botones, chips y campos.
- Atributos `aria-*` en menú, tema, diálogo, avisos y estados de error.
- Contraste comprobado en la página de temas (fórmula WCAG 2.1 en JavaScript).
- Textos alternativos en las fotografías y pie de imágenes decorativas oculto.

---

## 4. Relación con la rúbrica

| Criterio (guía) | Dónde verlo |
|---|---|
| **Color, tipografía, elevación y formas (40 %)** | `tokens.css` y el menú: muestras de roles, niveles de sombra y escala tipográfica. Los cinco énfasis de botón están en `components.css`. |
| **Variables de tema y diseño responsivo (25 %)** | Tema claro/oscuro en todas las páginas; comparador y tabla de contraste en `propuesto-3-temas/`; los puntos de quiebre están al final de cada CSS. |
| **Orden y legibilidad del código (15 %)** | Una carpeta por ejercicio, HTML/CSS/JS separados, nombres por bloques (`ficha__titulo`, `rol__celda`), cabeceras de sección y comentarios solo donde explican una decisión. |
| **Creatividad, accesibilidad y presentación (20 %)** | Concepto editorial de ALTURA, laboratorio de contraste, boleto de la cata, FAB con contador y formularios con validación y avisos. |

---

## 5. Ejercicio 3 y Propuesto 4: servidor y Material Web

Los componentes oficiales se importan desde un CDN con un *import map*:

```html
<script type="importmap">
  { "imports": { "@material/web/": "https://esm.run/@material/web/" } }
</script>
```

y se registran desde el JavaScript de la página:

```js
import '@material/web/all.js';
```

Por eso esas dos páginas **necesitan un servidor local y conexión a internet**.
En el navegador puedes comprobar la carga con `F12` → *Network*: los módulos de
`esm.run` deben responder `200`.

El tema se hereda de `tokens.css` mediante un puente de variables:

```css
body {
  --md-sys-color-primary: var(--primary);
  --md-sys-color-on-primary: var(--on-primary);
  --md-sys-color-surface: var(--surface);
  --md-sys-color-on-surface: var(--on-surface);
  /* … */
}
```

Así, el interruptor de tema de la barra también cambia los componentes de
Material Web sin tocar una sola regla de ellos.

---

## 6. Datos y recursos

- **Fotografías:** banco de imágenes de uso libre (Unsplash y Pexels),
  descargadas y guardadas en `assets/img/` para que el sitio funcione aunque la
  conexión falle. Si una imagen no carga, el componente `.media` muestra un
  degradado con la marca.
- **Fuentes e iconos:** Google Fonts (Fraunces y Roboto) y Material Symbols,
  cargados desde internet.
- **Material Web:** componentes oficiales desde `esm.run/@material/web`.
- **Datos simulados:** el pedido se guarda en `localStorage`
  (`altura-pedido-v1`); el tema, en `altura-tema`. Ningún formulario envía
  información a un servidor real.

---

## 7. Detalles que se pueden revisar en clase

1. Cambiar `--primary` en `tokens.css` y ver cómo se actualizan las siete
   pantallas, incluidos los componentes de Material Web.
2. Activar el tema oscuro desde cualquier barra superior y comprobar la tabla de
   contraste del Propuesto 3.
3. Agregar lotes al pedido en la Carta, recargar la página y ver que el
   `localStorage` conserva la selección.
4. Reducir la ventana a 560 px: el menú se convierte en desplegable, las
   rejillas pasan a una columna y las tablas se desplazan sin romper el ancho.
5. Abrir `propuesto-4-registro/` y registrarse: la validación marca los campos,
   el diálogo resume la reserva y el contador de tazas sube.

---

**Nota sobre la autoría.** El crédito aparece en el pie de cada página
(«Hecho por César Huaripaucar»). Si necesitas cambiar el nombre, edita el bloque
`.pie__firma` de cada HTML y este README.