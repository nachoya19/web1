import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { esquemaFormulario } from "../schemas/formularioSchema";
import { crearContacto } from "../services/contacto";

export default function FormularioRegistro() {
    const queryClient = useQueryClient();

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
            categoria: "cliente",
            empresa: "",
            aceptaTerminos: false,
        },
    });

    const mutacion = useMutation({
        mutationFn: crearContacto,
        onSuccess: () => {
            reset();
            queryClient.invalidateQueries({ queryKey: ["contactos"] });
        },
    });

    const onSubmit = (datos) => {
        mutacion.mutate(datos);
    };

    return (
        <section>
            <h2>Nuevo Contacto</h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="categoria" style={{ display: "block", fontWeight: "bold" }}>
                        Categoría
                    </label>
                    <select
                        id="categoria"
                        aria-invalid={!!errors.categoria}
                        aria-describedby={errors.categoria ? "error-categoria" : undefined}
                        {...register("categoria")}
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    >
                        <option value="cliente">Cliente</option>
                        <option value="proveedor">Proveedor (requiere empresa)</option>
                        <option value="socio">Socio</option>
                    </select>
                    {errors.categoria && (
                        <p id="error-categoria" role="alert" style={{ color: "#c00", margin: "4px 0 0" }}>
                            {errors.categoria.message}
                        </p>
                    )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="empresa" style={{ display: "block", fontWeight: "bold" }}>
                        Empresa (opcional, obligatoria si es proveedor)
                    </label>
                    <input
                        id="empresa"
                        type="text"
                        autoComplete="organization"
                        aria-invalid={!!errors.empresa}
                        aria-describedby={errors.empresa ? "error-empresa" : undefined}
                        {...register("empresa")}
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    />
                    {errors.empresa && (
                        <p id="error-empresa" role="alert" style={{ color: "#c00", margin: "4px 0 0" }}>
                            {errors.empresa.message}
                        </p>
                    )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            aria-invalid={!!errors.aceptaTerminos}
                            aria-describedby={errors.aceptaTerminos ? "error-terminos" : undefined}
                            {...register("aceptaTerminos")}
                        />
                        <span>Acepto la política de privacidad</span>
                    </label>
                    {errors.aceptaTerminos && (
                        <p id="error-terminos" role="alert" style={{ color: "#c00", margin: "4px 0 0" }}>
                            {errors.aceptaTerminos.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={mutacion.isPending}
                    style={{ padding: "8px 16px", cursor: mutacion.isPending ? "not-allowed" : "pointer" }}
                >
                    {mutacion.isPending ? "Guardando..." : "Registrar"}
                </button>

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
