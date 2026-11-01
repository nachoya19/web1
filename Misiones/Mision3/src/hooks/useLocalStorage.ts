import { useCallback, useState } from 'react';
import { seguroSetItem } from '../utils/storage';

/**
 * Custom hook reutilizable para sincronizar un estado de React con localStorage.
 * Utiliza lazy initialization en useState para leer el almacenamiento una sola vez al montar
 * y persiste en localStorage directamente a través del setter, evitando flags de primer montaje
 * frágiles en entornos React 19 con StrictMode.
 */
export function useLocalStorage<T>(
  clave: string,
  valorInicial: T
): [T, (nuevoValor: T | ((anterior: T) => T)) => void] {
  const [valorAlmacenado, setValorAlmacenado] = useState<T>(() => {
    try {
      const item = localStorage.getItem(clave);
      if (item === null) return valorInicial;
      return JSON.parse(item) as T;
    } catch {
      return valorInicial;
    }
  });

  const actualizarValor = useCallback(
    (nuevoValor: T | ((anterior: T) => T)) => {
      setValorAlmacenado((prev) => {
        const siguiente =
          typeof nuevoValor === 'function'
            ? (nuevoValor as (anterior: T) => T)(prev)
            : nuevoValor;
        try {
          seguroSetItem(clave, JSON.stringify(siguiente));
        } catch {
          // Ignora errores si el almacenamiento está restringido
        }
        return siguiente;
      });
    },
    [clave]
  );

  return [valorAlmacenado, actualizarValor];
}
