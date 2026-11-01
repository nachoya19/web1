import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { Anime } from '../types/anime';
import { PLACEHOLDER_IMG } from '../utils/logic';
import AnimeBadges from './AnimeBadges';

interface PanelSeccionProps {
  titulo: string;
  children: ReactNode;
}

/**
 * Componente contenedor reutilizable que demuestra el uso de la prop especial children.
 */
function PanelSeccion({ titulo, children }: PanelSeccionProps) {
  return (
    <section className="modal-section-panel">
      <h4>{titulo}</h4>
      {children}
    </section>
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
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const tituloId = useId();
  const [ritmoEpisodiosDia, setRitmoEpisodiosDia] = useState(3);
  const [imgFallida, setImgFallida] = useState(false);

  // Sincroniza la apertura/cierre del elemento nativo <dialog> en el Top Layer
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (anime) {
      setImgFallida(false);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [anime]);

  // Fallback para light-dismiss en navegadores sin soporte nativo de closedby="any"
  function manejarClickBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const dialog = dialogRef.current;
      if (!dialog || event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;
      dialog.close();
    }
  }

  if (!anime) {
    return null;
  }

  const urlPoster =
    !imgFallida && (anime.imagenGrande ?? anime.imagen)
      ? (anime.imagenGrande ?? anime.imagen!)
      : PLACEHOLDER_IMG;

  // Valores derivados en el render para la calculadora de maratón
  const numEpisodios = typeof anime.episodios === 'number' ? anime.episodios : null;
  const minutosTotales =
    numEpisodios !== null ? numEpisodios * anime.duracionMinutos : null;
  const horasTotales =
    minutosTotales !== null ? (minutosTotales / 60).toFixed(1) : null;
  const diasEstimados =
    numEpisodios !== null ? Math.ceil(numEpisodios / ritmoEpisodiosDia) : null;

  return (
    <dialog
      ref={dialogRef}
      className="anime-dialog"
      aria-labelledby={tituloId}
      onClose={onCerrar}
      onClick={manejarClickBackdrop}
      {...({ closedby: 'any' } as Record<string, unknown>)}
    >
      <button
        type="button"
        className="modal-close-btn"
        aria-label="Cerrar modal"
        onClick={() => dialogRef.current?.close()}
      >
        ✕
      </button>

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
                    onChange={(e) => setRitmoEpisodiosDia(Number(e.target.value))}
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
    </dialog>
  );
}

