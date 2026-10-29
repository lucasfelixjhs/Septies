import type { ComposedHour, Language, TextKind } from '../types';
const labels: Record<TextKind, string> = { psalm: 'Salmo', antiphon: 'Antífona', hymn: 'Himno', reading: 'Lectura', prayer: 'Oración' };
export function Reader({ composition, language }: { composition: ComposedHour; language: Language }) {
  return <div className="reader-content">
    {composition.texts.length ? composition.texts.map(text => <section className="text-block" key={text.id}>
      <p className="eyebrow">{labels[text.kind]}</p><h3>{text.title}</h3>
      <div className={language === 'bilingual' ? 'parallel' : ''}>
        {language !== 'es' && <p lang="la">{text.la ?? 'Texto latino aún no disponible.'}</p>}
        {language !== 'la' && <p lang="es">{text.es ?? 'Traducción española aún no disponible.'}</p>}
      </div><small>Fuente: {text.source} · Derechos: {text.rights}</small>
    </section>) : <div className="empty-state">
      <span className="book-mark" aria-hidden="true">✦</span>
      <h3>Un espacio para la oración</h3>
      <p>Los textos de esta hora todavía no están disponibles. Estamos preparando una biblioteca con fuentes y derechos de reproducción verificados.</p>
      <p className="rubric">Esta pantalla no constituye un oficio litúrgico completo ni válido para su rezo.</p>
      <div className="text-types">{['Salmos', 'Antífonas', 'Himnos', 'Lecturas', 'Oraciones'].map(label => <span key={label}>{label}</span>)}</div>
    </div>}
  </div>;
}
