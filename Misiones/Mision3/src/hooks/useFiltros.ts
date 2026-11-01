import { useState } from 'react';
import type { CategoriaExplorar, FiltroEstado } from '../types/anime';

export interface EstadoFiltros {
  categoriaActiva: CategoriaExplorar;
  terminoBusqueda: string;
  textoInput: string;
  filtroLocal: string;
  ordenDescendente: boolean;
  notaMinima: number;
  estadoFiltro: FiltroEstado;
  soloFavoritos: boolean;
}

export interface AccionesFiltros {
  setTextoInput: (texto: string) => void;
  cambiarCategoria: (categoria: CategoriaExplorar) => void;
  buscarTermino: (termino: string) => void;
  setFiltroLocal: (texto: string) => void;
  toggleOrden: () => void;
  setNotaMinima: (nota: number) => void;
  setEstadoFiltro: (estado: FiltroEstado) => void;
  toggleSoloFavoritos: () => void;
  resetFiltros: () => void;
}

const FILTROS_INICIALES: EstadoFiltros = {
  categoriaActiva: 'populares',
  terminoBusqueda: '',
  textoInput: '',
  filtroLocal: '',
  ordenDescendente: true,
  notaMinima: 0,
  estadoFiltro: 'todos',
  soloFavoritos: false,
};

/**
 * Custom hook que agrupa el estado de exploración y filtrado en un único objeto.
 * Evita múltiples estados sueltos en App.tsx, reduce el prop drilling hacia SearchControls
 * y mantiene textoInput sincronizado con terminoBusqueda tras cualquier reset.
 */
export function useFiltros(): {
  filtros: EstadoFiltros;
  accionesFiltros: AccionesFiltros;
} {
  const [filtros, setFiltros] = useState<EstadoFiltros>(FILTROS_INICIALES);

  const accionesFiltros: AccionesFiltros = {
    setTextoInput: (textoInput) => {
      setFiltros((prev) => ({ ...prev, textoInput }));
    },
    cambiarCategoria: (nuevaCategoria) => {
      setFiltros((prev) => ({
        ...prev,
        categoriaActiva: nuevaCategoria,
        terminoBusqueda: '',
        textoInput: '',
        filtroLocal: '',
      }));
    },
    buscarTermino: (termino) => {
      const limpio = termino.trim();
      setFiltros((prev) => ({
        ...prev,
        categoriaActiva: limpio.length > 0 ? 'busqueda' : 'populares',
        terminoBusqueda: limpio,
        textoInput: limpio,
        filtroLocal: '',
      }));
    },
    setFiltroLocal: (filtroLocal) => {
      setFiltros((prev) => ({ ...prev, filtroLocal }));
    },
    toggleOrden: () => {
      setFiltros((prev) => ({
        ...prev,
        ordenDescendente: !prev.ordenDescendente,
      }));
    },
    setNotaMinima: (notaMinima) => {
      setFiltros((prev) => ({ ...prev, notaMinima }));
    },
    setEstadoFiltro: (estadoFiltro) => {
      setFiltros((prev) => ({ ...prev, estadoFiltro }));
    },
    toggleSoloFavoritos: () => {
      setFiltros((prev) => ({ ...prev, soloFavoritos: !prev.soloFavoritos }));
    },
    resetFiltros: () => {
      setFiltros((prev) => ({
        ...FILTROS_INICIALES,
        categoriaActiva:
          prev.categoriaActiva === 'busqueda'
            ? 'populares'
            : prev.categoriaActiva,
      }));
    },
  };

  return { filtros, accionesFiltros };
}

