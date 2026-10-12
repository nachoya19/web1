// Prefijo de almacenamiento y tiempo de validez en milisegundos (20 min)
const PREFIX = 'kitsu_cache_';
const TTL_MS = 20 * 60 * 1000;

// Limpia espacios y convierte a minusculas para formar la clave
export function normalizarClave(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

// Almacena un array con marca temporal en localStorage
export function guardarEnCache(clave, datos) {
  if (!Array.isArray(datos)) return;

  const envoltorio = {
    timestamp: Date.now(),
    data: datos,
  };

  try {
    localStorage.setItem(PREFIX + normalizarClave(clave), JSON.stringify(envoltorio));
  } catch (error) {
    console.error('[Storage] Error al persistir en localStorage:', error.message);
  }
}

// Recupera datos en cache comprobando si han expirado
export function obtenerDeCache(clave) {
  const claveFinal = PREFIX + normalizarClave(clave);
  try {
    const contenido = localStorage.getItem(claveFinal);
    if (!contenido) return null;

    const parseado = JSON.parse(contenido);

    // Comprueba que la marca temporal sea numerica
    const { timestamp, data } = parseado;
    if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
      localStorage.removeItem(claveFinal);
      return null;
    }

    // Descarta el registro si supero el tiempo limite
    const haCaducado = Date.now() - timestamp > TTL_MS;
    if (haCaducado) {
      localStorage.removeItem(claveFinal);
      return null;
    }

    return Array.isArray(data) ? data : null;
  } catch (error) {
    localStorage.removeItem(claveFinal);
    return null;
  }
}