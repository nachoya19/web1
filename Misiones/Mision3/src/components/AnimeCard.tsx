import { useState } from 'react';
import type { Anime } from '../types/anime';
import { PLACEHOLDER_IMG } from '../utils/logic';
import AnimeBadges from './AnimeBadges';

interface AnimeCardProps {
  anime: Anime;
  esFavorito: boolean;
  enComparacion: boolean;
  onVerDetalle: (anime: Anime) => void;
  onToggleFavorito: (animeId: string) => void;
  onToggleComparar: (anime: Anime) => void;
}

export default function AnimeCard({
  anime,
  esFavorito,
  enComparacion,
  onVerDetalle,
  onToggleFavorito,
  onToggleComparar,
}: AnimeCardProps) {
  const [imgFallida, setImgFallida] = useState(false);

  const urlImagen =
    !imgFallida && anime.imagen ? anime.imagen : PLACEHOLDER_IMG;

  const sinopsisCorta =
    anime.sinopsis.length > 120
      ? `${anime.sinopsis.slice(0, 120)}...`
      : anime.sinopsis;

  return (
    <article className={`anime-card ${enComparacion ? 'card-comparing' : ''}`}>
      <div className="anime-card-poster-wrap">
        <img
          src={urlImagen}
          alt={anime.titulo}
          loading="lazy"
          onError={() => setImgFallida(true)}
        />
        <span className="poster-age-badge">{anime.clasificacionEdad}</span>
      </div>

      <div className="anime-card-content">
        <div className="anime-card-header">
          <h3>{anime.titulo}</h3>
          <AnimeBadges anime={anime} />
        </div>

        <p className="anime-synopsis">{sinopsisCorta}</p>

        <div className="anime-actions">
          <button
            type="button"
            className="card-btn detail-btn"
            onClick={() => onVerDetalle(anime)}
          >
            Ver ficha
          </button>
          <button
            type="button"
            className={`card-btn fav-btn ${esFavorito ? 'is-fav' : ''}`}
            aria-pressed={esFavorito}
            onClick={() => onToggleFavorito(anime.id)}
          >
            {esFavorito ? '★ Favorito' : '☆ Favorito'}
          </button>
          <button
            type="button"
            className={`card-btn compare-btn ${enComparacion ? 'is-comparing' : ''}`}
            aria-pressed={enComparacion}
            onClick={() => onToggleComparar(anime)}
            title="Seleccionar para comparar cara a cara"
          >
            {enComparacion ? 'En VS' : 'VS'}
          </button>
        </div>
      </div>
    </article>
  );
}

