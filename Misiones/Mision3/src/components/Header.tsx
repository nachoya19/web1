interface HeaderProps {
  totalFavoritos: number;
  totalComparando: number;
  soloFavoritos: boolean;
  onToggleSoloFavoritos: () => void;
  onAbrirComparador: () => void;
}

export default function Header({
  totalFavoritos,
  totalComparando,
  soloFavoritos,
  onToggleSoloFavoritos,
  onAbrirComparador,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-top-pills">
        <span className="logo-badge">ANIME RADAR · REACT 19</span>
        <div className="header-quick-counters">
          <button
            type="button"
            className={`counter-pill ${soloFavoritos ? 'active' : ''}`}
            onClick={onToggleSoloFavoritos}
            aria-pressed={soloFavoritos}
            title="Alternar vista de tus animes favoritos"
          >
            ★ Favoritos: <strong>{totalFavoritos}</strong>
          </button>
          {totalComparando > 0 && (
            <button
              type="button"
              className="counter-pill compare-pill"
              onClick={onAbrirComparador}
              title="Abrir comparador cara a cara"
            >
              ⚖ Comparador: <strong>{totalComparando}/2</strong>
            </button>
          )}
        </div>
      </div>
      <h1>Kitsu Anime Radar</h1>
      <p className="header-subtitle">
        Explorador reactivo en tiempo real con caché inteligente, comparador VS y calculadora de maratón
      </p>
    </header>
  );
}
