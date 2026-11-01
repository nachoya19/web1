interface EsclusaProps {
  abierta: boolean;
  avisos: number;
} 

export default function Esclusa({ abierta, avisos }: EsclusaProps) {
  return (
    <article className={`esclusa ${abierta ? "abierta" : "cerrada"}`}>
      <h2>{abierta ? "🟢 Esclusa abierta" : "🔴 Esclusa cerrada"}</h2>
      
      {avisos > 0 && <p>⚠️ Tienes {avisos} avisos pendientes</p>}
    </article>
  );
}