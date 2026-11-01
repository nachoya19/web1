import { useMemo } from 'react';
import type { Anime } from '../types/anime';
import AnimeCard from './AnimeCard';

interface AnimeGridProps {
  animes: Anime[];
  cargando: boolean;
  favoritosIds: string[];
  comparandoIds: string[];
  onVerDetalle: (anime: Anime) => void;
  onToggleFavorito: (animeId: string) => void;
  onToggleComparar: (animeId: string) => void;
}

/**
 * Rejilla de tarjetas de anime. Se enfoca exclusivamente en renderizar la colección
 * con Sets memoizados para un look-up O(1) de favoritos y elementos en comparación.
 */
export default function AnimeGrid({
  animes,
  cargando,
  favoritosIds,
  comparandoIds,
  onVerDetalle,
  onToggleFavorito,
  onToggleComparar,
}: AnimeGridProps) {
  const setFavs = useMemo(
    () => new Set(favoritosIds.map(String)),
    [favoritosIds]
  );
  const setComp = useMemo(
    () => new Set(comparandoIds.map(String)),
    [comparandoIds]
  );

  return (
    <section
      className={`anime-grid ${cargando ? 'grid-dimmed' : ''}`}
      aria-label="Catálogo de animes"
    >
      {animes.map((anime) => (
        <AnimeCard
          key={anime.id}
          anime={anime}
          esFavorito={setFavs.has(String(anime.id))}
          enComparacion={setComp.has(String(anime.id))}
          onVerDetalle={onVerDetalle}
          onToggleFavorito={onToggleFavorito}
          onToggleComparar={onToggleComparar}
        />
      ))}
    </section>
  );
}
