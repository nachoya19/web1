interface Jugador {
  id: string;
  jugador: string;
  puntos: number;
}

interface RankingProps {
  puntuaciones: Jugador[];
}

export default function Ranking({ puntuaciones } : RankingProps) {
  return (
    <ol className="ranking">
      {puntuaciones.map((p) => (
        <li key={p.id}>
          {p.jugador} — {p.puntos} puntos {p.puntos > 8000 && "🏅"}
        </li>
      ))}
    </ol>
  );
}