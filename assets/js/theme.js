/* Tema claro / oscuro.
   Se carga en el <head> (sin defer) para evitar el parpadeo inicial.
   Guarda la preferencia y avisa al resto de scripts con un evento. */
(function () {
  var CLAVE = 'altura-tema';
  var raiz = document.documentElement;
  var guardado = null;

  try { guardado = localStorage.getItem(CLAVE); } catch (e) { /* modo privado */ }

  var prefiereOscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var inicial = guardado === 'claro' || guardado === 'oscuro' ? guardado : (prefiereOscuro ? 'oscuro' : 'claro');

  raiz.dataset.tema = inicial;
  raiz.style.colorScheme = inicial;

  window.ALTURA = window.ALTURA || {};
  window.ALTURA.tema = inicial;

  function pintarBotones() {
    var oscuro = raiz.dataset.tema === 'oscuro';
    document.querySelectorAll('[data-tema-toggle]').forEach(function (boton) {
      boton.setAttribute('aria-pressed', String(oscuro));
      boton.setAttribute('aria-label', oscuro ? 'Activar tema claro' : 'Activar tema oscuro');
      boton.setAttribute('title', oscuro ? 'Tema claro' : 'Tema oscuro');
      var icono = boton.querySelector('[data-tema-icono]');
      if (icono) icono.textContent = oscuro ? 'light_mode' : 'dark_mode';
      var texto = boton.querySelector('[data-tema-texto]');
      if (texto) texto.textContent = oscuro ? 'Tema claro' : 'Tema oscuro';
    });
    var interruptor = document.querySelector('[data-tema-switch]');
    if (interruptor) interruptor.checked = oscuro;
  }

  window.ALTURA.cambiarTema = function (tema) {
    var nuevo = tema === 'claro' || tema === 'oscuro'
      ? tema
      : (raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro');

    raiz.dataset.tema = nuevo;
    raiz.style.colorScheme = nuevo;
    window.ALTURA.tema = nuevo;

    try { localStorage.setItem(CLAVE, nuevo); } catch (e) { /* sin persistencia */ }

    pintarBotones();
    document.dispatchEvent(new CustomEvent('tema-cambiado', { detail: { tema: nuevo } }));
  };

  function conectar() {
    document.querySelectorAll('[data-tema-toggle]').forEach(function (boton) {
      boton.addEventListener('click', function () { window.ALTURA.cambiarTema(); });
    });
    var interruptor = document.querySelector('[data-tema-switch]');
    if (interruptor) {
      interruptor.addEventListener('change', function () {
        window.ALTURA.cambiarTema(interruptor.checked ? 'oscuro' : 'claro');
      });
    }
    pintarBotones();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', conectar);
  } else {
    conectar();
  }
})();