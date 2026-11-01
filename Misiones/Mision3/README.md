# Kitsu Anime Radar — M3 · Reactor Core

> **«Todo es un componente.»**  
> Reconstrucción y evolución en **React 19 + TypeScript** del explorador de anime conectado a la API oficial de **Kitsu**, aplicando arquitectura declarativa, descomposición modular, estado mínimo con valores derivados y *custom hooks* reutilizables.

---

## Características Principales

- **Exploración en Tiempo Real y por Categorías:** Consulta de animes en tendencia (`En tendencia`), mejor valorados (`Mejor valorados`), en emisión (`En emisión popular`) y búsqueda abierta por texto contra `https://kitsu.app/api/edge`.
- **Caché Inteligente con TTL (20 min):** Almacenamiento local con control de caducidad, liberación automática de cuota e indicador en vivo del origen de los datos (`Caché local (0 ms)` vs `API en directo`), con botón para forzar la sincronización desde red.
- **Filtrado Multicriterio y Ordenación Inmutable:** Combinación reactiva de filtro rápido en pantalla, nota mínima (`70%`, `80%`, `85%`), estado de emisión (`En emisión`, `Finalizado`), vista de favoritos y ordenación ascendente/descendente (`[...lista].sort()`).
- **★ BONUS — Custom Hooks Reutilizables:**
  - `useFetch`: Hook genérico para peticiones asíncronas con `useReducer` (`status: 'idle' | 'loading' | 'success' | 'error'`), `AbortController` en el cleanup e inicialización síncrona desde caché.
  - `useKitsuFetch`: Hook de dominio que orquesta las consultas a la API de Kitsu y la caché TTL sobre `useFetch`.
  - `useFiltros`: Centraliza el estado de exploración y filtrado en un único objeto estable (`useMemo`).
  - `useAnimesVisibles`: Encapsula la cadena pura de filtros y ordenación, aligerando el componente raíz.
  - `useLocalStorage`: Sincroniza el almacenamiento local con `lazy initialization` en `useState` y persistencia directa en el setter.
- **Interacciones Originales:**
  - **Comparador Cara a Cara (VS):** Selecciona hasta 2 animes desde sus tarjetas para enfrentarlos en un modal visual que compara valoración de la comunidad, episodios y año de estreno.
  - **Calculadora de Maratón:** Integrada en la ficha modal de cada anime; permite ajustar tu ritmo diario de episodios (`1–12 ep./día`) y deriva al instante las horas totales y los días necesarios para completarlo.
- **Accesibilidad Cuidada:** Uso del elemento nativo `<dialog>` en el *Top Layer* con soporte de *light-dismiss* (`closedby="any"` y *fallback* de coordenadas), `aria-pressed` en botones de filtro/pestañas y regiones `role="status"` / `role="alert"`.

---

## Estructura del Proyecto y Árbol de Componentes

```text
Mision3/
├── index.html                      # Punto de entrada HTML
├── package.json                    # Dependencias y scripts (React 19 + TypeScript + Vite)
├── tsconfig.json                   # Configuración de TypeScript
├── eslint.config.js                # Configuración de ESLint con typescript-eslint
├── vite.config.js                  # Configuración de Vite
└── src/
    ├── main.tsx                    # Montaje de React con StrictMode
    ├── App.tsx                     # Componente raíz y orquestación principal
    ├── index.css                   # Estilos globales y diseño oscuro neón
    ├── vite-env.d.ts               # Declaraciones de tipos de cliente Vite
    ├── types/
    │   └── anime.ts                # Interfaces y tipos de dominio
    ├── services/
    │   └── api.ts                  # Cliente HTTP con AbortController, timeout y cause
    ├── utils/
    │   ├── logic.ts                # Funciones puras (flatMap, reduce, filter, sort)
    │   └── storage.ts              # Gestión de caché local con TTL de 20 minutos
    ├── hooks/
    │   ├── useFetch.ts             # Custom hook genérico de peticiones con useReducer
    │   ├── useKitsuFetch.ts        # Hook de dominio Kitsu con caché TTL sobre useFetch
    │   ├── useFiltros.ts           # Custom hook que agrupa el estado de filtros y búsqueda
    │   ├── useAnimesVisibles.ts    # Custom hook que encapsula la cadena pura de filtrado
    │   └── useLocalStorage.ts      # Custom hook genérico de persistencia local sin efectos frágiles
    └── components/
        ├── Header.tsx              # Cabecera con contadores rápidos de favoritos y VS
        ├── SearchControls.tsx      # Pestañas, buscador controlado, filtros y sugerencias
        ├── StatsRibbon.tsx         # Cinta de métricas derivadas con .reduce()
        ├── AnimeGrid.tsx           # Rejilla de tarjetas con Sets memoizados y props mínimas
        ├── AnimeCard.tsx           # Tarjeta individual de anime
        ├── AnimeBadges.tsx         # Componente compartido de insignias (tipo, nota, ep, año)
        ├── ModalDialog.tsx         # Componente <dialog> reutilizable con light-dismiss
        ├── AnimeDetailModal.tsx    # Modal de ficha completa y calculadora de maratón
        ├── CompareDock.tsx         # Barra flotante inferior de selección VS
        ├── AnimeCompareModal.tsx   # Modal comparador VS con subcomponente FighterCard
        ├── StatusFeedback.tsx      # LoadingSpinner, ErrorBanner y EmptyState compartido
        └── Footer.tsx              # Pie de página informativo
```

---

