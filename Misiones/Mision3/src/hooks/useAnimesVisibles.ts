import { useMemo } from 'react';
import type { Anime } from '../types/anime';
import type { EstadoFiltros } from './useFiltros';
import {
  filtrarPorEstado,
  filtrarPorFavoritos,
  filtrarPorRatingMinimo,
  filtrarPorTextoLocal,
  ordenarPorRating,
} from '../utils/logic';

/**
 * Custom hook que encapsula la cadena de filtrado y ordenación sobre el catálogo de animes.
 * Aligera App.tsx centralizando las transformaciones puras en una derivación memoizada.
 */
export function useAnimesVisibles(
  animes: Anime[],
  filtros: EstadoFiltros,
  favoritosIds: string[]
): Anime[] {
  return useMemo(() => {
    const porNota = filtrarPorRatingMinimo(animes, filtros.notaMinima);
    const porEstado = filtrarPorEstado(porNota, filtros.estadoFiltro);
    const porFavs = filtros.soloFavoritos
      ? filtrarPorFavoritos(porEstado, favoritosIds)
      : porEstado;
    const porTexto = filtrarPorTextoLocal(porFavs, filtros.filtroLocal);
    return ordenarPorRating(porTexto, filtros.ordenDescendente);
  }, [animes, filtros, favoritosIds]);
}
