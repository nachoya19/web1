import { useMemo } from 'react';
import type { Anime, FiltroEstado } from '../types/anime';
import {
  filtrarPorEstado,
  filtrarPorFavoritos,
  filtrarPorRatingMinimo,
  filtrarPorTextoLocal,
  ordenarPorRating,
} from '../utils/logic';

export interface ParametrosVisibles {
  notaMinima: number;
  estadoFiltro: FiltroEstado;
  soloFavoritos: boolean;
  filtroLocal: string;
  ordenDescendente: boolean;
}

/**
 * Custom hook que encapsula la cadena de filtrado y ordenación sobre el catálogo de animes.
 * Declara como dependencias los campos primitivos específicos en lugar del objeto completo,
 * evitando invalidar la memoización cuando el usuario escribe en el campo de búsqueda.
 */
export function useAnimesVisibles(
  animes: Anime[],
  parametros: ParametrosVisibles,
  favoritosIds: string[]
): Anime[] {
  const {
    notaMinima,
    estadoFiltro,
    soloFavoritos,
    filtroLocal,
    ordenDescendente,
  } = parametros;

  return useMemo(() => {
    const porNota = filtrarPorRatingMinimo(animes, notaMinima);
    const porEstado = filtrarPorEstado(porNota, estadoFiltro);
    const porFavs = soloFavoritos
      ? filtrarPorFavoritos(porEstado, favoritosIds)
      : porEstado;
    const porTexto = filtrarPorTextoLocal(porFavs, filtroLocal);
    return ordenarPorRating(porTexto, ordenDescendente);
  }, [
    animes,
    notaMinima,
    estadoFiltro,
    soloFavoritos,
    filtroLocal,
    ordenDescendente,
    favoritosIds,
  ]);
}
