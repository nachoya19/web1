interface LoadingSpinnerProps {
  mensaje?: string;
}

export function LoadingSpinner({
  mensaje = 'Sincronizando con Kitsu...',
}: LoadingSpinnerProps) {
  return (
    <div className="spinner-wrapper" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{mensaje}</p>
    </div>
  );
}

interface ErrorBannerProps {
  mensaje: string;
  onRetry: () => void;
}

export function ErrorBanner({ mensaje, onRetry }: ErrorBannerProps) {
  return (
    <div className="error-box" role="alert">
      <p className="error-title">No se pudo sincronizar el radar</p>
      <p>{mensaje}</p>
      <button type="button" className="retry-btn" onClick={onRetry}>
        Reintentar petición
      </button>
    </div>
  );
}

interface EmptyStateProps {
  terminoBusqueda: string;
  filtroLocal: string;
  soloFavoritos: boolean;
  onResetFiltros: () => void;
}

export function EmptyState({
  terminoBusqueda,
  filtroLocal,
  soloFavoritos,
  onResetFiltros,
}: EmptyStateProps) {
  let mensaje = 'No se encontraron resultados para los filtros seleccionados.';

  if (soloFavoritos) {
    mensaje = 'No tienes ningún anime en favoritos que coincida con los filtros actuales.';
  } else if (filtroLocal.trim().length > 0) {
    mensaje = `Ningún anime en pantalla coincide con el filtro rápido "${filtroLocal}".`;
  } else if (terminoBusqueda.trim().length > 0) {
    mensaje = `No se encontraron animes para "${terminoBusqueda}". Prueba con otro término.`;
  }

  return (
    <div className="status-empty" role="status">
      <p>{mensaje}</p>
      <button type="button" className="secondary-btn" onClick={onResetFiltros}>
        Restablecer filtros y ver tendencias
      </button>
    </div>
  );
}

