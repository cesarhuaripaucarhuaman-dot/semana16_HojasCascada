/* Propuesto 2 · carta interactiva
   Filtros por proceso, pedido persistente y resumen en un <dialog>. */
(function () {
  'use strict';

  var A = window.ALTURA = window.ALTURA || {};
  var CLAVE = 'altura-pedido-v1';
  var tarjetas = Array.prototype.slice.call(document.querySelectorAll('.lote'));
  var productos = {};

  tarjetas.forEach(function (tarjeta) {
    var imagen = tarjeta.querySelector('.lote__media img');
    productos[tarjeta.dataset.id] = {
      nombre: tarjeta.dataset.nombre,
      origen: tarjeta.dataset.origen,
      precio: Number(tarjeta.dataset.precio),
      imagen: imagen ? imagen.getAttribute('src') : ''
    };
  });

  var dialogo = document.getElementById('dialogo-pedido');
  var lista = document.querySelector('[data-pedido-lista]');
  var vacio = document.querySelector('[data-pedido-vacio]');
  var totalEl = document.querySelector('[data-pedido-total]');
  var contador = document.querySelector('[data-contador]');
  var fab = document.querySelector('.fab--pedido');
  var resultado = document.querySelector('[data-resultado]');
  var botonesFiltro = document.querySelectorAll('[data-filtro]');
  var botonesAgregar = document.querySelectorAll('[data-agregar]');
  var botonConfirmar = document.querySelector('[data-confirmar]');
  var pedido = cargar();

  function avisar(texto) {
    if (typeof A.aviso === 'function') A.aviso(texto);
  }

  function cargar() {
    try {
      var guardado = JSON.parse(localStorage.getItem(CLAVE) || '{}');
      var limpio = {};
      Object.keys(guardado).forEach(function (id) {
        var cantidad = Number(guardado[id]);
        if (productos[id] && Number.isInteger(cantidad) && cantidad > 0) {
          limpio[id] = Math.min(cantidad, 20);
        }
      });
      return limpio;
    } catch (e) {
      return {};
    }
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(pedido)); } catch (e) { /* sin persistencia */ }
  }

  function crearIcono(nombre) {
    var icono = document.createElement('span');
    icono.className = 'material-symbols-outlined';
    icono.setAttribute('aria-hidden', 'true');
    icono.textContent = nombre;
    return icono;
  }

  function crearItem(id) {
    var producto = productos[id];
    var cantidad = pedido[id];
    var item = document.createElement('li');
    item.className = 'pedido__item';

    var imagen = document.createElement('img');
    imagen.className = 'pedido__miniatura';
    imagen.src = producto.imagen;
    imagen.alt = '';
    imagen.loading = 'lazy';

    var datos = document.createElement('div');
    datos.className = 'pedido__datos';
    var nombre = document.createElement('strong');
    nombre.textContent = producto.nombre;
    var detalle = document.createElement('small');
    detalle.textContent = producto.origen + ' · S/ ' + producto.precio + ' c/u';
    datos.append(nombre, detalle);

    var control = document.createElement('div');
    control.className = 'pedido__control';

    var stepper = document.createElement('div');
    stepper.className = 'pedido__cantidad';

    var menos = document.createElement('button');
    menos.type = 'button';
    menos.dataset.accion = 'menos';
    menos.dataset.id = id;
    menos.setAttribute('aria-label', 'Quitar una unidad de ' + producto.nombre);
    menos.appendChild(crearIcono('remove'));

    var numero = document.createElement('span');
    numero.textContent = cantidad;
    numero.setAttribute('aria-label', cantidad + ' unidades');

    var mas = document.createElement('button');
    mas.type = 'button';
    mas.dataset.accion = 'mas';
    mas.dataset.id = id;
    mas.setAttribute('aria-label', 'Añadir una unidad de ' + producto.nombre);
    mas.appendChild(crearIcono('add'));

    stepper.append(menos, numero, mas);

    var linea = document.createElement('span');
    linea.className = 'pedido__linea';
    linea.textContent = 'S/ ' + (producto.precio * cantidad);

    control.append(stepper, linea);
    item.append(imagen, datos, control);
    return item;
  }

  function actualizar() {
    var ids = Object.keys(pedido);
    var unidades = 0;
    var total = 0;

    lista.replaceChildren();
    ids.forEach(function (id) {
      unidades += pedido[id];
      total += pedido[id] * productos[id].precio;
      lista.appendChild(crearItem(id));
    });

    contador.textContent = unidades;
    contador.hidden = unidades === 0;
    fab.setAttribute('aria-label', 'Ver pedido, ' + unidades + (unidades === 1 ? ' artículo' : ' artículos'));
    lista.hidden = unidades === 0;
    vacio.hidden = unidades > 0;
    totalEl.textContent = 'S/ ' + total;
    if (dialogo) dialogo.classList.toggle('pedido--vacio', unidades === 0);
  }

  function pulsarFab() {
    if (!fab) return;
    fab.classList.remove('fab--pulso');
    void fab.offsetWidth;
    fab.classList.add('fab--pulso');
    window.setTimeout(function () { fab.classList.remove('fab--pulso'); }, 450);
  }

  botonesAgregar.forEach(function (boton) {
    var id = boton.closest('.lote').dataset.id;
    var texto = boton.querySelector('span:not(.material-symbols-outlined)');
    var icono = boton.querySelector('.material-symbols-outlined');
    var temporizador;

    boton.addEventListener('click', function () {
      pedido[id] = (pedido[id] || 0) + 1;
      guardar();
      actualizar();
      pulsarFab();
      avisar(productos[id].nombre + ' añadido al pedido · ' + productos[id].origen);

      boton.classList.add('es-agregado');
      icono.textContent = 'check';
      texto.textContent = 'Añadido';
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(function () {
        boton.classList.remove('es-agregado');
        icono.textContent = 'add';
        texto.textContent = 'Añadir';
      }, 1250);
    });
  });

  botonesFiltro.forEach(function (boton) {
    boton.addEventListener('click', function () {
      botonesFiltro.forEach(function (otro) {
        otro.setAttribute('aria-pressed', String(otro === boton));
      });
      var filtro = boton.dataset.filtro;
      var visibles = 0;

      tarjetas.forEach(function (tarjeta) {
        var mostrar = filtro === 'todos' || tarjeta.dataset.proceso === filtro;
        tarjeta.classList.toggle('oculta', !mostrar);
        if (mostrar) {
          visibles++;
          tarjeta.style.animation = 'none';
          void tarjeta.offsetWidth;
          tarjeta.style.animation = '';
        }
      });

      if (resultado) resultado.textContent = visibles + (visibles === 1 ? ' lote' : ' lotes');
    });
  });

  if (lista) {
    lista.addEventListener('click', function (evento) {
      var boton = evento.target.closest('[data-accion]');
      if (!boton) return;
      var id = boton.dataset.id;
      if (!pedido[id]) return;

      if (boton.dataset.accion === 'mas') {
        pedido[id] += 1;
      } else {
        pedido[id] -= 1;
        if (pedido[id] <= 0) delete pedido[id];
      }
      guardar();
      actualizar();
    });
  }

  if (botonConfirmar) {
    botonConfirmar.addEventListener('click', function () {
      if (!Object.keys(pedido).length) return;
      pedido = {};
      guardar();
      actualizar();
      if (dialogo) dialogo.close();
      avisar('Pedido confirmado. Te escribimos para coordinar entrega y pago.');
    });
  }

  actualizar();
})();