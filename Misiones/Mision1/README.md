# Tres en Raya · El Despertar del DOM

Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo
Abre el archivo `index.html` en el navegador. Haz clic en las casillas para jugar.

* **Marcador:** El sistema cuenta las victorias y empates en tiempo real.
* **Tecla secreta:** Pulsa la tecla "n" para activar o desactivar el modo oscuro (temática Aurelion Sol).
* **Reinicio:** Utiliza el botón inferior para limpiar el tablero y resetear la ronda.

## Uso de IA
No se ha utilizado ninguna inteligencia artificial para desarrollar la lógica, estructura o diseño base de este proyecto. Todo el código de HTML, CSS y JavaScript ha sido escrito de forma manual para comprender la manipulación del DOM, el flujo de eventos y la gestión de estados. Como máximo, se han consultado manuales de referencia para verificar sintaxis de métodos nativos y propiedades de eventos. También se ha usado para redactar el readme jeje.

## Autopsia
1. **Delegación de eventos frente a listeners individuales:** En lugar de asignar un `addEventListener` a cada una de las 9 casillas mediante un bucle, he aplicado delegación de eventos colocando un único escuchador en el contenedor padre (`#tablero-juego`). Descarté los listeners múltiples porque la delegación es más eficiente, consume menos memoria y escala mejor si el tablero creciera en el futuro.
2. **Nodos dinámicos frente a HTML estático:** Para los mensajes de victoria y empate, el código genera elementos HTML al vuelo utilizando `document.createElement("span")` y los inyecta con `appendChild`. Descarté la opción de tener un párrafo ya maquetado y limitarme a cambiar su `textContent` porque la creación dinámica demuestra un control más profundo del DOM.
3. **El array como fuente de verdad:** Se ha optado por mantener el estado del juego en un array de JavaScript (`tablero`), reiniciándolo a través de una constante global mediante el operador de propagación (`...`), en lugar de consultar directamente el DOM. Descarté usar el contenido visual de los botones como referencia porque es frágil y ensucia la lógica de las combinaciones ganadoras.
