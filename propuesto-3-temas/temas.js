/* ============================================================
   ALTURA · Laboratorio de temas
   Lee los tokens reales de los dos paneles (Sala / Noche),
   los pinta en una tabla y calcula el contraste WCAG en vivo.
   ============================================================ */
(function () {
  'use strict';

  var paneles = {
    claro: document.querySelector('.vista[data-tema="claro"]'),
    oscuro: document.querySelector('.vista[data-tema="oscuro"]')
  };

  var cuerpoRoles = document.querySelector('[data-roles-filas]');
  var cuerpoContraste = document.querySelector('[data-contraste-filas]');
  var salidaTema = document.querySelector('[data-tema-actual]');
  var salidaResumen = document.querySelector('[data-contraste-resultado]');

  var ROLES = [
    { token: 'primary', pareja: 'on-primary', uso: 'Botón principal, enlaces fuertes' },
    { token: 'primary-container', pareja: 'on-primary-container', uso: 'Botones tonales y avisos suaves' },
    { token: 'secondary-container', pareja: 'on-secondary-container', uso: 'Chips seleccionados' },
    { token: 'tertiary', pareja: 'on-tertiary', uso: 'Sellos y detalles de marca' },
    { token: 'surface', pareja: 'on-surface', uso: 'Fondo de página y texto base' },
    { token: 'surface-container-high', pareja: 'on-surface-variant', uso: 'Tarjetas elevadas, texto suave' },
    { token: 'error', pareja: 'on-error', uso: 'Campos con error' }
  ];

  var PARES = [
    { frente: 'on-surface', fondo: 'surface', etiqueta: 'Texto base sobre página' },
    { frente: 'on-primary', fondo: 'primary', etiqueta: 'Texto sobre botón principal' },
    { frente: 'on-primary-container', fondo: 'primary-container', etiqueta: 'Texto sobre botón tonal' },
    { frente: 'on-secondary-container', fondo: 'secondary-container', etiqueta: 'Texto sobre chip activo' },
    { frente: 'on-tertiary', fondo: 'tertiary', etiqueta: 'Texto sobre sello' },
    { frente: 'on-surface-variant', fondo: 'surface-container-high', etiqueta: 'Texto suave sobre tarjeta' }
  ];

  /* ---------- utilidades de color ---------- */

  function leerToken(panel, nombre) {
    if (!panel) return '#000000';
    var valor = getComputedStyle(panel).getPropertyValue('--' + nombre).trim();
    return valor || '#000000';
  }

  function aRgb(color) {
    color = color.trim();
    if (color.charAt(0) === '#') {
      var hex = color.slice(1);
      if (hex.length === 3) {
        hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
      }
      var numero = parseInt(hex, 16);
      return { r: (numero >> 16) & 255, g: (numero >> 8) & 255, b: numero & 255 };
    }
    var match = color.match(/rgba?\(([^)]+)\)/);
    if (match) {
      var partes = match[1].split(',').map(function (p) { return parseFloat(p); });
      return { r: partes[0], g: partes[1], b: partes[2] };
    }
    return { r: 0, g: 0, b: 0 };
  }

  function luminancia(rgb) {
    function canal(v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * canal(rgb.r) + 0.7152 * canal(rgb.g) + 0.0722 * canal(rgb.b);
  }

  function contraste(colorA, colorB) {
    var la = luminancia(aRgb(colorA));
    var lb = luminancia(aRgb(colorB));
    var claro = Math.max(la, lb);
    var oscuro = Math.min(la, lb);
    return (claro + 0.05) / (oscuro + 0.05);
  }

  function nivel(ratio) {
    if (ratio >= 7) return { clase: 'apto--aaa', texto: 'AAA' };
    if (ratio >= 4.5) return { clase: 'apto--aa', texto: 'AA' };
    return { clase: 'apto--bajo', texto: 'Bajo' };
  }

  function formatear(ratio) {
    return ratio.toFixed(2).replace('.', ',') + ':1';
  }

  /* ---------- pintado de tablas ---------- */

  function pintarRoles() {
    if (!cuerpoRoles) return;
    cuerpoRoles.innerHTML = '';

    ROLES.forEach(function (rol) {
      var fila = document.createElement('div');
      fila.className = 'rol';
      fila.setAttribute('role', 'row');

      var nombre = document.createElement('div');
      nombre.className = 'rol__nombre';
      nombre.setAttribute('role', 'cell');

      var token = document.createElement('span');
      token.className = 'rol__token';
      token.textContent = '--' + rol.token;

      var uso = document.createElement('span');
      uso.className = 'rol__uso';
      uso.textContent = rol.uso;

      nombre.appendChild(token);
      nombre.appendChild(uso);
      fila.appendChild(nombre);

      ['claro', 'oscuro'].forEach(function (tema) {
        var celda = document.createElement('div');
        celda.className = 'rol__celda';
        celda.setAttribute('role', 'cell');

        var fondo = leerToken(paneles[tema], rol.token);
        var frente = leerToken(paneles[tema], rol.pareja);

        var muestra = document.createElement('span');
        muestra.className = 'rol__muestra';
        muestra.style.background = fondo;
        muestra.style.color = frente;
        muestra.textContent = 'Aa';

        var hex = document.createElement('span');
        hex.className = 'rol__hex';
        hex.textContent = fondo.toUpperCase();

        celda.appendChild(muestra);
        celda.appendChild(hex);
        fila.appendChild(celda);
      });

      cuerpoRoles.appendChild(fila);
    });
  }

  function pintarContraste() {
    if (!cuerpoContraste) return;
    cuerpoContraste.innerHTML = '';

    var peor = 21;

    PARES.forEach(function (par) {
      var fila = document.createElement('div');
      fila.className = 'contraste__fila';
      fila.setAttribute('role', 'row');

      var pareja = document.createElement('div');
      pareja.className = 'contraste__pareja';
      pareja.setAttribute('role', 'cell');

      var titulo = document.createElement('strong');
      titulo.textContent = par.etiqueta;

      var claves = document.createElement('small');
      claves.textContent = '--' + par.frente + ' / --' + par.fondo;

      pareja.appendChild(titulo);
      pareja.appendChild(claves);
      fila.appendChild(pareja);

      ['claro', 'oscuro'].forEach(function (tema) {
        var ratio = contraste(leerToken(paneles[tema], par.frente), leerToken(paneles[tema], par.fondo));
        if (ratio < peor) peor = ratio;

        var info = nivel(ratio);
        var celda = document.createElement('div');
        celda.className = 'contraste__celda';
        celda.setAttribute('role', 'cell');

        var ratioTexto = document.createElement('span');
        ratioTexto.className = 'contraste__ratio';
        ratioTexto.textContent = formatear(ratio);

        var sello = document.createElement('span');
        sello.className = 'apto ' + info.clase;
        sello.textContent = info.texto;

        celda.appendChild(ratioTexto);
        celda.appendChild(sello);
        fila.appendChild(celda);
      });

      cuerpoContraste.appendChild(fila);
    });

    if (salidaResumen) {
      var infoPeor = nivel(peor);
      salidaResumen.textContent = 'El par más apretado llega a ' + formatear(peor) +
        ' (' + infoPeor.texto + '). Para texto normal, AA pide 4,5:1.';
      salidaResumen.className = 'contraste__resumen ' + infoPeor.clase;
    }
  }

  /* ---------- estado del tema ---------- */

  function pintarEstado() {
    if (!salidaTema) return;
    var actual = document.documentElement.dataset.tema === 'oscuro' ? 'oscuro' : 'claro';
    salidaTema.textContent = actual === 'oscuro' ? 'Noche' : 'Sala';
    salidaTema.dataset.estado = actual;
  }

  /* ---------- arranque ---------- */

  function iniciar() {
    pintarRoles();
    pintarContraste();
    pintarEstado();
  }

  document.addEventListener('tema-cambiado', pintarEstado);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();