import type { Anime, OrigenDatos } from '../types/anime';
import { calcularEstadisticasCatalogo } from '../utils/logic';

interface StatsRibbonProps {
  animes: Anime[];
  origen: OrigenDatos;
  onRefrescarRed: () => void;
}

function obtenerClaseOrigen(origen: OrigenDatos): string {
  if (origen && origen.includes('Caché')) {
    return 'origin-cache';
  }
  return 'origin-live';
}

/**
 * Cinta de métricas derivadas.
 * Calcula todos los agregados durante el render mediante .reduce() sin estado duplicado.
 */
export default function StatsRibbon({
  animes,
  origen,
  onRefrescarRed,
}: StatsRibbonProps) {
  if (animes.length === 0) {
    return null;
  }

  const estadisticas = calcularEstadisticasCatalogo(animes);
  const detalleEstados = Object.entries(estadisticas.porEstado)
    .map(([estado, cantidad]) => `${estado}: ${cantidad}`)
    .join(' · ');

  return (
    <div
      className="stats-bar"
      role="region"
      aria-label="Resumen estadístico del catálogo"
    >
      <div className="stats-metrics">
        <span className="stat-item">
          Mostrando <strong>{estadisticas.total}</strong> animes
        </span>
        {estadisticas.mediaRating !== null && (
          <span className="stat-item stat-gold">
            ★ <strong>{estadisticas.mediaRating}%</strong> media
          </span>
        )}
        {detalleEstados.length > 0 && (
          <span className="stat-item">{detalleEstados}</span>
        )}
        {estadisticas.totalEpisodiosConocidos > 0 && (
          <span className="stat-item">
            <strong>{estadisticas.totalEpisodiosConocidos}</strong> ep.
            acumulados
          </span>
        )}
      </div>

      {origen !== null && (
        <div className="stats-origin">
          <span className={`origin-badge ${obtenerClaseOrigen(origen)}`}>
            {origen}
          </span>
          <button
            type="button"
            className="refresh-cache-btn"
            onClick={onRefrescarRed}
            title="Ignorar caché local y consultar de nuevo la API de Kitsu"
          >
            ↻ Sincronizar
          </button>
        </div>
      )}
    </div>
  );
}
