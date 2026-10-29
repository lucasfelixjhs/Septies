# Breviarium Romanum 1960 — investigación y prototipo de Completas

## Alcance y resultado

Se importa únicamente **Completas del martes 7 de julio de 2026**, calendario romano general, configuración **Rubrics 1960 - 1960**, latín del directorio `Latin` (no el salterio Bea), recitación privada no clerical (`priest=0` en la configuración del generador). El motor original identifica **Ss. Cyrilli et Methodii Pont. et Conf., III classis**. El resultado contiene sus trece bloques completos, con los salmos **11, 12 y 15**, en numeración de la Vulgata, y **Salve Regina** como antífona mariana final. No se aplican calendarios diocesanos, patronales ni religiosos.

Es un prototipo con una composición documentalmente contrastada con Divinum Officium, **no una implementación general de las rúbricas ni una certificación litúrgica independiente**. Seleccionar cualquier otra fecha u hora devuelve el estado pendiente. No se emplea este formulario como plantilla universal.

Para abrirlo, usar el botón «Abrir Completas · 7 de julio de 2026» de la interfaz existente. El botón selecciona oficio de 1960, Completas, esa fecha y latín. También puede hacerse con los selectores habituales. Español muestra un aviso de indisponibilidad; bilingüe conserva el latín y marca la traducción ausente.

## Fuente reproducible

Repositorio: <https://github.com/DivinumOfficium/divinum-officium>.

Commit inspeccionado e importado: **`08edec53cc13f9bd109d2ebcae93529b504003bd`**. Todos los enlaces relativos a continuación se refieren a ese commit, no a la rama cambiante `master`:

<https://github.com/DivinumOfficium/divinum-officium/tree/08edec53cc13f9bd109d2ebcae93529b504003bd>.

El prototipo no llama al sitio público ni necesita Perl en producción. Se ejecutó localmente el generador original `standalone/tools/epubgen2/EofficiumXhtml.pl`, sin modificar sus archivos, con:

```text
command=prayCompletorium&date1=07-07-2026&version=Rubrics%201960%20-%201960&lang1=Latin&lang2=Latin
```

Se conservan la salida XHTML exacta en `tests/fixtures/compline-1960-2026-07-07.html` y su SHA-256 en el JSON. El manifiesto incluye el commit, la consulta y hashes de las fuentes seleccionadas y del código examinado. Es una lista de evidencia y fuentes relevantes, no un registro exhaustivo de todos los archivos que el motor original abre transitivamente.

### Textos utilizados

Los siguientes caminos pertenecen al repositorio fuente. `P/` abrevia **`web/www/horas/Latin/Psalterium/`** solo en esta tabla; el JSON contiene las rutas completas y las secciones por bloque.

| Archivo | Secciones / uso |
| --- | --- |
| `web/www/horas/Ordinarium/Completorium.txt` | Orden del oficio y condiciones rubricales para 1960. |
| `P/Common/Prayers.txt` | Bendiciones inicial y final, lectura y respuestas comunes, examen/Pater, Confiteor, Misereatur, Indulgentiam, Converte nos, Deus in adjutorium, Gloria, Alleluia, Domine exaudi, Oremus, Visita, conclusión y Divinum auxilium. Contiene referencias a otras secciones que resuelve el generador. |
| `P/Psalmi/Psalmi minor.txt`, `[Completorium] / Feria III` | Antífona «Tu, Domine, servabis nos» y asignación 11, 12, 15. |
| `P/Psalmorum/Psalm11.txt` | Salmo 11 completo. |
| `P/Psalmorum/Psalm12.txt` | Salmo 12 completo. |
| `P/Psalmorum/Psalm15.txt` | Salmo 15 completo. |
| `P/Special/Minor Special.txt` | `Lectio Completorium` (1 Pe 5,8-9), `Hymnus Completorium`, `Completorium` (Jer 14,9), `Responsory Completorium`, `Versum 4`, `Ant 4`. |
| `P/Psalmorum/Psalm233.txt` | Nunc dimittis, Lc 2,29-32. |
| `P/Mariaant.txt`, `[Postpentecost]` | Salve Regina, versículo y oración; seleccionado a través de `ant Salve Regina` de Prayers. |
| `web/www/horas/Latin/Sancti/07-07.txt` | Identificación del propio del día; **no** se copian sus himnos de Vísperas a Completas. |

