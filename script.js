/* =====================================================
   SUPERNOVA LAVANDERÍA — script.js
   Menú móvil, header con scroll, acordeón FAQ,
   animaciones de entrada (IntersectionObserver) y
   resaltado de navegación activa.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header con estado "scrolleado" ---------- */
  const header = document.getElementById('header');
  const alScrollear = () => {
    header.classList.toggle('con-scroll', window.scrollY > 8);
  };
  alScrollear();
  window.addEventListener('scroll', alScrollear, { passive: true });

  /* ---------- Botón flotante de WhatsApp + CTA del header: se turnan al pasar el hero ---------- */
  const flotante = document.getElementById('wpp-flotante');
  const wppHeader = document.getElementById('wpp-header');
  const hero = document.getElementById('inicio');

  const actualizarFlotante = (mostrarFlotante) => {
    flotante.classList.toggle('visible', mostrarFlotante);

    // Evita que un elemento invisible quede enfocable por teclado
    if (mostrarFlotante) {
      flotante.removeAttribute('tabindex');
      flotante.removeAttribute('aria-hidden');
    } else {
      flotante.setAttribute('tabindex', '-1');
      flotante.setAttribute('aria-hidden', 'true');
    }

    // El botón del header hace lo contrario: solo hace falta antes de que exista el flotante
    if (wppHeader) {
      wppHeader.classList.toggle('oculto', mostrarFlotante);
      if (mostrarFlotante) {
        wppHeader.setAttribute('tabindex', '-1');
        wppHeader.setAttribute('aria-hidden', 'true');
      } else {
        wppHeader.removeAttribute('tabindex');
        wppHeader.removeAttribute('aria-hidden');
      }
    }
  };

  if (hero && 'IntersectionObserver' in window) {
    const observadorHero = new IntersectionObserver(([entrada]) => {
      // Deja de considerarse "hero visible" una vez pasado ~60% de su altura
      actualizarFlotante(!entrada.isIntersecting);
    }, { threshold: 0, rootMargin: '-60% 0px 0px 0px' });

    observadorHero.observe(hero);
  } else {
    actualizarFlotante(true);
  }

  /* ---------- Menú móvil ---------- */
  const btnMenu = document.getElementById('btnMenu');
  const nav = document.getElementById('nav');
  const btnMas = document.getElementById('btnMas');
  const submenuMas = document.getElementById('submenu-mas');

  const cerrarSubmenu = () => {
    if (!btnMas || !submenuMas) return;
    submenuMas.classList.remove('abierto');
    btnMas.setAttribute('aria-expanded', 'false');
  };

  const cerrarMenu = () => {
    nav.classList.remove('abierto');
    btnMenu.setAttribute('aria-expanded', 'false');
    btnMenu.setAttribute('aria-label', 'Abrir menú de navegación');
    cerrarSubmenu();
  };

  const alternarMenu = () => {
    const abierto = nav.classList.toggle('abierto');
    btnMenu.setAttribute('aria-expanded', String(abierto));
    btnMenu.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  };

  btnMenu.addEventListener('click', alternarMenu);

  nav.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', cerrarMenu);
  });

  /* ---------- Submenú "Más" (agrupa Nosotros, Cómo funciona, Galería y Preguntas) ---------- */
  if (btnMas && submenuMas) {
    btnMas.addEventListener('click', (evento) => {
      evento.stopPropagation();
      const abierto = submenuMas.classList.toggle('abierto');
      btnMas.setAttribute('aria-expanded', String(abierto));
    });

    // En escritorio, un clic fuera del submenú lo cierra
    document.addEventListener('click', (evento) => {
      if (!submenuMas.contains(evento.target) && evento.target !== btnMas) {
        cerrarSubmenu();
      }
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && submenuMas.classList.contains('abierto')) {
        cerrarSubmenu();
        btnMas.focus();
      }
    });
  }

  /* ---------- Acordeón de preguntas frecuentes ---------- */
  const preguntas = document.querySelectorAll('.acordeon__pregunta');

  preguntas.forEach((boton) => {
    const respuesta = boton.closest('.acordeon__item').querySelector('.acordeon__respuesta');

    boton.addEventListener('click', () => {
      const estaAbierta = boton.getAttribute('aria-expanded') === 'true';

      // Cierra las demás preguntas para mantener la lista ordenada
      preguntas.forEach((otroBoton) => {
        if (otroBoton !== boton) {
          otroBoton.setAttribute('aria-expanded', 'false');
          otroBoton.closest('.acordeon__item').querySelector('.acordeon__respuesta').style.maxHeight = null;
        }
      });

      boton.setAttribute('aria-expanded', String(!estaAbierta));
      respuesta.style.maxHeight = estaAbierta ? null : respuesta.scrollHeight + 'px';
    });
  });

  /* ---------- Animación de entrada al hacer scroll ---------- */
  const elementosReveal = document.querySelectorAll('.reveal');

  if (prefiereMenosMovimiento || !('IntersectionObserver' in window)) {
    elementosReveal.forEach((el) => el.classList.add('visible'));
  } else {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elementosReveal.forEach((el) => observador.observe(el));
  }

  /* ---------- Resaltado del enlace activo en la navegación ---------- */
  const secciones = document.querySelectorAll('main section[id]');
  const enlacesNav = document.querySelectorAll('.nav__lista a');

  if ('IntersectionObserver' in window && secciones.length) {
    const observadorNav = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const id = entrada.target.getAttribute('id');
          enlacesNav.forEach((enlace) => {
            enlace.classList.toggle('activo', enlace.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '-80px 0px -55% 0px' });

    secciones.forEach((seccion) => observadorNav.observe(seccion));
  }

  /* ---------- Tambor interactivo: Misión / Visión / Valores ---------- */
  const visualTambor = document.getElementById('tamborVisual');
  const displayTambor = document.getElementById('tamborDisplay');

  if (visualTambor && displayTambor) {
    const tokensTambor = visualTambor.querySelectorAll('.token');
    const contenidoIdle = displayTambor.innerHTML; // estado inicial, para restablecerlo
    let fijado = null; // data-token anclado por click/tap/Enter, si existe

    const construirEstado = (token) => {
      const titulo = token.dataset.titulo;
      const texto = token.dataset.texto;
      const iconoOriginal = token.querySelector('.token__icono');
      const iconoSvg = iconoOriginal ? iconoOriginal.innerHTML : '';

      return `<div class="tambor__display-estado tambor__display-estado--activo">
        <span class="tambor__display-icono" aria-hidden="true">
          <svg viewBox="-18 -18 36 36" width="20" height="20" stroke="currentColor" stroke-width="1.6" fill="none">${iconoSvg}</svg>
        </span>
        <h3>${titulo}</h3>
        <p>${texto}</p>
      </div>`;
    };

    const activarToken = (nombre) => {
      const token = visualTambor.querySelector(`.token[data-token="${nombre}"]`);
      if (!token) return;

      visualTambor.classList.add('interactuando');
      tokensTambor.forEach((t) => {
        const esEste = t.dataset.token === nombre;
        t.classList.toggle('token--activo', esEste);
        t.classList.toggle('token--dim', !esEste);
      });

      displayTambor.innerHTML = construirEstado(token);
    };

    const restablecerTambor = () => {
      if (fijado) return; // uno anclado por click no se suelta con mouseleave/blur
      visualTambor.classList.remove('interactuando');
      tokensTambor.forEach((t) => t.classList.remove('token--activo', 'token--dim'));
      displayTambor.innerHTML = contenidoIdle;
    };

    const alternarFijado = (nombre) => {
      if (fijado === nombre) {
        fijado = null;
        restablecerTambor();
      } else {
        fijado = nombre;
        activarToken(nombre);
      }
    };

    tokensTambor.forEach((token) => {
      const nombre = token.dataset.token;

      token.addEventListener('mouseenter', () => { if (!fijado) activarToken(nombre); });
      token.addEventListener('mouseleave', restablecerTambor);
      token.addEventListener('focus', () => { if (!fijado) activarToken(nombre); });
      token.addEventListener('blur', restablecerTambor);
      token.addEventListener('click', () => alternarFijado(nombre));

      // Los elementos SVG no tienen .click() nativo: Enter/Espacio llaman
      // directamente a la misma función que usa el listener de click.
      token.addEventListener('keydown', (evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          alternarFijado(nombre);
        }
      });
    });

    // Tocar/dar clic fuera del tambor suelta el valor anclado
    document.addEventListener('click', (evento) => {
      if (fijado && !visualTambor.contains(evento.target)) {
        fijado = null;
        restablecerTambor();
      }
    });
  }

  /* ---------- Año dinámico en el pie de página ---------- */
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

});