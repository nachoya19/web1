// Endpoint base de la API de Kitsu
const BASE_URL = 'https://kitsu.app/api/edge';

// Traduce codigos de estado HTTP a mensajes descriptivos
function formatearErrorHttp(status) {
  if (status === 404) return 'Recurso no encontrado en el servidor de Kitsu.';
  if (status === 429) return 'Límite de consultas a Kitsu alcanzado. Espera unos segundos.';
  if (status >= 500) return 'El servidor de Kitsu no responde correctamente. Prueba más tarde.';
  return `Error en la solicitud HTTP (${status}).`;
}

// Realiza la peticion fetch controlando cancelacion y formato de respuesta
async function realizarPeticion(url, signal) {
  try {
    const respuesta = await fetch(url, { signal });

    // Comprueba el estado HTTP de la respuesta
    if (!respuesta.ok) {
      throw new Error(formatearErrorHttp(respuesta.status));
    }

    const json = await respuesta.json();

    // Valida que el payload contenga una lista de datos
    if (!json || !Array.isArray(json.data)) {
      throw new Error('La respuesta recibida no tiene el formato de datos esperado.');
    }

    return json.data;
  } catch (error) {
    // Relanza el error si la peticion fue abortada
    if (error.name === 'AbortError') {
      throw error;
    }
    // Identifica errores de conexion o red
    if (error instanceof TypeError) {
      throw new Error('Sin conexión con la API de anime. Comprueba tu conexión a internet.');
    }
    throw error;
  }
}

// Consulta la lista de animes en tendencia
export async function obtenerPopulares(signal) {
  const url = `${BASE_URL}/trending/anime`;
  return await realizarPeticion(url, signal);
}

// Consulta animes mediante filtro de texto
export async function buscarPorTexto(termino, signal) {
  const terminoLimpio = encodeURIComponent(termino.trim());
  const url = `${BASE_URL}/anime?filter[text]=${terminoLimpio}&page[limit]=12`;
  return await realizarPeticion(url, signal);
}