Los trece bloques preservan: inicio; lectura breve; examen/confesión y Converte nos; Deus in adjutorium; los tres salmos con antífona y doxologías en su sitio; himno; capítulo/responsorio/versículo; cántico con antífona; oración; conclusión; antífona mariana con su oración y Divinum auxilium.

No se ensamblan textos a mano. El importador transforma los bloques `Completorium1` a `Completorium13` generados por la fuente, conservando texto, orden, saltos de línea, versículos, repeticiones, signos y rúbricas. Solo elimina encabezados de presentación que se sustituyen por títulos de interfaz y la anotación de procedencia «ex Psalterio secundum diem». Conserva la normalización I/J y los signos de cruz que hace el generador original. No traslada expresiones condicionales de otros ritos a la aplicación ni interpreta referencias sin resolver (`@`, `$`, `&`). React representa los fragmentos como texto y spans, sin insertar HTML externo.

## Estructura y reglas investigadas

Los textos de 1960 **no están aislados en un directorio por año**. `web/www/horas/Latin/` y `Espanol/` comparten la organización `Psalterium`, `Tempora`, `Sancti`, `Commune`, etc. Hay archivos multiversión con encabezados entre corchetes, referencias a secciones/archivos y condiciones de rúbrica. Buscar un salmo o copiar un propio sin resolver estas condiciones no produce por sí solo un oficio de 1960. `Espanol` es el nombre exacto del directorio español.

1. **Versión y calendario.** `web/www/Tabulae/data.txt` enlaza `Rubrics 1960 - 1960` con calendarios y tablas de traslados, y con una versión base. `Kalendaria/1960.txt` declara cambios respecto de 1955, no un calendario autosuficiente. `DivinumOfficium/Directorium.pm` carga esas tablas con herencia, traslados y particularidades. `Date.pm` calcula el ciclo temporal a partir de Pascua y de la fecha; no basta el número del día de la semana.
2. **Ocurrencia y concurrencia.** `horascommon.pl` contiene `occurrence`, `concurrence` y `precedence`. Compara temporal, santoral, clases y reglas; determina el oficio prevalente, el común, la escritura y las conmemoraciones. Vísperas y Completas pasan por concurrencia. Por tanto, un cambio de oficio por primeras Vísperas puede afectar Completas; no se extrapola el resultado de este martes a una víspera festiva.
3. **Horas.** El ordinario declara Maitines, Laudes, Prima, Tercia, Sexta, Nona, Vísperas y Completas; el Invitatorio pertenece a Maitines. Septies mantiene su acceso separado por continuidad de la interfaz. `horas.pl` y `specials.pl` combinan el ordinario con las partes seleccionadas, y `DivinumOfficium/Scripting.pm` resuelve las llamadas del lenguaje de datos.
4. **Propios y comunes.** `specials.pl:getproprium` y los módulos en `specials/` resuelven propio del tiempo, propio de santos, referencias a comunes y ordinario. Las reglas `vide`, `ex`, `Psalmi...` y sus excepciones importan. No se usa el himno propio de otra hora como sustituto del himno de Completas.
5. **Salterio de Completas.** `specials/psalmi.pl:psalmi_minor` usa `Psalmi minor.txt`. Para 1960 hay salterio semanal, excepciones por la clase y reglas del oficio, y tratamiento de la concurrencia del sábado. No es correcto usar siempre 4, 90, 133. En el caso seleccionado, III clase en martes, se usa 11, 12, 15. El mismo módulo contiene ajustes pascuales; otros casos especiales se procesan también en `specials.pl`.
6. **Himno y lecturas.** `specials/hymni.pl` selecciona `Hymnus Completorium`; la sustitución de doxologías de versiones antiguas no se aplica indiscriminadamente a 1960. `specials/capitulis.pl` selecciona Tu autem in nobis, In manus tuas y Custodi nos. `horas.pl:canticum` resuelve Nunc dimittis con su antífona.
7. **Comienzo, final y modo de recitación.** El ordinario y `horasscripts.pl` determinan las fórmulas y exclusiones. El ejemplo usa Domine exaudi, no Dominus vobiscum. La rúbrica de examen o Pater secreto se conserva tal como la ofrece el generador; el Pater mostrado no significa que deban realizarse ambas alternativas. No se añaden las preces dominicales de versiones anteriores ni las oraciones secretas finales omitidas por el ordinario de 1960.
8. **Antífona mariana.** `specials.pl` y `Mariaant.txt` seleccionan Alma Redemptoris Mater, Ave Regina caelorum, Regina caeli o Salve Regina según la época y límites de fecha. Para el 7 de julio, fuera del tiempo pascual, corresponde Salve Regina con su versículo y oración, seguida de Divinum auxilium.
9. **Conmemoraciones.** Se calculan por clase, carácter privilegiado, ocurrencia/concurrencia y límites del calendario; su expresión habitual usa antífona del Benedictus/Magnificat, versículo y oración después de la oración del oficio en Laudes/Vísperas. No se añaden arbitrariamente a Completas los propios de los santos conmemorados. Este resultado no contiene conmemoraciones. La selección general de conmemoraciones aún no está implementada en Septies.

