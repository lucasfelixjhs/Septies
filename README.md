# Septies

Interfaz para el Oficio Divino: Liturgia de las Horas actual y Breviario Romano de 1960. Aplicación en desarrollo con un prototipo latino de Completas de 1960 para una fecha fija; **no calcula todavía el oficio diario**.

## Desarrollo

Requiere Node.js 24 y npm. Desde la raíz del repositorio:

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

Vite sirve la aplicación bajo `/Septies/`, también en desarrollo. La compilación se genera en `dist/`.

## Funciones disponibles

- Selección de fecha civil, oficio, hora e idioma (latín, español y bilingüe).
- Ocho accesos en el oficio actual; nueve en 1960, incluido el Invitatorio como acceso separado de Maitines. Prima solo aparece en 1960.
- Interfaz responsive, controles accesibles y lector preparado para salmos, antífonas, himnos, lecturas y oraciones, con columnas bilingües.
- Completas latinas del 7 de julio de 2026, contrastadas con Divinum Officium, con rúbricas y procedencia por sección.
- Indicaciones explícitas de contenido pendiente; no se muestran textos ficticios.

## Arquitectura

- `src/components`: lector compartido; `App.tsx`: interfaz y estado de selección.
- `src/calendar`: fechas civiles. No calcula fiestas, tiempos ni precedencias.
- `src/engines/modern.ts` y `roman1960.ts`: motores independientes, con catálogo de horas propio. El motor de 1960 selecciona una composición de Completas para una fecha fija; sus reglas generales siguen pendientes.
- `src/composition`: estado pendiente compartido; `src/engines/roman1960/compline.ts` selecciona la composición latina documentada sin intervenir en el oficio actual.
- `src/texts/library.json`: biblioteca genérica vacía intencionalmente; `src/texts/roman1960/` contiene el caso latino documentado. `types.ts` define fuente, derechos, verificación y variantes lingüísticas; `texts/index.ts` permite filtrar los registros verificados.

Antes de integrar textos se deben documentar edición, fuente y derechos de reproducción para cada idioma. No debe marcarse como verificado un texto sin revisar estos datos. No se han incorporado traducciones modernas. La selección de idioma configura el lector; el prototipo contiene solo latín y señala expresamente la ausencia del español.

Pendientes: calendario litúrgico completo, rúbricas de cada oficio, salterios, propios, comunes, composición general de las horas y revisión litúrgica independiente. Solo la composición fija documentada identifica su celebración; no se infieren celebraciones para otras fechas. Los avisos deben mantenerse hasta completar y validar estas funciones.

## GitHub Pages

El workflow `.github/workflows/deploy.yml` instala con el lockfile, ejecuta pruebas, compila y publica `dist/` al recibir cambios en `main`. En GitHub, seleccionar **Settings → Pages → Source → GitHub Actions**. La base configurada es `/Septies/`; la URL esperada es `https://lucasfelixjhs.github.io/Septies/`.

Revisar e incorporar la rama de trabajo mediante un pull request antes de publicar. No se ha desplegado ni modificado `main` desde esta entrega. No se requiere un router de servidor ni secretos adicionales para Pages; el workflow utiliza los permisos estándar de GitHub.

## Fase 1: Completas de 1960

Ya está disponible un prototipo latino para **7 de julio de 2026**, en modo privado no clerical y calendario romano general. Usar «Abrir Completas · 7 de julio de 2026» para seleccionarlo. Las demás fechas y horas siguen pendientes. No se incorporan traducciones españolas por derechos aún sin verificar.

El [informe de investigación](docs/breviarium-1960-fase-1.md) detalla fuentes, rúbricas, licencias, arquitectura, pruebas y cómo ampliar el sistema. El JSON de esta hora es un registro separado de la biblioteca genérica aún vacía; el resto de las limitaciones anteriores permanece vigente. Véanse también los [avisos de terceros](THIRD_PARTY_NOTICES.md).
