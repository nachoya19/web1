// Descarta elementos que carecen de titulos validos
export function filtrarAnimesValidos(listaBruta) {
  if (!Array.isArray(listaBruta)) return [];

  return listaBruta.filter((item) => {
    const attrs = item?.attributes;
    return Boolean(attrs && (attrs.canonicalTitle || attrs.titles?.en || attrs.titles?.en_jp || attrs.titles?.ja_jp));
  });
}

// Filtra y transforma en un unico paso mediante flatMap
export function normalizarAnimes(listaBruta) {
  if (!Array.isArray(listaBruta)) return [];

  return listaBruta.flatMap((item) => {
    const attrs = item?.attributes;
    const esValido = Boolean(
      attrs && (attrs.canonicalTitle || attrs.titles?.en || attrs.titles?.en_jp || attrs.titles?.ja_jp)
    );

    // Omite items sin campos de titulo
    if (!esValido) return [];

    // Fallbacks secuenciales de titulos
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

// Calcula la media con un unico reduce preservando un decimal
export function calcularRatingMedio(lista) {
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
export function contarPorEstado(lista) {
  if (!Array.isArray(lista)) return {};

  return lista.reduce((acumulador, anime) => {
    const estado = anime.estado;
    acumulador[estado] = (acumulador[estado] ?? 0) + 1;
    return acumulador;
  }, {});
}

// Ordena situando siempre los elementos sin nota al final
export function ordenarPorRating(lista, descendente = true) {
  if (!Array.isArray(lista)) return [];

  const comparador = (a, b) => {
    const ratingA = a.rating;
    const ratingB = b.rating;

    // Si ambos carecen de nota, preservan su orden relativo
    if (ratingA === null && ratingB === null) return 0;
    // Animes sin calificacion se situan siempre al final de la lista
    if (ratingA === null) return 1;
    if (ratingB === null) return -1;

    return descendente ? ratingB - ratingA : ratingA - ratingB;
  };

  return typeof lista.toSorted === 'function'
    ? lista.toSorted(comparador)
    : [...lista].sort(comparador);
}

// Filtra por rating excluyendo expresamente elementos sin nota
export function filtrarPorRatingMinimo(lista, notaMinima = 0) {
  if (!Array.isArray(lista)) return [];
  if (notaMinima <= 0) return lista;

  return lista.filter((anime) => typeof anime.rating === 'number' && !Number.isNaN(anime.rating) && anime.rating >= notaMinima);
}

// Filtra la coleccion segun el estado de emision
export function filtrarPorEstado(lista, estadoFiltro = 'todos') {
  if (!Array.isArray(lista)) return [];
  if (!estadoFiltro || estadoFiltro === 'todos') return lista;
  return lista.filter((anime) => anime.estado.toLowerCase() === estadoFiltro.toLowerCase());
}

// Filtra segun el identificador de favoritos
export function filtrarPorFavoritos(lista, idsFavoritos = []) {
  if (!Array.isArray(lista)) return [];
  const setFavoritos = new Set(idsFavoritos.map(String));
  return lista.filter((anime) => setFavoritos.has(String(anime.id)));
}