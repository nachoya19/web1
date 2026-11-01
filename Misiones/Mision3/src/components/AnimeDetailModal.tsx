import { useId, useState, type ReactNode } from 'react';
import type { Anime } from '../types/anime';
import { PLACEHOLDER_IMG } from '../utils/logic';
import AnimeBadges from './AnimeBadges';
import ModalDialog from './ModalDialog';

interface PanelSeccionProps {
  titulo: string;
  children: ReactNode;
}

/**
 * Componente contenedor reutilizable que aprovecha la prop especial children.
 */
function PanelSeccion({ titulo, children }: PanelSeccionProps) {
  return (
    <section className="modal-section-panel">
      <h4>{titulo}</h4>
      {children}
    </section>
  );
}

interface ContenidoDetalleProps {
  anime: Anime;
  tituloId: string;
  esFavorito: boolean;
  onToggleFavorito: (animeId: string) => void;
}

/**
 * Contenido interno del modal que se reinicia limpiamente mediante key={anime.id}
 * sin necesidad de llamar a setState dentro de un useEffect.
 */
function ContenidoDetalle({
  anime,
  tituloId,
  esFavorito,
  onToggleFavorito,
}: ContenidoDetalleProps) {
  const [ritmoEpisodiosDia, setRitmoEpisodiosDia] = useState(3);
  const [imgFallida, setImgFallida] = useState(false);

  const imagenDisponible = anime.imagenGrande ?? anime.imagen;
  const urlPoster = !imgFallida && imagenDisponible ? imagenDisponible : PLACEHOLDER_IMG;

  const numEpisodios =
    typeof anime.episodios === 'number' ? anime.episodios : null;
  const minutosTotales =
    numEpisodios !== null ? numEpisodios * anime.duracionMinutos : null;
  const horasTotales =
    minutosTotales !== null ? (minutosTotales / 60).toFixed(1) : null;
  const diasEstimados =
    numEpisodios !== null ? Math.ceil(numEpisodios / ritmoEpisodiosDia) : null;

  return (
    <div className="modal-detail-content">
      <img
        src={urlPoster}
        alt={anime.titulo}
        className="modal-poster"
        onError={() => setImgFallida(true)}
      />

      <div className="modal-info">
        <h2 id={tituloId}>{anime.titulo}</h2>

        <div className="modal-meta">
          <AnimeBadges anime={anime} detallarEpisodios />
        </div>

        <PanelSeccion titulo="Sinopsis completa">
          <p className="modal-synopsis">{anime.sinopsis}</p>
        </PanelSeccion>

        {numEpisodios !== null && (
          <PanelSeccion titulo="Calculadora de Maratón">
            <div className="binge-calculator">
              <label className="binge-slider-label">
                <span>
                  Ritmo diario: <strong>{ritmoEpisodiosDia} ep./día</strong>
                </span>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={ritmoEpisodiosDia}
                  onChange={(e) =>
                    setRitmoEpisodiosDia(Number(e.target.value))
                  }
                />
              </label>
              <p className="binge-summary">
                Duración total: <strong>{horasTotales} horas</strong> · Lo
                completarías en{' '}
                <strong>
                  {diasEstimados} {diasEstimados === 1 ? 'día' : 'días'}
                </strong>
                .
              </p>
            </div>
          </PanelSeccion>
        )}

        <div className="modal-actions-row">
          <button
            type="button"
            className={`card-btn fav-btn ${esFavorito ? 'is-fav' : ''}`}
            aria-pressed={esFavorito}
            onClick={() => onToggleFavorito(anime.id)}
          >
            {esFavorito ? '★ Guardado en favoritos' : '☆ Añadir a favoritos'}
          </button>

          <a
            className="anime-link"
            href={anime.enlaceKitsu}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir ficha oficial en Kitsu ↗
          </a>
        </div>
      </div>
    </div>
  );
}

interface AnimeDetailModalProps {
  anime: Anime | null;
  esFavorito: boolean;
  onCerrar: () => void;
  onToggleFavorito: (animeId: string) => void;
}

export default function AnimeDetailModal({
  anime,
  esFavorito,
  onCerrar,
  onToggleFavorito,
}: AnimeDetailModalProps) {
  const tituloId = useId();

  return (
    <ModalDialog
      abierto={anime !== null}
      tituloId={tituloId}
      ariaLabelCerrar="Cerrar ficha de detalle"
      onCerrar={onCerrar}
    >
      {anime !== null && (
        <ContenidoDetalle
          key={anime.id}
          anime={anime}
          tituloId={tituloId}
          esFavorito={esFavorito}
          onToggleFavorito={onToggleFavorito}
        />
      )}
    </ModalDialog>
  );
}
