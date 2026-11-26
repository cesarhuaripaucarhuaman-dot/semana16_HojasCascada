# Cuestionario — Sesión 16: Material Design

**Alumno:** César Huaripaucar
**Curso:** Hojas de Estilo en Cascada Avanzado
**Proyecto de referencia:** ALTURA, cafetería de especialidad (carpeta `altura-sesion16`)

---

## 1. ¿Qué es Material Design, quién lo creó y qué diferencia hay entre un sistema de diseño y una biblioteca de componentes?

Material Design es un lenguaje visual creado por Google y presentado en 2014
por Matías Duarte. Propone reglas comunes para color, tipografía, elevación,
formas, movimiento y accesibilidad, de modo que aplicaciones distintas se
sientan parte de una misma familia. La versión actual, Material 3 (Material
You, 2021), organiza el color por roles y permite temas dinámicos.

Un **sistema de diseño** es el conjunto de decisiones y reglas: qué rol cumple
cada color, qué escala tipográfica existe, cómo se representa la elevación,
cuánto dura una transición. No es código ejecutable; es una guía. Una
**biblioteca de componentes** es la implementación concreta de esas reglas en
una tecnología: Material Web, Angular Material, Material Components para
Android o MUI para React. El sistema dice *qué* debe pasar; la biblioteca
entrega el *cómo* ya programado.

En el proyecto se ve la diferencia: `tokens.css` y `components.css` funcionan
como mi sistema (roles, sombras, botones), mientras que los elementos `md-*` de
Material Web son la biblioteca que usé en el Propuesto 4 y en el Resuelto 3.

---

## 2. Explique la metáfora de las capas de papel y cómo se expresa la elevación en CSS. Escriba un ejemplo con `box-shadow`.

Material imagina la interfaz como hojas de papel apiladas sobre una mesa. La
hoja que está más cerca del usuario se percibe más importante y proyecta una
sombra más amplia; la que está al nivel de la mesa casi no proyecta sombra. Esa
distancia se mide en *dp* (densidad independiente de píxeles) y va de 0 a 5.
Además, la elevación no es solo decorativa: indica jerarquía y qué elementos
están activos (un menú abierto, un diálogo, un FAB).

En CSS se representa con `box-shadow`. Lo habitual es combinar dos sombras: una
corta y definida (la que toca el borde) y otra amplia y suave (la que difunde
luz). En `tokens.css` definí los cinco niveles así:

```css
--sombra: 45 28 12;
--elev-1: 0 1px 2px rgb(var(--sombra) / .18),
          0 1px 3px 1px rgb(var(--sombra) / .10);
--elev-3: 0 4px 8px 3px rgb(var(--sombra) / .10),
          0 1px 3px rgb(var(--sombra) / .22);
```

La tarjeta del Resuelto 1 descansa en `--elev-1` y sube a `--elev-3` en
`:hover`. En el tema oscuro las sombras se atenúan y la elevación se comunica
con el tono de la superficie (`--surface-container-high`), porque una sombra
negra sobre fondo negro no se vería.

---

## 3. Describa los roles de color `primary`, `on-primary`, `surface` y `on-surface`. ¿Por qué es útil definirlos como variables CSS?

- **`primary`** es el color de marca para las acciones principales: el botón de
  reservar, el enlace activo, el indicador de un campo enfocado.
- **`on-primary`** es el color del contenido (texto e iconos) que se coloca
  *sobre* `primary`. Debe garantizar contraste; en el tema claro es blanco.
- **`surface`** es el fondo base de la interfaz: la página, una tarjeta, un
  panel.
- **`on-surface`** es el color del texto y los iconos sobre esa superficie.

Definirlos como variables CSS tiene tres ventajas concretas. Primero, un solo
lugar de cambio: si ajusto `--primary` en `tokens.css`, se actualizan las siete
páginas y también los componentes de Material Web. Segundo, el tema oscuro deja
de ser un conjunto de reglas nuevas: es un bloque que reasigna los mismos
nombres dentro de `[data-tema="oscuro"]`. Tercero, permite comprobar el
contraste por parejas: en el Propuesto 3 leo las variables reales con
`getComputedStyle` y calculo la fórmula WCAG; el par texto base/página da
15,71:1 en claro y 14,31:1 en oscuro, ambos AAA.

---

## 4. Diferencie los botones *filled*, *outlined* y *text*, y mencione cuándo conviene usar cada uno. ¿Qué es un FAB?

Los tres existen para expresar **jerarquía de énfasis**, no para decorar.

- **Filled (relleno):** máxima prioridad. Fondo `primary` y texto `on-primary`.
  Se usa para la acción que la pantalla quiere que ocurra: «Reservar mi taza»,
  «Aceptar». Conviene uno solo por zona; si todo es relleno, nada destaca.
- **Outlined (contorno):** prioridad media. Borde visible y fondo transparente.
  Sirve para una alternativa segura o secundaria: «Cancelar», «Ver ficha».
- **Text (texto):** prioridad baja. Sin borde ni fondo hasta el hover. Se usa
  para acciones terciarias dentro de una barra, un diálogo o una tarjeta:
  «Más info».

En la tarjeta del Resuelto 1 los tres conviven en ese orden y el ojo entiende
de inmediato cuál es la acción principal.

Un **FAB** (*Floating Action Button*) es un botón flotante, generalmente
circular o con forma de cuadrado redondeado, fijo en una esquina, con un icono
y una sola acción principal de la pantalla. En Material 3 el radio típico es de
16 px. En la Carta y en el Resuelto 1 lo usé para «agregar al pedido», con un
contador que se actualiza al sumar lotes.

---

## 5. Mencione tres ventajas y dos limitaciones de Material Design, y dos formas de implementarlo en una página web.

**Ventajas.**

1. **Coherencia inmediata.** Al compartir roles, escala tipográfica y estados,
   varias pantallas se sienten parte del mismo producto aunque las haya hecho
   en momentos distintos.
2. **Accesibilidad y estados ya pensados.** Las guías definen foco visible,
   áreas táctiles, contraste y comportamiento de componentes; Material Web
   incluso trae el *ripple* y el manejo del foco.
3. **Tematización y adaptación.** Los roles de color permiten claro/oscuro con
   pocas variables, y las rejillas responsive están contempladas desde el
   diseño.

**Limitaciones.**

1. **Riesgo de look genérico.** Si se usan los componentes sin criterio, todas
   las aplicaciones se parecen. Diferenciar la marca exige trabajo de color,
   tipografía y composición.
2. **Peso y dependencia.** Las bibliotecas añaden JavaScript y CSS, y las
   versiones web suelen cargarse por CDN: sin internet o sin servidor local
   dejan de funcionar. Además, la API puede cambiar entre versiones.

**Dos formas de implementarlo.**

1. **Con CSS propio y variables**, como en los Propuestos 1, 2 y 3: se aplican
   los principios (roles, elevación, formas) sin cargar ninguna biblioteca.
   Da control total y poco peso, pero hay que programar cada estado.
2. **Con la biblioteca oficial de componentes web**, como en el Propuesto 4 y
   el Resuelto 3: se importan los `md-*` con un *import map* y se personalizan
   con variables `--md-sys-color-*`. Se gana comportamiento y accesibilidad,
   a cambio de depender de la librería y de un servidor local.

Una tercera variante, que no usé en este trabajo, son los envoltorios para
frameworks (Angular Material, MUI): la misma idea de biblioteca, adaptada a la
arquitectura de cada framework.