## Decisiones Técnicas (Unidad 3 · React Core)

1. **Descomposición sin duplicación (`AnimeBadges`, `ModalDialog` y `FighterCard`):**  
   Las insignias de metadatos se centralizaron en `AnimeBadges.tsx` para reutilizarse sin cambios en `AnimeCard`, `AnimeDetailModal` y `AnimeCompareModal`. El comportamiento imperativo del elemento nativo `<dialog>` se unificó en `ModalDialog.tsx`, y cada combatiente de la arena VS se extrajo a `FighterCard`.
2. **Estado mínimo y valores derivados (*You Might Not Need an Effect*):**  
   Los filtros visibles (`useAnimesVisibles`), las estadísticas agregadas (`StatsRibbon` con `.reduce()`), la derivación de animes en comparación a partir de sus IDs y el cálculo de tiempo de maratón se derivan directamente en el render sin duplicar estado ni recurrir a efectos innecesarios.
3. **Máquina de estados con `useReducer`:**  
   En lugar de mantener variables booleanas dispersas (`cargando`, `error`, `datos`), `useFetch` centraliza las transiciones en un `fetchReducer` con un campo `status`, impidiendo combinaciones de estado inconsistentes.
4. **Renderizado condicional legible:**  
   `App.tsx` delega la visualización del catálogo a la función `renderContenidoCatalogo()` mediante sentencias `if` tempranas antes del `return`, evitando ternarios anidados.

---

## 🩺 Autopsia del Proyecto (Decisiones Discutibles y Alternativas Descartadas)

A lo largo del desarrollo de la aplicación se evaluaron tres decisiones arquitectónicas clave:

### 1. Pureza del estado en `useLocalStorage` vs. efectos secundarios en el updater
- **Alternativa descartada:** Ejecutar `seguroSetItem` directamente dentro de la función actualizadora de `setState` (`setValorAlmacenado(prev => { seguroSetItem(...); return siguiente; })`).
- **Por qué se descartó:** En React, las funciones actualizadoras de estado deben ser estrictamente puras (sin efectos secundarios). En React 19 bajo `<StrictMode>`, React ejecuta los updaters dos veces intencionadamente en desarrollo para verificar su pureza, lo que duplicaba las escrituras en almacenamiento.
- **Decisión adoptada:** La función actualizadora se mantiene 100% pura, y la sincronización con el sistema externo (`localStorage`) se delega legítimamente a un `useEffect` con dependencias explícitas `[clave, valorAlmacenado]`.

### 2. Permanencia del elemento `<dialog>` en el DOM vs. desmontaje condicional prematuro
- **Alternativa descartada:** Devolver `null` en `ModalDialog` cuando `abierto` fuese `false` (`if (!abierto) return null`).
- **Por qué se descartó:** Si el componente se desmonta anticipadamente cuando `abierto` es `false`, el nodo `<dialog>` desaparece del DOM antes de que el `useEffect` pueda invocar `dialog.close()`, convirtiendo la rama de cierre imperativo en código muerto e interrumpiendo las animaciones y eventos nativos de cierre.
- **Decisión adoptada:** El elemento nativo `<dialog>` permanece montado en el DOM en todo momento, permitiendo que el `useEffect` sincronice limpiamente `showModal()` y `close()` según la prop booleana `abierto`, y renderizando condicionalmente su contenido interno `{abierto ? children : null}`.

### 3. Sincronización declarativa en `useFetch` vs. banderas mutables con `useRef`
- **Alternativa descartada:** Gestionar la invalidación forzada de red mediante referencias mutables (`forzarRedRef`) y mantener el estado anterior al cambiar de categoría.
- **Por qué se descartó:** El uso de referencias mutables dentro de los efectos complica la trazabilidad del estado. Además, si el reducer no sincroniza inmediatamente el cambio de clave de consulta en el render, se produce un parpadeo visual mostrando brevemente los animes de la categoría anterior mientras carga la nueva.
- **Decisión adoptada:** Se implementó un estado declarativo para solicitudes manuales y una sincronización en render en el reducer cuando cambia la clave de consulta, garantizando que el estado transiciona de inmediato y sin lecturas duplicadas de la caché.

---

## Instalación y Puesta en Marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build

# 4. Ejecutar comprobación de tipos y linter
npx tsc --noEmit
npm run lint
```

---

## Declaración de Uso de Inteligencia Artificial (IA)

De conformidad con la normativa académica de la asignatura, se declara el uso asistido de Inteligencia Artificial generativa como herramienta de apoyo técnico durante el desarrollo del proyecto:

- **Configuración y tipado:** Diagnóstico e integración del entorno TypeScript (`tsconfig.json`, `vite-env.d.ts`) y configuración de `typescript-eslint` en `eslint.config.js`.
- **Generación asistida de componentes:** Se utilizó IA para generar el andamiaje base de los componentes **`AnimeCompareModal`** y **`CompareDock`** (lógica del comparador VS cara a cara).
- **Estilos y maquetación:** Generación del código CSS global (`src/index.css`) para la estética temática oscura con acentos neón y adaptabilidad responsive.
- **Documentación:** Apoyo en la redacción y maquetación de este documento `README.md`.
- **Autoría y verificación humana (Revisión y adaptación activa):** Se generó la estructura base con IA y posteriormente se ajustaron a mano las props, los tipos de TypeScript, la extracción de subcomponentes (`FighterCard`), la conexión con el estado global de React y la estricta verificación de las reglas de los hooks e inmutabilidad.
