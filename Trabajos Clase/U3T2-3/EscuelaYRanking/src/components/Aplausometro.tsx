import { useState } from "react";

export default function Aplausometro() {

    const [aplausos, setAplausos] = useState(0);

  let mensaje = "Tímido...";
  if (aplausos >= 15) {
    mensaje = "¡OVACIÓN TOTAL! 🎉";
  } else if (aplausos >= 5) {
    mensaje = "¡Se anima la sala!";
  }

  const aplaudir = () => setAplausos((aplauso) => aplauso + 1);
  const reiniciar = () => setAplausos(0);

  return (
    <article className="aplausometro">
      <h3>👏 Aplausómetro</h3>
      <p className="contador">Aplausos: <strong>{aplausos}</strong></p>
      <p className="mensaje">{mensaje}</p>

      <div className="acciones">
        <button onClick={aplaudir}>👏 Aplaudir</button>
        <button onClick={reiniciar} className="btn-secundario">Reiniciar</button>
      </div>
    </article>
  );
}