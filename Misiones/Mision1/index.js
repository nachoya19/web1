const tableroElemento = document.querySelector("#tablero-juego");

for (let i = 0; i < 9; i++) {
    const boton = document.createElement("button");
    boton.classList.add("casilla");
    boton.dataset.index = i;
    tableroElemento.appendChild(boton);
}

const casillas = document.querySelectorAll(".casilla");
const botonReiniciar = document.querySelector("#reinicio");
const texto = document.querySelector("#texto");
const turnoActualEl = document.querySelector("#turno-actual");

const puntuacionX = document.querySelector("#puntuacionX");
const puntuacionO = document.querySelector("#puntuacionO");
const empatesEl = document.querySelector("#empates");

const TABLERO_INICIAL = ["", "", "", "", "", "", "", "", ""];
const casosGanadores = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let turno = "❌";
let juegoActivo = true;
let tablero = [...TABLERO_INICIAL];

function mostrarMensaje(mensaje) {
    texto.innerHTML = "";
    const spanResultado = document.createElement("span");
    spanResultado.style.fontWeight = "bold";
    spanResultado.textContent = mensaje;
    texto.appendChild(spanResultado);
}

tableroElemento.addEventListener("click", (event) => {
    const casillaPulsada = event.target;

    if (!casillaPulsada.classList.contains("casilla")) return;

    const indice = Number(casillaPulsada.dataset.index);

    if (juegoActivo && tablero[indice] === "") {
        tablero[indice] = turno;
        casillaPulsada.textContent = turno;
        comprobarGanador();

        if (juegoActivo) {
            turno = turno === "❌" ? "⭕️" : "❌";
            turnoActualEl.textContent = turno;
        }
    }
});

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

botonReiniciar.addEventListener("click", reiniciarTablero);

document.addEventListener("keydown", (event) => {
    if (event.key === "n") {
        document.body.classList.toggle("modo-oscuro");
    }
});

function comprobarGanador() {
    let rondaGanada = false;
    let combinacionGanadora = [];

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

        if (turno === "❌") {
            victoriasX++;
            puntuacionX.textContent = victoriasX;
        } else {
            victoriasO++;
            puntuacionO.textContent = victoriasO;
        }

        for (const index of combinacionGanadora) {
            casillas[index].classList.add("casilla-ganadora");
        }

        mostrarMensaje(`¡Ha ganado ${turno}! 🎉`);
        return;
    }

    if (!tablero.includes("")) {
        juegoActivo = false;
        empate++;
        empatesEl.textContent = empate;

        mostrarMensaje("¡Empate! 🤝");
    }
}
