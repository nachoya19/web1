// Servicio para consumir la API pública de Kitsu (Módulo API)
import { obtenerDeCache, guardarEnCache } from './storage.js';

const BASE_URL = 'https://kitsu.io/api/edge';
const TRENDING_API_URL = `${BASE_URL}/trending/anime?page[limit]=10`;

/**
 * Función auxiliar privada del módulo para realizar peticiones HTTP o devolver desde caché.
 * Si los datos existen en localStorage, se recuperan al instante sin repetir el fetch (BONUS).
 * @param {string} url - URL a consultar
 * @returns {Promise<Array>} Lista de animes
 */
async function realizarPeticion(url) {
  // 1. Comprobamos si la petición ya está guardada en la caché local
  const datosEnCache = obtenerDeCache(url);
  if (datosEnCache) {
    return datosEnCache;
  }

  // 2. Si no está en caché, realizamos la petición a la API
  const response = await fetch(url);

  // fetch solo rechaza por fallos de red; verificamos el status HTTP manualmente (Unidad 2, pág. 25)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  // 3. Guardamos los datos en localStorage para no repetir la petición en el futuro
  guardarEnCache(url, data.data);

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
