# Prototipo de Completas de 1960 con fuentes latinas verificadas

Septies aún no podía mostrar textos auténticos. Esta propuesta añade Completas para el **7 de julio de 2026**, calendario romano general de 1960 y recitación privada no clerical, contrastadas con la salida del motor de Divinum Officium en el commit `08edec53cc13f9bd109d2ebcae93529b504003bd`.

El lector conserva la interfaz y añade un acceso a la fecha de prueba. Presenta las trece secciones completas, salmos 11, 12 y 15, rúbricas y antífonas en su orden original, y Salve Regina con su oración. Otras fechas y horas permanecen pendientes; el motor de la Liturgia de las Horas actual no cambia ni consume estos datos.

La importación está limitada a esta composición. Se incluyen consulta original, XHTML de referencia, SHA-256, fuentes por bloque, importador reproducible y aviso MIT. La licencia de código y datos se verificó también en los créditos del proyecto. No se incorporan traducciones españolas: los permisos de las fuentes citadas requieren revisión específica.

El [informe de investigación](breviarium-1960-fase-1.md) enumera los archivos utilizados, las reglas estudiadas, las decisiones de licencia y el camino para ampliar el motor. Pendientes: calendario completo, composición para otras fechas/horas, calendarios locales, otros modos de recitación, traducciones autorizadas y revisión litúrgica independiente.

Validación realizada:

- `npm test`: 10 pruebas aprobadas; selección, rechazo de otras fechas, orden, salmodia, antífonas, igualdad de todo el texto con la referencia, procedencia, renderizado y ausencia de español no autorizado.
- `npm run build`: TypeScript y compilación de producción correctos.
- Importador con `--check`: reproducción exacta de los tres archivos derivados con el upstream fijado y sin modificar.
- Chromium: acceso al prototipo, 13 secciones, cambios de idioma, fecha y oficio; sin sustitución de contenidos ni errores de React; ancho móvil de 390 px sin desbordamiento horizontal.

No se ha fusionado en `main` ni desplegado. La comparación con Divinum Officium no sustituye la revisión litúrgica independiente.
