const BASE_URL = 'https://kitsu.app/api/edge';

// Variable para almacenar el AbortController de la petición activa
let controladorActual = null;

/**
 * Traduce códigos HTTP a mensajes amigables para el usuario
 */
function formatearErrorHttp(status) {
  if (status === 404) return 'No se han encontrado animes con ese nombre.';
  if (status === 429) return 'Límite de consultas superado. Espera unos segundos antes de reintentar.';
  if (status >= 500) return 'El servidor de anime está experimentando problemas. Prueba en unos minutos.';
  return `Error en la solicitud (Código ${status}).`;
}

/**
 * Función central de petición que gestiona cancelación y validaciones
 */
async function realizarPeticion(url) {
  // 1. Si ya hay una petición en curso, la abortamos para evitar condiciones de carrera
  if (controladorActual) {
    controladorActual.abort();
  }

  // 2. Creamos una nueva instancia de AbortController para esta petición
  controladorActual = new AbortController();

  try {
    const respuesta = await fetch(url, {
      signal: controladorActual.signal,
      headers: {
        'Accept': 'application/vnd.api+json',
      },
    });

    // 3. fetch no rechaza por códigos 4xx/5xx; verificamos respuesta.ok manualmente
    if (!respuesta.ok) {
      throw new Error(formatearErrorHttp(respuesta.status));
    }

    const resultado = await respuesta.json();

    // 4. Validamos que la API realmente haya devuelto el array esperado
    if (!resultado || !Array.isArray(resultado.data)) {
      throw new Error('La respuesta recibida no tiene el formato de datos esperado.');
    }

    return resultado.data;

  } catch (error) {
    // Si la petición fue abortada expresamente por una nueva búsqueda, relanzamos el AbortError
    if (error.name === 'AbortError') {
      throw error;
    }

    // Si hubo un fallo de conexión (ej. sin internet o bloqueo de red)
    if (error instanceof TypeError) {
      throw new Error('Error de conexión a internet. Comprueba tu red e inténtalo de nuevo.');
    }

    // Relanzamos cualquier error con mensaje ya formateado
    throw error;
  }
}

/**
 * Obtiene la lista de animes populares en tendencia
 */
export async function obtenerPopulares() {
  return await realizarPeticion(`${BASE_URL}/trending/anime`);
}

/**
 * Busca animes en Kitsu según el texto proporcionado
 */
export async function buscarPorTexto(termino) {
  const url = `${BASE_URL}/anime?filter[text]=${encodeURIComponent(termino)}`;
  return await realizarPeticion(url);
}