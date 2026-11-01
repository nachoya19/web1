import { consultarCatalogoKitsu } from '../services/api';
import type {
  Anime,
  CategoriaExplorar,
  EstadoPeticion,
  OrigenDatos,
} from '../types/anime';
import { normalizarAnimes } from '../utils/logic';
import {
  guardarEnCache,
  invalidarEntradaCache,
  obtenerDeCache,
} from '../utils/storage';
import { useFetch } from './useFetch';

export interface ResultadoKitsuFetch {
  status: EstadoPeticion;
  animes: Anime[];
  error: string | null;
  origen: OrigenDatos;
  recargar: (forzarRed?: boolean) => void;
}

const LISTA_VACIA: Anime[] = [];

/**
 * Hook de dominio que conecta el hook genérico useFetch con la API de Kitsu y su caché TTL.
 */
export function useKitsuFetch(
  categoria: CategoriaExplorar,
  terminoBusqueda: string
): ResultadoKitsuFetch {
  const claveConsulta = `${categoria}::${terminoBusqueda.trim().toLowerCase()}`;

  const { status, data, error, origen, recargar } = useFetch<Anime[]>(
    async (signal) => {
      const brutos = await consultarCatalogoKitsu(
        categoria,
        terminoBusqueda,
        signal
      );
      if (!signal.aborted) {
        guardarEnCache(categoria, terminoBusqueda, brutos);
      }
      return normalizarAnimes(brutos);
    },
    claveConsulta,
    LISTA_VACIA,
    {
      leer: () => {
        const entrada = obtenerDeCache(categoria, terminoBusqueda);
        return entrada !== null ? normalizarAnimes(entrada.data) : null;
      },
      invalidar: () => {
        invalidarEntradaCache(categoria, terminoBusqueda);
      },
    }
  );

  return {
    status,
    animes: data,
    error,
    origen,
    recargar,
  };
}
