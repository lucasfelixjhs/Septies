import type { ComposedHour, Language, TextKind } from '../types';
const labels: Record<TextKind, string> = { psalm: 'Salmo', antiphon: 'Antífona', hymn: 'Himno', reading: 'Lectura', prayer: 'Oración', canticle: 'Cántico' };
export function Reader({ composition, language }: { composition: ComposedHour; language: Language }) {
  const spanishUnavailable = composition.texts.length > 0 && composition.texts.every(text => !text.es);
  return <div className="reader-content">
    {composition.notice && <p className="prototype-notice">{composition.notice} <a href={`${import.meta.env?.BASE_URL ?? '/Septies/'}licenses/divinum-officium-MIT.txt`}>Licencia de los datos</a>.</p>}
    {language === 'es' && spanishUnavailable && <p role="status">No hay textos españoles autorizados para esta hora. Selecciona Latín o Bilingüe para consultar el prototipo latino.</p>}
    {composition.texts.length ? composition.texts.filter(text => language !== 'es' || !spanishUnavailable).map(text => <section className="text-block" key={text.id}>
      <p className="eyebrow">{labels[text.kind]}</p><h3>{text.title}</h3>
      <div className={language === 'bilingual' ? 'parallel' : ''}>
        {language !== 'es' && (text.latinLines
          ? <p lang="la">{text.latinLines.map((line, i) => <span className="liturgical-line" key={i}>{line.length ? line.map((run, j) => <span key={j} className={run.rubric ? 'liturgical-rubric' : undefined}>{run.text}</span>) : <br />}</span>)}</p>
          : <p lang="la">{text.la ?? 'Texto latino aún no disponible.'}</p>)}
        {language !== 'la' && <p lang="es">{text.es ?? 'Traducción española aún no disponible.'}</p>}
      </div><small>Fuente: <a href={text.source}>Ver fuente</a> · {text.rights}</small>
    </section>) : <div className="empty-state">
      <span className="book-mark" aria-hidden="true">✦</span>
      <h3>Un espacio para la oración</h3>
      <p>Los textos de esta hora todavía no están disponibles. Estamos preparando una biblioteca con fuentes y derechos de reproducción verificados.</p>
      <p className="rubric">Esta pantalla no constituye un oficio litúrgico completo ni válido para su rezo.</p>
      <div className="text-types">{['Salmos', 'Antífonas', 'Himnos', 'Lecturas', 'Oraciones'].map(label => <span key={label}>{label}</span>)}</div>
    </div>}
  </div>;
}
