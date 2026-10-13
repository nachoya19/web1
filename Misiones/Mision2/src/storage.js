// Constantes de configuracion de almacenamiento
const PREFIX = 'kitsu_cache_';
const FAVORITOS_KEY = 'kitsu_favoritos';
const TTL_MS = 20 * 60 * 1000;

// Borrado seguro que no propaga errores si el storage esta bloqueado
function seguroRemoverItem(clave) {
  try {
    localStorage.removeItem(clave);
  } catch {
    // Omite excepciones si el almacenamiento local esta restringido
  }
}

// Escritura protegida frente a bloqueos de navegador
function seguroSetItem(clave, valor) {
  try {
    localStorage.setItem(clave, valor);
    return true;
  } catch {
    return false;
  }
}

// Estandariza la cadena eliminando caracteres sobrantes
export function normalizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto.trim().toLowerCase().replace(/\s+/g, '_');
}

// Genera la clave unica centralizada para la cache
export function generarClaveCache(tipo, termino = '') {
  const terminoLimpio = normalizarTexto(termino);
  if (tipo === 'populares' || !terminoLimpio) {
    return 'populares';
  }
  return `busqueda_${terminoLimpio}`;
}

// Pone a disposicion espacio eliminando registros obsoletos
function liberarEspacioExcedido() {
  const ahora = Date.now();
  const clavesParaBorrar = [];

  for (let i = 0; i < localStorage.length; i++) {
    const clave = localStorage.key(i);
    if (clave && clave.startsWith(PREFIX)) {
      try {
        const item = JSON.parse(localStorage.getItem(clave));
        if (!item || typeof item !== 'object' || !item.timestamp || ahora - item.timestamp > TTL_MS) {
          clavesParaBorrar.push(clave);
        }
      } catch {
        clavesParaBorrar.push(clave);
      }
    }
  }

  clavesParaBorrar.forEach(seguroRemoverItem);
}

// Almacena datos asociando una marca de tiempo
export function guardarEnCache(tipo, termino, datos) {
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

  const exito = seguroSetItem(claveFinal, contenido);
  if (!exito) {
    // Si la cuota falla, purga entradas caducadas y reintenta
    liberarEspacioExcedido();
    seguroSetItem(claveFinal, contenido);
  }
}

// Recupera el registro distinguiendo ausencia de datos frente a resultado vacio
export function obtenerDeCache(tipo, termino = '') {
  const claveInterna = termino !== undefined 
    ? generarClaveCache(tipo, termino) 
    : normalizarTexto(tipo);

  const claveFinal = PREFIX + claveInterna;

  try {
    const contenido = localStorage.getItem(claveFinal);
    // Ausencia de registro en almacenamiento
    if (!contenido) return null;

    const parseado = JSON.parse(contenido);

    // Valida que el objeto sea valido antes de desestructurar
    if (!parseado || typeof parseado !== 'object' || !Array.isArray(parseado.data)) {
      seguroRemoverItem(claveFinal);
      return null;
    }

    const { timestamp, data } = parseado;

    // Comprueba formato numerico del timestamp
    if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
      seguroRemoverItem(claveFinal);
      return null;
    }

    // Comprueba caducidad respecto al tiempo de vida
    const haCaducado = Date.now() - timestamp > TTL_MS;
    if (haCaducado) {
      seguroRemoverItem(claveFinal);
      return null;
    }

    // Devuelve el objeto que encapsula la lista y metadatos
    return { data, timestamp };
  } catch {
    seguroRemoverItem(claveFinal);
    return null;
  }
}

// Recupera la lista de favoritos almacenados
export function obtenerFavoritos() {
  try {
    const raw = localStorage.getItem(FAVORITOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Modifica la presencia de un elemento en la lista de favoritos
export function alternarFavorito(animeId) {
  const favoritos = obtenerFavoritos();
  const idStr = String(animeId);
  const existe = favoritos.includes(idStr);

  const nuevaLista = existe 
    ? favoritos.filter((id) => id !== idStr) 
    : [...favoritos, idStr];

  seguroSetItem(FAVORITOS_KEY, JSON.stringify(nuevaLista));
  return !existe;
}

// Verifica si un elemento concreto esta guardado como favorito
export function esFavorito(animeId) {
  return obtenerFavoritos().includes(String(animeId));
}