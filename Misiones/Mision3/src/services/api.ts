import type { CategoriaExplorar, KitsuRawItem } from '../types/anime';

// Endpoint base de la API de Kitsu y tiempo máximo de espera
const BASE_URL = 'https://kitsu.app/api/edge';
const TIMEOUT_PETICION_MS = 10000;

// Traduce códigos de estado HTTP a mensajes descriptivos
function formatearErrorHttp(status: number): string {
  if (status === 404) return 'Recurso o ruta no encontrada en la API de Kitsu.';
  if (status === 429) return 'Límite de consultas a Kitsu alcanzado. Espera unos segundos.';
  if (status >= 500) return 'El servidor de Kitsu no responde correctamente. Prueba más tarde.';
  return `Error en la solicitud HTTP (${status}).`;
}

// Realiza la llamada fetch gestionando timeout y cancelaciones con AbortController
async function realizarPeticion(url: string, signal?: AbortSignal): Promise<KitsuRawItem[]> {
  const controladorTimeout = new AbortController();
  const idTimer = setTimeout(() => {
    controladorTimeout.abort();
  }, TIMEOUT_PETICION_MS);

  // Vincula la señal externa de cancelación con el temporizador interno
  const alAbortarExterno = () => controladorTimeout.abort();
  if (signal) {
    signal.addEventListener('abort', alAbortarExterno, { once: true });
  }

  try {
    const respuesta = await fetch(url, { signal: controladorTimeout.signal });

    if (!respuesta.ok) {
      throw new Error(formatearErrorHttp(respuesta.status));
    }

    const json: unknown = await respuesta.json();

    if (
      !json ||
      typeof json !== 'object' ||
      !('data' in json) ||
      !Array.isArray((json as { data: unknown }).data)
    ) {
      throw new Error('La respuesta recibida no tiene el formato de datos esperado.');
    }

    return (json as { data: KitsuRawItem[] }).data;
  } catch (error) {
    // Relanza si la llamada fue cancelada intencionadamente por el efecto de React
    if (signal?.aborted) {
      throw error;
    }
    // Detecta agotamiento del tiempo límite de red
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

// Obtiene la relación de animes en tendencia
export async function obtenerPopulares(signal?: AbortSignal): Promise<KitsuRawItem[]> {
  const url = `${BASE_URL}/trending/anime`;
  return await realizarPeticion(url, signal);
}

// Obtiene los animes mejor valorados del catálogo
export async function obtenerMejorValorados(signal?: AbortSignal): Promise<KitsuRawItem[]> {
  const url = `${BASE_URL}/anime?sort=-averageRating&page[limit]=12`;
  return await realizarPeticion(url, signal);
}

// Obtiene los animes actualmente en emisión más seguidos
export async function obtenerEnEmision(signal?: AbortSignal): Promise<KitsuRawItem[]> {
  const url = `${BASE_URL}/anime?filter[status]=current&sort=-userCount&page[limit]=12`;
  return await realizarPeticion(url, signal);
}

// Localiza animes asociados al término de consulta
export async function buscarPorTexto(termino: string, signal?: AbortSignal): Promise<KitsuRawItem[]> {
  const terminoLimpio = encodeURIComponent(termino.trim());
  const url = `${BASE_URL}/anime?filter[text]=${terminoLimpio}&page[limit]=12`;
  return await realizarPeticion(url, signal);
}

// Punto de entrada unificado para consultar según categoría o término
export async function consultarCatalogoKitsu(
  categoria: CategoriaExplorar,
  termino: string,
  signal?: AbortSignal
): Promise<KitsuRawItem[]> {
  const terminoLimpio = termino.trim();
  if (categoria === 'busqueda' && terminoLimpio.length > 0) {
    return await buscarPorTexto(terminoLimpio, signal);
  }
  if (categoria === 'mejor_valorados') {
    return await obtenerMejorValorados(signal);
  }
  if (categoria === 'en_emision') {
    return await obtenerEnEmision(signal);
  }
  return await obtenerPopulares(signal);
}
