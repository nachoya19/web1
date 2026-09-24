# Tres en Raya Ultra Épico 🎮

Proyecto interactivo del clásico juego de **Tres en Raya** desarrollado con tecnologías web estándar (**HTML5**, **CSS Grid** y **JavaScript Vanilla**).

---

## 🚀 Cómo probar el proyecto

1. Clona o descarga el repositorio en tu ordenador local.
2. Abre el archivo `index.html` directamente en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge) haciendo doble clic o a través de una extensión como *Live Server*.
3. **Mecánica de juego**:
   - La partida comienza con el turno de **❌**.
   - Haz clic sobre cualquiera de las 9 casillas para colocar tu ficha.
   - Los turnos se alternan automáticamente entre **❌** y **⭕️**.
   - Si se alinean 3 fichas idénticas (en horizontal, vertical o diagonal), se anunciará la victoria. Si se ocupan las 9 casillas sin un ganador, se declarará empate.
   - Pulsa el botón **REINICIAR** para limpiar el tablero y empezar una nueva partida en cualquier momento.
   - 🌙 **Bonus Modo Oscuro**: Presiona la tecla secreta `n` en el teclado para alternar instantáneamente entre el modo claro y el modo oscuro.

---

## 🤖 Uso de IA

> **Declaración de autoría e integridad:**
> 
> **NO se ha utilizado Inteligencia Artificial para desarrollar la lógica del proyecto.**
> 
> Toda la estructura del juego, el control del flujo de estados, la comprobación de combinaciones ganadoras y la gestión de eventos en el DOM han sido concebidos, programados y estructurados de forma manual por el autor. 
> El uso de herramientas de IA se ha limitado, a lo sumo, a consultas puntuales de sintaxis o métodos específicos de JavaScript (como la propiedad `dataset` o el método `classList.toggle`).

---

## 🔬 Autopsia (Decisiones Técnicas Clave)

Durante la concepción y desarrollo del proyecto se tomaron decisiones técnicas orientadas a la limpieza, mantenibilidad y robustez del código:

### 1. Separación del estado en un Array en memoria frente a la lectura directa del DOM
* **Decisión técnica**: Mantener una estructura de datos centralizada en JavaScript (`let tablero = ["","","","","","","","",""]`) como única fuente de verdad (*Single Source of Truth*), sincronizándola con la interfaz visual solo tras validar cada acción.
* **Justificación**: Leer el estado de la partida directamente desde los elementos HTML (consultando `textContent` o `innerText` del DOM) es ineficiente, frágil y acopla la lógica de negocio a la capa de presentación. Al desacoplar el estado en un array unidimensional:
  - La comprobación de victoria se simplifica enormemente comprobando índices puros con el array de matrices `casosGanadores`.
  - La detección de empate se resuelve de forma inmediata y expresiva mediante `!tablero.includes("")`.
  - El reinicio de la partida es atómico y predecible al reasignar el array a sus valores iniciales.

### 2. Iteración con `for...of` y `addEventListener` frente a manejadores en línea (`onclick`)
* **Decisión técnica**: Seleccionar la colección de casillas mediante `document.querySelectorAll(".casilla")` y asociar la escucha de eventos dinámicamente mediante un bucle `for (const casilla of casillas)` con `addEventListener("click", ...)`, leyendo la posición a través del atributo semántico `data-index`.
* **Justificación**: Incluir atributos `onclick` directamente en el marcado HTML es una práctica obsoleta que vulnera el principio de separación de responsabilidades (*Separation of Concerns*) y dificulta la reutilización. Al gestionar los eventos de forma centralizada en JavaScript:
  - El marcado HTML se mantiene limpio y puramente estructural.
  - Se accede al índice de forma limpia y estandarizada mediante `event.target.dataset.index`.
  - Se facilita la validación defensiva (verificando `juegoActivo` y si la celda ya está ocupada) antes de realizar cualquier mutación de estado o repintado.
