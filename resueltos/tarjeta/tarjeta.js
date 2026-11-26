/* Ejercicio 1 · botones y FAB con respuesta inmediata */
(function () {
  'use strict';

  var badge = document.querySelector('[data-contador]');
  var fab = document.querySelector('[data-fab]');
  var lotes = 0;

  function anunciar(texto) {
    if (window.ALTURA && typeof window.ALTURA.aviso === 'function') {
      window.ALTURA.aviso(texto);
    }
  }

  document.querySelectorAll('[data-accion]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      if (boton.dataset.accion === 'aceptar') {
        lotes += 1;
        badge.textContent = String(lotes);
        badge.hidden = false;
        anunciar('La Colmena entró al pedido. Llevas ' + lotes + (lotes === 1 ? ' lote.' : ' lotes.'));
      } else if (boton.dataset.accion === 'cancelar') {
        anunciar('Sin cambios en el pedido.');
      } else {
        anunciar('Panela, mandarina y cacao · tueste medio · bolsa de 250 g.');
      }
    });
  });

  fab.addEventListener('click', function () {
    if (lotes === 0) {
      anunciar('El pedido está vacío: pulsa «Aceptar» en la tarjeta.');
    } else {
      anunciar('Tu pedido lleva ' + lotes + (lotes === 1 ? ' lote' : ' lotes') + '. Se cierra desde la página Carta.');
    }
  });
})();