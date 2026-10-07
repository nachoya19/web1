// URL para obtener los animes en tendencia/populares (10 resultados)
const TRENDING_API_URL = 'https://kitsu.io/api/edge/trending/anime?page[limit]=10';

// 1. Selección de elementos del DOM
const container = document.querySelector('#anime-grid');
const statusMessage = document.querySelector('#status-message');

// 2. Funciones para representar los estados de la interfaz
function mostrarCargando() {
  statusMessage.textContent = 'Cargando animes populares...';
  statusMessage.className = 'status-msg';
  container.innerHTML = '';
}

function mostrarError(mensaje) {
  statusMessage.textContent = `Error: ${mensaje}`;
  statusMessage.className = 'status-msg error';
  container.innerHTML = '';
}

// 3. Renderizado funcional mediante .map() y template literals
function renderizarTarjetas(listaAnimes) {
  if (listaAnimes.length === 0) {
    statusMessage.textContent = 'No hay resultados disponibles.';
    container.innerHTML = '';
    return;
  }

  // Limpiamos el mensaje de estado al haber datos
  statusMessage.textContent = '';

  // Pipeline funcional: transformamos el array de objetos a un string de HTML
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

// 4. Función asíncrona que consume la API
async function cargarAnimesPopulares() {
  mostrarCargando();

  try {
    const response = await fetch(TRENDING_API_URL);

    // fetch solo rechaza por fallos de red; verificamos el estado HTTP manualmente
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Verificamos por consola la estructura recibida (apitest)
    console.log('Datos recibidos de Kitsu:', data.data);

    // Renderizamos los animes obtenidos
    renderizarTarjetas(data.data);

  } catch (error) {
    console.error('Error al solicitar los datos:', error.message);
    mostrarError(error.message);
  } finally {
    console.log('Petición completada');
  }
}

// 5. Ejecución inicial al cargar el script
cargarAnimesPopulares();