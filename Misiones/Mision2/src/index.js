import './style.css';
import { obtenerPopulares, buscarPorTexto } from './api.js';
import {
  normalizarAnimes,
  calcularRatingMedio,
  contarPorEstado,
  ordenarPorRating,
  filtrarPorRatingMinimo,
} from './logic.js';
import { guardarEnCache, obtenerDeCache } from './storage.js';
import {
  alternarBotonCarga,
  mostrarCargando,
  mostrarErrorConReintento,
  limpiarEstado,
  renderizarMetricas,
  renderizarCatalogo,
} from './ui.js';

// Elementos del DOM
const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const btnBuscar = document.querySelector('#search-btn');
const sortBtn = document.querySelector('#sort-btn');
const filterRating = document.querySelector('#filter-rating');
const statusBox = document.querySelector('#status-message');
const statsBox = document.querySelector('#stats-info');
const grid = document.querySelector('#anime-grid');

// Estado de la aplicacion
let animesActuales = [];
let controladorActivo = null;
let peticionActualId = 0;
let ordenDescendente = true;

// Gestiona el flujo de consulta a cache o red y actualiza la vista
async function ejecutarConsulta(tipo, termino = '') {
  // Identificador para sincronizar peticiones concurrentes
  const idConsulta = ++peticionActualId;

  // Cancela la peticion anterior si sigue en curso
  if (controladorActivo) {
    controladorActivo.abort();
  }
  controladorActivo = new AbortController();
  const signal = controladorActivo.signal;

  alternarBotonCarga(btnBuscar, true);
  mostrarCargando(statusBox);
  renderizarMetricas(statsBox, 0, null, {});

  const claveCache = tipo === 'populares' ? 'populares' : `busqueda_${termino}`;

  try {
    let datosBrutos = obtenerDeCache(claveCache);

    if (!datosBrutos) {
      datosBrutos = tipo === 'populares'
        ? await obtenerPopulares(signal)
        : await buscarPorTexto(termino, signal);

      // Descarta si llego una peticion mas reciente
      if (idConsulta !== peticionActualId) return;

      guardarEnCache(claveCache, datosBrutos);
    }

    if (idConsulta !== peticionActualId) return;

    // Normaliza la estructura de los animes
    animesActuales = normalizarAnimes(datosBrutos);

    limpiarEstado(statusBox);
    actualizarVista();

  } catch (error) {
    // Omite acciones si fue abortada o sustituida
    if (idConsulta !== peticionActualId || error.name === 'AbortError') return;

    mostrarErrorConReintento(statusBox, error.message, () => {
      ejecutarConsulta(tipo, termino);
    });
    renderizarCatalogo(grid, []);
  } finally {
    // Restablece el boton unicamente si es la peticion activa
    if (idConsulta === peticionActualId) {
      alternarBotonCarga(btnBuscar, false);
      controladorActivo = null;
    }
  }
}

// Aplica filtros, ordenacion y actualiza las metricas y tarjetas
function actualizarVista() {
  const notaMinima = Number(filterRating?.value) || 0;

  // Filtra por valor de rating minimo
  const animesFiltrados = filtrarPorRatingMinimo(animesActuales, notaMinima);

  // Ordena de forma inmutable segun el sentido actual
  const animesOrdenados = ordenarPorRating(animesFiltrados, ordenDescendente);

  // Calcula rating medio y recuento por estado
  const media = calcularRatingMedio(animesOrdenados);
  const estados = contarPorEstado(animesOrdenados);

  // Renderiza los componentes en pantalla
  renderizarMetricas(statsBox, animesOrdenados.length, media, estados);
  renderizarCatalogo(grid, animesOrdenados);
}

// Alterna el orden de clasificacion
sortBtn.addEventListener('click', () => {
  ordenDescendente = !ordenDescendente;
  sortBtn.textContent = ordenDescendente ? '↓ Mayor nota' : '↑ Menor nota';
  actualizarVista();
});

// Listener para el filtro por nota minima
filterRating?.addEventListener('change', actualizarVista);

// Gestiona el envio del formulario de busqueda
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const valor = input.value.trim();
  ejecutarConsulta(valor ? 'busqueda' : 'populares', valor);
});

// Carga inicial al abrir la aplicacion
ejecutarConsulta('populares');