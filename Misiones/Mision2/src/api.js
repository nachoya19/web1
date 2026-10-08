// Servicio para consumir la API pública de Kitsu (Módulo API)

const BASE_URL = 'https://kitsu.io/api/edge';
const TRENDING_API_URL = `${BASE_URL}/trending/anime?page[limit]=10`;

/**
 * Obtiene los animes en tendencia/populares.
 * @returns {Promise<Array>} Lista de animes
 */
export async function obtenerAnimesPopulares() {
  const response = await fetch(TRENDING_API_URL);

  // fetch solo rechaza por fallos de red; verificamos el estado HTTP manualmente
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}
