// app.js — El oráculo de los números 🔮

// Variables de estado del juego
const MAX_INTENTOS = 7;
let secreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;
let historial = [];

// Selección de elementos del DOM
const inputNumero = document.querySelector("#numero-usuario");
const btnAdivinar = document.querySelector("#btn-adivinar");
const mensajeOraculo = document.querySelector("#mensaje-oraculo");
const marcadorIntentos = document.querySelector("#marcador-intentos");
const historialIntentos = document.querySelector("#historial-intentos");
const btnReiniciar = document.querySelector("#btn-reiniciar");

// Evento de consulta al oráculo
btnAdivinar.addEventListener("click", () => {
  const valorTexto = inputNumero.value;

  // Validación: campo vacío
  if (valorTexto === "") {
    mensajeOraculo.textContent = "Por favor, introduce un número antes de consultar.";
    return;
  }

  const numero = Number(valorTexto);

  // Validación: número válido y dentro del rango (1–100)
  if (Number.isNaN(numero) || numero < 1 || numero > 100) {
    mensajeOraculo.textContent = "El número debe estar entre 1 y 100.";
    return;
  }

  // Consulta válida: incrementamos el intento
  intentos = intentos + 1;
  historial.push(numero);

  // Actualización del marcador
  marcadorIntentos.textContent = `Intentos: ${intentos} / ${MAX_INTENTOS}`;

  // Actualización del historial en pantalla
  let listaHistorial = "";
  for (let i = 0; i < historial.length; i++) {
    if (i === 0) {
      listaHistorial = `${historial[i]}`;
    } else {
      listaHistorial = `${listaHistorial}, ${historial[i]}`;
    }
  }
  historialIntentos.textContent = `Has probado: ${listaHistorial}.`;

  // Comprobación de resultado
  if (numero === secreto) {
    mensajeOraculo.textContent = `¡Correcto! Has adivinado el número secreto en ${intentos} intentos. ¡Logro «Francotirador»!`;
    btnAdivinar.disabled = true;
  } else if (intentos >= MAX_INTENTOS) {
    mensajeOraculo.textContent = `¡Has agotado tus ${MAX_INTENTOS} intentos! El oráculo revela su secreto: el número era ${secreto}.`;
    btnAdivinar.disabled = true;
  } else if (numero < secreto) {
    mensajeOraculo.textContent = "El número secreto es mayor.";
  } else {
    mensajeOraculo.textContent = "El número secreto es menor.";
  }

  // Limpiar campo para la siguiente consulta
  inputNumero.value = "";
});

// Evento de reinicio: Nueva profecía
btnReiniciar.addEventListener("click", () => {
  secreto = Math.floor(Math.random() * 100) + 1;
  intentos = 0;
  historial = [];

  marcadorIntentos.textContent = `Intentos: 0 / ${MAX_INTENTOS}`;
  mensajeOraculo.textContent = "";
  historialIntentos.textContent = "";
  inputNumero.value = "";
  btnAdivinar.disabled = false;
});
