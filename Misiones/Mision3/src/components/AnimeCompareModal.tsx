import { useId } from 'react';
import type { Anime } from '../types/anime';
import { PLACEHOLDER_IMG } from '../utils/logic';
import AnimeBadges from './AnimeBadges';
import ModalDialog from './ModalDialog';

interface FighterCardProps {
  anime: Anime;
  esGanador: boolean;
}

/**
 * Subcomponente desacoplado para representar cada anime contendiente en la arena VS.
 */
function FighterCard({ anime, esGanador }: FighterCardProps) {
  return (
    <div
      className={`compare-fighter-card ${esGanador ? 'fighter-winner' : ''}`}
    >
      <img src={anime.imagen ?? PLACEHOLDER_IMG} alt={anime.titulo} />
      <h3>{anime.titulo}</h3>
      <AnimeBadges anime={anime} />
      {esGanador && <span className="winner-pill">Mejor valoración</span>}
    </div>
  );
}

interface AnimeCompareModalProps {
  seleccionados: Anime[];
  abierto: boolean;
  onCerrar: () => void;
}

/**
 * Modal dedicado exclusivamente a la comparación cara a cara entre dos animes.
 * Reutiliza el componente común ModalDialog para la lógica del elemento <dialog>.
 */
export default function AnimeCompareModal({
  seleccionados,
  abierto,
  onCerrar,
}: AnimeCompareModalProps) {
  const tituloId = useId();
  const [animeA, animeB] = seleccionados;

  const ratingA = animeA?.rating ?? 0;
  const ratingB = animeB?.rating ?? 0;
  const epA = typeof animeA?.episodios === 'number' ? animeA.episodios : 0;
  const epB = typeof animeB?.episodios === 'number' ? animeB.episodios : 0;

  const ganaA = ratingA > ratingB;
  const ganaB = ratingB > ratingA;

  return (
    <ModalDialog
      abierto={abierto && seleccionados.length >= 2}
      tituloId={tituloId}
      claseExtra="compare-dialog"
      ariaLabelCerrar="Cerrar comparador"
      onCerrar={onCerrar}
    >
      <h2 id={tituloId} className="compare-modal-title">
        Comparador Cara a Cara (VS)
      </h2>

      {!animeA || !animeB ? (
        <p>Selecciona dos animes del catálogo para ver la comparativa.</p>
      ) : (
        <div className="compare-arena">
          <div className="compare-fighters">
            <FighterCard anime={animeA} esGanador={ganaA} />
            <FighterCard anime={animeB} esGanador={ganaB} />
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
                <div className="bar-left" style={{ width: `${ratingA}%` }} />
                <div className="bar-right" style={{ width: `${ratingB}%` }} />
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
      )}
    </ModalDialog>
  );
}
