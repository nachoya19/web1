import { useCallback, useState } from 'react';
import AnimeCompareModal from './components/AnimeCompareModal';
import AnimeDetailModal from './components/AnimeDetailModal';
import AnimeGrid from './components/AnimeGrid';
import CompareDock from './components/CompareDock';
import Footer from './components/Footer';
import Header from './components/Header';
import SearchControls from './components/SearchControls';
import StatsRibbon from './components/StatsRibbon';
import {
  EmptyState,
  ErrorBanner,
  LoadingSpinner,
} from './components/StatusFeedback';
import { useAnimesVisibles } from './hooks/useAnimesVisibles';
import { useFiltros } from './hooks/useFiltros';
import { useKitsuFetch } from './hooks/useKitsuFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Anime } from './types/anime';
import { COMPARANDO_KEY, FAVORITOS_KEY } from './utils/storage';

export default function App() {
  // Estado de exploración y filtros agrupado en un custom hook dedicado
  const { filtros, accionesFiltros } = useFiltros();

  // Estado mínimo de UI para apertura de modales
  const [animeDetalle, setAnimeDetalle] = useState<Anime | null>(null);
  const [comparadorAbierto, setComparadorAbierto] = useState(false);

  // Persistencia de IDs de favoritos y comparación en localStorage
  const [favoritosIds, setFavoritosIds] = useLocalStorage<string[]>(
    FAVORITOS_KEY,
    []
  );
  const [comparandoIds, setComparandoIds] = useLocalStorage<string[]>(
    COMPARANDO_KEY,
    []
  );

  // Sincronización asíncrona con Kitsu API a través de useFetch + useReducer
  const { status, animes, error, origen, recargar } = useKitsuFetch(
    filtros.categoriaActiva,
    filtros.terminoBusqueda
  );

  // Cadena de filtrado y ordenación delegada en el hook especializado useAnimesVisibles
  const animesVisibles = useAnimesVisibles(animes, filtros, favoritosIds);

  // Deriva los objetos completos de Anime seleccionados a partir de los IDs
  const animesComparando = comparandoIds.flatMap((id) => {
    const encontrado = animes.find((a) => String(a.id) === String(id));
    return encontrado ? [encontrado] : [];
  });

  const manejarToggleFavorito = useCallback(
    (animeId: string) => {
      const idStr = String(animeId);
      setFavoritosIds((prev) =>
        prev.includes(idStr)
          ? prev.filter((id) => id !== idStr)
          : [...prev, idStr]
      );
    },
    [setFavoritosIds]
  );

  const manejarToggleComparar = useCallback(
    (animeId: string) => {
      const idStr = String(animeId);
      setComparandoIds((prev) => {
        if (prev.includes(idStr)) {
          return prev.filter((id) => id !== idStr);
        }
        if (prev.length >= 2) {
          return [prev[1], idStr];
        }
        return [...prev, idStr];
      });
    },
    [setComparandoIds]
  );

  const manejarQuitarDeComparacion = useCallback(
    (animeId: string) => {
      const idStr = String(animeId);
      setComparandoIds((prev) => prev.filter((id) => id !== idStr));
    },
    [setComparandoIds]
  );

  const manejarLimpiarComparacion = useCallback(() => {
    setComparandoIds([]);
    setComparadorAbierto(false);
  }, [setComparandoIds]);

  function renderContenidoCatalogo() {
    if (status === 'loading' && animes.length === 0) {
      return <LoadingSpinner />;
    }

    if (status === 'error' && error) {
      return <ErrorBanner mensaje={error} onRetry={() => recargar(true)} />;
    }

    return (
      <>
        {status === 'loading' && (
          <LoadingSpinner mensaje="Actualizando resultados de Kitsu..." />
        )}
        <StatsRibbon
          animes={animesVisibles}
          origen={origen}
          onRefrescarRed={() => recargar(true)}
        />
        {animesVisibles.length === 0 ? (
          <EmptyState
            terminoBusqueda={filtros.terminoBusqueda}
            filtroLocal={filtros.filtroLocal}
            soloFavoritos={filtros.soloFavoritos}
            onResetFiltros={accionesFiltros.resetFiltros}
          />
        ) : (
          <AnimeGrid
            animes={animesVisibles}
            cargando={status === 'loading'}
            favoritosIds={favoritosIds}
            comparandoIds={comparandoIds}
            onVerDetalle={(anime) => setAnimeDetalle(anime)}
            onToggleFavorito={manejarToggleFavorito}
            onToggleComparar={manejarToggleComparar}
          />
        )}
      </>
    );
  }

  const esDetalleFavorito =
    animeDetalle !== null && favoritosIds.includes(String(animeDetalle.id));

  return (
    <div id="app">
      <Header
        totalFavoritos={favoritosIds.length}
        totalComparando={animesComparando.length}
        soloFavoritos={filtros.soloFavoritos}
        onToggleSoloFavoritos={accionesFiltros.toggleSoloFavoritos}
        onAbrirComparador={() => setComparadorAbierto(true)}
      />

      <main>
        <SearchControls
          filtros={filtros}
          acciones={accionesFiltros}
          cargando={status === 'loading'}
        />

        {renderContenidoCatalogo()}
      </main>

      <AnimeDetailModal
        anime={animeDetalle}
        esFavorito={esDetalleFavorito}
        onCerrar={() => setAnimeDetalle(null)}
        onToggleFavorito={manejarToggleFavorito}
      />

      <CompareDock
        seleccionados={animesComparando}
        onAbrirComparador={() => setComparadorAbierto(true)}
        onQuitarDeComparacion={manejarQuitarDeComparacion}
        onLimpiarComparacion={manejarLimpiarComparacion}
      />

      <AnimeCompareModal
        seleccionados={animesComparando}
        abierto={comparadorAbierto}
        onCerrar={() => setComparadorAbierto(false)}
      />

      <Footer />
    </div>
  );
}
