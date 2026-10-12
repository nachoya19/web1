// Imagen de sustitucion en formato SVG
export const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%232e303a"/><text x="50%" y="50%" fill="%239ca3af" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">Sin Imagen</text></svg>';

// Cambia el estado de habilitacion y texto del boton
export function alternarBotonCarga(boton, cargando) {
  if (!boton) return;
  boton.disabled = cargando;
  boton.textContent = cargando ? 'Buscando...' : 'Buscar';
}

// Muestra el indicador visual de carga
export function mostrarCargando(contenedor) {
  if (!contenedor) return;
  contenedor.innerHTML = `
    <div class="spinner-wrapper">
      <div class="spinner"></div>
      <p>Sincronizando con Kitsu...</p>
    </div>
  `;
}

// Muestra mensaje de error con boton para reintentar la accion
export function mostrarErrorConReintento(contenedor, mensajeError, callbackReintento) {
  if (!contenedor) return;
  contenedor.replaceChildren();

  const wrapper = document.createElement('div');
  wrapper.className = 'error-box';

  const texto = document.createElement('p');
  texto.textContent = mensajeError;

  const btnReintentar = document.createElement('button');
  btnReintentar.className = 'retry-btn';
  btnReintentar.textContent = 'Reintentar petición';
  btnReintentar.type = 'button';
  btnReintentar.addEventListener('click', callbackReintento, { once: true });

  wrapper.append(texto, btnReintentar);
  contenedor.appendChild(wrapper);
}

// Vacia el contenido del contenedor de estado
export function limpiarEstado(contenedor) {
  if (contenedor) contenedor.replaceChildren();
}

// Muestra el resumen de animes, media y desglose por estado
export function renderizarMetricas(contenedor, total, media, estados) {
  if (!contenedor) return;
  if (total === 0 || media === null) {
    contenedor.textContent = '';
    return;
  }

  const detalleEstados = Object.entries(estados)
    .map(([est, cant]) => `${est}: ${cant}`)
    .join(' · ');

  contenedor.textContent = `Mostrando ${total} animes | ★ ${media}% media | ${detalleEstados}`;
}

// Construye e inserta las tarjetas del catalogo en el DOM
export function renderizarCatalogo(contenedorGrid, animes) {
  if (!contenedorGrid) return;
  contenedorGrid.replaceChildren();

  // Muestra mensaje cuando la lista esta vacia
  if (!animes || animes.length === 0) {
    contenedorGrid.innerHTML = '<p class="status-empty">No se encontraron resultados para los filtros indicados.</p>';
    return;
  }

  const fragmento = document.createDocumentFragment();

  // Genera cada tarjeta mediante transformacion funcional
  const nodos = animes.map((anime) => {
    const article = document.createElement('article');
    article.className = 'anime-card';

    const img = document.createElement('img');
    img.src = anime.imagen ?? PLACEHOLDER_IMG;
    img.alt = anime.titulo;
    img.loading = 'lazy';
    // Asigna imagen de respaldo si la carga falla
    img.onerror = () => {
      img.src = PLACEHOLDER_IMG;
      img.onerror = null;
    };

    const info = document.createElement('div');
    info.className = 'anime-card-content';

    const header = document.createElement('div');
    header.className = 'anime-card-header';

    const titulo = document.createElement('h3');
    titulo.textContent = anime.titulo;

    const badges = document.createElement('div');
    badges.className = 'anime-badges';

    const tipo = document.createElement('span');
    tipo.className = 'badge-tipo';
    tipo.textContent = anime.tipo;

    const rating = document.createElement('span');
    rating.className = 'anime-rating';
    rating.textContent = anime.rating !== null ? `★ ${anime.rating}%` : 'N/A';

    const ep = document.createElement('span');
    ep.className = 'badge-ep';
    ep.textContent = `${anime.episodios} ep.`;

    const estado = document.createElement('span');
    estado.className = 'badge-estado';
    estado.textContent = `${anime.estado} (${anime.año})`;

    badges.append(tipo, rating, ep, estado);
    header.append(titulo, badges);

    const sinopsis = document.createElement('p');
    sinopsis.className = 'anime-synopsis';
    sinopsis.textContent = anime.sinopsis.length > 130 
      ? `${anime.sinopsis.slice(0, 130)}...` 
      : anime.sinopsis;

    const link = document.createElement('a');
    link.className = 'anime-link';
    link.href = anime.enlaceKitsu;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Ver en Kitsu ↗';

    info.append(header, sinopsis, link);
    article.append(img, info);
    return article;
  });

  fragmento.append(...nodos);
  contenedorGrid.appendChild(fragmento);
}