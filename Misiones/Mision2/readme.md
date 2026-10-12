# 🎬 Kitsu Anime Radar (M2 · Async Odyssey)

Aplicación web desarrollada con **JavaScript vanilla**, **HTML5**, **CSS3** y empaquetada con **Vite**. La aplicación consume la API pública de **Kitsu** para explorar animes populares en tendencia y realizar búsquedas personalizadas en tiempo real, implementando persistencia y optimización de peticiones mediante caché en `localStorage`, filtrado reactivo, ordenación inmutable, favoritos y vista de detalle en modal.

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
  El código se organiza siguiendo el principio de responsabilidad única y bajo acoplamiento:
  - `src/api.js`: Centraliza las peticiones de red mediante la API `fetch`, validando `response.ok`, distinguiendo errores de red (`TypeError`) y configurando `AbortController` para prevenir condiciones de carrera.
  - `src/logic.js`: Capa funcional de lógica pura. Utiliza `flatMap` para filtrar y normalizar en un único recorrido eficiente, `reduce` para agregaciones y conteos de estado, y `toSorted` con fallback retrocompatible para ordenaciones inmutables.
  - `src/storage.js`: Centraliza la generación y normalización de claves de caché, el control de caducidad (TTL de 20 minutos), la persistencia de favoritos y la liberación automática de cuota en caso de saturación de `localStorage`.
  - `src/ui.js`: Encapsula todas las referencias y mutaciones del DOM. Renderiza de forma 100% segura mediante `createElement`, `textContent` y `DocumentFragment` (sin `innerHTML`), e implementa modal accesible (`<dialog>`) y spinner visual.
  - `src/index.js`: Orquestador reactivo que sincroniza peticiones concurrentes mediante identificadores incrementales (`peticionActualId`) para descartar respuestas desfasadas.

- **Asincronía y robustez:**  
  Uso de `async/await` encapsulado en bloques `try/catch/finally`. El botón adapta su estado contextual distinguiendo entre carga inicial (`Cargando...`) y búsquedas (`Buscando...`), informando además en pantalla si los datos provienen de la memoria caché local o de la red en vivo.

- **Diseño e identidad visual anime:**  
  Se sustituyó la paleta genérica por un diseño temático oscuro con acentos carmesí neón (`#ff2a5f`), insignias detalladas (tipo, episodios, estado, valoración) y transiciones fluidas.

---

## 🤖 Declaración de uso de Inteligencia Artificial

En cumplimiento con la normativa de transparencia y evaluación de la asignatura, a continuación se detalla el uso de herramientas de IA durante el desarrollo:

- **Herramienta utilizada:** Asistente IA (Gemini).
- **Tareas delegadas en la IA:**
  - Consulta e investigación de la documentación de endpoints REST de la API de Kitsu.
  - Apoyo en la optimización de transformaciones funcionales (`flatMap`, `toSorted`) y control de cuota en Web Storage.
  - Redacción y estructuración de la documentación técnica en `README.md`.
- **Verificación y trabajo manual:**
  - Pruebas de integración de red verificadas en las herramientas de desarrollo del navegador.
  - Enlace de eventos del DOM y orquestación con ES Modules implementados manualmente.
  - Validación de la build de producción con Vite.