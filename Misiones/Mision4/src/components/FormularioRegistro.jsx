import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { esquemaFormulario } from "../schemas/formularioSchema";
import { crearContacto } from "../services/contacto";

export default function FormularioRegistro() {
    const queryClient = useQueryClient();

    // 1. Configuración de React Hook Form con el validador de Zod
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(esquemaFormulario),
        defaultValues: {
            nombre: "",
            email: "",
            telefono: "",
        },
    });

    // 2. Mutación con TanStack Query para el envío POST
    const mutacion = useMutation({
        mutationFn: crearContacto,
        onSuccess: () => {
            reset(); // Limpia los campos tras un envío exitoso
            // Invalida la query "contactos" para que ListaContactos se actualice sola
            queryClient.invalidateQueries({ queryKey: ["contactos"] });
        },
    });

    // 3. onSubmit solo se ejecuta si Zod valida que todo está correcto
    const onSubmit = (datos) => {
        mutacion.mutate(datos);
    };

    return (
        <section>
            <h2>Nuevo Contacto</h2>

            {/* noValidate desactiva los mensajes nativos del navegador para que mande Zod */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Campo Nombre */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="nombre" style={{ display: "block", fontWeight: "bold" }}>
                        Nombre
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        autoComplete="name"
                        aria-invalid={!!errors.nombre}
                        aria-describedby={errors.nombre ? "error-nombre" : undefined}
                        {...register("nombre")}
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    />
                    {errors.nombre && (
                        <p id="error-nombre" role="alert" style={{ color: "#c00", margin: "4px 0 0" }}>
                            {errors.nombre.message}
                        </p>
                    )}
                </div>

                {/* Campo Email */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="email" style={{ display: "block", fontWeight: "bold" }}>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "error-email" : undefined}
                        {...register("email")}
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    />
                    {errors.email && (
                        <p id="error-email" role="alert" style={{ color: "#c00", margin: "4px 0 0" }}>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Campo Teléfono */}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="telefono" style={{ display: "block", fontWeight: "bold" }}>
                        Teléfono
                    </label>
                    <input
                        id="telefono"
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={!!errors.telefono}
                        aria-describedby={errors.telefono ? "error-telefono" : undefined}
                        {...register("telefono")}
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    />
                    {errors.telefono && (
                        <p id="error-telefono" role="alert" style={{ color: "#c00", margin: "4px 0 0" }}>
                            {errors.telefono.message}
                        </p>
                    )}
                </div>

                {/* Botón de envío: se deshabilita solo mientras se envía para evitar dobles clics */}
                <button
                    type="submit"
                    disabled={mutacion.isPending}
                    style={{ padding: "8px 16px", cursor: mutacion.isPending ? "not-allowed" : "pointer" }}
                >
                    {mutacion.isPending ? "Guardando..." : "Registrar"}
                </button>

                {/* Regiones accesibles para anunciar el resultado global al usuario */}
                {mutacion.isError && (
                    <p role="alert" style={{ color: "#c00", marginTop: "1rem" }}>
                        Error al registrar: {mutacion.error.message}
                    </p>
                )}

                {mutacion.isSuccess && (
                    <p role="status" style={{ color: "green", marginTop: "1rem" }}>
                        ¡Contacto registrado con éxito!
                    </p>
                )}
            </form>
        </section>
    );
}