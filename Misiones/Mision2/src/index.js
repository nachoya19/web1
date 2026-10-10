import { obtenerPopulares, buscarPorTexto } from './api.js';
import { normalizarAnimes, calcularRatingMedio } from './logic.js';
import { guardarEnCache, obtenerDeCache } from './storage.js';
import {
  alternarBotonCarga,
  mostrarEstado,
  mostrarError,
  renderizarMetricas,
  renderizarCatalogo,
} from './ui.js';

// 1. Selección de nodos del DOM (centralizada en el orquestador)
const formBusqueda = document.querySelector('#search-form');
const inputBusqueda = document.querySelector('#search-input');
const btnBusqueda = document.querySelector('#search-btn');
const contenedorEstado = document.querySelector('#status-message');
const contenedorStats = document.querySelector('#stats-info');
const contenedorGrid = document.querySelector('#anime-grid');

/**
 * Función central de flujo:
 * Caché (storage) -> API (red) -> Lógica (map/filter/reduce) -> UI (DOM seguro)
 */
async function procesarConsulta(tipo, termino = '') {
  const claveCache = tipo === 'populares' ? 'populares' : `busqueda_${termino.toLowerCase()}`;

  // 1. Estados de carga y bloqueo de botón
  alternarBotonCarga(btnBusqueda, true);
  mostrarEstado(contenedorEstado, tipo === 'populares' ? 'Cargando animes populares...' : `Buscando "${termino}"...`);
  renderizarMetricas(contenedorStats, 0, 0);

  try {
    let datosBrutos = obtenerDeCache(claveCache);

    // 2. Si no están en caché con TTL válido, pedimos a la red
    if (!datosBrutos) {
      console.log(`[App] Solicitando datos a la API de Kitsu (${tipo})...`);
      datosBrutos = tipo === 'populares' 
        ? await obtenerPopulares() 
        : await buscarPorTexto(termino);

      // Guardamos la respuesta bruta en caché
      guardarEnCache(claveCache, datosBrutos);
    } else {
      console.log(`[App] Datos recuperados desde la caché local (${claveCache}).`);
    }

    // 3. Capa de lógica: filter + map
    const animesProcesados = normalizarAnimes(datosBrutos);

    // 4. Comprobación de lista vacía
    if (animesProcesados.length === 0) {
      mostrarEstado(contenedorEstado, 'No se encontraron resultados para esta búsqueda.');
      renderizarCatalogo(contenedorGrid, []);
      return;
    }

    // 5. Capa de lógica: cálculo con reduce
    const ratingPromedio = calcularRatingMedio(animesProcesados);

    // 6. Renderizado seguro en la interfaz
    mostrarEstado(contenedorEstado, '');
    renderizarMetricas(contenedorStats, animesProcesados.length, ratingPromedio);
    renderizarCatalogo(contenedorGrid, animesProcesados);

  } catch (error) {
    // Si la petición fue abortada por una búsqueda más reciente, se ignora silenciosamente
    if (error.name === 'AbortError') {
      console.log('[App] Petición anterior cancelada por una nueva búsqueda.');
      return;
    }

    console.error('[App] Error en la ejecución:', error.message);
    mostrarError(contenedorEstado, error.message);
    renderizarCatalogo(contenedorGrid, []);
  } finally {
    // Siempre reactivamos el botón al terminar
    alternarBotonCarga(btnBusqueda, false);
  }
}

// Evento de formulario de búsqueda
formBusqueda.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const valor = inputBusqueda.value.trim();

  if (valor === '') {
    procesarConsulta('populares');
    return;
  }

  procesarConsulta('busqueda', valor);
});

// Carga inicial automática al iniciar la aplicación
procesarConsulta('populares');