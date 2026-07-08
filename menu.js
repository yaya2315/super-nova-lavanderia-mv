/* =====================================================
   SUPERNOVA LAVANDERÍA — menu.js
   Lógica exclusiva de la página de Lista de precios:
   filtros por tipo de carga y contador animado de precios.
   El resto (header, menú móvil, reveal, año) lo maneja script.js.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Filtros de precios ---------- */
  const botonesFiltro = document.querySelectorAll('.filtro');
  const tarjetasPrecio = document.querySelectorAll('.precio-tarjeta');

  const activarFiltro = (categoria) => {
    tarjetasPrecio.forEach((tarjeta) => {
      const coincide = categoria === 'todos' || tarjeta.dataset.categoria === categoria;

      if (coincide) {
        tarjeta.hidden = false;
        // Se libera en el siguiente frame para que la transición de entrada se note
        requestAnimationFrame(() => tarjeta.classList.remove('precio-tarjeta--saliendo'));
      } else if (prefiereMenosMovimiento) {
        tarjeta.hidden = true;
      } else {
        tarjeta.classList.add('precio-tarjeta--saliendo');
        tarjeta.addEventListener('transitionend', function ocultar(evento) {
          if (evento.propertyName !== 'opacity') return;
          if (tarjeta.classList.contains('precio-tarjeta--saliendo')) tarjeta.hidden = true;
          tarjeta.removeEventListener('transitionend', ocultar);
        });
      }
    });
  };

  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach((otro) => otro.setAttribute('aria-selected', String(otro === boton)));
      activarFiltro(boton.dataset.filtro);
    });
  });

  // Estado inicial: todas las cargas visibles
  if (botonesFiltro.length) {
    botonesFiltro[0].setAttribute('aria-selected', 'true');
  }

  /* ---------- Contador animado de precios ---------- */
  const numerosPrecio = document.querySelectorAll('.precio-tarjeta__numero');

  const animarNumero = (elemento) => {
    const destino = parseFloat(elemento.dataset.precio);
    if (Number.isNaN(destino)) return;

    if (prefiereMenosMovimiento) {
      elemento.textContent = destino.toFixed(2);
      return;
    }

    const duracion = 800;
    const inicio = performance.now();

    const paso = (ahora) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const facilitado = 1 - Math.pow(1 - progreso, 3); // ease-out cúbico
      elemento.textContent = (destino * facilitado).toFixed(2);
      if (progreso < 1) requestAnimationFrame(paso);
    };

    requestAnimationFrame(paso);
  };

  if ('IntersectionObserver' in window) {
    const observadorPrecios = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          animarNumero(entrada.target);
          observadorPrecios.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.4 });

    numerosPrecio.forEach((numero) => observadorPrecios.observe(numero));
  } else {
    numerosPrecio.forEach(animarNumero);
  }

});
