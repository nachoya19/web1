import {z} from "zod";

// Esquema para el formulario de registro (Cliente)
export const esquemaFormulario = z.object({
    nombre: z.string().min(2,"El nombre tiene que tener mas de 2 caracteres"),
    email: z.email("Formato de email no valido"),
    telefono: z.string().min(9, "El telefono debe tener al menos 9 dígitos"),
});
// Esquema para validar un contacto individual recibido del API
export const esuqmaContacto = z.object({
    id: z.union([z.string(), z.number()]),
    nombre: z.string(),
    email: z.email(),
    telefono: z.string().optional(),
});

// Esquema para el listado completo del API
export const esquemaListaContactos = z.array(esuqmaContacto);