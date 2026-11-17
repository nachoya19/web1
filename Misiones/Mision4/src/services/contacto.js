import { esquemaListaContactos } from "../schemas/formularioSchema";

const API_URL =
    import.meta.env.VITE_API_URL || "https://jsonplaceholder.typicode.com/users";

// Almacén en memoria para que los POST a JSONPlaceholder se reflejen tras invalidateQueries
const inscritosLocales = [];

export async function obtenerContactos({ simularCorrupto = false } = {}) {
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
    }

    const json = await res.json();

    // Adapta los datos del API al dominio del torneo de bádminton
    let datos = Array.isArray(json)
        ? json.map((u) => ({
              id: u.id,
              nombre: u.nombre ?? u.name,
              email: u.email,
              telefono: u.telefono ?? u.phone,
              club: u.club ?? u.company?.name,
              categoria: u.categoria ?? "intermedio",
              modalidad: u.modalidad ?? "individual",
          }))
        : json;

    if (simularCorrupto && Array.isArray(datos)) {
        datos = [
            { id: 999, nombre: "", email: "correo-invalido" },
            ...datos,
        ];
    }

    // Validar respuesta del API con Zod (Bonus)
    const validacion = esquemaListaContactos.safeParse(datos);
    if (!validacion.success) {
        console.error("Datos corruptos detectados con Zod:", validacion.error);
        throw new Error("Respuesta del servidor corrupta o inválida");
    }

    return [...inscritosLocales, ...validacion.data];
}

export async function crearContacto(datos) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
    });

    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
    }

    const creado = await res.json();
    inscritosLocales.unshift({
        id: creado.id ?? Date.now(),
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        club: datos.club || undefined,
        categoria: datos.categoria,
        modalidad: datos.modalidad,
        pareja: datos.pareja || undefined,
    });

    return creado;
}
