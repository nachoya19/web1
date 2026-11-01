import { useEffect, useReducer, useState } from 'react';
import type { EstadoPeticion, OrigenDatos } from '../types/anime';

export interface EstadoGenericoFetch<T> {
  claveActual: string;
  status: EstadoPeticion;
  data: T;
  error: string | null;
  origen: OrigenDatos;
}

type AccionGenericaFetch<T> =
  | {
      tipo: 'REINICIAR_CONSULTA';
      payload: {
        clave: string;
        data: T;
        status: EstadoPeticion;
        origen: OrigenDatos;
      };
    }
  | { tipo: 'INICIAR_CARGA' }
  | { tipo: 'EXITO_CARGA'; payload: { data: T; origen: OrigenDatos } }
  | { tipo: 'ERROR_CARGA'; payload: string };

function fetchReducer<T>(
  estado: EstadoGenericoFetch<T>,
  accion: AccionGenericaFetch<T>
): EstadoGenericoFetch<T> {
  switch (accion.tipo) {
    case 'REINICIAR_CONSULTA':
      return {
        claveActual: accion.payload.clave,
        status: accion.payload.status,
        data: accion.payload.data,
        error: null,
        origen: accion.payload.origen,
      };
    case 'INICIAR_CARGA':
      return {
        ...estado,
        status: 'loading',
        error: null,
      };
    case 'EXITO_CARGA':
      return {
        ...estado,
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

export interface ResultadoUseFetch<T> {
  status: EstadoPeticion;
  data: T;
  error: string | null;
  origen: OrigenDatos;
  recargar: (forzarRed?: boolean) => void;
}

/**
 * Custom hook genérico y reutilizable para peticiones asíncronas con useReducer y AbortController.
 * - Sincroniza la clave de consulta para resetear el estado de inmediato y evitar mostrar datos obsoletos al cambiar de categoría.
 * - Elimina refs mutables gestionando la intención de recarga forzada de forma declarativa.
 * - Evita lecturas duplicadas de caché verificando de antemano el estado sincronizado.
 */
export function useFetch<T>(
  clave: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
  valorInicial: T,
  opcionesCache?: OpcionesCache<T>
): ResultadoUseFetch<T> {
  const [estado, dispatch] = useReducer(
    fetchReducer<T>,
    null,
    (): EstadoGenericoFetch<T> => {
      const enCache = opcionesCache?.leer() ?? null;
      if (enCache !== null) {
        return {
          claveActual: clave,
          status: 'success',
          data: enCache,
          error: null,
          origen: 'Caché local (0 ms)',
        };
      }
      return {
        claveActual: clave,
        status: 'loading',
        data: valorInicial,
        error: null,
        origen: null,
      };
    }
  );

  // Sincroniza el estado en el render si la clave cambia para evitar mostrar datos de la consulta anterior
  if (estado.claveActual !== clave) {
    const enCache = opcionesCache?.leer() ?? null;
    dispatch({
      tipo: 'REINICIAR_CONSULTA',
      payload: {
        clave,
        data: enCache !== null ? enCache : valorInicial,
        status: enCache !== null ? 'success' : 'loading',
        origen: enCache !== null ? 'Caché local (0 ms)' : null,
      },
    });
  }

  // Estado declarativo para recargas manuales (sin referencias mutables)
  const [solicitudManual, setSolicitudManual] = useState<{
    id: number;
    forzarRed: boolean;
  }>({
    id: 0,
    forzarRed: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const esForzado = solicitudManual.forzarRed;

    async function ejecutar() {
      // Si no es forzado y el estado ya tiene los datos de la clave actual en caché, no repetimos la petición
      if (!esForzado && estado.status === 'success' && estado.claveActual === clave) {
        return;
      }

      if (estado.status !== 'loading') {
        dispatch({ tipo: 'INICIAR_CARGA' });
      }

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
  }, [clave, fetcher, solicitudManual, opcionesCache, estado.status, estado.claveActual]);

  function recargar(forzarRed = false) {
    if (forzarRed) {
      opcionesCache?.invalidar?.();
    }
    setSolicitudManual((prev) => ({
      id: prev.id + 1,
      forzarRed,
    }));
  }

  return {
    status: estado.status,
    data: estado.data,
    error: estado.error,
    origen: estado.origen,
    recargar,
  };
}
