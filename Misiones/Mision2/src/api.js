// Endpoint base de la API de Kitsu
const BASE_URL = 'https://kitsu.app/api/edge';

// Traduce codigos de estado HTTP a mensajes para el usuario
function formatearErrorHttp(status) {
  if (status === 404) return 'No se han encontrado animes con esos criterios.';
  if (status === 429) return 'Límite de consultas a Kitsu alcanzado. Espera unos segundos.';
  if (status >= 500) return 'El servidor de Kitsu no responde correctamente. Prueba más tarde.';
  return `Error en la solicitud HTTP (${status}).`;
}

// Realiza la llamada fetch gestionando la cancelacion y validacion
async function realizarPeticion(url, signal) {
  try {
    const respuesta = await fetch(url, { signal });

    // Verifica que la respuesta sea correcta
    if (!respuesta.ok) {
      throw new Error(formatearErrorHttp(respuesta.status));
    }

    const json = await respuesta.json();

    // Comprueba que los datos devueltos sean un array
    if (!json || !Array.isArray(json.data)) {
      throw new Error('La respuesta recibida no tiene el formato de datos esperado.');
    }

    return json.data;
  } catch (error) {
    // Relanza el error si la peticion fue cancelada
    if (error.name === 'AbortError') {
      throw error;
    }
    // Captura fallos de conectividad
    if (error instanceof TypeError) {
      throw new Error('Sin conexión con la API de anime. Comprueba tu conexión a internet.');
    }
    throw error;
  }
}

// Obtiene la lista de animes populares
export async function obtenerPopulares(signal) {
  const url = `${BASE_URL}/trending/anime`;
  return await realizarPeticion(url, signal);
}

// Busca animes por termino de texto
export async function buscarPorTexto(termino, signal) {
  const terminoLimpio = encodeURIComponent(termino.trim());
  const url = `${BASE_URL}/anime?filter[text]=${terminoLimpio}&page[limit]=12`;
  return await realizarPeticion(url, signal);
}