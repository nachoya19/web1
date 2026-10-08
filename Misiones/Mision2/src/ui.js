// Módulo de interfaz de usuario (DOM y Renderizado)

// Selección de elementos del DOM
const container = document.querySelector('#anime-grid');
const statusMessage = document.querySelector('#status-message');

/**
 * Muestra el estado de carga en la interfaz.
 * @param {string} mensaje
 */
export function mostrarCargando(mensaje = 'Cargando animes...') {
  statusMessage.textContent = mensaje;
  statusMessage.className = 'status-msg';
  container.innerHTML = '';
}

/**
 * Muestra el estado de error en la interfaz.
 * @param {string} mensaje
 */
export function mostrarError(mensaje) {
  statusMessage.textContent = `Error: ${mensaje}`;
  statusMessage.className = 'status-msg error';
  container.innerHTML = '';
}

/**
 * Renderiza las tarjetas de anime en el DOM usando métodos de array (.map) y template literals.
 * Maneja también el estado de lista vacía.
 * @param {Array} listaAnimes
 */
export function renderizarTarjetas(listaAnimes) {
  if (!listaAnimes || listaAnimes.length === 0) {
    statusMessage.textContent = 'No hay resultados disponibles.';
    statusMessage.className = 'status-msg';
    container.innerHTML = '';
    return;
  }

  // Limpiamos el mensaje de estado al mostrar datos con éxito
  statusMessage.textContent = '';

  // Pipeline funcional: transformamos el array de objetos a un string HTML
  const tarjetasHTML = listaAnimes
    .map((item) => {
      const { canonicalTitle, posterImage, synopsis, averageRating } = item.attributes;

      const imagen = posterImage?.medium ?? 'https://via.placeholder.com/200x300';
      const valoracion = averageRating ? `⭐️ ${averageRating}%` : 'Sin valoración';
      const descripcion = synopsis
        ? `${synopsis.slice(0, 110)}...`
        : 'Sin sinopsis disponible.';

      return `
        <article class="anime-card">
          <img src="${imagen}" alt="${canonicalTitle}" loading="lazy" />
          <div class="anime-card-content">
            <h3>${canonicalTitle}</h3>
            <span class="anime-rating">${valoracion}</span>
            <p class="anime-synopsis">${descripcion}</p>
          </div>
        </article>
      `;
    })
    .join('');

  container.innerHTML = tarjetasHTML;
}
