// Punto de entrada principal de la aplicación (Orquestador)
import { obtenerAnimesPopulares, buscarAnimes } from './api.js';
import { mostrarCargando, mostrarError, renderizarTarjetas } from './ui.js';

// Elementos del buscador en el DOM
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

/**
 * Carga y renderiza los animes populares por defecto.
 */
async function cargarAnimesIniciales() {
  mostrarCargando('Cargando animes populares...');

  try {
    const animes = await obtenerAnimesPopulares();
    renderizarTarjetas(animes);
  } catch (error) {
    mostrarError(error.message);
  }
}

/**
 * Escucha el evento submit del formulario de búsqueda.
 * Aplica event.preventDefault() para no recargar la página y maneja la asincronía con async/await.
 */
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();

  // Si el campo está vacío, se vuelven a mostrar los más populares
  if (!query) {
    await cargarAnimesIniciales();
    return;
  }

  mostrarCargando(`Buscando animes para "${query}"...`);

  try {
    const animes = await buscarAnimes(query);
    renderizarTarjetas(animes);
  } catch (error) {
    mostrarError(error.message);
  }
});

// Inicialización de la aplicación al cargar el script
cargarAnimesIniciales();