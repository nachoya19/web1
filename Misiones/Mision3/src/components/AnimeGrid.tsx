import type { Anime } from '../types/anime';
import AnimeCard from './AnimeCard';
import { EmptyState } from './StatusFeedback';

interface AnimeGridProps {
  animes: Anime[];
  cargando: boolean;
  favoritosIds: string[];
  comparandoIds: string[];
  terminoBusqueda: string;
  filtroLocal: string;
  soloFavoritos: boolean;
  onVerDetalle: (anime: Anime) => void;
  onToggleFavorito: (animeId: string) => void;
  onToggleComparar: (anime: Anime) => void;
  onResetFiltros: () => void;
}

export default function AnimeGrid({
  animes,
  cargando,
  favoritosIds,
  comparandoIds,
  terminoBusqueda,
  filtroLocal,
  soloFavoritos,
  onVerDetalle,
  onToggleFavorito,
  onToggleComparar,
  onResetFiltros,
}: AnimeGridProps) {
  if (animes.length === 0) {
    return (
      <EmptyState
        terminoBusqueda={terminoBusqueda}
        filtroLocal={filtroLocal}
        soloFavoritos={soloFavoritos}
        onResetFiltros={onResetFiltros}
      />
    );
  }

  const setFavs = new Set(favoritosIds.map(String));
  const setComp = new Set(comparandoIds.map(String));

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
