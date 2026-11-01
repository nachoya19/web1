import { useCallback, useMemo } from 'react';
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
import { useFetch, type OpcionesCache } from './useFetch';

export interface ResultadoKitsuFetch {
  status: EstadoPeticion;
  animes: Anime[];
  error: string | null;
  origen: OrigenDatos;
  recargar: (forzarRed?: boolean) => void;
}

const LISTA_VACIA: Anime[] = [];

/**
 * Hook de dominio que conecta el hook genérico useFetch con la API de Kitsu y su caché con TTL.
 * Pasa funciones con dependencias reales memoizadas con useCallback y useMemo.
 */
export function useKitsuFetch(
  categoria: CategoriaExplorar,
  terminoBusqueda: string
): ResultadoKitsuFetch {
  const fetcher = useCallback(
    async (signal: AbortSignal): Promise<Anime[]> => {
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
    [categoria, terminoBusqueda]
  );

  const opcionesCache = useMemo<OpcionesCache<Anime[]>>(
    () => ({
      leer: () => {
        const entrada = obtenerDeCache(categoria, terminoBusqueda);
        return entrada !== null ? normalizarAnimes(entrada.data) : null;
      },
      invalidar: () => {
        invalidarEntradaCache(categoria, terminoBusqueda);
      },
    }),
    [categoria, terminoBusqueda]
  );

  const clave = `${categoria}::${terminoBusqueda.trim().toLowerCase()}`;

  const { status, data, error, origen, recargar } = useFetch<Anime[]>(
    clave,
    fetcher,
    LISTA_VACIA,
    opcionesCache
  );

  return {
    status,
    animes: data,
    error,
    origen,
    recargar,
  };
}