También se consultaron `web/www/horas/Help/Rubrics/General Rubrics.html` y `Breviary 1960.html` como material explicativo, sin reproducir sus traducciones. El segundo remite a normas especialmente relevantes: 138 (horas), 147 (examen/Pater), 148–157 (calendario propio), 165–177 (tipos de oficio y Completas), 178–181 (inicio/final), 186 (himnos), 190 (excepciones a antífonas), 240–248 (capítulo, responsorio, oración y modo de recitación), 250–260 (conmemoraciones y preces). Son ayudas de investigación; el prototipo se contrasta con la salida concreta, no con una reinterpretación libre de esa traducción.

## Licencias y procedencia: comprobaciones separadas

- **Código:** `LICENSE` declara MIT, copyright © 2026 Divinum Officium. Se conserva íntegramente en `public/licenses/divinum-officium-MIT.txt`. No se incorpora el motor Perl ni se atribuye esa licencia a todo el código original de Septies.
- **Datos y latín:** no se dedujo el permiso de los textos únicamente de la licencia del código. `web/www/horas/Help/credits.html` dice expresamente que **el código y los datos** se ofrecen bajo MIT y que, según su conocimiento, los textos litúrgicos son de dominio público. En «Latin sources» identifica el Breviarium Romanum de Ratisbona de 1888, adaptaciones con ediciones de 1943–1962, la Vulgata latina de dominio público y el texto acentuado sixto-clementino. Se revisaron los archivos latinos usados, sin encontrar en ellos una licencia separada más restrictiva. Se conserva la licencia de los datos y se atribuye cada fragmento a su archivo y commit.
- **Límites de esa evidencia:** los créditos también mencionan condiciones de uso personal/educativo/no comercial del escaneo original y permisos recibidos por el proyecto. La afirmación del proyecto sobre dominio público es una declaración de procedencia, no una auditoría jurídica universal de cada edición o transcripción. No se redistribuyen escaneos, imágenes, partituras, salterio Bea ni traducciones modernas. No se afirma que toda la base multilingüe pueda reutilizarse automáticamente bajo MIT.
- **Español: no incorporado.** «Spanish» en el mismo archivo agradece a **Sapientia Sedei Filii** el ofrecimiento de su traducción; cita **Petisco–Torres Amat, revisión de Alfonso Mª Gubianas, O.S.B., 1935** para la Biblia, y menciona Una Voce Sevilla y la Iglesia del Salvador de Toledo para otros contenidos. Un permiso concedido al proyecto no documenta por sí mismo una autorización redistribuible para Septies. Falta comprobar alcance del permiso, edición, titulares y situación jurídica de cada traducción/revisión. No se copió ningún archivo de `Espanol` al producto ni se generó una traducción nueva.
- **Otras lenguas y documentos:** los créditos registran permisos particulares para otras traducciones, lo que confirma que la declaración general requiere revisión por fuente. Algunos documentos de ayuda incluyen avisos CC BY-SA; no se copian esos documentos ni se presentan como datos MIT.

La palabra `verified` en cada bloque significa **selección y procedencia comprobadas para este caso**, no un dictamen jurídico o aprobación eclesiástica. Para nuevos textos debe repetirse la revisión de derechos a nivel de fuente e idioma.

## Arquitectura de integración

Se mantienen la interfaz, navegación y selectores compartidos. La única ampliación visible es un acceso al prototipo y avisos que reflejan su estado real.

