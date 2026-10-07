interface FichaTripulanteProps {
  nombre: string;
  rol: string;
  especie: string;
}

export default function FichaTripulante({ nombre, rol, especie = "humano" }: FichaTripulanteProps) {
  return (
    <article className="ficha">
      <h2>{nombre}</h2>
      <p>Rol: {rol}</p>
      <p>Especie: {especie}</p>
    </article>
  );
}