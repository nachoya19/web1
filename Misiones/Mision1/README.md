# Tres en Raya · El Despertar del DOM

Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo
Abre el archivo `index.html` en el navegador. Haz clic en las casillas para jugar. 
* **Marcador:** El sistema cuenta las victorias en tiempo real.
* **Tecla secreta:** Pulsa la tecla **"n"** para activar o desactivar el modo oscuro.
* **Reinicio:** Utiliza el botón inferior para limpiar el tablero.

## Uso de IA
No se ha utilizado ninguna inteligencia artificial para desarrollar la lógica, estructura o diseño base de este proyecto. Todo el código de HTML, CSS y JavaScript ha sido escrito de forma manual para comprender la manipulación del DOM, el flujo de eventos y la gestión de estados. Como máximo, se han consultado manuales de referencia para verificar sintaxis de métodos nativos y propiedades de eventos. Tambien se ha usado para redactar el readme jeje.

## Autopsia
1. **El array como fuente de verdad:** Se ha optado por mantener el estado del juego en un array de JavaScript (`tablero`) en lugar de consultar directamente el DOM. Esto simplifica enormemente la comprobación de las combinaciones ganadoras y evita errores derivados de leer contenido visual frágil.
2. **Listeners dinámicos frente a controladores en línea:** Se recorren las casillas mediante un bucle `for...of` para asignarles un `addEventListener` de forma limpia, manteniendo el archivo HTML completamente libre de atributos `onclick` y respetando la separación estricta de responsabilidades.
