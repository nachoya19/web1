const casillas = document.querySelectorAll(".casilla")
const botonReiniciar = document.querySelector("#reinicio")
const texto = document.querySelector("#texto")

const casosGanadores =[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; 

let turno = "❌";
let juegoActivo = true;
let tablero = ["","","","","","","","",""];

for (const casilla of casillas) {
    casilla.addEventListener("click", (event) => {
    const indice = event.target.dataset.index;

    if(juegoActivo && tablero[indice] === ""){
        tablero[indice] = turno;
        event.target.textContent = turno;
        if(turno === "❌"){
            turno = "⭕️";
        }
        else{
            turno = "❌";
        }
        }
    });
}