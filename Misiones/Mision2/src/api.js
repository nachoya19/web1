// Endpoint base de la API de Kitsu y tiempo maximo de espera
const BASE_URL = 'https://kitsu.app/api/edge';
const TIMEOUT_PETICION_MS = 10000;

// Traduce codigos de estado HTTP a mensajes descriptivos
function formatearErrorHttp(status) {
  if (status === 404) return 'Recurso o ruta no encontrada en la API de Kitsu.';
  if (status === 429) return 'Límite de consultas a Kitsu alcanzado. Espera unos segundos.';
  if (status >= 500) return 'El servidor de Kitsu no responde correctamente. Prueba más tarde.';
  return `Error en la solicitud HTTP (${status}).`;
}

// Realiza la llamada fetch gestionando timeout y cancelaciones
async function realizarPeticion(url, signal) {
  const controladorTimeout = new AbortController();
  const idTimer = setTimeout(() => {
    controladorTimeout.abort();
  }, TIMEOUT_PETICION_MS);

  // Vincula la senal externa de cancelacion con el temporizador interno
  const alAbortarExterno = () => controladorTimeout.abort();
  if (signal) {
    signal.addEventListener('abort', alAbortarExterno, { once: true });
  }

  try {
    const respuesta = await fetch(url, { signal: controladorTimeout.signal });

    if (!respuesta.ok) {
      throw new Error(formatearErrorHttp(respuesta.status));
    }

    const json = await respuesta.json();

    if (!json || !Array.isArray(json.data)) {
      throw new Error('La respuesta recibida no tiene el formato de datos esperado.');
    }

    return json.data;
  } catch (error) {
    // Relanza si la llamada fue cancelada intencionadamente por el usuario
    if (signal?.aborted) {
      throw error;
    }
    // Detecta agotamiento del tiempo limite de red
    if (controladorTimeout.signal.aborted) {
      throw new Error('Tiempo de espera agotado. El servidor de anime tarda demasiado en responder.');
    }
    if (error instanceof TypeError) {
      throw new Error('Sin conexión con la API de anime. Comprueba tu conexión a internet.');
    }
    throw error;
  } finally {
    clearTimeout(idTimer);
    if (signal) {
      signal.removeEventListener('abort', alAbortarExterno);
    }
  }
}

// Obtiene la relacion de animes en tendencia
export async function obtenerPopulares(signal) {
  const url = `${BASE_URL}/trending/anime`;
  return await realizarPeticion(url, signal);
}

// Localiza animes asociados al termino de consulta
export async function buscarPorTexto(termino, signal) {
  const terminoLimpio = encodeURIComponent(termino.trim());
  const url = `${BASE_URL}/anime?filter[text]=${terminoLimpio}&page[limit]=12`;
  return await realizarPeticion(url, signal);
}