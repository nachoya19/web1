import './style.css';
import { obtenerPopulares, buscarPorTexto } from './api.js';
import {
  normalizarAnimes,
  calcularRatingMedio,
  contarPorEstado,
  ordenarPorRating,
  filtrarPorRatingMinimo,
  filtrarPorEstado,
  filtrarPorFavoritos,
} from './logic.js';
import {
  guardarEnCache,
  obtenerDeCache,
  alternarFavorito,
  esFavorito,
  obtenerFavoritos,
} from './storage.js';
import {
  dom,
  alternarBotonCarga,
  atenuarRejilla,
  mostrarCargando,
  mostrarErrorConReintento,
  limpiarEstado,
  renderizarMetricas,
  renderizarCatalogo,
  abrirModalDetalle,
  cerrarModalDetalle,
} from './ui.js';

// Estado global de la aplicacion
let animesActuales = [];
let controladorActivo = null;
let peticionActualId = 0;
let ordenDescendente = true;
let soloFavoritos = false;
let ultimoOrigen = '';
let terminoBusquedaActivo = '';

// Recupera datos verificando cache o realizando peticion a la red
async function ejecutarConsulta(tipo, termino = '') {
  const idConsulta = ++peticionActualId;
  terminoBusquedaActivo = termino.trim();

  // Cancela la peticion anterior si sigue activa
  if (controladorActivo) {
    controladorActivo.abort();
  }
  controladorActivo = new AbortController();
  const signal = controladorActivo.signal;

  // Actualiza controles y atenua la rejilla previa sin desmontarla
  alternarBotonCarga(dom.btnBuscar, true, tipo);
  atenuarRejilla(dom.grid, true);
  mostrarCargando(dom.statusBox);

  try {
    // Distingue entre ausencia de cache y resultado vacio persistido
    const entradaCache = obtenerDeCache(tipo, terminoBusquedaActivo);
    let datosBrutos = null;
    let desdeCache = false;

    if (entradaCache !== null) {
      datosBrutos = entradaCache.data;
      desdeCache = true;
    } else {
      datosBrutos = tipo === 'populares'
        ? await obtenerPopulares(signal)
        : await buscarPorTexto(terminoBusquedaActivo, signal);

      // Omite procesamiento si otra peticion mas reciente fue lanzada
      if (idConsulta !== peticionActualId) return;

      guardarEnCache(tipo, terminoBusquedaActivo, datosBrutos);
    }

    if (idConsulta !== peticionActualId) return;

    // Normaliza la lista mediante flatMap en un unico paso
    animesActuales = normalizarAnimes(datosBrutos);
    ultimoOrigen = desdeCache ? 'Caché local (0 ms)' : 'API en directo';

    limpiarEstado(dom.statusBox);
    actualizarVista();

  } catch (error) {
    if (idConsulta !== peticionActualId || error.name === 'AbortError') return;

    mostrarErrorConReintento(dom.statusBox, error.message, () => {
      ejecutarConsulta(tipo, termino);
    });
    renderizarCatalogo(dom.grid, []);
  } finally {
    // Restablece estado del boton y quita la atenuacion
    if (idConsulta === peticionActualId) {
      alternarBotonCarga(dom.btnBuscar, false);
      atenuarRejilla(dom.grid, false);
      controladorActivo = null;
    }
  }
}

// Aplica filtros combinados, ordenacion inmutable y refresca la interfaz
function actualizarVista() {
  const notaMinima = Number(dom.filterRating?.value) || 0;
  const estadoFiltro = dom.filterStatus?.value || 'todos';

  // Filtra excluyendo animes sin nota
  let resultado = filtrarPorRatingMinimo(animesActuales, notaMinima);

  // Filtra por estado de emision
  resultado = filtrarPorEstado(resultado, estadoFiltro);

  // Aplica filtro de favoritos si se encuentra activado
  if (soloFavoritos) {
    const idsFavs = obtenerFavoritos();
    resultado = filtrarPorFavoritos(resultado, idsFavs);
  }

  // Ordena situando los items sin calificacion al final
  const animesOrdenados = ordenarPorRating(resultado, ordenDescendente);

  // Calcula metricas agregadas con un unico reduce
  const media = calcularRatingMedio(animesOrdenados);
  const estados = contarPorEstado(animesOrdenados);

  renderizarMetricas(dom.statsBox, animesOrdenados.length, media, estados, ultimoOrigen);

  renderizarCatalogo(dom.grid, animesOrdenados, {
    terminoBusqueda: terminoBusquedaActivo,
    soloFavoritos,
    onVerDetalle: (anime) => abrirModalDetalle(dom.modal, dom.modalBody, anime),
    onToggleFavorito: (id) => {
      alternarFavorito(id);
      actualizarVista();
    },
    esFavoritoFn: (id) => esFavorito(id),
  });
}

// Alterna el orden de ordenacion por nota
dom.sortBtn?.addEventListener('click', () => {
  ordenDescendente = !ordenDescendente;
  dom.sortBtn.textContent = ordenDescendente ? '↓ Mayor nota' : '↑ Menor nota';
  actualizarVista();
});

// Listeners reactivos para filtros
dom.filterRating?.addEventListener('change', actualizarVista);
dom.filterStatus?.addEventListener('change', actualizarVista);

// Alterna el filtro de favoritos
dom.favFilterBtn?.addEventListener('click', () => {
  soloFavoritos = !soloFavoritos;
  dom.favFilterBtn.textContent = soloFavoritos ? '★ Mostrando favoritos' : '☆ Ver favoritos';
  dom.favFilterBtn.classList.toggle('active', soloFavoritos);
  actualizarVista();
});

// Eventos del modal de detalle
dom.modalClose?.addEventListener('click', () => cerrarModalDetalle(dom.modal));
dom.modal?.addEventListener('click', (e) => {
  if (e.target === dom.modal) cerrarModalDetalle(dom.modal);
});

// Formulario de busqueda
dom.form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const valor = dom.input.value.trim();
  ejecutarConsulta(valor ? 'busqueda' : 'populares', valor);
});

// Consulta inicial automatica
ejecutarConsulta('populares');