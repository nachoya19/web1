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
            categoria: "iniciacion",
            modalidad: "individual",
            club: "",
            pareja: "",
            aceptaReglamento: false,
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
            <h2>Inscripción de Jugador</h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="nombre" style={{ display: "block", fontWeight: "bold" }}>
                        Nombre completo
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        autoComplete="name"
                        placeholder="Ej. Carolina Marín"
                        aria-invalid={!!errors.nombre}
                        aria-describedby={errors.nombre ? "error-nombre" : undefined}
                        {...register("nombre")}
                    />
                    {errors.nombre && (
                        <p id="error-nombre" role="alert" style={{ margin: "4px 0 0" }}>
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
                        placeholder="jugador@club.es"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "error-email" : undefined}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p id="error-email" role="alert" style={{ margin: "4px 0 0" }}>
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="telefono" style={{ display: "block", fontWeight: "bold" }}>
                        Teléfono de contacto
                    </label>
                    <input
                        id="telefono"
                        type="tel"
                        autoComplete="tel"
                        placeholder="600 123 456"
                        aria-invalid={!!errors.telefono}
                        aria-describedby={errors.telefono ? "error-telefono" : undefined}
                        {...register("telefono")}
                    />
                    {errors.telefono && (
                        <p id="error-telefono" role="alert" style={{ margin: "4px 0 0" }}>
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
                    >
                        <option value="iniciacion">Iniciación (Sub-15 / Amateur)</option>
                        <option value="intermedio">Intermedio (Liga Local)</option>
                        <option value="absoluta">Absoluta (Federados)</option>
                    </select>
                    {errors.categoria && (
                        <p id="error-categoria" role="alert" style={{ margin: "4px 0 0" }}>
                            {errors.categoria.message}
                        </p>
                    )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="modalidad" style={{ display: "block", fontWeight: "bold" }}>
                        Modalidad
                    </label>
                    <select
                        id="modalidad"
                        aria-invalid={!!errors.modalidad}
                        aria-describedby={errors.modalidad ? "error-modalidad" : undefined}
                        {...register("modalidad")}
                    >
                        <option value="individual">Individual</option>
                        <option value="dobles">Dobles (requiere pareja)</option>
                        <option value="mixtos">Dobles Mixtos (requiere pareja)</option>
                    </select>
                    {errors.modalidad && (
                        <p id="error-modalidad" role="alert" style={{ margin: "4px 0 0" }}>
                            {errors.modalidad.message}
                        </p>
                    )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="pareja" style={{ display: "block", fontWeight: "bold" }}>
                        Nombre de la pareja (obligatorio en dobles/mixtos)
                    </label>
                    <input
                        id="pareja"
                        type="text"
                        placeholder="Ej. Pablo Abián"
                        aria-invalid={!!errors.pareja}
                        aria-describedby={errors.pareja ? "error-pareja" : undefined}
                        {...register("pareja")}
                    />
                    {errors.pareja && (
                        <p id="error-pareja" role="alert" style={{ margin: "4px 0 0" }}>
                            {errors.pareja.message}
                        </p>
                    )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="club" style={{ display: "block", fontWeight: "bold" }}>
                        Club de procedencia (opcional)
                    </label>
                    <input
                        id="club"
                        type="text"
                        autoComplete="organization"
                        placeholder="Ej. CB Madrid"
                        aria-invalid={!!errors.club}
                        aria-describedby={errors.club ? "error-club" : undefined}
                        {...register("club")}
                    />
                    {errors.club && (
                        <p id="error-club" role="alert" style={{ margin: "4px 0 0" }}>
                            {errors.club.message}
                        </p>
                    )}
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            aria-invalid={!!errors.aceptaReglamento}
                            aria-describedby={errors.aceptaReglamento ? "error-reglamento" : undefined}
                            {...register("aceptaReglamento")}
                        />
                        <span>Acepto el reglamento del torneo y declaro estar apto/a físicamente</span>
                    </label>
                    {errors.aceptaReglamento && (
                        <p id="error-reglamento" role="alert" style={{ margin: "4px 0 0" }}>
                            {errors.aceptaReglamento.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={mutacion.isPending}
                    style={{ cursor: mutacion.isPending ? "not-allowed" : "pointer" }}
                >
                    {mutacion.isPending ? "Enviando inscripción..." : "Inscribirse al torneo"}
                </button>

                {mutacion.isError && (
                    <p role="alert" style={{ marginTop: "1rem" }}>
                        Error al inscribirse: {mutacion.error.message}
                    </p>
                )}

                {mutacion.isSuccess && (
                    <p role="status" style={{ marginTop: "1rem" }}>
                        ¡Inscripción confirmada! Nos vemos en la pista.
                    </p>
                )}
            </form>
        </section>
    );
}
