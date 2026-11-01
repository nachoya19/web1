export type EstadoEmision = 'En emisión' | 'Finalizado' | 'TBA';

export type FiltroEstado = 'todos' | 'En emisión' | 'Finalizado';

export type CategoriaExplorar = 'populares' | 'mejor_valorados' | 'en_emision' | 'busqueda';

export interface KitsuRawAttributes {
  canonicalTitle?: string | null;
  titles?: {
    en?: string | null;
    en_jp?: string | null;
    ja_jp?: string | null;
  };
  posterImage?: {
    small?: string | null;
    medium?: string | null;
    large?: string | null;
    original?: string | null;
  } | null;
  averageRating?: string | null;
  synopsis?: string | null;
  episodeCount?: number | null;
  episodeLength?: number | null;
  subtype?: string | null;
  status?: 'current' | 'finished' | 'tba' | 'unreleased' | 'upcoming' | string | null;
  startDate?: string | null;
  ageRating?: string | null;
  userCount?: number | null;
}

export interface KitsuRawItem {
  id: string;
  attributes?: KitsuRawAttributes | null;
}

export interface Anime {
  id: string;
  titulo: string;
  imagen: string | null;
  imagenGrande: string | null;
  rating: number | null;
  sinopsis: string;
  episodios: number | '¿?';
  duracionMinutos: number;
  tipo: string;
  estado: EstadoEmision;
  año: string;
  clasificacionEdad: string;
  enlaceKitsu: string;
}

export type OrigenDatos = 'Caché local (0 ms)' | 'API en directo' | null;

export type EstadoPeticion = 'idle' | 'loading' | 'success' | 'error';

export interface EstadisticasCatalogo {
  total: number;
  mediaRating: number | null;
  porEstado: Record<string, number>;
  totalEpisodiosConocidos: number;
}

