# 📡 Kitsu Anime Radar — M3 · Reactor Core

> **«Todo es un componente.»**  
> Reconstrucción y evolución en **React 19 + TypeScript** del explorador de anime conectado a la API oficial de **Kitsu**, aplicando arquitectura declarativa, descomposición modular, estado mínimo con valores derivados y *custom hooks* reutilizables.

---

## 🚀 Características Principales

- **Exploración en Tiempo Real y por Categorías:** Consulta de animes en tendencia (`🔥 En tendencia`), mejor valorados (`🏆 Mejor valorados`), en emisión (`📺 En emisión popular`) y búsqueda abierta por texto contra `https://kitsu.app/api/edge`.
- **Caché Inteligente con TTL (20 min):** Almacenamiento local con control de caducidad, liberación automática de cuota e indicador en vivo del origen de los datos (`⚡ Caché local (0 ms)` vs `🌐 API en directo`), con botón para forzar la sincronización desde red.
- **Filtrado Multicriterio y Ordenación Inmutable:** Combinación reactiva de filtro rápido en pantalla, nota mínima (`70%`, `80%`, `85%`), estado de emisión (`En emisión`, `Finalizado`), vista de favoritos y ordenación ascendente/descendente (`[...lista].sort()`).
- **★ BONUS — Custom Hooks Reutilizables:**
  - `useKitsuFetch`: Encapsula la máquina de estados asíncrona con `useReducer` (`status: 'idle' | 'loading' | 'success' | 'error'`) y `useEffect` con `AbortController` en la función de limpieza (*cleanup*).
  - `useLocalStorage`: Sincroniza el estado de favoritos con `localStorage` empleando *lazy initialization* en `useState`.
- **✨ Interacciones Originales:**
  - **Comparador Cara a Cara (VS):** Selecciona hasta 2 animes desde sus tarjetas para enfrentarlos en un modal visual que compara valoración de la comunidad, episodios y año de estreno.
  - **Calculadora de Maratón:** Integrada en la ficha modal de cada anime; permite ajustar tu ritmo diario de episodios (`1–12 ep./día`) y deriva al instante las horas totales y los días necesarios para completarlo.
- **Accesibilidad Cuidada:** Uso del elemento nativo `<dialog>` en el *Top Layer* con soporte de *light-dismiss* (`closedby="any"` y *fallback* de coordenadas), `aria-pressed` en botones de filtro/pestañas y regiones `role="status"` / `role="alert"`.

---

## 🧱 Estructura del Proyecto y Árbol de Componentes

```text
Mision3/
├── index.html                      # Punto de entrada HTML
├── package.json                    # Dependencias y scripts (React 19 + Vite)
├── tsconfig.json                   # Configuración de TypeScript
├── vite.config.js                  # Configuración de Vite
└── src/
    ├── main.tsx                    # Montaje de React con StrictMode
    ├── App.tsx                     # Componente raíz y estado compartido (lifting state)
    ├── index.css                   # Estilos globales y diseño oscuro neón
    ├── vite-env.d.ts               # Declaraciones de tipos de cliente Vite
    ├── types/
    │   └── anime.ts                # Interfaces y tipos de dominio
    ├── services/
    │   └── api.ts                  # Cliente HTTP con AbortController y timeout
    ├── utils/
    │   ├── logic.ts                # Funciones puras (flatMap, reduce, filter, sort)
    │   └── storage.ts              # Gestión de caché local con TTL de 20 minutos
    ├── hooks/
    │   ├── useKitsuFetch.ts        # Custom hook de consulta asíncrona con useReducer
    │   └── useLocalStorage.ts      # Custom hook genérico de persistencia local
    └── components/
        ├── Header.tsx              # Cabecera con contadores rápidos de favoritos y VS
        ├── SearchControls.tsx      # Pestañas, buscador controlado, filtros y sugerencias
        ├── StatsRibbon.tsx         # Cinta de métricas derivadas con .reduce()
        ├── AnimeGrid.tsx           # Rejilla de tarjetas con keys estables (anime.id)
        ├── AnimeCard.tsx           # Tarjeta individual de anime
        ├── AnimeBadges.tsx         # Componente compartido de insignias (tipo, nota, ep, año)
        ├── AnimeDetailModal.tsx    # Modal <dialog> con ficha completa y calculadora
        ├── AnimeCompareModal.tsx   # Barra flotante y modal comparador VS cara a cara
        ├── StatusFeedback.tsx      # LoadingSpinner, ErrorBanner y EmptyState compartido
        └── Footer.tsx              # Pie de página informativo
```

---

## 🧠 Decisiones Técnicas (Unidad 3 · React Core)

1. **Descomposición sin duplicación (`AnimeBadges` y `EmptyState`):**  
   Las insignias de metadatos se extrajeron a `AnimeBadges.tsx` para reutilizarse de forma idéntica en `AnimeCard`, `AnimeDetailModal` y `AnimeCompareModal`.
2. **Estado mínimo y valores derivados (*You Might Not Need an Effect*):**  
   La lista filtrada (`animesVisibles`), las estadísticas del catálogo (`calcularEstadisticasCatalogo` con `.reduce()`) y el tiempo de maratón se calculan directamente durante el render sin duplicar estado ni usar `useEffect` innecesarios.
3. **Máquina de estados con `useReducer`:**  
   En lugar de mantener variables booleanas sueltas (`cargando`, `error`, `datos`), `useKitsuFetch` centraliza las transiciones en un `fetchReducer` con un campo `status`, impidiendo combinaciones imposibles.
4. **Renderizado condicional legible:**  
   `App.tsx` delega la decisión de qué vista mostrar a la función `renderContenidoCatalogo()` mediante sentencias `if` claras antes del `return`, evitando ternarios anidados.

---

## 🛠️ Instalación y Puesta en Marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build

# 4. Ejecutar linter
npm run lint
```

---

## 🤖 Declaración de Uso de Inteligencia Artificial (IA)

De acuerdo con las normas académicas de la asignatura, se declara el uso de herramientas de Inteligencia Artificial generativa (asistente de programación) como apoyo durante el desarrollo de esta práctica:

- **Resolución de configuración inicial:** Diagnóstico y configuración de TypeScript (`tsconfig.json`, `vite-env.d.ts`) al migrar los archivos de `.jsx` a `.tsx`.
- **Refactorización arquitectónica a React 19:** Apoyo en la estructuración de los componentes funcionales, tipado de *props* con interfaces de TypeScript y extracción de la lógica imperativa de la Misión 2 hacia los *custom hooks* `useKitsuFetch` y `useLocalStorage`.
- **Revisión y autoría:** Todo el código generado o sugerido ha sido revisado, comprendido y validado manualmente conforme a los apuntes de la **Unidad 3 (React Core)**, verificando el cumplimiento de las reglas de los hooks, la inmutabilidad del estado y la limpieza de efectos con `AbortController`.
