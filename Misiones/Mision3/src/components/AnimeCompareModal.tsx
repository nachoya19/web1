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

interface FighterMetricRowProps {
  titulo: string;
  valorA: string | number;
  valorB: string | number;
  ganaA?: boolean;
  ganaB?: boolean;
  barraA?: number;
  barraB?: number;
}

/**
 * Subcomponente desacoplado para renderizar filas de métricas comparativas
 * evitando mezclar cálculos y condiciones dentro del JSX principal.
 */
function FighterMetricRow({
  titulo,
  valorA,
  valorB,
  ganaA = false,
  ganaB = false,
  barraA,
  barraB,
}: FighterMetricRowProps) {
  return (
    <div className="compare-metric-row">
      <div className="metric-header">
        <span className={ganaA ? 'metric-lead' : ''}>{valorA}</span>
        <strong>{titulo}</strong>
        <span className={ganaB ? 'metric-lead' : ''}>{valorB}</span>
      </div>
      {typeof barraA === 'number' && typeof barraB === 'number' && (
        <div className="dual-bar">
          <div className="bar-left" style={{ width: `${barraA}%` }} />
          <div className="bar-right" style={{ width: `${barraB}%` }} />
        </div>
      )}
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
 * Reutiliza el componente común ModalDialog y delega en FighterCard y FighterMetricRow.
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

  const textoRatingA = animeA?.rating !== null && animeA?.rating !== undefined ? `${animeA.rating}%` : 'N/A';
  const textoRatingB = animeB?.rating !== null && animeB?.rating !== undefined ? `${animeB.rating}%` : 'N/A';

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
            <FighterMetricRow
              titulo="Valoración de la comunidad"
              valorA={textoRatingA}
              valorB={textoRatingB}
              ganaA={ratingA >= ratingB}
              ganaB={ratingB >= ratingA}
              barraA={ratingA}
              barraB={ratingB}
            />
            <FighterMetricRow
              titulo="Volumen de episodios"
              valorA={`${epA} ep.`}
              valorB={`${epB} ep.`}
              ganaA={epA >= epB}
              ganaB={epB >= epA}
            />
            <FighterMetricRow
              titulo="Año de estreno"
              valorA={animeA.año}
              valorB={animeB.año}
            />
          </div>
        </div>
      )}
    </ModalDialog>
  );
}
