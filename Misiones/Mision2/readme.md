# 🎬 Kitsu Anime Radar (M2 · Async Odyssey)

Aplicación web desarrollada con **JavaScript vanilla**, **HTML5**, **CSS3** y empaquetada con **Vite**. La aplicación consume la API pública de **Kitsu** para explorar animes populares en tendencia y realizar búsquedas personalizadas en tiempo real, implementando persistencia y optimización de peticiones mediante caché en `localStorage`.

---

## 🚀 Cómo arrancar el proyecto

El proyecto utiliza **Vite** como servidor de desarrollo y empaquetador. Sigue estos pasos para ejecutarlo localmente:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre en tu navegador la URL local indicada (habitualmente `http://localhost:5173`).

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

4. **Previsualizar la build de producción:**
   ```bash
   npm run preview
   ```

---

## 🛠️ Decisiones técnicas tomadas

- **Arquitectura modular en ES Modules:**  
  El código se organiza siguiendo el principio de responsabilidad única:
  - `src/api.js`: Centraliza las peticiones de red mediante la API `fetch`, validando `response.ok` y configurando `AbortController` para prevenir condiciones de carrera.
  - `src/logic.js`: Capa intermedia de lógica de negocio y transformación funcional de datos utilizando métodos inmutables de array (`map`, `filter`, `reduce`).
  - `src/storage.js`: Gestión de la persistencia en `localStorage` con expiración temporal (TTL) y validación de tipos.
  - `src/ui.js`: Manipulación y renderizado seguro del DOM (prevención de vulnerabilidades XSS y gestión de estados de carga, error y listas vacías).
  - `src/index.js` (o `main.js`): Orquestador de eventos e integración entre la vista, la lógica y los datos.

- **Asincronía y flujo de peticiones:**  
  Uso de sintaxis moderna `async/await` encapsulada en bloques `try/catch/finally` para garantizar que la interfaz responda fluidamente sin bloquear el *call stack*. Los estados de interfaz reflejan en todo momento si la aplicación está cargando datos, mostrando resultados o comunicando un error comprensible al usuario.

- **Caché con tiempo de vida (TTL):**  
  Para cumplir con el bonus y optimizar el consumo de red, se implementó almacenamiento local con caducidad. Si una petición ya se realizó recientemente, los datos se sirven directamente desde `localStorage`, reduciendo la latencia a 0 ms.

---

## 🤖 Declaración de uso de Inteligencia Artificial

En cumplimiento con la normativa de transparencia y evaluación de la asignatura, a continuación se detalla el uso de herramientas de IA durante el desarrollo:

- **Herramienta utilizada:** Asistente IA (Gemini / Claude / ChatGPT).
- **Tareas delegadas en la IA:**
  - Consulta e investigación de la documentación de APIs públicas de anime (descartando Jikan por inestabilidad de servicio y seleccionando los endpoints REST de Kitsu).
  - Depuración y limpieza del CSS base generado por la plantilla inicial de Vite para centrar el encabezado y adaptarlo a las tarjetas de contenido.
  - Generación de la estructura base y redacción de este archivo `README.md`.
- **Prompts clave utilizados:**
  1. *"Quiero hacer una práctica con una API de anime pero Jikan no funciona actualmente. ¿Puedes investigar la documentación de alguna API pública alternativa que no requiera API key y darme sus endpoints para animes populares y búsquedas?"*
  2. *"Tengo el CSS base que me viene con Vite pero tiene muchas clases que no uso. Limpia el CSS quedándote solo con las variables de color, tipografía y diseño oscuro/claro, y céntrame el h1 y añade estilos para las tarjetas de anime."*
  3. *"Genera el README.md del proyecto explicando qué es, cómo arrancarlo y las decisiones técnicas tomadas, incluyendo la sección de declaración de uso de IA."*
- **Verificación y trabajo manual:**
  - Se verificaron manualmente todos los endpoints consultados usando la pestaña **Network** de las herramientas de desarrollo del navegador (DevTools) y validando la estructura de las respuestas JSON.
  - Se adaptaron y enlazaron a mano los elementos del DOM y los manejadores de eventos (`submit`, `click`) en JavaScript.
  - Se implementó manualmente el flujo de la aplicación con ES Modules y la lógica de arrays (`map`, `filter`, `reduce`) requerida por la rúbrica.