import { useState } from 'react';
import AnimeCompareModal from './components/AnimeCompareModal';
import AnimeDetailModal from './components/AnimeDetailModal';
import AnimeGrid from './components/AnimeGrid';
import CompareDock from './components/CompareDock';
import Footer from './components/Footer';
import Header from './components/Header';
import SearchControls from './components/SearchControls';
import StatsRibbon from './components/StatsRibbon';
import { ErrorBanner, LoadingSpinner } from './components/StatusFeedback';
import { useFiltros } from './hooks/useFiltros';
import { useKitsuFetch } from './hooks/useKitsuFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Anime } from './types/anime';
import {
  filtrarPorEstado,
  filtrarPorFavoritos,
  filtrarPorRatingMinimo,
  filtrarPorTextoLocal,
  ordenarPorRating,
} from './utils/logic';
import { COMPARANDO_KEY, FAVORITOS_KEY } from './utils/storage';

export default function App() {
  // Estado de exploración y filtros agrupado en un custom hook dedicado
  const { filtros, accionesFiltros } = useFiltros();

  // Estado mínimo de UI para la apertura de los modales
  const [animeDetalle, setAnimeDetalle] = useState<Anime | null>(null);
  const [comparadorAbierto, setComparadorAbierto] = useState(false);

  // Persistencia de IDs de favoritos y de comparación en localStorage
  const [favoritosIds, setFavoritosIds] = useLocalStorage<string[]>(
    FAVORITOS_KEY,
    []
  );
  const [comparandoIds, setComparandoIds] = useLocalStorage<string[]>(
    COMPARANDO_KEY,
    []
  );

  // Sincronización con la API de Kitsu usando el hook basado en useFetch + useReducer
  const { status, animes, error, origen, recargar } = useKitsuFetch(
    filtros.categoriaActiva,
    filtros.terminoBusqueda
  );

  // Valores derivados calculados durante el render (sin estado redundante ni useEffect)
  const filtradosPorNota = filtrarPorRatingMinimo(animes, filtros.notaMinima);
  const filtradosPorEstado = filtrarPorEstado(
    filtradosPorNota,
    filtros.estadoFiltro
  );
  const filtradosPorFavs = filtros.soloFavoritos
    ? filtrarPorFavoritos(filtradosPorEstado, favoritosIds)
    : filtradosPorEstado;
  const filtradosLocalmente = filtrarPorTextoLocal(
    filtradosPorFavs,
    filtros.filtroLocal
  );
  const animesVisibles = ordenarPorRating(
    filtradosLocalmente,
    filtros.ordenDescendente
  );

  // Deriva los objetos Anime seleccionados para comparar a partir de sus IDs
  const animesComparando = comparandoIds.flatMap((id) => {
    const encontrado = animes.find((a) => String(a.id) === String(id));
    return encontrado ? [encontrado] : [];
  });

  function manejarToggleFavorito(animeId: string) {
    const idStr = String(animeId);
    setFavoritosIds((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr]
    );
  }

  function manejarToggleComparar(animeId: string) {
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
  }

  function manejarQuitarDeComparacion(animeId: string) {
    const idStr = String(animeId);
    setComparandoIds((prev) => prev.filter((id) => id !== idStr));
  }

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
        <AnimeGrid
          animes={animesVisibles}
          cargando={status === 'loading'}
          favoritosIds={favoritosIds}
          comparandoIds={comparandoIds}
          terminoBusqueda={filtros.terminoBusqueda}
          filtroLocal={filtros.filtroLocal}
          soloFavoritos={filtros.soloFavoritos}
          onVerDetalle={(anime) => setAnimeDetalle(anime)}
          onToggleFavorito={manejarToggleFavorito}
          onToggleComparar={manejarToggleComparar}
          onResetFiltros={accionesFiltros.resetFiltros}
        />
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
        onLimpiarComparacion={() => {
          setComparandoIds([]);
          setComparadorAbierto(false);
        }}
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
