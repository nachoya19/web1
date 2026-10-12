// Imagen de reserva en formato SVG embebido
export const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1e2e"/><text x="50%" y="50%" fill="%238a92b2" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">Sin Imagen</text></svg>';

// Nodos del DOM centralizados en el modulo de interfaz
export const dom = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-input'),
  btnBuscar: document.querySelector('#search-btn'),
  sortBtn: document.querySelector('#sort-btn'),
  filterRating: document.querySelector('#filter-rating'),
  favFilterBtn: document.querySelector('#fav-filter-btn'),
  statusBox: document.querySelector('#status-message'),
  statsBox: document.querySelector('#stats-info'),
  grid: document.querySelector('#anime-grid'),
  modal: document.querySelector('#anime-modal'),
  modalBody: document.querySelector('#modal-body'),
  modalClose: document.querySelector('#modal-close'),
};

// Ajusta el texto del boton distinguiendo entre carga inicial y busqueda
export function alternarBotonCarga(boton, cargando, tipo = 'busqueda') {
  if (!boton) return;
  boton.disabled = cargando;
  if (cargando) {
    boton.textContent = tipo === 'populares' ? 'Cargando...' : 'Buscando...';
  } else {
    boton.textContent = 'Buscar';
  }
}

// Renderiza un spinner animado sin utilizar innerHTML
export function mostrarCargando(contenedor) {
  if (!contenedor) return;
  contenedor.replaceChildren();

  const wrapper = document.createElement('div');
  wrapper.className = 'spinner-wrapper';

  const spinner = document.createElement('div');
  spinner.className = 'spinner';

  const texto = document.createElement('p');
  texto.textContent = 'Sincronizando con Kitsu...';

  wrapper.append(spinner, texto);
  contenedor.appendChild(wrapper);
}

// Muestra aviso de error con accion para reintentar la solicitud
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

// Limpia el contenido de cualquier contenedor
export function limpiarEstado(contenedor) {
  if (contenedor) contenedor.replaceChildren();
}

// Renderiza el balance numerico y el desglose de animes
export function renderizarMetricas(contenedor, total, media, estados, origen = '') {
  if (!contenedor) return;
  if (total === 0 || media === null) {
    contenedor.textContent = '';
    return;
  }

  const detalleEstados = Object.entries(estados)
    .map(([est, cant]) => `${est}: ${cant}`)
    .join(' · ');

  const extraOrigen = origen ? ` | ${origen}` : '';
  contenedor.textContent = `Mostrando ${total} animes | ★ ${media}% media | ${detalleEstados}${extraOrigen}`;
}

// Construye e inyecta la coleccion de tarjetas usando transformacion map
export function renderizarCatalogo(contenedorGrid, animes, opciones = {}) {
  if (!contenedorGrid) return;
  contenedorGrid.replaceChildren();

  const { onVerDetalle, onToggleFavorito, esFavoritoFn } = opciones;

  // Renderizado seguro del mensaje de lista vacia
  if (!animes || animes.length === 0) {
    const msgVacio = document.createElement('p');
    msgVacio.className = 'status-empty';
    msgVacio.textContent = 'No se encontraron resultados para los filtros seleccionados.';
    contenedorGrid.appendChild(msgVacio);
    return;
  }

  const fragmento = document.createDocumentFragment();

  const nodos = animes.map((anime) => {
    const article = document.createElement('article');
    article.className = 'anime-card';

    const img = document.createElement('img');
    img.src = anime.imagen ?? PLACEHOLDER_IMG;
    img.alt = anime.titulo;
    img.loading = 'lazy';
    // Reemplaza por placeholder si falla la carga remota
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
    sinopsis.textContent = anime.sinopsis.length > 120 
      ? `${anime.sinopsis.slice(0, 120)}...` 
      : anime.sinopsis;

    // Fila de acciones interactivas de la tarjeta
    const acciones = document.createElement('div');
    acciones.className = 'anime-actions';

    const btnDetalle = document.createElement('button');
    btnDetalle.type = 'button';
    btnDetalle.className = 'card-btn detail-btn';
    btnDetalle.textContent = 'Ver detalle';
    btnDetalle.addEventListener('click', () => {
      if (typeof onVerDetalle === 'function') onVerDetalle(anime);
    });

    const esFav = esFavoritoFn ? esFavoritoFn(anime.id) : false;
    const btnFav = document.createElement('button');
    btnFav.type = 'button';
    btnFav.className = `card-btn fav-btn ${esFav ? 'is-fav' : ''}`;
    btnFav.textContent = esFav ? '★ Favorito' : '☆ Favorito';
    btnFav.addEventListener('click', () => {
      if (typeof onToggleFavorito === 'function') onToggleFavorito(anime.id);
    });

    acciones.append(btnDetalle, btnFav);
    info.append(header, sinopsis, acciones);
    article.append(img, info);

    return article;
  });

  fragmento.append(...nodos);
  contenedorGrid.appendChild(fragmento);
}

// Abre el modal mostrando la ficha completa del anime
export function abrirModalDetalle(modal, modalBody, anime) {
  if (!modal || !modalBody || !anime) return;
  modalBody.replaceChildren();

  const contenedor = document.createElement('div');
  contenedor.className = 'modal-detail-content';

  const img = document.createElement('img');
  img.src = anime.imagenGrande ?? anime.imagen ?? PLACEHOLDER_IMG;
  img.alt = anime.titulo;
  img.className = 'modal-poster';
  img.onerror = () => {
    img.src = PLACEHOLDER_IMG;
    img.onerror = null;
  };

  const info = document.createElement('div');
  info.className = 'modal-info';

  const titulo = document.createElement('h2');
  titulo.textContent = anime.titulo;

  const datos = document.createElement('div');
  datos.className = 'modal-meta';

  const badgeTipo = document.createElement('span');
  badgeTipo.className = 'badge-tipo';
  badgeTipo.textContent = anime.tipo;

  const badgeNota = document.createElement('span');
  badgeNota.className = 'anime-rating';
  badgeNota.textContent = anime.rating !== null ? `★ ${anime.rating}%` : 'Sin calificación';

  const badgeEp = document.createElement('span');
  badgeEp.className = 'badge-ep';
  badgeEp.textContent = `${anime.episodios} episodios`;

  const badgeEst = document.createElement('span');
  badgeEst.className = 'badge-estado';
  badgeEst.textContent = `${anime.estado} (${anime.año})`;

  datos.append(badgeTipo, badgeNota, badgeEp, badgeEst);

  const sinopsisTitulo = document.createElement('h4');
  sinopsisTitulo.textContent = 'Sinopsis completa';

  const sinopsis = document.createElement('p');
  sinopsis.className = 'modal-synopsis';
  sinopsis.textContent = anime.sinopsis;

  const link = document.createElement('a');
  link.className = 'anime-link';
  link.href = anime.enlaceKitsu;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Abrir ficha oficial en Kitsu ↗';

  info.append(titulo, datos, sinopsisTitulo, sinopsis, link);
  contenedor.append(img, info);
  modalBody.appendChild(contenedor);

  modal.showModal();
}

// Cierra el modal de detalle
export function cerrarModalDetalle(modal) {
  if (modal && typeof modal.close === 'function') {
    modal.close();
  }
}