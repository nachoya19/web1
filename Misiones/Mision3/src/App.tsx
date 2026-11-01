import { useState } from 'react';
import AnimeCompareModal from './components/AnimeCompareModal';
import AnimeDetailModal from './components/AnimeDetailModal';
import AnimeGrid from './components/AnimeGrid';
import Footer from './components/Footer';
import Header from './components/Header';
import SearchControls from './components/SearchControls';
import StatsRibbon from './components/StatsRibbon';
import { ErrorBanner, LoadingSpinner } from './components/StatusFeedback';
import { useKitsuFetch } from './hooks/useKitsuFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Anime, CategoriaExplorar, FiltroEstado } from './types/anime';
import {
  filtrarPorEstado,
  filtrarPorFavoritos,
  filtrarPorRatingMinimo,
  filtrarPorTextoLocal,
  ordenarPorRating,
} from './utils/logic';
import { FAVORITOS_KEY } from './utils/storage';

export default function App() {
  // Estado mínimo de consulta y filtrado
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaExplorar>('populares');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroLocal, setFiltroLocal] = useState('');
  const [ordenDescendente, setOrdenDescendente] = useState(true);
  const [notaMinima, setNotaMinima] = useState(0);
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>('todos');
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  // Estado de modales e interacción VS
  const [animeDetalle, setAnimeDetalle] = useState<Anime | null>(null);
  const [animesComparando, setAnimesComparando] = useState<Anime[]>([]);
  const [comparadorAbierto, setComparadorAbierto] = useState(false);

  // Custom hooks reutilizables: persistencia en localStorage y sincronización con Kitsu API
  const [favoritosIds, setFavoritosIds] = useLocalStorage<string[]>(FAVORITOS_KEY, []);
  const { status, animes, error, origen, recargar } = useKitsuFetch(
    categoriaActiva,
    terminoBusqueda
  );

  // Valores derivados calculados directamente durante el render (sin estado redundante ni useEffect)
  const filtradosPorNota = filtrarPorRatingMinimo(animes, notaMinima);
  const filtradosPorEstado = filtrarPorEstado(filtradosPorNota, estadoFiltro);
  const filtradosPorFavs = soloFavoritos
    ? filtrarPorFavoritos(filtradosPorEstado, favoritosIds)
    : filtradosPorEstado;
  const filtradosLocalmente = filtrarPorTextoLocal(filtradosPorFavs, filtroLocal);
  const animesVisibles = ordenarPorRating(filtradosLocalmente, ordenDescendente);

  // Manejadores de eventos inmutables con función actualizadora
  function manejarCambiarCategoria(nuevaCategoria: CategoriaExplorar) {
    setCategoriaActiva(nuevaCategoria);
    setTerminoBusqueda('');
    setFiltroLocal('');
  }

  function manejarBuscarTermino(termino: string) {
    setTerminoBusqueda(termino);
    setCategoriaActiva('busqueda');
    setFiltroLocal('');
  }

  function manejarToggleFavorito(animeId: string) {
    const idStr = String(animeId);
    setFavoritosIds((prev) =>
      prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr]
    );
  }

  function manejarToggleComparar(anime: Anime) {
    setAnimesComparando((prev) => {
      const existe = prev.some((item) => item.id === anime.id);
      if (existe) {
        return prev.filter((item) => item.id !== anime.id);
      }
      if (prev.length >= 2) {
        return [prev[1], anime];
      }
      return [...prev, anime];
    });
  }

  function manejarQuitarDeComparacion(animeId: string) {
    setAnimesComparando((prev) => prev.filter((item) => item.id !== animeId));
  }

  function manejarResetFiltros() {
    setNotaMinima(0);
    setEstadoFiltro('todos');
    setSoloFavoritos(false);
    setFiltroLocal('');
    if (categoriaActiva === 'busqueda') {
      setTerminoBusqueda('');
      setCategoriaActiva('populares');
    }
  }

  // Función de renderizado condicional limpio sin ternarios anidados
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
          comparandoIds={animesComparando.map((a) => a.id)}
          terminoBusqueda={terminoBusqueda}
          filtroLocal={filtroLocal}
          soloFavoritos={soloFavoritos}
          onVerDetalle={(anime) => setAnimeDetalle(anime)}
          onToggleFavorito={manejarToggleFavorito}
          onToggleComparar={manejarToggleComparar}
          onResetFiltros={manejarResetFiltros}
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
        soloFavoritos={soloFavoritos}
        onToggleSoloFavoritos={() => setSoloFavoritos((v) => !v)}
        onAbrirComparador={() => setComparadorAbierto(true)}
      />

      <main>
        <SearchControls
          categoriaActiva={categoriaActiva}
          terminoBusqueda={terminoBusqueda}
          filtroLocal={filtroLocal}
          ordenDescendente={ordenDescendente}
          notaMinima={notaMinima}
          estadoFiltro={estadoFiltro}
          soloFavoritos={soloFavoritos}
          cargando={status === 'loading'}
          onCambiarCategoria={manejarCambiarCategoria}
          onBuscarTermino={manejarBuscarTermino}
          onCambiarFiltroLocal={setFiltroLocal}
          onToggleOrden={() => setOrdenDescendente((o) => !o)}
          onCambiarNotaMinima={setNotaMinima}
          onCambiarEstadoFiltro={setEstadoFiltro}
          onToggleSoloFavoritos={() => setSoloFavoritos((f) => !f)}
        />

        {renderContenidoCatalogo()}
      </main>

      <AnimeDetailModal
        anime={animeDetalle}
        esFavorito={esDetalleFavorito}
        onCerrar={() => setAnimeDetalle(null)}
        onToggleFavorito={manejarToggleFavorito}
      />

      <AnimeCompareModal
        seleccionados={animesComparando}
        abierto={comparadorAbierto}
        onAbrir={() => setComparadorAbierto(true)}
        onCerrar={() => setComparadorAbierto(false)}
        onQuitarDeComparacion={manejarQuitarDeComparacion}
        onLimpiarComparacion={() => {
          setAnimesComparando([]);
          setComparadorAbierto(false);
        }}
      />

      <Footer />
    </div>
  );
}
