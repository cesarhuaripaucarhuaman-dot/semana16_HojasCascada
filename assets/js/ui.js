/* Interacciones comunes: barra al hacer scroll, navegación móvil,
   imágenes con respaldo, aparición progresiva, avisos, diálogos y reloj. */
(function () {
  'use strict';

  var A = window.ALTURA = window.ALTURA || {};

  /* Barra superior */
  var topbar = document.querySelector('[data-topbar]');
  function alDesplazar() {
    if (!topbar) return;
    topbar.classList.toggle('topbar--alta', window.scrollY > 10);
  }
  window.addEventListener('scroll', alDesplazar, { passive: true });
  alDesplazar();

  /* Navegación móvil */
  if (topbar) {
    var abrir = topbar.querySelector('[data-nav-toggle]');
    var cerrarNav = function () {
      topbar.dataset.nav = 'cerrada';
      if (abrir) abrir.setAttribute('aria-expanded', 'false');
    };
    if (abrir) {
      abrir.addEventListener('click', function () {
        var abierta = topbar.dataset.nav === 'abierta';
        topbar.dataset.nav = abierta ? 'cerrada' : 'abierta';
        abrir.setAttribute('aria-expanded', String(!abierta));
      });
      topbar.querySelectorAll('.nav a').forEach(function (enlace) {
        enlace.addEventListener('click', cerrarNav);
      });
      document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') cerrarNav();
      });
      document.addEventListener('click', function (evento) {
        if (!topbar.contains(evento.target)) cerrarNav();
      });
    }
  }

  /* Página activa en el menú */
  var pagina = document.body.dataset.pagina;
  if (pagina) {
    document.querySelectorAll('[data-nav="' + pagina + '"], [data-nav="' + pagina + '"] *').forEach(function (nodo) {
      var enlace = nodo.closest('a');
      if (enlace) enlace.setAttribute('aria-current', 'page');
    });
  }

  /* Imágenes: si el host falla, queda el degradado de respaldo */
  function prepararImagen(img) {
    if (img.classList.contains('cargada') || img.dataset.estado === 'error') return;
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('cargada');
    } else if (img.complete) {
      img.dataset.estado = 'error';
    }
  }
  document.querySelectorAll('img[data-foto]').forEach(function (img) {
    if (img.dataset.estado) return;
    img.addEventListener('load', function () { img.classList.add('cargada'); });
    img.addEventListener('error', function () {
      img.dataset.estado = 'error';
      img.removeAttribute('src');
      img.style.display = 'none';
    });
    prepararImagen(img);
  });

  /* Aparición progresiva */
  var animables = document.querySelectorAll('[data-revelar]');
  if ('IntersectionObserver' in window && animables.length) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('es-visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    animables.forEach(function (nodo) { observador.observe(nodo); });
  } else {
    animables.forEach(function (nodo) { nodo.classList.add('es-visible'); });
  }

  /* Aviso flotante (snackbar) */
  var temporizador;
  A.aviso = function (mensaje) {
    var aviso = document.querySelector('.aviso');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.className = 'aviso';
      aviso.setAttribute('role', 'status');
      aviso.setAttribute('aria-live', 'polite');
      document.body.appendChild(aviso);
    }
    aviso.textContent = mensaje;
    aviso.classList.add('aviso--visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      aviso.classList.remove('aviso--visible');
    }, 4200);
  };

  /* Diálogos nativos */
  document.querySelectorAll('[data-abrir-dialogo]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var dialogo = document.querySelector(boton.dataset.abrirDialogo);
      if (dialogo && typeof dialogo.showModal === 'function') {
        dialogo.showModal();
      }
    });
  });
  document.querySelectorAll('dialog.dialogo').forEach(function (dialogo) {
    dialogo.querySelectorAll('[data-cerrar-dialogo]').forEach(function (boton) {
      boton.addEventListener('click', function () { dialogo.close(); });
    });
    dialogo.addEventListener('click', function (evento) {
      if (evento.target === dialogo) dialogo.close();
    });
  });

  /* Reloj y estado de atención (solo si la página lo pide) */
  var reloj = document.querySelector('[data-reloj]');
  var estado = document.querySelector('[data-estado]');
  function actualizarReloj() {
    if (!reloj) return;
    var ahora = new Date();
    var hora = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(ahora);
    var horaNumero = Number(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Lima', hour: 'numeric', hour12: false
    }).format(ahora));
    var dia = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima', weekday: 'long'
    }).format(ahora);
    var abierto = horaNumero >= 7 && horaNumero < 19 && dia !== 'domingo';
    reloj.textContent = hora;
    if (estado) {
      estado.textContent = abierto ? 'Abierto ahora' : 'Cerrado ahora';
      estado.dataset.abierto = String(abierto);
    }
  }
  actualizarReloj();
  if (reloj) setInterval(actualizarReloj, 30000);

  var anio = document.querySelector('[data-anio]');
  if (anio) anio.textContent = new Date().getFullYear();
})();