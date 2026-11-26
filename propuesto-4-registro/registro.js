/* ============================================================
   Propuesto 4 · Registro con Material Web
   Importa los componentes, valida a mano y confirma con un
   <md-dialog>. Nunca envía datos: es una simulación de clase.
   ============================================================ */

import '@material/web/all.js';

const form = document.querySelector('#form-registro');
const nombre = form.querySelector('[name="nombre"]');
const correo = form.querySelector('[name="correo"]');
const telefono = form.querySelector('[name="telefono"]');
const sede = form.querySelector('[name="sede"]');
const acepto = form.querySelector('[name="acepto"]');
const recordatorio = form.querySelector('[name="recordatorio"]');
const aviso = form.querySelector('[data-error]');

const dialogo = document.querySelector('#dialogo-confirmacion');
const codigo = dialogo.querySelector('[data-codigo]');
const resumen = dialogo.querySelector('[data-resumen]');
const cerrar = dialogo.querySelector('[data-cerrar]');

const cuposTexto = document.querySelector('[data-cupos]');
const quedanTexto = document.querySelector('[data-quedan]');
const barra = document.querySelector('.boleto md-linear-progress');

const SEDES = {
  barranco: 'Barranco · Av. Miguel Grau 318',
  miraflores: 'Miraflores · Calle Berlín 259'
};

const TOTAL = 16;
let cupos = 6;

/* ---------- validación ---------- */

function marcar(campo, mensaje) {
  campo.error = true;
  campo.errorText = mensaje;
}

function limpiarError(campo) {
  campo.error = false;
  campo.errorText = '';
}

function correoValido(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto.trim());
}

function validar() {
  let primero = null;

  if (nombre.value.trim().length < 3) {
    marcar(nombre, 'Escribe tu nombre completo.');
    primero = primero || nombre;
  }

  if (!correoValido(correo.value)) {
    marcar(correo, 'Revisa el correo: falta el arroba o el dominio.');
    primero = primero || correo;
  }

  if (!acepto.checked) {
    aviso.textContent = 'Marca la casilla de condiciones para reservar tu taza.';
    aviso.hidden = false;
    primero = primero || acepto;
  } else {
    aviso.hidden = true;
  }

  if (primero) {
    if (typeof primero.focus === 'function') primero.focus();
    return false;
  }

  return true;
}

/* ---------- confirmación ---------- */

function filaResumen(etiqueta, valor) {
  const dt = document.createElement('dt');
  dt.textContent = etiqueta;
  const dd = document.createElement('dd');
  dd.textContent = valor;
  resumen.appendChild(dt);
  resumen.appendChild(dd);
}

function confirmar() {
  const clave = 'ALT-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  codigo.textContent = clave;

  resumen.innerHTML = '';
  filaResumen('Nombre', nombre.value.trim());
  filaResumen('Correo', correo.value.trim());
  filaResumen('Sede', SEDES[sede.value] || sede.value);
  filaResumen('Recordatorio', recordatorio.selected ? 'Sí, el jueves en la mañana' : 'No');

  if (cupos < TOTAL) {
    cupos += 1;
    cuposTexto.textContent = String(cupos);
    quedanTexto.textContent = 'Quedan ' + (TOTAL - cupos);
    barra.value = cupos / TOTAL;
  }

  limpiar();
  dialogo.show();
}

/* ---------- eventos ---------- */

form.addEventListener('submit', function (evento) {
  evento.preventDefault();
  if (validar()) confirmar();
});

form.addEventListener('reset', function (evento) {
  evento.preventDefault();
  limpiar();
  if (typeof nombre.focus === 'function') nombre.focus();
});

[nombre, correo, telefono].forEach(function (campo) {
  campo.addEventListener('input', function () {
    limpiarError(campo);
    if (!aviso.hidden) aviso.hidden = true;
  });
});

acepto.addEventListener('change', function () {
  if (acepto.checked) aviso.hidden = true;
});

cerrar.addEventListener('click', function () {
  dialogo.close();
});

function limpiar() {
  nombre.value = '';
  correo.value = '';
  telefono.value = '';
  sede.value = 'barranco';
  acepto.checked = false;
  recordatorio.selected = false;
  [nombre, correo, telefono].forEach(limpiarError);
  aviso.hidden = true;
  aviso.textContent = '';
}