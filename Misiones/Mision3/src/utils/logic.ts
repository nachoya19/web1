import type {
  Anime,
  EstadisticasCatalogo,
  EstadoEmision,
  FiltroEstado,
  KitsuRawItem,
} from '../types/anime';

export const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1e2e"/><text x="50%" y="50%" fill="%238a92b2" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">Sin Imagen</text></svg>';

// Tabla de mapeo para evitar ternarios anidados al normalizar el estado de emisión
const MAPA_ESTADOS_EMISION: Record<string, EstadoEmision> = {
  current: 'En emisión',
  finished: 'Finalizado',
};

function resolverEstadoEmision(status?: string | null): EstadoEmision {
  if (status && status in MAPA_ESTADOS_EMISION) {
    return MAPA_ESTADOS_EMISION[status];
  }
  return 'TBA';
}

// Descarta elementos que carecen de títulos válidos
export function filtrarAnimesValidos(listaBruta: KitsuRawItem[]): KitsuRawItem[] {
  if (!Array.isArray(listaBruta)) return [];

  return listaBruta.filter((item) => {
    const attrs = item?.attributes;
    return Boolean(
      attrs &&
        (attrs.canonicalTitle ||
          attrs.titles?.en ||
          attrs.titles?.en_jp ||
          attrs.titles?.ja_jp)
    );
  });
}

// Filtra y transforma en un único paso mediante flatMap
export function normalizarAnimes(listaBruta: KitsuRawItem[]): Anime[] {
  if (!Array.isArray(listaBruta)) return [];

  return listaBruta.flatMap((item): Anime[] => {
    const attrs = item?.attributes;
    const esValido = Boolean(
      attrs &&
        (attrs.canonicalTitle ||
          attrs.titles?.en ||
          attrs.titles?.en_jp ||
          attrs.titles?.ja_jp)
    );

    if (!esValido || !attrs) return [];

    const tituloFinal =
      attrs.canonicalTitle ??
      attrs.titles?.en ??
      attrs.titles?.en_jp ??
      attrs.titles?.ja_jp ??
      'Título no disponible';

    const fechaInicio = attrs.startDate ? attrs.startDate.split('-')[0] : 'N/A';
    const tipoAnime = attrs.subtype ? attrs.subtype.toUpperCase() : 'ANIME';
    const estadoEmision: EstadoEmision = resolverEstadoEmision(attrs.status);

    const ratingParseado = attrs.averageRating ? Number.parseFloat(attrs.averageRating) : null;
    const ratingValido =
      ratingParseado !== null && !Number.isNaN(ratingParseado) ? ratingParseado : null;

    return [
      {
        id: String(item.id),
        titulo: tituloFinal,
        imagen: attrs.posterImage?.medium ?? attrs.posterImage?.small ?? null,
        imagenGrande:
          attrs.posterImage?.large ??
          attrs.posterImage?.original ??
          attrs.posterImage?.medium ??
          null,
        rating: ratingValido,
        sinopsis: attrs.synopsis?.trim()
          ? attrs.synopsis.trim()
          : 'Sin sinopsis disponible.',
        episodios:
          typeof attrs.episodeCount === 'number' && attrs.episodeCount > 0
            ? attrs.episodeCount
            : '¿?',
        duracionMinutos:
          typeof attrs.episodeLength === 'number' && attrs.episodeLength > 0
            ? attrs.episodeLength
            : 24,
        tipo: tipoAnime,
        estado: estadoEmision,
        año: fechaInicio,
        clasificacionEdad: attrs.ageRating ?? 'PG-13',
        enlaceKitsu: `https://kitsu.app/anime/${item.id}`,
      },
    ];
  });
}

// Calcula la media con un único reduce preservando un decimal
export function calcularRatingMedio(lista: Anime[]): number | null {
  if (!Array.isArray(lista) || lista.length === 0) return null;

  const resultado = lista.reduce(
    (acumulado, anime) => {
      if (typeof anime.rating === 'number' && !Number.isNaN(anime.rating)) {
        acumulado.suma += anime.rating;
        acumulado.contador += 1;
      }
      return acumulado;
    },
    { suma: 0, contador: 0 }
  );

  if (resultado.contador === 0) return null;
  return Number((resultado.suma / resultado.contador).toFixed(1));
}

// Contabiliza el volumen de animes clasificados por estado
export function contarPorEstado(lista: Anime[]): Record<string, number> {
  if (!Array.isArray(lista)) return {};

  return lista.reduce<Record<string, number>>((acumulador, anime) => {
    const estado = anime.estado;
    acumulador[estado] = (acumulador[estado] ?? 0) + 1;
    return acumulador;
  }, {});
}

// Calcula todas las métricas derivadas del catálogo visible en un solo paso
export function calcularEstadisticasCatalogo(lista: Anime[]): EstadisticasCatalogo {
  const mediaRating = calcularRatingMedio(lista);
  const porEstado = contarPorEstado(lista);
  const totalEpisodiosConocidos = lista.reduce((acc, anime) => {
    return typeof anime.episodios === 'number' ? acc + anime.episodios : acc;
  }, 0);

  return {
    total: lista.length,
    mediaRating,
    porEstado,
    totalEpisodiosConocidos,
  };
}

// Ordena de forma inmutable situando siempre los elementos sin nota al final
export function ordenarPorRating(lista: Anime[], descendente = true): Anime[] {
  if (!Array.isArray(lista)) return [];

  const comparador = (a: Anime, b: Anime): number => {
    const ratingA = a.rating;
    const ratingB = b.rating;

    if (ratingA === null && ratingB === null) return 0;
    if (ratingA === null) return 1;
    if (ratingB === null) return -1;

    return descendente ? ratingB - ratingA : ratingA - ratingB;
  };

  return [...lista].sort(comparador);
}

// Filtra por rating excluyendo expresamente elementos sin nota
export function filtrarPorRatingMinimo(lista: Anime[], notaMinima = 0): Anime[] {
  if (!Array.isArray(lista)) return [];
  if (notaMinima <= 0) return lista;

  return lista.filter(
    (anime) =>
      typeof anime.rating === 'number' &&
      !Number.isNaN(anime.rating) &&
      anime.rating >= notaMinima
  );
}

// Filtra la colección según el estado de emisión
export function filtrarPorEstado(lista: Anime[], estadoFiltro: FiltroEstado = 'todos'): Anime[] {
  if (!Array.isArray(lista)) return [];
  if (!estadoFiltro || estadoFiltro === 'todos') return lista;
  return lista.filter(
    (anime) => anime.estado.toLowerCase() === estadoFiltro.toLowerCase()
  );
}

// Filtra según el conjunto de identificadores de favoritos
export function filtrarPorFavoritos(lista: Anime[], idsFavoritos: string[] = []): Anime[] {
  if (!Array.isArray(lista)) return [];
  const setFavoritos = new Set(idsFavoritos.map(String));
  return lista.filter((anime) => setFavoritos.has(String(anime.id)));
}

// Filtra de forma instantánea por texto sobre la lista cargada (filtro rápido local)
export function filtrarPorTextoLocal(lista: Anime[], filtroRapido: string): Anime[] {
  const limpio = filtroRapido.trim().toLowerCase();
  if (!limpio) return lista;
  return lista.filter(
    (anime) =>
      anime.titulo.toLowerCase().includes(limpio) ||
      anime.tipo.toLowerCase().includes(limpio) ||
      anime.año.toLowerCase().includes(limpio)
  );
}

