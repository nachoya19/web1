// Descarta elementos que carecen de titulo
export function filtrarAnimesValidos(listaBruta) {
  if (!Array.isArray(listaBruta)) return [];

  return listaBruta.filter((item) => {
    const attrs = item?.attributes;
    return Boolean(attrs && (attrs.canonicalTitle || attrs.titles?.en || attrs.titles?.ja_jp));
  });
}

// Adapta los datos de la API a un modelo uniforme
export function normalizarAnimes(listaBruta) {
  const animesValidos = filtrarAnimesValidos(listaBruta);

  return animesValidos.map((item) => {
    const attrs = item.attributes;

    // Selecciona el titulo disponible por orden de prioridad
    const tituloFinal = attrs.canonicalTitle 
      ?? attrs.titles?.en 
      ?? attrs.titles?.en_jp 
      ?? attrs.titles?.ja_jp 
      ?? 'Título no disponible';

    const fechaInicio = attrs.startDate ? attrs.startDate.split('-')[0] : 'N/A';
    const tipoAnime = attrs.subtype ? attrs.subtype.toUpperCase() : 'ANIME';

    return {
      id: item.id,
      titulo: tituloFinal,
      imagen: attrs.posterImage?.medium ?? attrs.posterImage?.small ?? null,
      rating: attrs.averageRating ? parseFloat(attrs.averageRating) : null,
      sinopsis: attrs.synopsis?.trim() ? attrs.synopsis.trim() : 'Sin sinopsis disponible.',
      episodios: attrs.episodeCount ?? '¿?',
      tipo: tipoAnime,
      estado: attrs.status === 'current' ? 'En emisión' : attrs.status === 'finished' ? 'Finalizado' : 'TBA',
      año: fechaInicio,
      enlaceKitsu: `https://kitsu.app/anime/${item.id}`,
    };
  });
}

// Calcula la media de valoracion conservando un decimal
export function calcularRatingMedio(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return null;

  const conRating = lista.filter((a) => typeof a.rating === 'number' && !Number.isNaN(a.rating));
  if (conRating.length === 0) return null;

  const total = conRating.reduce((acumulado, anime) => acumulado + anime.rating, 0);
  return Number((total / conRating.length).toFixed(1));
}

// Cuenta la cantidad de animes segun su estado de emision
export function contarPorEstado(lista) {
  if (!Array.isArray(lista)) return {};

  return lista.reduce((acumulador, anime) => {
    const estado = anime.estado;
    acumulador[estado] = (acumulador[estado] ?? 0) + 1;
    return acumulador;
  }, {});
}

// Ordena la lista por nota sin modificar el array original
export function ordenarPorRating(lista, descendente = true) {
  if (!Array.isArray(lista)) return [];

  return lista.toSorted((a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    return descendente ? ratingB - ratingA : ratingA - ratingB;
  });
}

// Filtra animes que alcanzan la puntuacion minima indicada
export function filtrarPorRatingMinimo(lista, notaMinima = 0) {
  if (!Array.isArray(lista)) return [];
  return lista.filter((anime) => (anime.rating ?? 0) >= notaMinima);
}