import { z } from "zod";

// Esquema para el formulario de inscripción al torneo de bádminton
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
        categoria: z.enum(["iniciacion", "intermedio", "absoluta"], {
            message: "Selecciona una categoría válida",
        }),
        modalidad: z.enum(["individual", "dobles", "mixtos"], {
            message: "Selecciona una modalidad válida",
        }),
        club: z.string().trim().optional(),
        pareja: z.string().trim().optional(),
        aceptaReglamento: z.boolean().refine((val) => val === true, {
            message: "Debes aceptar el reglamento del torneo",
        }),
    })
    .refine(
        (datos) =>
            datos.modalidad === "individual" ||
            (datos.pareja && datos.pareja.length >= 2),
        {
            message:
                "Indica el nombre de tu pareja para dobles o mixtos (mín. 2 caracteres)",
            path: ["pareja"],
        }
    );

// Esquema para validar un jugador inscrito recibido del API
export const esquemaContacto = z.object({
    id: z.union([z.string(), z.number()]),
    nombre: z.string().min(1),
    email: z.email(),
    telefono: z.string().optional(),
    club: z.string().optional(),
    categoria: z.string().optional(),
    modalidad: z.string().optional(),
    pareja: z.string().optional(),
});

// Esquema para el listado completo del API
export const esquemaListaContactos = z.array(esquemaContacto);
