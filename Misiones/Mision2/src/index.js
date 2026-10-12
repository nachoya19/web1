import './style.css';
import { obtenerPopulares, buscarPorTexto } from './api.js';
import {
  normalizarAnimes,
  calcularRatingMedio,
  contarPorEstado,
  ordenarPorRating,
  filtrarPorRatingMinimo,
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
  mostrarCargando,
  mostrarErrorConReintento,
  limpiarEstado,
  renderizarMetricas,
  renderizarCatalogo,
  abrirModalDetalle,
  cerrarModalDetalle,
} from './ui.js';

// Estado interno de la aplicacion
let animesActuales = [];
let controladorActivo = null;
let peticionActualId = 0;
let ordenDescendente = true;
let soloFavoritos = false;
let ultimoOrigen = '';

// Coordina la recuperacion de datos desde cache o red
async function ejecutarConsulta(tipo, termino = '') {
  const idConsulta = ++peticionActualId;

  // Interrumpe la llamada anterior si continuaba pendiente
  if (controladorActivo) {
    controladorActivo.abort();
  }
  controladorActivo = new AbortController();
  const signal = controladorActivo.signal;

  // Modifica el estado del boton segun el tipo de peticion
  alternarBotonCarga(dom.btnBuscar, true, tipo);
  mostrarCargando(dom.statusBox);
  renderizarMetricas(dom.statsBox, 0, null, {});

  try {
    // La clave y el TTL se resuelven de forma opaca en storage.js
    let datosBrutos = obtenerDeCache(tipo, termino);
    let desdeCache = true;

    if (!datosBrutos) {
      desdeCache = false;
      datosBrutos = tipo === 'populares'
        ? await obtenerPopulares(signal)
        : await buscarPorTexto(termino, signal);

      // Descarta la respuesta si otra peticion comenzo mientras tanto
      if (idConsulta !== peticionActualId) return;

      guardarEnCache(tipo, termino, datosBrutos);
    }

    if (idConsulta !== peticionActualId) return;

    // Normaliza la respuesta en un unico paso mediante flatMap
    animesActuales = normalizarAnimes(datosBrutos);
    ultimoOrigen = desdeCache ? 'Caché local' : 'API en directo';

    limpiarEstado(dom.statusBox);
    actualizarVista();

  } catch (error) {
    if (idConsulta !== peticionActualId || error.name === 'AbortError') return;

    mostrarErrorConReintento(dom.statusBox, error.message, () => {
      ejecutarConsulta(tipo, termino);
    });
    renderizarCatalogo(dom.grid, []);
  } finally {
    // Restaura el boton de busqueda unicamente si corresponde a la peticion activa
    if (idConsulta === peticionActualId) {
      alternarBotonCarga(dom.btnBuscar, false);
      controladorActivo = null;
    }
  }
}

// Procesa filtros, ordenacion y actualiza los componentes en pantalla
function actualizarVista() {
  const notaMinima = Number(dom.filterRating?.value) || 0;

  // Filtra por valor de rating minimo
  let resultado = filtrarPorRatingMinimo(animesActuales, notaMinima);

  // Aplica filtro de favoritos si esta activo
  if (soloFavoritos) {
    const idsFavs = obtenerFavoritos();
    resultado = filtrarPorFavoritos(resultado, idsFavs);
  }

  // Ordena de manera inmutable
  const animesOrdenados = ordenarPorRating(resultado, ordenDescendente);

  // Calcula metricas agregadas
  const media = calcularRatingMedio(animesOrdenados);
  const estados = contarPorEstado(animesOrdenados);

  renderizarMetricas(dom.statsBox, animesOrdenados.length, media, estados, ultimoOrigen);

  renderizarCatalogo(dom.grid, animesOrdenados, {
    onVerDetalle: (anime) => abrirModalDetalle(dom.modal, dom.modalBody, anime),
    onToggleFavorito: (id) => {
      alternarFavorito(id);
      actualizarVista();
    },
    esFavoritoFn: (id) => esFavorito(id),
  });
}

// Alterna el orden de clasificacion
dom.sortBtn?.addEventListener('click', () => {
  ordenDescendente = !ordenDescendente;
  dom.sortBtn.textContent = ordenDescendente ? '↓ Mayor nota' : '↑ Menor nota';
  actualizarVista();
});

// Listener para el filtro por nota minima
dom.filterRating?.addEventListener('change', actualizarVista);

// Alterna el filtro de visualizacion de favoritos
dom.favFilterBtn?.addEventListener('click', () => {
  soloFavoritos = !soloFavoritos;
  dom.favFilterBtn.textContent = soloFavoritos ? '★ Mostrando favoritos' : '☆ Ver favoritos';
  dom.favFilterBtn.classList.toggle('active', soloFavoritos);
  actualizarVista();
});

// Cierre del modal de detalle
dom.modalClose?.addEventListener('click', () => cerrarModalDetalle(dom.modal));
dom.modal?.addEventListener('click', (e) => {
  if (e.target === dom.modal) cerrarModalDetalle(dom.modal);
});

// Envio del formulario de busqueda
dom.form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const valor = dom.input.value.trim();
  ejecutarConsulta(valor ? 'busqueda' : 'populares', valor);
});

// Carga inicial automatica
ejecutarConsulta('populares');