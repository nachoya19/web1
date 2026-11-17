import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerContactos } from "../services/contacto";

export default function ListaContactos() {
    const [simularCorrupto, setSimularCorrupto] = useState(false);

    const { data: contactos, isPending, isError, error } = useQuery({
        queryKey: ["contactos", simularCorrupto],
        queryFn: () => obtenerContactos({ simularCorrupto }),
        retry: false,
    });

    return (
        <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <h2>Lista de Contactos</h2>
                <button
                    type="button"
                    onClick={() => setSimularCorrupto((prev) => !prev)}
                    style={{ padding: "6px 10px", fontSize: "0.85rem", cursor: "pointer" }}
                >
                    {simularCorrupto ? "Usar datos válidos" : "Simular dato corrupto"}
                </button>
            </div>

            {isPending && <p role="status">Cargando contactos...</p>}

            {isError && (
                <p role="alert" style={{ color: "#c00" }}>
                    Error: {error.message}
                </p>
            )}

            {contactos && (
                <ul>
                    {contactos.map((c) => (
                        <li key={c.id} style={{ marginBottom: "0.5rem" }}>
                            <strong>{c.nombre}</strong> — {c.email}
                            {c.empresa ? ` (${c.empresa})` : ""}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
