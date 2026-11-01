import type { FormEvent } from 'react';
import type { AccionesFiltros, EstadoFiltros } from '../hooks/useFiltros';
import type { FiltroEstado } from '../types/anime';

const SUGERENCIAS_RAPIDAS = [
  'Attack on Titan',
  'Fullmetal Alchemist',
  'Jujutsu Kaisen',
  'One Piece',
  'Death Note',
];

interface SearchControlsProps {
  filtros: EstadoFiltros;
  acciones: AccionesFiltros;
  cargando: boolean;
}

export default function SearchControls({
  filtros,
  acciones,
  cargando,
}: SearchControlsProps) {
  const {
    categoriaActiva,
    terminoBusqueda,
    textoInput,
    filtroLocal,
    ordenDescendente,
    notaMinima,
    estadoFiltro,
    soloFavoritos,
  } = filtros;

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    acciones.buscarTermino(textoInput);
  }

  return (
    <section
      className="controls-wrapper"
      aria-label="Controles de exploración y filtrado"
    >
      {/* Pestañas de categoría con aria-pressed */}
      <div
        className="category-tabs"
        role="group"
        aria-label="Categorías del catálogo"
      >
        <button
          type="button"
          className={`tab-btn ${categoriaActiva === 'populares' ? 'active' : ''}`}
          aria-pressed={categoriaActiva === 'populares'}
          onClick={() => acciones.cambiarCategoria('populares')}
        >
          En tendencia
        </button>
        <button
          type="button"
          className={`tab-btn ${categoriaActiva === 'mejor_valorados' ? 'active' : ''}`}
          aria-pressed={categoriaActiva === 'mejor_valorados'}
          onClick={() => acciones.cambiarCategoria('mejor_valorados')}
        >
          Mejor valorados
        </button>
        <button
          type="button"
          className={`tab-btn ${categoriaActiva === 'en_emision' ? 'active' : ''}`}
          aria-pressed={categoriaActiva === 'en_emision'}
          onClick={() => acciones.cambiarCategoria('en_emision')}
        >
          En emisión popular
        </button>
      </div>

      {/* Formulario de búsqueda en API y controles de filtro */}
      <div className="controls-section">
        <form className="search-form" onSubmit={manejarEnvio}>
          <input
            type="text"
            className="search-input"
            value={textoInput}
            onChange={(e) => acciones.setTextoInput(e.target.value)}
            placeholder="Buscar en Kitsu API (ej. Naruto, Bleach)..."
            aria-label="Buscar anime en la API de Kitsu"
            autoComplete="off"
          />
          <button type="submit" className="search-btn" disabled={cargando}>
            {cargando ? 'Sincronizando...' : 'Buscar'}
          </button>
        </form>

        <input
          type="search"
          className="local-filter-input"
          value={filtroLocal}
          onChange={(e) => acciones.setFiltroLocal(e.target.value)}
          placeholder="Filtrar resultados actuales..."
          aria-label="Filtrar instantáneamente resultados en pantalla"
        />

        <button
          type="button"
          className="secondary-btn"
          onClick={acciones.toggleOrden}
          aria-pressed={!ordenDescendente}
          title="Alternar dirección de ordenación por puntuación"
        >
          {ordenDescendente ? '↓ Mayor nota' : '↑ Menor nota'}
        </button>

        <select
          className="secondary-btn"
          value={notaMinima}
          onChange={(e) => acciones.setNotaMinima(Number(e.target.value))}
          aria-label="Filtrar por valoración mínima"
        >
          <option value={0}>Todas las notas</option>
          <option value={70}>70% o más</option>
          <option value={80}>80% o más</option>
          <option value={85}>85% o más</option>
        </select>

        <select
          className="secondary-btn"
          value={estadoFiltro}
          onChange={(e) =>
            acciones.setEstadoFiltro(e.target.value as FiltroEstado)
          }
          aria-label="Filtrar por estado de emisión"
        >
          <option value="todos">Todos los estados</option>
          <option value="En emisión">En emisión</option>
          <option value="Finalizado">Finalizado</option>
        </select>

        <button
          type="button"
          className={`secondary-btn ${soloFavoritos ? 'active' : ''}`}
          onClick={acciones.toggleSoloFavoritos}
          aria-pressed={soloFavoritos}
        >
          {soloFavoritos ? 'Mostrando favoritos' : 'Ver favoritos'}
        </button>
      </div>

      {/* Sugerencias rápidas de consulta */}
      <div className="quick-tags">
        <span className="quick-tags-label">Sugerencias:</span>
        {SUGERENCIAS_RAPIDAS.map((sugerencia) => {
          const esActiva =
            categoriaActiva === 'busqueda' &&
            terminoBusqueda.toLowerCase() === sugerencia.toLowerCase();
          return (
            <button
              key={sugerencia}
              type="button"
              className={`tag-chip ${esActiva ? 'active' : ''}`}
              aria-pressed={esActiva}
              onClick={() => acciones.buscarTermino(sugerencia)}
            >
              {sugerencia}
            </button>
          );
        })}
      </div>
    </section>
  );
}
