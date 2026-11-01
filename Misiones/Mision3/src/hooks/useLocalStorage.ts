import { useEffect, useState } from 'react';
import { seguroSetItem } from '../utils/storage';

/**
 * Custom hook reutilizable para sincronizar un estado de React con localStorage.
 * Utiliza lazy initialization en useState para leer el almacenamiento solo al montar.
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

  // Sincroniza con el sistema externo (localStorage) cuando cambia la clave o el valor
  useEffect(() => {
    try {
      seguroSetItem(clave, JSON.stringify(valorAlmacenado));
    } catch {
      // Ignora errores si el almacenamiento está restringido
    }
  }, [clave, valorAlmacenado]);

  return [valorAlmacenado, setValorAlmacenado];
}

