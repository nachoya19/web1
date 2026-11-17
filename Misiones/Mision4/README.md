# Torneo de Bádminton · Inscripciones (M4)

Aplicación React para gestionar inscripciones a un torneo de bádminton (categoría, modalidad, pareja y club) con validación en cliente y servidor mediante **React Hook Form**, **Zod** y **TanStack Query v5**.

## Tecnologías

- React 19 + Vite
- React Hook Form (`register`, `handleSubmit`, `reset`, estados accesibles con `aria-invalid` y `aria-describedby`)
- Zod + `@hookform/resolvers` (esquema como única fuente de verdad con `.regex()` en teléfono y `.refine()` cruzado que exige pareja en dobles o mixtos)
- TanStack Query v5 (`useQuery`, `useMutation` e invalidación con `invalidateQueries`)

## Estructura

- `src/schemas/formularioSchema.js`: esquemas Zod del formulario de inscripción y de la respuesta del API.
- `src/services/contacto.js`: peticiones `GET` y `POST` con `fetch` y validación `safeParse`.
- `src/components/FormularioRegistro.jsx`: formulario accesible de inscripción al torneo.
- `src/components/ListaContactos.jsx`: listado remoto de jugadores inscritos con estados de carga, error y simulación de dato corrupto.

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Bonus: Validación de respuesta del API con Zod

En `src/services/contacto.js`, `obtenerContactos` valida los datos recibidos con `esquemaListaContactos.safeParse(datos)` antes de devolverlos. En la interfaz puedes pulsar **"Simular dato corrupto"** para comprobar que Zod intercepta un registro inválido (nombre vacío y email mal formado) y muestra el error sin romper la aplicación.

## Declaración de uso de IA

La IA me ayudó a estructurar el formulario, con el CSS y a configurar la API.
