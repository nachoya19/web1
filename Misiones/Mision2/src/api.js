// Servicio para consumir la API pública de Kitsu (Módulo API)

const BASE_URL = 'https://kitsu.io/api/edge';
const TRENDING_API_URL = `${BASE_URL}/trending/anime?page[limit]=10`;

/**
 * Función auxiliar privada del módulo para realizar peticiones HTTP y procesar respuestas.
 * @param {string} url - URL a consultar
 * @returns {Promise<Array>} Lista de animes
 */
async function realizarPeticion(url) {
  const response = await fetch(url);

  // fetch solo rechaza por fallos de red a nivel de socket; verificamos el status HTTP
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Obtiene los animes en tendencia/populares.
 * @returns {Promise<Array>} Lista de animes populares
 */
export async function obtenerAnimesPopulares() {
  return realizarPeticion(TRENDING_API_URL);
}

/**
 * Busca animes por texto.
 * @param {string} termino - Término de búsqueda ingresado por el usuario
 * @returns {Promise<Array>} Lista de animes que coinciden con el término
 */
export async function buscarAnimes(termino) {
  const url = `${BASE_URL}/anime?filter[text]=${encodeURIComponent(termino)}&page[limit]=10`;
  return realizarPeticion(url);
}
