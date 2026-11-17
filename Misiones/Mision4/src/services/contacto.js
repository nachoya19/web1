import { esquemaListaContactos } from "../schemas/formularioSchema";

const API_URL = import.meta.env.VITE_API_URL || "https://jsonplaceholder.typicode.com/users";

export async function obtenerContactos(){
const res = await fetch("https://jsonplaceholder.typicode.com/users");
  
  if (!res.ok) {
    throw new Error(`Error HTTP: ${res.status}`);
    }

    const json = await res.json();

    // Validar con Zod
    const validacion = esquemaListaContactos.safeParse(json);
    if (!validacion.success){
        console.error("Datos corrupto detectado con Zod: ", validacion.error);
        throw new Error("Respuesta del servidor corrupta o invaldia");
    }

    return validacion.data;
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

    return res.json();
}