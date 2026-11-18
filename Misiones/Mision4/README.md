# Torneo de Bádminton · App Full Contact Forms

Aplicación web desarrollada en React con Vite, React Hook Form, Zod, TanStack Query v5 y accesibilidad integrada.

## Arquitectura
- **`src/services/contacto.js`**: Capa de servicios que gestiona peticiones HTTP (`fetch`), comprobación de `response.ok` y validación defensiva con Zod (`safeParse`).
- **`src/schemas/formularioSchema.js`**: Esquemas de validación Zod reutilizables tanto para el formulario del cliente como para los datos remotos del servidor.
- **`src/components/FormularioRegistro.jsx`**: Formulario optimizado sin re-renders innecesarios mediante React Hook Form y `zodResolver`, cumpliendo pautas de accesibilidad (`aria-invalid`, `role="alert"`).
- **`src/components/ListaContactos.jsx`**: Listado reactivo de inscritos consumido mediante TanStack Query con caché automática, deduplicación y simulación de datos corruptos.

## Seguridad y Autopsia (Pregunta típica de examen)
- **Validación**: La validación en cliente con Zod aporta una excelente experiencia de usuario (UX), pero la seguridad real recae en el servidor, ya que el navegador es territorio del usuario y las peticiones pueden alterarse desde DevTools.
- **Caché y Estado del Servidor**: Se ha evitado el anti-patrón de `fetch` dentro de `useEffect` utilizando TanStack Query para delegar el control de reintentos, caché y refetching.