- `src/calendar/`: sigue siendo calendario civil. No recibe reglas de 1960 ni simula fiestas para cualquier fecha.
- `src/engines/roman1960/compline.ts`: selecciona por coincidencia exacta fecha/hora; entrega una copia independiente del registro importado. No hay fallback del martes para otros días.
- `src/engines/modern.ts`: intacto y pendiente; nunca consume textos ni reglas del breviario tradicional.
- `src/texts/roman1960/compline-2026-07-07.la.json`: registro versionado con ámbito de calendario, fecha, hora, idioma, modo de recitación, celebración, salmodia, conmemoraciones, partes ordenadas y procedencia. Se mantiene separado de la biblioteca genérica aún vacía.
- `src/types.ts`: contrato de lectura compartido; incorpora el estado `prototype`, cánticos y líneas con fragmentos de rúbrica. No contiene algoritmos de calendario.
- `src/components/Reader.tsx`: muestra líneas latinas, rúbricas y enlaces a fuentes. La traducción ausente nunca se sustituye por texto de otro idioma.
- `tools/import-compline-1960.py`: importador deliberadamente acotado a una composición, no un parser universal de toda la base. Usa la fuente original para resolverla antes de normalizar.

### Cómo ampliarlo

1. Añadir bajo el motor de 1960 un contexto de calendario explícito (fecha, calendario local/general, clase, temporal, santoral, concurrencia, conmemoraciones y modo de recitación). Separarlo del futuro calendario de la Liturgia Horarum.
2. Ampliar la selección con casos estudiados y pruebas contra el motor fuente: domingo, sábado con primeras Vísperas, I/II clase, Adviento/Navidad, Septuagésima/Cuaresma/Pasión, Pascua y su octava, Pentecostés, Triduo y difuntos. Probar límites de las antífonas marianas, no solo fechas interiores.
3. Extraer identificadores estables de textos reutilizables y planes de composición por hora. La versión 1 del JSON conserva bloques resueltos para evitar una abstracción prematura que cambie su orden. El esquema se puede migrar a referencias sin mezclar calendarios ni perder la procedencia por bloque.
4. Para otra fecha/hora, generar primero un resultado de referencia y revisarlo. No generalizar simplemente eliminando la condición de fecha del selector actual.
5. Revisar y documentar permisos de cada traducción antes de añadir variantes `es` a los bloques; mantener correspondencia con la misma composición latina. La interfaz bilingüe ya acepta la ausencia explícita de una traducción.
6. Someter las composiciones y rúbricas nuevas a revisión litúrgica independiente antes de ampliar las afirmaciones de disponibilidad.

## Reproducción y comprobaciones

Requisitos de desarrollo de Septies: Node 24 y npm. `npm ci`, `npm test`, `npm run build`.

El importador requiere además Python 3, Perl y módulos CGI/URI con sus dependencias; en Debian se obtienen con `libcgi-pm-perl`, `liburi-perl`, `libhtml-parser-perl` y sus dependencias. Estas herramientas solo son necesarias al regenerar las fuentes, no para ejecutar/buildar Septies. El usuario puede indicar bibliotecas Perl instaladas localmente mediante `PERL5LIB`. En esta investigación se extrajeron paquetes oficiales verificados en `/tmp`, sin modificar dependencias del proyecto.

```sh
git clone https://github.com/DivinumOfficium/divinum-officium.git /tmp/divinum-officium
git -C /tmp/divinum-officium checkout 08edec53cc13f9bd109d2ebcae93529b504003bd
python3 tools/import-compline-1960.py --upstream /tmp/divinum-officium --check
```

Sin `--check` regenera los tres archivos derivados: JSON, XHTML de referencia y licencia MIT. El script exige ese commit y ausencia de cambios en archivos versionados de upstream; rechaza un número u orden de celdas o encabezados inesperados. No hace solicitudes de red, instala dependencias ni copia la base completa.

Las pruebas automáticas verifican selección exacta y rechazo de otras fechas/horas/oficio; orden de las trece partes; salmos del martes; ubicación de antífonas; capítulo/responsorio/versículo; oración y final estacional; igualdad de **todo** el texto con cada celda XHTML; hash de la referencia; procedencia; rúbricas; ausencia de español; renderizado latino/bilingüe/español; y aislamiento frente a mutaciones.

Pendientes: calendario completo, algoritmo general de composición, calendarios propios, otras horas/fechas, variantes de coro/comunidad/clérigos, traducciones autorizadas y revisión litúrgica independiente. No se ha publicado ni fusionado el prototipo en `main`.

Validación de esta entrega: las 10 pruebas pasaron; TypeScript/Vite compilaron; el importador con `--check` reprodujo exactamente los archivos derivados. En Chromium se comprobaron el acceso al caso fijo, las 13 partes, los tres idiomas, el rechazo de otra fecha y otro oficio, y un ancho móvil de 390 px sin desbordamiento ni errores de React.
