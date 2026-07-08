/* =====================================================
   SUPERNOVA LAVANDERÍA — calculadora.js
   Lógica exclusiva de la página Calculadora de precios:
   contador de cargas, extras y total en tiempo real.
   El resto (header, menú móvil, reveal, año) lo maneja script.js.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const simulador = document.querySelector('.simulador__panel');
  if (!simulador) return;

  const PRECIO_CARGA = 1.50;      // media docena, docena y dos docenas (lavado o secado)
  const PRECIO_ESPECIAL = 3.50;   // edredones (lavado y secado incluidos)
  const PRECIO_EXTRA = 0.25;      // detergente o suavizante, por carga
  const PRECIO_PLANCHADO = 4.00;  // por docena

  const NOMBRES = {
    'media-docena': 'Media docena',
    'docena': 'Docena',
    'dos-docenas': 'Dos docenas',
    'toallas-sabanas': 'Toallas y sábanas',
    'especiales': 'Edredones'
  };

  const TIPOS_CARGA = ['media-docena', 'docena', 'dos-docenas', 'toallas-sabanas'];

  const estado = { 'media-docena': 0, 'docena': 0, 'dos-docenas': 0, 'toallas-sabanas': 0, 'especiales': 0, 'planchado': 0 };
  const secado = { 'media-docena': false, 'docena': false, 'dos-docenas': false, 'toallas-sabanas': false };

  const totalEl = document.getElementById('simulador-total');
  const desgloseEl = document.getElementById('simulador-desglose');
  const whatsappEl = document.getElementById('simulador-whatsapp');
  const chkDetergente = document.getElementById('chk-detergente');
  const chkSuavizante = document.getElementById('chk-suavizante');

  const formatear = (numero) => numero.toFixed(2);

  const actualizarBotonRestar = (tipo) => {
    const fila = simulador.querySelector(`.simulador__fila[data-tipo="${tipo}"]`);
    const boton = fila && fila.querySelector('[data-accion="restar"]');
    if (boton) boton.disabled = estado[tipo] === 0;
  };

  const calcular = () => {
    const desglose = [];
    let total = 0;
    let cargasTotales = 0;

    TIPOS_CARGA.forEach((tipo) => {
      const cantidad = estado[tipo];
      if (cantidad === 0) return;

      cargasTotales += cantidad;
      const lavado = cantidad * PRECIO_CARGA;
      total += lavado;
      desglose.push(`${cantidad} × ${NOMBRES[tipo]} (lavado) — $${formatear(lavado)}`);

      if (secado[tipo]) {
        const secadoTotal = cantidad * PRECIO_CARGA;
        total += secadoTotal;
        desglose.push(`${cantidad} × ${NOMBRES[tipo]} (secado) — $${formatear(secadoTotal)}`);
      }
    });

    if (estado.especiales > 0) {
      cargasTotales += estado.especiales;
      const especialesTotal = estado.especiales * PRECIO_ESPECIAL;
      total += especialesTotal;
      desglose.push(`${estado.especiales} × ${NOMBRES.especiales} (lavado y secado) — $${formatear(especialesTotal)}`);
    }

    if (chkDetergente.checked && cargasTotales > 0) {
      const detergenteTotal = cargasTotales * PRECIO_EXTRA;
      total += detergenteTotal;
      desglose.push(`Detergente en ${cargasTotales} carga(s) — $${formatear(detergenteTotal)}`);
    }

    if (chkSuavizante.checked && cargasTotales > 0) {
      const suavizanteTotal = cargasTotales * PRECIO_EXTRA;
      total += suavizanteTotal;
      desglose.push(`Suavizante en ${cargasTotales} carga(s) — $${formatear(suavizanteTotal)}`);
    }

    if (estado.planchado > 0) {
      const planchadoTotal = estado.planchado * PRECIO_PLANCHADO;
      total += planchadoTotal;
      desglose.push(`${estado.planchado} × Planchado por docena — $${formatear(planchadoTotal)}`);
    }

    totalEl.textContent = formatear(total);
    desgloseEl.innerHTML = desglose.length
      ? desglose.map((linea) => `<li>${linea}</li>`).join('')
      : '<li class="simulador__desglose-vacio">Elige tus cargas para ver el detalle.</li>';

    // Arma un mensaje de WhatsApp con el resumen exacto de lo seleccionado
    let mensaje = 'Hola, quisiera cotizar mi lavado:\n';
    mensaje += desglose.length
      ? `${desglose.map((linea) => `- ${linea}`).join('\n')}\nTotal aproximado: $${formatear(total)}`
      : 'Quisiera más información sobre sus precios.';

    whatsappEl.href = `https://wa.me/50377712215?text=${encodeURIComponent(mensaje)}`;
  };

  simulador.querySelectorAll('[data-accion]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const tipo = boton.dataset.tipo;
      const delta = boton.dataset.accion === 'sumar' ? 1 : -1;
      estado[tipo] = Math.max(0, Math.min(20, estado[tipo] + delta));

      const cantidadEl = simulador.querySelector(`[data-cantidad="${tipo}"]`);
      if (cantidadEl) cantidadEl.textContent = estado[tipo];

      actualizarBotonRestar(tipo);
      calcular();
    });
  });

  simulador.querySelectorAll('[data-secado]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      secado[checkbox.dataset.secado] = checkbox.checked;
      calcular();
    });
  });

  [chkDetergente, chkSuavizante].forEach((checkbox) => {
    checkbox.addEventListener('change', calcular);
  });

  calcular();

});