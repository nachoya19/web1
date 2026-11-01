import type { Anime } from '../types/anime';

interface AnimeBadgesProps {
  anime: Anime;
  detallarEpisodios?: boolean;
}

/**
 * Componente compartido para representar las insignias de metadatos de un anime.
 * Evita duplicar la lógica de formato y clases entre las tarjetas y los modales.
 */
export default function AnimeBadges({
  anime,
  detallarEpisodios = false,
}: AnimeBadgesProps) {
  const claseRating =
    anime.rating === null
      ? 'rating-none'
      : anime.rating >= 80
        ? 'rating-high'
        : anime.rating >= 70
          ? 'rating-mid'
          : 'rating-low';

  const textoEpisodios = detallarEpisodios
    ? `${anime.episodios} episodios (${anime.duracionMinutos} min)`
    : `${anime.episodios} ep.`;

  return (
    <div className="anime-badges">
      <span className="badge-tipo">{anime.tipo}</span>
      <span className={`anime-rating ${claseRating}`}>
        {anime.rating !== null ? `★ ${anime.rating}%` : 'Sin calificación'}
      </span>
      <span className="badge-ep">{textoEpisodios}</span>
      <span
        className={`badge-estado ${anime.estado === 'En emisión' ? 'estado-live' : ''}`}
      >
        {anime.estado} ({anime.año})
      </span>
    </div>
  );
}
