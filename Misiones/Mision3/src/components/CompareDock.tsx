import type { Anime } from '../types/anime';

interface CompareDockProps {
  seleccionados: Anime[];
  onAbrirComparador: () => void;
  onQuitarDeComparacion: (animeId: string) => void;
  onLimpiarComparacion: () => void;
}

/**
 * Barra flotante inferior independiente para gestionar la cola de comparación VS.
 */
export default function CompareDock({
  seleccionados,
  onAbrirComparador,
  onQuitarDeComparacion,
  onLimpiarComparacion,
}: CompareDockProps) {
  if (seleccionados.length === 0) {
    return null;
  }

  return (
    <aside
      className="compare-dock"
      aria-label="Bandeja de comparación de animes"
    >
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
            Selecciona 1 anime más con el botón «VS» para comparar
          </span>
        )}
      </div>

      <div className="compare-dock-actions">
        <button
          type="button"
          className="search-btn"
          disabled={seleccionados.length < 2}
          onClick={onAbrirComparador}
        >
          Comparar cara a cara ({seleccionados.length}/2)
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
  );
}

