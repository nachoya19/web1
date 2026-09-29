const tableroElemento = document.querySelector("#tablero-juego");

// Creamos las 9 casillas desde JS directamente para tener el HTML limpio
for (let i = 0; i < 9; i++) {
    const boton = document.createElement("button");
    boton.classList.add("casilla");
    boton.dataset.index = i;
    tableroElemento.appendChild(boton);
}

// Pillamos los elementos del DOM que vamos a necesitar
const casillas = document.querySelectorAll(".casilla");
const botonReiniciar = document.querySelector("#reinicio");
const texto = document.querySelector("#texto");
const turnoActualEl = document.querySelector("#turno-actual");

const puntuacionX = document.querySelector("#puntuacionX");
const puntuacionO = document.querySelector("#puntuacionO");
const empatesEl = document.querySelector("#empates");

// Guardamos las formas de ganar y un array limpio de base
const TABLERO_INICIAL = ["", "", "", "", "", "", "", "", ""];
const casosGanadores = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Estado inicial de la partida
let turno = "❌";
let juegoActivo = true;
let tablero = [...TABLERO_INICIAL];

// Agrupamos los puntos aquí para tenerlo ordenado y sin fallos
let estadoJuego = {
    victoriasX: 0,
    victoriasO: 0,
    empates: 0
};

// Función que crea un nodo nuevo al vuelo para dar el resultado
function mostrarMensaje(mensaje) {
    texto.innerHTML = "";
    const spanResultado = document.createElement("span");
    spanResultado.style.fontWeight = "bold";
    spanResultado.textContent = mensaje;
    texto.appendChild(spanResultado);
}

// La magia para saber si alguien ha hecho 3 en raya
function comprobarGanador() {
    let rondaGanada = false;
    let combinacionGanadora = [];

    // Repasamos cada combinación ganadora posible
    for (const combinacion of casosGanadores) {
        const [a, b, c] = combinacion;

        if (tablero[a] === tablero[b] && tablero[b] === tablero[c] && tablero[a] !== "") {
            rondaGanada = true;
            combinacionGanadora = combinacion;
            break;
        }
    }

    if (rondaGanada) {
        juegoActivo = false;

        // Sumamos el punto a quien toque y actualizamos el texto
        if (turno === "❌") {
            estadoJuego.victoriasX++;
            puntuacionX.textContent = estadoJuego.victoriasX;
        } else {
            estadoJuego.victoriasO++;
            puntuacionO.textContent = estadoJuego.victoriasO;
        }

        // Hacemos brillar las 3 casillas que han ganado
        for (const index of combinacionGanadora) {
            casillas[index].classList.add("casilla-ganadora");
        }

        mostrarMensaje(`¡Ha ganado ${turno}! 🎉`);
        return;
    }

    // Si el tablero se llena y no hay ganador, lo damos por empate
    if (!tablero.includes("")) {
        juegoActivo = false;
        estadoJuego.empates++;
        empatesEl.textContent = estadoJuego.empates;

        mostrarMensaje("¡Empate! 🤝");
    }
}

// Dejamos todo como nuevo para la siguiente ronda
function reiniciarTablero() {
    tablero = [...TABLERO_INICIAL];
    juegoActivo = true;
    turno = "❌";
    turnoActualEl.textContent = turno;
    texto.textContent = "";

    for (const casilla of casillas) {
        casilla.textContent = "";
        casilla.classList.remove("casilla-ganadora");
    }
}

// Delegación de eventos: un único listener para todo el tablero
tableroElemento.addEventListener("click", (event) => {
    const casillaPulsada = event.target;

    // Si hacen clic fuera de los botones, pasamos
    if (!casillaPulsada.classList.contains("casilla")) return;

    const indice = Number(casillaPulsada.dataset.index);

    // Solo hacemos algo si la casilla está libre y seguimos jugando
    if (juegoActivo && tablero[indice] === "") {
        tablero[indice] = turno;
        casillaPulsada.textContent = turno;
        comprobarGanador();

        // Cambiamos el turno si la partida no ha terminado
        if (juegoActivo) {
            turno = turno === "❌" ? "⭕️" : "❌";
            turnoActualEl.textContent = turno;
        }
    }
});

botonReiniciar.addEventListener("click", reiniciarTablero);

// Reto bonus: cambiamos toda la temática al pulsar la 'n'
document.addEventListener("keydown", (event) => {
    if (event.key === "n") {
        document.body.classList.toggle("modo-oscuro");
    }
});