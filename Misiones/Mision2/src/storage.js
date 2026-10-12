// Prefijo para evitar colisiones y tiempo maximo de validez (20 minutos)
const PREFIX = 'kitsu_cache_';
const FAVORITOS_KEY = 'kitsu_favoritos';
const TTL_MS = 20 * 60 * 1000;

// Limpia espacios y caracteres para estandarizar la cadena
export function normalizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto.trim().toLowerCase().replace(/\s+/g, '_');
}

// Genera la clave unica de cache centralizada en el modulo de almacenamiento
export function generarClaveCache(tipo, termino = '') {
  const terminoLimpio = normalizarTexto(termino);
  if (tipo === 'populares' || !terminoLimpio) {
    return 'populares';
  }
  return `busqueda_${terminoLimpio}`;
}

// Elimina registros caducados para liberar espacio en almacenamiento
function liberarEspacioExcedido() {
  const ahora = Date.now();
  const clavesParaBorrar = [];

  for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);
    if (clave && clave.startsWith(PREFIX)) {
      try {
        const item = JSON.parse(localStorage.getItem(clave));
        if (!item || !item.timestamp || ahora - item.timestamp > TTL_MS) {
          clavesParaBorrar.push(clave);
        }
      } catch {
        clavesParaBorrar.push(clave);
      }
    }
  }

  clavesParaBorrar.forEach((clave) => localStorage.removeItem(clave));
}

// Guarda datos en localStorage gestionando cuota y marcas de tiempo
export function guardarEnCache(tipo, termino, datos) {
  // Permite llamada con dos parametros si se pasa clave directa
  const datosAGuardar = datos !== undefined ? datos : termino;
  const claveInterna = datos !== undefined 
    ? generarClaveCache(tipo, termino) 
    : normalizarTexto(tipo);

  if (!Array.isArray(datosAGuardar)) return;

  const envoltorio = {
    timestamp: Date.now(),
    data: datosAGuardar,
  };

  const claveFinal = PREFIX + claveInterna;
  const contenido = JSON.stringify(envoltorio);

  try {
    localStorage.setItem(claveFinal, contenido);
  } catch (error) {
    // Si la cuota se satura, limpia entradas antiguas y reintenta
    console.warn('[Storage] Cuota excedida, liberando cache antigua...');
    liberarEspacioExcedido();
    try {
      localStorage.setItem(claveFinal, contenido);
    } catch (segundoError) {
      console.error('[Storage] No se pudo guardar tras purgar cache:', segundoError.message);
    }
  }
}

// Recupera datos verificando que no hayan superado el TTL
export function obtenerDeCache(tipo, termino = '') {
  const claveInterna = termino !== undefined 
    ? generarClaveCache(tipo, termino) 
    : normalizarTexto(tipo);

  const claveFinal = PREFIX + claveInterna;

  try {
    const contenido = localStorage.getItem(claveFinal);
    if (!contenido) return null;

    const parseado = JSON.parse(contenido);

    // Valida que el timestamp exista y sea un numero finito
    const { timestamp, data } = parseado;
    if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
      localStorage.removeItem(claveFinal);
      return null;
    }

    // Comprueba si el registro ha caducado
    const haCaducado = Date.now() - timestamp > TTL_MS;
    if (haCaducado) {
      localStorage.removeItem(claveFinal);
      return null;
    }

    return Array.isArray(data) ? data : null;
  } catch (error) {
    localStorage.removeItem(claveFinal);
    return null;
  }
}

// Obtiene la lista de identificadores guardados como favoritos
export function obtenerFavoritos() {
  try {
    const raw = localStorage.getItem(FAVORITOS_KEY);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Alterna el estado de favorito de un anime
export function alternarFavorito(animeId) {
  const favoritos = obtenerFavoritos();
  const idStr = String(animeId);
  const existe = favoritos.includes(idStr);

  const nuevaLista = existe 
    ? favoritos.filter((id) => id !== idStr) 
    : [...favoritos, idStr];

  try {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(nuevaLista));
  } catch (error) {
    console.error('[Storage] Error al actualizar favoritos:', error.message);
  }

  return !existe;
}

// Comprueba si un anime forma parte de los favoritos
export function esFavorito(animeId) {
  return obtenerFavoritos().includes(String(animeId));
}