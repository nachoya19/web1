import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerContactos } from "../services/contacto";

const ETIQUETAS_CATEGORIA = {
    iniciacion: "Iniciación",
    intermedio: "Intermedio",
    absoluta: "Absoluta",
};

const ETIQUETAS_MODALIDAD = {
    individual: "Individual",
    dobles: "Dobles",
    mixtos: "Dobles Mixtos",
};

export default function ListaContactos() {
    const [simularCorrupto, setSimularCorrupto] = useState(false);

    const { data: inscritos, isPending, isError, error } = useQuery({
        queryKey: ["contactos", simularCorrupto],
        queryFn: () => obtenerContactos({ simularCorrupto }),
        retry: false,
    });

    return (
        <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <h2 style={{ margin: 0 }}>Jugadores Inscritos</h2>
                <button
                    type="button"
                    onClick={() => setSimularCorrupto((prev) => !prev)}
                    style={{ padding: "6px 10px", fontSize: "0.85rem", cursor: "pointer" }}
                >
                    {simularCorrupto ? "Usar datos válidos" : "Simular dato corrupto"}
                </button>
            </div>

            {isPending && <p role="status">Cargando lista de inscritos...</p>}

            {isError && (
                <p role="alert">
                    Error: {error.message}
                </p>
            )}

            {inscritos && (
                <ul>
                    {inscritos.map((j) => (
                        <li key={j.id}>
                            <strong>{j.nombre}</strong> — {ETIQUETAS_CATEGORIA[j.categoria] ?? j.categoria} ·{" "}
                            {ETIQUETAS_MODALIDAD[j.modalidad] ?? j.modalidad}
                            {j.pareja ? ` (Pareja: ${j.pareja})` : ""}
                            {j.club ? ` · ${j.club}` : ""}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
