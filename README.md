# Web 1 — Proyectos y Trabajos

Repositorio de trabajos prácticos y proyectos de la asignatura.

---

## 🎮 Misión 1: Tres en Raya Ultra Épico

Proyecto interactivo del clásico juego de **Tres en Raya** desarrollado con tecnologías web estándar (**HTML5**, **CSS Grid** y **JavaScript Vanilla**).

### 🚀 Cómo probar el proyecto
1. Abre el archivo [`Trabajos/Misiones/Mision 1/index.html`](Misiones/Mision%201/index.html) en cualquier navegador web moderno (haciendo doble clic o con Live Server).
2. **Mecánica de juego**:
   - Turno inicial para **❌**.
   - Haz clic en las casillas para jugar por turnos.
   - Detecta victorias y empates automáticamente.
   - Botón **REINICIAR** para restablecer la partida.
   - 🌙 **Bonus Modo Oscuro**: Pulsa la tecla `n` para activar o desactivar el modo oscuro.

---

### 🤖 Uso de IA
> **Declaración de autoría e integridad:**
> 
> **NO se ha utilizado Inteligencia Artificial para desarrollar la lógica del proyecto.**
> 
> Toda la estructura del juego, el control del flujo de estados, la comprobación de combinaciones ganadoras y la gestión de eventos en el DOM han sido concebidos, programados y estructurados de forma manual por el autor. 
> El uso de herramientas de IA se ha limitado, a lo sumo, a consultas puntuales de sintaxis o métodos específicos de JavaScript (como la propiedad `dataset` o el método `classList.toggle`).

---

### 🔬 Autopsia (Decisiones Técnicas Clave)

1. **Separación del estado en un Array en memoria frente a la lectura directa del DOM**:
   Se definió `tablero = ["","","","","","","","",""]` como única fuente de verdad en lugar de consultar directamente los textos de las casillas en el HTML, permitiendo validar las 8 combinaciones ganadoras mediante índices (`casosGanadores`) y comprobar empates con `!tablero.includes("")` de forma limpia y mantenible.

2. **Iteración con `for...of` y `addEventListener` frente a manejadores en línea (`onclick`)**:
   Se iteró sobre las casillas con `document.querySelectorAll(".casilla")` y `addEventListener` junto con `data-index`, preservando la separación de capas, evitando ensuciar el HTML con atributos `onclick` y facilitando el control de flujo con `juegoActivo`.