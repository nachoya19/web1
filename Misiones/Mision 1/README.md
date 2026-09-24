# Tres en Raya · El Despertar del DOM

Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo
Abre el archivo `index.html` en el navegador (o utiliza Live Server en VS Code). Haz clic en las casillas del tablero para alternar entre ❌ y ⭕️. El juego detectará automáticamente las líneas ganadoras o el empate, y podrás reiniciar la partida con el botón inferior. 
* **Tecla secreta:** Pulsa la tecla **"n"** para activar o desactivar el modo oscuro.

## Uso de IA
No se ha utilizado ninguna inteligencia artificial para desarrollar la lógica, estructura o diseño de este proyecto. Todo el código de HTML, CSS y JavaScript ha sido escrito de forma puramente manual para entender la sintaxis, la manipulación del DOM y el flujo de eventos. Como máximo, se han consultado manuales de referencia de JavaScript para repasar la sintaxis de métodos nativos y propiedades de eventos.

## Autopsia
1. Guardo la memoria y el estado del juego en un array de JavaScript (`tablero`) en lugar de leer el contenido visual de los botones del DOM cada vez que hay que comprobar una jugada. Descarté usar el DOM como fuente de verdad porque resulta mucho más frágil y complica innecesariamente la validación de las combinaciones ganadoras.
2. Utilizo un bucle `for...of` para recorrer las casillas y asociarles un `addEventListener` dinámico, manteniendo el HTML completamente limpio de atributos de comportamiento. Descarté utilizar controladores de eventos en línea (`onclick="..."`) porque violan directamente la rúbrica de la asignatura y acoplan la estructura con la lógica.