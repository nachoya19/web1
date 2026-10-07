import './App.css'
import FichaTripulante from "./components/FichaTripulante"


function App() { 
  return(
  <main>
    <h1>Tripulacion nave</h1>
    <section className="cards">
      <FichaTripulante nombre = "mario" rol = "scrum master" especie = "humano"></FichaTripulante>
      <FichaTripulante nombre = "nacho" rol = "programador" especie = "humano"></FichaTripulante>
      <FichaTripulante nombre = "aranda" rol = "pollitas" especie = "humano?"></FichaTripulante>
      <FichaTripulante nombre = "kura" rol = "platita en el lol" especie='cluster'></FichaTripulante>
    </section>

  </main>
  )
}

export default App
