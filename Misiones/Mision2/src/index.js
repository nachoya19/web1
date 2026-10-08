// Punto de entrada principal de la aplicación (Orquestador)
import { obtenerAnimesPopulares } from './api.js';
import { mostrarCargando, mostrarError, renderizarTarjetas } from './ui.js';

/**
 * Función controladora para cargar y renderizar los animes populares
 */
async function inicializarApp() {
  mostrarCargando('Cargando animes populares...');

  try {
    const animes = await obtenerAnimesPopulares();
    renderizarTarjetas(animes);
  } catch (error) {
    mostrarError(error.message);
  }
}

// Inicialización de la aplicación
inicializarApp();