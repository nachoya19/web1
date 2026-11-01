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

export interface OpcionesCache<T> {
  leer: () => T | null;
  guardar?: (datos: T) => void;
  invalidar?: () => void;
}

export interface ResultadoUseFetch<T> extends EstadoGenericoFetch<T> {
  recargar: (forzarRed?: boolean) => void;
}

/**
 * Custom hook genérico y reutilizable para peticiones asíncronas con useReducer y AbortController.
 * Inicializa sincronizadamente desde caché si está disponible para evitar saltos de loading/success
 * y declara dependencias reales sin artificios de refs desincronizados.
 */
export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  valorInicial: T,
  opcionesCache?: OpcionesCache<T>
): ResultadoUseFetch<T> {
  const [estado, dispatch] = useReducer(
    fetchReducer<T>,
    null,
    (): EstadoGenericoFetch<T> => {
      const enCache = opcionesCache?.leer();
      if (enCache !== null && enCache !== undefined) {
        return {
          status: 'success',
          data: enCache,
          error: null,
          origen: 'Caché local (0 ms)',
        };
      }
      return {
        status: 'loading',
        data: valorInicial,
        error: null,
        origen: null,
      };
    }
  );

  const [recargarKey, setRecargarKey] = useState(0);
  const forzarRedRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const forzarRed = forzarRedRef.current;
    forzarRedRef.current = false;

    async function ejecutar() {
      // Si no se fuerza la red, revisamos si la caché ya contiene los datos válidos
      if (!forzarRed && opcionesCache) {
        const datosEnCache = opcionesCache.leer();
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
      }

      dispatch({ tipo: 'INICIAR_CARGA' });

      try {
        const resultadoRed = await fetcher(signal);
        if (signal.aborted) return;

        opcionesCache?.guardar?.(resultadoRed);

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
  }, [fetcher, recargarKey, opcionesCache]);

  function recargar(forzarRed = false) {
    if (forzarRed) {
      forzarRedRef.current = true;
      opcionesCache?.invalidar?.();
    }
    setRecargarKey((c) => c + 1);
  }

  return {
    ...estado,
    recargar,
  };
}
