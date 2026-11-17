import { useQuery } from "@tanstack/react-query";
import { obtenerContactos } from "../services/contacto";

export default function ListaContactos() {
    const { data: contactos, isPending, isError, error } = useQuery({
        queryKey: ["contactos"],
        queryFn: obtenerContactos,
    });

    if (isPending) return <p>Cargando contactos...</p>;
    if (isError) return <p role="alert">Error: {error.message}</p>;

    return (
        <ul>
            {contactos.map((c) => (
                <li key={c.id}>{c.nombre} ({c.email})</li>
            ))}
        </ul>
    );
}