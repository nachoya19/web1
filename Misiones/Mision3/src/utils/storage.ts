import type { CategoriaExplorar, KitsuRawItem } from '../types/anime';

// Constantes de configuración de almacenamiento en caché con TTL
const PREFIX = 'kitsu_cache_';
export const FAVORITOS_KEY = 'kitsu_favoritos';
export const COMPARANDO_KEY = 'kitsu_comparando';
const TTL_MS = 20 * 60 * 1000;

export interface EntradaCache {
  timestamp: number;
  data: KitsuRawItem[];
}

// Borrado seguro que no propaga errores si el storage está bloqueado
export function seguroRemoverItem(clave: string): void {
  try {
    localStorage.removeItem(clave);
  } catch {
    // Omite excepciones si el almacenamiento local está restringido
  }
}

// Escritura protegida frente a bloqueos de navegador o cuota excedida
export function seguroSetItem(clave: string, valor: string): boolean {
  try {
    localStorage.setItem(clave, valor);
    return true;
  } catch {
    return false;
  }
}

// Estandariza la cadena eliminando caracteres sobrantes
export function normalizarTexto(texto: string): string {
  if (typeof texto !== 'string') return '';
  return texto.trim().toLowerCase().replace(/\s+/g, '_');
}

// Genera la clave única centralizada para la caché
export function generarClaveCache(categoria: CategoriaExplorar, termino = ''): string {
  const terminoLimpio = normalizarTexto(termino);
  if (categoria === 'busqueda' && terminoLimpio) {
    return `busqueda_${terminoLimpio}`;
  }
  return categoria;
}

// Libera espacio eliminando registros obsoletos de la caché
export function liberarEspacioExcedido(): void {
  const ahora = Date.now();
  const clavesParaBorrar: string[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave && clave.startsWith(PREFIX)) {
        try {
          const raw = localStorage.getItem(clave);
          const item: unknown = raw ? JSON.parse(raw) : null;
          if (
            !item ||
            typeof item !== 'object' ||
            !('timestamp' in item) ||
            typeof (item as { timestamp: unknown }).timestamp !== 'number' ||
            ahora - (item as { timestamp: number }).timestamp > TTL_MS
          ) {
            clavesParaBorrar.push(clave);
          }
        } catch {
          clavesParaBorrar.push(clave);
        }
      }
    }
  } catch {
    // Ignorar si localStorage no es accesible
  }

  clavesParaBorrar.forEach(seguroRemoverItem);
}

// Elimina una entrada concreta de la caché para forzar recarga desde red
export function invalidarEntradaCache(categoria: CategoriaExplorar, termino = ''): void {
  const claveFinal = PREFIX + generarClaveCache(categoria, termino);
  seguroRemoverItem(claveFinal);
}

// Almacena datos asociando una marca de tiempo
export function guardarEnCache(
  categoria: CategoriaExplorar,
  termino: string,
  datos: KitsuRawItem[]
): void {
  if (!Array.isArray(datos)) return;

  const claveInterna = generarClaveCache(categoria, termino);
  const envoltorio: EntradaCache = {
    timestamp: Date.now(),
    data: datos,
  };

  const claveFinal = PREFIX + claveInterna;
  const contenido = JSON.stringify(envoltorio);

  const exito = seguroSetItem(claveFinal, contenido);
  if (!exito) {
    liberarEspacioExcedido();
    seguroSetItem(claveFinal, contenido);
  }
}

// Recupera el registro distinguiendo ausencia de datos frente a resultado vacío
export function obtenerDeCache(
  categoria: CategoriaExplorar,
  termino = ''
): EntradaCache | null {
  const claveInterna = generarClaveCache(categoria, termino);
  const claveFinal = PREFIX + claveInterna;

  try {
    const contenido = localStorage.getItem(claveFinal);
    if (!contenido) return null;

    const parseado: unknown = JSON.parse(contenido);

    if (
      !parseado ||
      typeof parseado !== 'object' ||
      !('data' in parseado) ||
      !Array.isArray((parseado as { data: unknown }).data)
    ) {
      seguroRemoverItem(claveFinal);
      return null;
    }

    const { timestamp, data } = parseado as EntradaCache;

    if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
      seguroRemoverItem(claveFinal);
      return null;
    }

    const haCaducado = Date.now() - timestamp > TTL_MS;
    if (haCaducado) {
      seguroRemoverItem(claveFinal);
      return null;
    }

    return { data, timestamp };
  } catch {
    seguroRemoverItem(claveFinal);
    return null;
  }
}

