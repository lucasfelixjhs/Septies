import { useState } from 'react';
import type { HourId, Language, Office } from './types';
import { modern } from './engines/modern';
import { roman1960 } from './engines/roman1960';
import { formatDate, localDate } from './calendar';
import { Reader } from './components/Reader';
export default function App() {
  const [date, setDate] = useState(localDate);
  const [office, setOffice] = useState<Office>('modern');
  const [language, setLanguage] = useState<Language>('bilingual');
  const [hour, setHour] = useState<HourId>('lauds');
  const engine = office === 'modern' ? modern : roman1960;
  const composition = engine.compose(date, hour);
  function changeOffice(value: Office) {
    setOffice(value);
    if (value === 'modern' && hour === 'prime') setHour('lauds');
  }
  return <>
    <a className="skip-link" href="#lector">Ir al lector</a>
    <header className="masthead"><div className="cross" aria-hidden="true">✠</div><h1>Septies</h1><p lang="la">Septies in die laudem dixi tibi</p><span className="edition">EL OFICIO DIVINO · EDICIÓN EN DESARROLLO</span></header>
    <main>
      <section className="controls" aria-label="Configurar el oficio">
        <label>Fecha<input type="date" value={date} required min="0001-01-01" max="9999-12-31" onChange={e => { if (e.target.value && e.target.validity.valid) setDate(e.target.value); }} /></label>
        <label>Oficio<select value={office} onChange={e => changeOffice(e.target.value as Office)}><option value="modern">Liturgia de las Horas</option><option value="roman1960">Breviario Romano · 1960</option></select></label>
        <fieldset><legend>Idioma de los textos</legend><div className="language-control">{([['la', 'Latín'], ['es', 'Español'], ['bilingual', 'Bilingüe']] as const).map(([id, label]) => <button key={id} aria-pressed={language === id} onClick={() => setLanguage(id)}>{label}</button>)}</div></fieldset>
      </section>
      <div className="workspace">
        <nav className="hours" aria-label="Horas del oficio"><p className="eyebrow">Las horas del día</p>{engine.hours.map((item, i) => <button key={item.id} aria-current={hour === item.id ? 'true' : undefined} onClick={() => setHour(item.id)}><span className="hour-number">{String(i + 1).padStart(2, '0')}</span><span>{item.label}<small lang="la">{item.latin}</small></span><span className="hour-dot" aria-hidden="true">·</span></button>)}<p className="nav-note">{office === 'modern' ? 'Prima no forma parte de la Liturgia de las Horas actual.' : 'El Invitatorio se presenta como acceso propio; forma parte de Maitines.'}</p></nav>
        <article id="lector" className="reader" aria-label="Lector litúrgico">
          <div className="reader-heading"><p className="eyebrow">{office === 'modern' ? 'Liturgia de las Horas' : 'Breviario Romano · 1960'}</p><h2>{composition.hour.label}</h2><p className="latin-title" lang="la">{composition.hour.latin}</p><div className="divider" aria-hidden="true">✦</div><p className="date-label">{formatDate(date)}</p><span className="status">Textos y composición pendientes</span></div>
          <div aria-live="polite"><Reader composition={composition} language={language} /></div>
          <footer className="reader-footer">{language === 'bilingual' ? 'Lectura bilingüe · Latín / Español' : language === 'la' ? 'Lectura en latín' : 'Lectura en español'}<span>Calendario litúrgico en desarrollo</span></footer>
        </article>
      </div>
      <aside className="development"><strong>Una obra en preparación</strong><p>Ya puedes explorar los dos oficios, sus horas y las opciones de lectura. El calendario litúrgico, las rúbricas y la asignación de textos aún no están implementados. La fecha seleccionada es civil y no determina celebraciones.</p></aside>
    </main><footer className="site-footer"><span>SEPTIES</span><p>Una invitación a santificar el tiempo.</p></footer>
  </>;
}
