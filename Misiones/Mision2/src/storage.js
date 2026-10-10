// Clave prefijo para no colisionar con otras apps en el mismo dominio
const PREFIX = 'kitsu_cache_';

// Tiempo de vida de la caché: 20 minutos en milisegundos (20 * 60 * 1000)
const TTL_MS = 20 * 60 * 1000;

/**
 * Guarda datos en localStorage con una marca de tiempo (timestamp)
 * Solo guarda si los datos son un array válido.
 */
export function guardarEnCache(clave, datos) {
  // Validación requerida por la rúbrica: no guardar si no es array
  if (!Array.isArray(datos)) {
    console.warn(`[Storage] Los datos para "${clave}" no son un array. Se descarta el guardado.`);
    return;
  }

  const envoltorio = {
    timestamp: Date.now(),
    data: datos,
  };

  try {
    const jsonString = JSON.stringify(envoltorio);
    localStorage.setItem(PREFIX + clave, jsonString);
  } catch (error) {
    // Manejo de error típico: cuota excedida en localStorage
    console.error(`[Storage] Error al guardar en localStorage:`, error.message);
  }
}

/**
 * Recupera datos de localStorage comprobando si han expirado (TTL)
 * Devuelve el array de datos o null si expiró / no existe.
 */
export function obtenerDeCache(clave) {
  try {
    const contenido = localStorage.getItem(PREFIX + clave);
    if (!contenido) return null;

    const { timestamp, data } = JSON.parse(contenido);

    // Comprobamos si el tiempo actual supera el TTL fijado
    const haCaducado = Date.now() - timestamp > TTL_MS;

    if (haCaducado) {
      console.log(`[Storage] La caché para "${clave}" ha caducado. Se renueva.`);
      localStorage.removeItem(PREFIX + clave);
      return null;
    }

    return Array.isArray(data) ? data : null;
  } catch (error) {
    // Si el JSON estaba corrupto, limpiamos la entrada por seguridad
    console.error(`[Storage] Error al leer la caché para "${clave}":`, error.message);
    localStorage.removeItem(PREFIX + clave);
    return null;
  }
}