/* Ejercicio 2 · envío simulado y aviso del sistema */
(function () {
  'use strict';

  var form = document.querySelector('#form-ejercicio');

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var nombre = form.nombre.value.trim().split(' ')[0];
    if (window.ALTURA && typeof window.ALTURA.aviso === 'function') {
      window.ALTURA.aviso('Listo, ' + nombre + '. El mensaje quedó en la cola de este ejercicio.');
    }
    form.reset();
  });
})();