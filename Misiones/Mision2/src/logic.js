// Descarta animes sin titulos validos
export function filtrarAnimesValidos(listaBruta) {
  if (!Array.isArray(listaBruta)) return [];

  return listaBruta.filter((item) => {
    const attrs = item?.attributes;
    return Boolean(attrs && (attrs.canonicalTitle || attrs.titles?.en || attrs.titles?.en_jp || attrs.titles?.ja_jp));
  });
}

// Filtra y transforma la lista en una sola pasada usando flatMap
export function normalizarAnimes(listaBruta) {
  if (!Array.isArray(listaBruta)) return [];

  return listaBruta.flatMap((item) => {
    const attrs = item?.attributes;
    const esValido = Boolean(
      attrs && (attrs.canonicalTitle || attrs.titles?.en || attrs.titles?.en_jp || attrs.titles?.ja_jp)
    );

    // Omite elementos sin estructura minima
    if (!esValido) return [];

    // Prioriza titulos segun orden de disponibilidad
    const tituloFinal = attrs.canonicalTitle 
      ?? attrs.titles?.en 
      ?? attrs.titles?.en_jp 
      ?? attrs.titles?.ja_jp 
      ?? 'Título no disponible';

    const fechaInicio = attrs.startDate ? attrs.startDate.split('-')[0] : 'N/A';
    const tipoAnime = attrs.subtype ? attrs.subtype.toUpperCase() : 'ANIME';

    return [{
      id: item.id,
      titulo: tituloFinal,
      imagen: attrs.posterImage?.medium ?? attrs.posterImage?.small ?? null,
      imagenGrande: attrs.posterImage?.large ?? attrs.posterImage?.original ?? attrs.posterImage?.medium ?? null,
      rating: attrs.averageRating ? parseFloat(attrs.averageRating) : null,
      sinopsis: attrs.synopsis?.trim() ? attrs.synopsis.trim() : 'Sin sinopsis disponible.',
      episodios: attrs.episodeCount ?? '¿?',
      tipo: tipoAnime,
      estado: attrs.status === 'current' ? 'En emisión' : attrs.status === 'finished' ? 'Finalizado' : 'TBA',
      año: fechaInicio,
      enlaceKitsu: `https://kitsu.app/anime/${item.id}`,
    }];
  });
}

// Obtiene la calificacion promedio preservando un decimal
export function calcularRatingMedio(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return null;

  const conRating = lista.filter((a) => typeof a.rating === 'number' && !Number.isNaN(a.rating));
  if (conRating.length === 0) return null;

  const total = conRating.reduce((acumulado, anime) => acumulado + anime.rating, 0);
  return Number((total / conRating.length).toFixed(1));
}

// Agrupa y contabiliza animes segun su estado de emision
export function contarPorEstado(lista) {
  if (!Array.isArray(lista)) return {};

  return lista.reduce((acumulador, anime) => {
    const estado = anime.estado;
    acumulador[estado] = (acumulador[estado] ?? 0) + 1;
    return acumulador;
  }, {});
}

// Ordena de forma inmutable con soporte retrocompatible
export function ordenarPorRating(lista, descendente = true) {
  if (!Array.isArray(lista)) return [];

  const comparador = (a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    return descendente ? ratingB - ratingA : ratingA - ratingB;
  };

  return typeof lista.toSorted === 'function'
    ? lista.toSorted(comparador)
    : [...lista].sort(comparador);
}

// Filtra la lista por umbral de puntuacion minima
export function filtrarPorRatingMinimo(lista, notaMinima = 0) {
  if (!Array.isArray(lista)) return [];
  return lista.filter((anime) => (anime.rating ?? 0) >= notaMinima);
}

// Filtra elementos segun la lista de identificadores favoritos
export function filtrarPorFavoritos(lista, idsFavoritos = []) {
  if (!Array.isArray(lista)) return [];
  const setFavoritos = new Set(idsFavoritos.map(String));
  return lista.filter((anime) => setFavoritos.has(String(anime.id)));
}