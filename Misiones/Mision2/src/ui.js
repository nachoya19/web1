/**
 * 1. Control de estado del botón de envío (evita clics duplicados)
 */
export function alternarBotonCarga(boton, cargando) {
  if (!boton) return;
  boton.disabled = cargando;
  boton.textContent = cargando ? 'Buscando...' : 'Buscar';
}

/**
 * 2. Visualización de mensajes de estado (Cargando / Informativos)
 */
export function mostrarEstado(contenedorEstado, mensaje) {
  if (!contenedorEstado) return;
  contenedorEstado.textContent = mensaje;
  contenedorEstado.className = 'status-msg';
}

/**
 * 3. Visualización de errores con textContent (previene XSS en mensajes)
 */
export function mostrarError(contenedorEstado, mensajeError) {
  if (!contenedorEstado) return;
  contenedorEstado.textContent = mensajeError;
  contenedorEstado.className = 'status-msg error';
}

/**
 * 4. Muestra la métrica calculada con reduce en la capa de lógica
 */
export function renderizarMetricas(contenedorStats, cantidad, mediaRating) {
  if (!contenedorStats) return;

  if (cantidad === 0) {
    contenedorStats.textContent = '';
    return;
  }

  const textoRating = mediaRating > 0 ? `★ ${mediaRating}% media` : 'Sin calificación media';
  contenedorStats.textContent = `Mostrando ${cantidad} animes | Valoración promedio: ${textoRating}`;
}

/**
 * 5. Renderizado seguro en el DOM usando createElement y textContent
 * Recibe el contenedor del grid y el array de animes ya normalizado por logic.js
 */
export function renderizarCatalogo(contenedorGrid, animes) {
  if (!contenedorGrid) return;
  
  // Vaciamos el contenedor previo
  contenedorGrid.replaceChildren();

  if (!animes || animes.length === 0) {
    return;
  }

  // Fragmento de documento para minimizar reflujos (reflow/layout) en el DOM
  const fragmento = document.createDocumentFragment();

  animes.forEach((anime) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'anime-card';

    // Imagen con fallback y alt seguro
    const img = document.createElement('img');
    img.src = anime.imagen;
    img.alt = anime.titulo;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'anime-card-content';

    // Título seguro con textContent
    const titulo = document.createElement('h3');
    titulo.textContent = anime.titulo;

    // Valoración
    const rating = document.createElement('span');
    rating.className = 'anime-rating';
    rating.textContent = anime.rating !== null ? `★ ${anime.rating}%` : 'Sin calificación';

    // Sinopsis truncada y segura
    const sinopsis = document.createElement('p');
    sinopsis.className = 'anime-synopsis';
    sinopsis.textContent = anime.sinopsis.length > 120 
      ? `${anime.sinopsis.slice(0, 120)}...` 
      : anime.sinopsis;

    info.append(titulo, rating, sinopsis);
    tarjeta.append(img, info);
    fragmento.appendChild(tarjeta);
  });

  contenedorGrid.appendChild(fragmento);
}