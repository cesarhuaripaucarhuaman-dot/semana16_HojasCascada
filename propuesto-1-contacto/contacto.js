/* Propuesto 1 · validación del formulario, contador y copiar correo.
   Sin librerías: solo estados de error, foco y un aviso de confirmación. */
(function () {
  'use strict';

  var A = window.ALTURA = window.ALTURA || {};
  var formulario = document.getElementById('formulario-contacto');
  if (!formulario) return;

  var nombre = document.getElementById('nombre');
  var correo = document.getElementById('correo');
  var mensaje = document.getElementById('mensaje');
  var contador = document.getElementById('contador-mensaje');
  var boton = formulario.querySelector('[data-enviar]');
  var textoBoton = formulario.querySelector('[data-enviar-texto]');
  var iconoBoton = formulario.querySelector('[data-enviar-icono]');
  var limpiar = formulario.querySelector('[data-limpiar]');
  var chips = formulario.querySelectorAll('[data-motivo]');
  var motivo = 'pedido';
  var enviando = false;

  function avisar(texto) {
    if (typeof A.aviso === 'function') A.aviso(texto);
  }

  function campoDe(input) { return input.closest('[data-campo]'); }

  function marcarError(input, activo) {
    var contenedor = campoDe(input);
    if (!contenedor) return;
    contenedor.classList.toggle('campo--error', activo);
    input.setAttribute('aria-invalid', activo ? 'true' : 'false');
  }

  function actualizarContador() {
    contador.textContent = mensaje.value.length + ' / 280';
  }

  function nombreValido(v) { return v.trim().length >= 2; }
  function correoValido(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
  function mensajeValido(v) { return v.trim().length >= 10; }

  function validarTodo() {
    var validoNombre = nombreValido(nombre.value);
    var validoCorreo = correoValido(correo.value);
    var validoMensaje = mensajeValido(mensaje.value);
    marcarError(nombre, !validoNombre);
    marcarError(correo, !validoCorreo);
    marcarError(mensaje, !validoMensaje);

    if (!validoNombre) { nombre.focus(); return false; }
    if (!validoCorreo) { correo.focus(); return false; }
    if (!validoMensaje) { mensaje.focus(); return false; }
    return true;
  }

  [nombre, correo, mensaje].forEach(function (input) {
    input.addEventListener('input', function () { marcarError(input, false); });
    input.addEventListener('blur', function () {
      if (!input.value.trim()) return;
      if (input === nombre) marcarError(input, !nombreValido(input.value));
      if (input === correo) marcarError(input, !correoValido(input.value));
      if (input === mensaje) marcarError(input, !mensajeValido(input.value));
    });
  });

  mensaje.addEventListener('input', actualizarContador);

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (otro) { otro.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      motivo = chip.dataset.motivo;
    });
  });

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (enviando) return;
    if (!validarTodo()) {
      avisar('Revisa los campos marcados antes de enviar.');
      return;
    }

    enviando = true;
    boton.setAttribute('aria-busy', 'true');
    boton.disabled = true;
    textoBoton.textContent = 'Enviando…';
    iconoBoton.textContent = 'progress_activity';

    window.setTimeout(function () {
      var nombrePersona = nombre.value.trim().split(' ')[0];
      var etiquetas = { pedido: 'tu pedido', taller: 'el taller', prensa: 'la colaboración', saludo: 'tu saludo' };
      avisar('Listo, ' + nombrePersona + '. Recibimos ' + (etiquetas[motivo] || 'tu mensaje') + '; respondemos en menos de 24 h.');

      formulario.reset();
      actualizarContador();
      [nombre, correo, mensaje].forEach(function (input) { marcarError(input, false); });
      chips.forEach(function (chip) { chip.setAttribute('aria-pressed', chip.dataset.motivo === 'pedido' ? 'true' : 'false'); });
      motivo = 'pedido';

      enviando = false;
      boton.removeAttribute('aria-busy');
      boton.disabled = false;
      textoBoton.textContent = 'Enviar mensaje';
      iconoBoton.textContent = 'send';
    }, 900);
  });

  limpiar.addEventListener('click', function () {
    formulario.reset();
    actualizarContador();
    [nombre, correo, mensaje].forEach(function (input) { marcarError(input, false); });
    chips.forEach(function (chip) { chip.setAttribute('aria-pressed', chip.dataset.motivo === 'pedido' ? 'true' : 'false'); });
    motivo = 'pedido';
    nombre.focus();
  });

  /* Copiar el correo con respaldo para navegadores sin Clipboard API */
  var copiar = document.querySelector('[data-copiar-correo]');
  if (copiar) {
    copiar.addEventListener('click', function () {
      var texto = 'hola@altura.cafe';
      function listo() { avisar('Correo copiado: ' + texto); }
      function respaldo() {
        var area = document.createElement('textarea');
        area.value = texto;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); listo(); } catch (e) { avisar('Copia el correo a mano: ' + texto); }
        area.remove();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(listo).catch(respaldo);
      } else {
        respaldo();
      }
    });
  }

  actualizarContador();
})();