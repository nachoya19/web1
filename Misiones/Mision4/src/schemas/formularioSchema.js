import { z } from "zod";

// Esquema para el formulario de registro (Cliente)
export const esquemaFormulario = z
    .object({
        nombre: z
            .string()
            .trim()
            .min(2, "El nombre tiene que tener al menos 2 caracteres"),
        email: z.email("Formato de email no válido"),
        telefono: z
            .string()
            .trim()
            .min(9, "El teléfono debe tener al menos 9 dígitos")
            .regex(
                /^[+\d\s-]+$/,
                "El teléfono solo puede contener números, espacios, guiones o +"
            ),
        categoria: z.enum(["cliente", "proveedor", "socio"], {
            message: "Selecciona una categoría válida",
        }),
        empresa: z.string().trim().optional(),
        aceptaTerminos: z.boolean().refine((val) => val === true, {
            message: "Debes aceptar la política de privacidad",
        }),
    })
    .refine(
        (datos) =>
            datos.categoria !== "proveedor" ||
            (datos.empresa && datos.empresa.length >= 2),
        {
            message: "La empresa es obligatoria para proveedores (mín. 2 caracteres)",
            path: ["empresa"],
        }
    );

// Esquema para validar un contacto individual recibido del API
export const esquemaContacto = z.object({
    id: z.union([z.string(), z.number()]),
    nombre: z.string().min(1),
    email: z.email(),
    telefono: z.string().optional(),
    empresa: z.string().optional(),
});

// Esquema para el listado completo del API
export const esquemaListaContactos = z.array(esquemaContacto);
