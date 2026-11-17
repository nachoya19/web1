import './App.css'
import ListaContactos from './components/ListaContactos'
import FormularioRegistro from './components/FormularioRegistro'

function App() {
  return (
    <main style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1>M4 · Full Contact Forms</h1>
      <FormularioRegistro />
      <hr style={{ margin: "2rem 0" }} />
      <ListaContactos />
    </main>
  );
}

export default App
