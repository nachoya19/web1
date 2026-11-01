import { useEffect, useReducer, useState } from 'react';
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

interface EstadoFetch {
  status: EstadoPeticion;
  animes: Anime[];
  error: string | null;
  origen: OrigenDatos;
}

type AccionFetch =
  | { tipo: 'INICIAR_CARGA' }
  | { tipo: 'EXITO_CARGA'; payload: { animes: Anime[]; origen: OrigenDatos } }
  | { tipo: 'ERROR_CARGA'; payload: string };

const ESTADO_INICIAL: EstadoFetch = {
  status: 'loading',
  animes: [],
  error: null,
  origen: null,
};

function fetchReducer(estado: EstadoFetch, accion: AccionFetch): EstadoFetch {
  switch (accion.tipo) {
    case 'INICIAR_CARGA':
      return {
        ...estado,
        status: 'loading',
        error: null,
      };
    case 'EXITO_CARGA':
      return {
        status: 'success',
        animes: accion.payload.animes,
        error: null,
        origen: accion.payload.origen,
      };
    case 'ERROR_CARGA':
      return {
        ...estado,
        status: 'error',
        error: accion.payload,
      };
    default:
      return estado;
  }
}

export interface ResultadoKitsuFetch extends EstadoFetch {
  recargar: (forzarRed?: boolean) => void;
}

/**
 * Custom hook que gestiona la consulta asíncrona a la API de Kitsu y su caché con TTL.
 * Unifica el estado asíncrono con useReducer (evitando estados imposibles)
 * y gestiona la cancelación de peticiones en curso mediante AbortController en el cleanup.
 */
export function useKitsuFetch(
  categoria: CategoriaExplorar,
  terminoBusqueda: string
): ResultadoKitsuFetch {
  const [estado, dispatch] = useReducer(fetchReducer, ESTADO_INICIAL);
  const [recargarKey, setRecargarKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function cargarDatos() {
      dispatch({ tipo: 'INICIAR_CARGA' });

      try {
        const entradaCache = obtenerDeCache(categoria, terminoBusqueda);

        if (entradaCache !== null) {
          const normalizados = normalizarAnimes(entradaCache.data);
          if (!signal.aborted) {
            dispatch({
              tipo: 'EXITO_CARGA',
              payload: {
                animes: normalizados,
                origen: 'Caché local (0 ms)',
              },
            });
          }
          return;
        }

        const datosBrutos = await consultarCatalogoKitsu(
          categoria,
          terminoBusqueda,
          signal
        );

        if (signal.aborted) return;

        guardarEnCache(categoria, terminoBusqueda, datosBrutos);
        const normalizados = normalizarAnimes(datosBrutos);

        dispatch({
          tipo: 'EXITO_CARGA',
          payload: {
            animes: normalizados,
            origen: 'API en directo',
          },
        });
      } catch (err) {
        if (signal.aborted || (err instanceof Error && err.name === 'AbortError')) {
          return;
        }
        const mensaje =
          err instanceof Error
            ? err.message
            : 'Error inesperado al sincronizar con Kitsu.';
        dispatch({ tipo: 'ERROR_CARGA', payload: mensaje });
      }
    }

    void cargarDatos();

    // Función de limpieza: cancela la petición si cambian las dependencias o se desmonta
    return () => {
      controller.abort();
    };
  }, [categoria, terminoBusqueda, recargarKey]);

  function recargar(forzarRed = false) {
    if (forzarRed) {
      invalidarEntradaCache(categoria, terminoBusqueda);
    }
    setRecargarKey((c) => c + 1);
  }

  return {
    ...estado,
    recargar,
  };
}
