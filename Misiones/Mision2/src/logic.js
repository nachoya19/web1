export const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%232e303a"/><text x="50%" y="50%" fill="%239ca3af" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">Sin Imagen</text></svg>';

export function filtrarAnimesValidos(listaBruta) {
  if (!Array.isArray(listaBruta)) return [];

  return listaBruta.filter((item) => {
    const attrs = item?.attributes;
    return Boolean(attrs && (attrs.canonicalTitle || attrs.titles?.en));
  });
}

export function normalizarAnimes(listaBruta) {
  const animesValidos = filtrarAnimesValidos(listaBruta);

  return animesValidos.map((item) => {
    const { canonicalTitle, posterImage, synopsis, averageRating } = item.attributes;

    return {
      id: item.id,
      titulo: canonicalTitle ?? 'Título no disponible',
      imagen: posterImage?.medium ?? posterImage?.small ?? PLACEHOLDER_IMG,
      rating: averageRating ? parseFloat(averageRating) : null,
      sinopsis: synopsis?.trim() ? synopsis.trim() : 'Sin sinopsis disponible.'
    };
  });
}

export function calcularRatingMedio(listaNormalizada) {
  if (!Array.isArray(listaNormalizada) || listaNormalizada.length === 0) {
    return 0;
  }

  const conRating = listaNormalizada.filter((anime) => typeof anime.rating === 'number' && !Number.isNaN(anime.rating));

  if (conRating.length === 0) return 0;

  const sumaTotal = conRating.reduce((acumulador, anime) => {
    return acumulador + anime.rating;
  }, 0);

  return Math.round(sumaTotal / conRating.length);
}