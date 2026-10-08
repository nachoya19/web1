// Módulo de almacenamiento local (Caché con localStorage y JSON)

const CACHE_PREFIX = 'anime_cache_';

/**
 * Obtiene datos previamente cacheados en localStorage.
 * Envuelto en try/catch para evitar caídas si el JSON está corrupto (Unidad 2, pág. 27).
 * @param {string} clave - Identificador o URL de la petición
 * @returns {any|null} Datos deserializados o null si no existe o falla
 */
export function obtenerDeCache(clave) {
  try {
    const registro = localStorage.getItem(`${CACHE_PREFIX}${clave}`);
    return registro ? JSON.parse(registro) : null;
  } catch (error) {
    console.warn(`Error al leer "${clave}" de localStorage:`, error);
    return null;
  }
}

/**
 * Guarda datos en localStorage serializados a texto JSON.
 * Envuelto en try/catch por si la cuota de almacenamiento está llena (Unidad 2, pág. 28).
 * @param {string} clave - Identificador o URL de la petición
 * @param {any} datos - Información a almacenar
 */
export function guardarEnCache(clave, datos) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${clave}`, JSON.stringify(datos));
  } catch (error) {
    console.warn(`Error al guardar "${clave}" en localStorage:`, error);
  }
}
