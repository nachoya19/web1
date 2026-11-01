import { useEffect, useId, useRef, type MouseEvent } from 'react';
import type { Anime } from '../types/anime';
import { PLACEHOLDER_IMG } from '../utils/logic';
import AnimeBadges from './AnimeBadges';

interface AnimeCompareModalProps {
  seleccionados: Anime[];
  abierto: boolean;
  onAbrir: () => void;
  onCerrar: () => void;
  onQuitarDeComparacion: (animeId: string) => void;
  onLimpiarComparacion: () => void;
}

export default function AnimeCompareModal({
  seleccionados,
  abierto,
  onAbrir,
  onCerrar,
  onQuitarDeComparacion,
  onLimpiarComparacion,
}: AnimeCompareModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const tituloId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (abierto && seleccionados.length > 0) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [abierto, seleccionados.length]);

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

  if (seleccionados.length === 0) {
    return null;
  }

  const [animeA, animeB] = seleccionados;
  const ratingA = animeA?.rating ?? 0;
  const ratingB = animeB?.rating ?? 0;
  const epA = typeof animeA?.episodios === 'number' ? animeA.episodios : 0;
  const epB = typeof animeB?.episodios === 'number' ? animeB.episodios : 0;

  return (
    <>
      {/* Barra flotante inferior de selección VS */}
      <aside className="compare-dock" aria-label="Bandeja de comparación de animes">
        <div className="compare-dock-items">
          {seleccionados.map((item) => (
            <div key={item.id} className="compare-chip">
              <span>{item.titulo}</span>
              <button
                type="button"
                aria-label={`Quitar ${item.titulo} de la comparación`}
                onClick={() => onQuitarDeComparacion(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
          {seleccionados.length === 1 && (
            <span className="compare-hint">
              Selecciona 1 anime más con el botón «⚖ VS» para comparar
            </span>
          )}
        </div>

        <div className="compare-dock-actions">
          <button
            type="button"
            className="search-btn"
            disabled={seleccionados.length < 2}
            onClick={onAbrir}
          >
            ⚖ Comparar cara a cara ({seleccionados.length}/2)
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={onLimpiarComparacion}
          >
            Limpiar
          </button>
        </div>
      </aside>

      {/* Modal de comparación cara a cara */}
      <dialog
        ref={dialogRef}
        className="anime-dialog compare-dialog"
        aria-labelledby={tituloId}
        onClose={onCerrar}
        onClick={manejarClickBackdrop}
        {...({ closedby: 'any' } as Record<string, unknown>)}
      >
        <button
          type="button"
          className="modal-close-btn"
          aria-label="Cerrar comparador"
          onClick={() => dialogRef.current?.close()}
        >
          ✕
        </button>

        <h2 id={tituloId} className="compare-modal-title">
          ⚖ Comparador Cara a Cara (VS)
        </h2>

        {animeA && animeB ? (
          <div className="compare-arena">
            <div className="compare-fighters">
              {[animeA, animeB].map((contendiente, idx) => {
                const otro = idx === 0 ? animeB : animeA;
                const ganaNota =
                  (contendiente.rating ?? 0) > (otro.rating ?? 0);
                return (
                  <div
                    key={contendiente.id}
                    className={`compare-fighter-card ${
                      ganaNota ? 'fighter-winner' : ''
                    }`}
                  >
                    <img
                      src={contendiente.imagen ?? PLACEHOLDER_IMG}
                      alt={contendiente.titulo}
                    />
                    <h3>{contendiente.titulo}</h3>
                    <AnimeBadges anime={contendiente} />
                    {ganaNota && (
                      <span className="winner-pill">🏆 Mejor valoración</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="compare-bars">
              <div className="compare-metric-row">
                <div className="metric-header">
                  <span className={ratingA >= ratingB ? 'metric-lead' : ''}>
                    {animeA.rating !== null ? `${animeA.rating}%` : 'N/A'}
                  </span>
                  <strong>Valoración de la comunidad</strong>
                  <span className={ratingB >= ratingA ? 'metric-lead' : ''}>
                    {animeB.rating !== null ? `${animeB.rating}%` : 'N/A'}
                  </span>
                </div>
                <div className="dual-bar">
                  <div
                    className="bar-left"
                    style={{ width: `${ratingA}%` }}
                  />
                  <div
                    className="bar-right"
                    style={{ width: `${ratingB}%` }}
                  />
                </div>
              </div>

              <div className="compare-metric-row">
                <div className="metric-header">
                  <span className={epA >= epB ? 'metric-lead' : ''}>
                    {animeA.episodios} ep.
                  </span>
                  <strong>Volumen de episodios</strong>
                  <span className={epB >= epA ? 'metric-lead' : ''}>
                    {animeB.episodios} ep.
                  </span>
                </div>
              </div>

              <div className="compare-metric-row">
                <div className="metric-header">
                  <span>{animeA.año}</span>
                  <strong>Año de estreno</strong>
                  <span>{animeB.año}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Selecciona dos animes del catálogo para ver la comparativa.</p>
        )}
      </dialog>
    </>
  );
}

