import { useEffect, useReducer, useRef, useState } from 'react';
import type { EstadoPeticion, OrigenDatos } from '../types/anime';

export interface EstadoGenericoFetch<T> {
  status: EstadoPeticion;
  data: T;
  error: string | null;
  origen: OrigenDatos;
}

type AccionGenericaFetch<T> =
  | { tipo: 'INICIAR_CARGA' }
  | { tipo: 'EXITO_CARGA'; payload: { data: T; origen: OrigenDatos } }
  | { tipo: 'ERROR_CARGA'; payload: string };

function fetchReducer<T>(
  estado: EstadoGenericoFetch<T>,
  accion: AccionGenericaFetch<T>
): EstadoGenericoFetch<T> {
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
        data: accion.payload.data,
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

export interface AdaptadorCache<T> {
  leer: () => T | null;
  invalidar: () => void;
}

export interface ResultadoUseFetch<T> extends EstadoGenericoFetch<T> {
  recargar: (forzarRed?: boolean) => void;
}

/**
 * Custom hook genérico y reutilizable para gestionar peticiones asíncronas.
 * Centraliza el estado con useReducer (evitando combinaciones imposibles),
 * gestiona la cancelación mediante AbortController en el cleanup y admite caché opcional.
 */
export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  claveDependencia: string,
  valorInicial: T,
  cache?: AdaptadorCache<T>
): ResultadoUseFetch<T> {
  const [estado, dispatch] = useReducer(fetchReducer<T>, {
    status: 'loading',
    data: valorInicial,
    error: null,
    origen: null,
  });
  const [recargarKey, setRecargarKey] = useState(0);

  const fetcherRef = useRef(fetcher);
  const cacheRef = useRef(cache);

  useEffect(() => {
    fetcherRef.current = fetcher;
    cacheRef.current = cache;
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function ejecutar() {
      dispatch({ tipo: 'INICIAR_CARGA' });

      try {
        const datosEnCache = cacheRef.current ? cacheRef.current.leer() : null;
        if (datosEnCache !== null) {
          if (!signal.aborted) {
            dispatch({
              tipo: 'EXITO_CARGA',
              payload: {
                data: datosEnCache,
                origen: 'Caché local (0 ms)',
              },
            });
          }
          return;
        }

        const resultadoRed = await fetcherRef.current(signal);
        if (signal.aborted) return;

        dispatch({
          tipo: 'EXITO_CARGA',
          payload: {
            data: resultadoRed,
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
            : 'Error inesperado al realizar la petición.';
        dispatch({ tipo: 'ERROR_CARGA', payload: mensaje });
      }
    }

    void ejecutar();

    return () => {
      controller.abort();
    };
  }, [claveDependencia, recargarKey]);

  function recargar(forzarRed = false) {
    if (forzarRed) {
      cacheRef.current?.invalidar();
    }
    setRecargarKey((c) => c + 1);
  }

  return {
    ...estado,
    recargar,
  };
}
