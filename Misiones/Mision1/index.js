const casillas = document.querySelectorAll(".casilla")
const botonReiniciar = document.querySelector("#reinicio")
const texto = document.querySelector("#texto")
const TABLERO_INICIAL = ["","","","","","","","",""];

const casosGanadores =[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; 

let turno = "❌";
let juegoActivo = true;
let tablero = [...TABLERO_INICIAL];

for (const casilla of casillas) {
    casilla.addEventListener("click", (event) => {
    const indice = Number(event.target.dataset.index);

    if(juegoActivo && tablero[indice] === ""){
        tablero[indice] = turno;
        event.target.textContent = turno;
        comprobarGanador();
        if(turno === "❌"){
            turno = "⭕️";
        }
        else{
            turno = "❌";
        }
        }
    });
}

botonReiniciar.addEventListener("click", (event) =>{
   tablero = [...TABLERO_INICIAL];
   
   for (const casilla of casillas){
    casilla.textContent = "";
   }
   turno = "❌";
   juegoActivo = true;
   texto.textContent = "";
});

document.addEventListener("keydown", (event) =>{
    if(event.key === "n"){
        document.body.classList.toggle("modo-oscuro");
    }
})

function comprobarGanador() {
    let rondaGanada = false;

    // Recorremos cada combinación ganadora
    for (const combinacion of casosGanadores) {
        const a = combinacion[0];
        const b = combinacion[1];
        const c = combinacion[2];



        // Si las tres posiciones son iguales y diferentes de nada
        if (tablero[a] === tablero[b] && tablero[b] === tablero[c] && tablero[a] !== "") {
            rondaGanada = true;
            break;
        }
    }

    if (rondaGanada) {
        juegoActivo = false;

        texto.innerHTML = "";
        const spanResultado = document.createElement("span");
        spanResultado.style.fontWeight = "bold";
        spanResultado.textContent = `¡Ha ganado ${turno}! 🎉`;
        texto.appendChild(spanResultado);
        return;
    }

    // Comprobar si hay empate (si el tablero no incluye ningún string vacío)
    if (!tablero.includes("")) {
        juegoActivo = false;

        texto.innerHTML = "";
        const spanEmpate = document.createElement("span");
        spanEmpate.textContent = "¡Empate! 🤝";
        texto.appendChild(spanEmpate);
    }
}