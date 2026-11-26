/* ============================================================
   Ejercicio resuelto 3 · Material Web
   Registra los componentes y conecta los botones a un aviso.
   ============================================================ */

import '@material/web/all.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

function anunciar(texto) {
  if (window.ALTURA && typeof window.ALTURA.aviso === 'function') {
    window.ALTURA.aviso(texto);
  }
}

const nombre = document.querySelector('#mw-nombre');
const correo = document.querySelector('#mw-correo');
const avisoSwitch = document.querySelector('#mw-aviso');
const fab = document.querySelector('[data-fab]');

document.querySelector('[data-aceptar]').addEventListener('click', function () {
  if (nombre.value.trim().length < 2) {
    nombre.error = true;
    nombre.errorText = 'Escribe tu nombre para continuar.';
    if (typeof nombre.focus === 'function') nombre.focus();
    return;
  }
  nombre.error = false;
  nombre.errorText = '';
  anunciar('Guardado en esta sesión: ' + nombre.value.trim() + '.');
});

nombre.addEventListener('input', function () {
  if (nombre.error) {
    nombre.error = false;
    nombre.errorText = '';
  }
});

document.querySelector('[data-cancelar]').addEventListener('click', function () {
  nombre.value = '';
  correo.value = '';
  nombre.error = false;
  correo.error = false;
  anunciar('Campos limpios.');
});

document.querySelector('[data-info]').addEventListener('click', function () {
  anunciar('Estos componentes vienen de Material Web y heredan el tema de ALTURA.');
});

avisoSwitch.addEventListener('change', function () {
  anunciar(avisoSwitch.selected ? 'Avisos activados.' : 'Avisos desactivados.');
});

fab.addEventListener('click', function () {
  anunciar('FAB de Material Web: llama a la acción principal de la pantalla.');
});