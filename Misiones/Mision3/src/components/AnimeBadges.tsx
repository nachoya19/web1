import type { Anime } from '../types/anime';

interface AnimeBadgesProps {
  anime: Anime;
  detallarEpisodios?: boolean;
}

/**
 * Determina la clase visual de la insignia de valoración sin usar ternarios anidados.
 */
function obtenerClaseRating(rating: number | null): string {
  if (rating === null) return 'rating-none';
  if (rating >= 80) return 'rating-high';
  if (rating >= 70) return 'rating-mid';
  return 'rating-low';
}

function obtenerTextoEpisodios(anime: Anime, detallar: boolean): string {
  if (detallar) {
    return `${anime.episodios} episodios (${anime.duracionMinutos} min)`;
  }
  return `${anime.episodios} ep.`;
}

/**
 * Componente compartido para representar las insignias de metadatos de un anime.
 * Evita duplicar la lógica de formato y clases entre las tarjetas y los modales.
 */
export default function AnimeBadges({
  anime,
  detallarEpisodios = false,
}: AnimeBadgesProps) {
  const claseRating = obtenerClaseRating(anime.rating);
  const textoEpisodios = obtenerTextoEpisodios(anime, detallarEpisodios);
  const claseEstado = anime.estado === 'En emisión' ? 'estado-live' : '';

  return (
    <div className="anime-badges">
      <span className="badge-tipo">{anime.tipo}</span>
      <span className={`anime-rating ${claseRating}`}>
        {anime.rating !== null ? `★ ${anime.rating}%` : 'Sin calificación'}
      </span>
      <span className="badge-ep">{textoEpisodios}</span>
      <span className={`badge-estado ${claseEstado}`.trim()}>
        {anime.estado} ({anime.año})
      </span>
    </div>
  );
}
