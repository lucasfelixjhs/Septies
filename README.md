# Septies

Interfaz para el Oficio Divino: Liturgia de las Horas actual y Breviario Romano de 1960. Primera versión de la aplicación; **todavía no ofrece un oficio completo para rezar**.

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
- Indicaciones explícitas de contenido pendiente; no se muestran textos ficticios.

## Arquitectura

- `src/components`: lector compartido; `App.tsx`: interfaz y estado de selección.
- `src/calendar`: fechas civiles. No calcula fiestas, tiempos ni precedencias.
- `src/engines/modern.ts` y `roman1960.ts`: motores independientes, con catálogo de horas propio. Sus reglas litúrgicas están pendientes.
- `src/composition`: contrato de composición; devuelve un estado pendiente sin asignar textos.
- `src/texts/library.json`: biblioteca vacía intencionalmente. `types.ts` define fuente, derechos, verificación y variantes lingüísticas; `texts/index.ts` permite filtrar los registros verificados.

Antes de integrar textos se deben documentar edición, fuente y derechos de reproducción para cada idioma. No debe marcarse como verificado un texto sin revisar estos datos. No se han incorporado traducciones modernas. La selección de idioma configura el lector; actualmente no hay textos que traducir o mostrar.

Pendientes: calendario litúrgico completo, rúbricas de cada oficio, salterios, propios, comunes, composición auténtica y revisión litúrgica. No se infiere una celebración a partir de la fecha civil. Los avisos deben mantenerse hasta completar y validar estas funciones.

## GitHub Pages

El workflow `.github/workflows/deploy.yml` instala con el lockfile, ejecuta pruebas, compila y publica `dist/` al recibir cambios en `main`. En GitHub, seleccionar **Settings → Pages → Source → GitHub Actions**. La base configurada es `/Septies/`; la URL esperada es `https://lucasfelixjhs.github.io/Septies/`.

Revisar e incorporar primero la rama `feat/initial-app` mediante un pull request. No se ha desplegado ni modificado `main` desde esta entrega. No se requiere un router de servidor ni secretos adicionales para Pages; el workflow utiliza los permisos estándar de GitHub.
