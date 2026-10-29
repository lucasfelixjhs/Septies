import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { roman1960 } from '../src/engines/roman1960';
import { modern } from '../src/engines/modern';
import { Reader } from '../src/components/Reader';
import data from '../src/texts/roman1960/compline-2026-07-07.la.json';

const compose = () => roman1960.compose('2026-07-07', 'compline');
const textOf = (part: typeof data.parts[number]) => part.latinLines.map(line => line.map(run => run.text).join('')).join('\n');
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
const expectedOrder = ['incipit', 'short-reading', 'examination', 'opening', 'psalm-11', 'psalm-12', 'psalm-15', 'hymn', 'chapter-responsory', 'canticle', 'collect', 'conclusion', 'marian-antiphon'];

test('only the exact date, office and hour select the prototype', () => {
  assert.equal(compose().status, 'prototype');
  for (const date of ['2026-07-06', '2026-07-08', '2025-07-07', '2026-07-14', '', 'invalid']) {
    const result = roman1960.compose(date, 'compline');
    assert.equal(result.status, 'pending');
    assert.deepEqual(result.texts, []);
  }
  for (const hour of roman1960.hours.filter(hour => hour.id !== 'compline')) {
    assert.equal(roman1960.compose(data.date, hour.id).status, 'pending');
  }
  for (const hour of modern.hours) {
    assert.deepEqual(modern.compose(data.date, hour.id).texts, []);
  }
});

test('order and weekday psalmody match the pinned office, not Sunday Compline', () => {
  assert.equal(new Date(`${data.date}T12:00:00Z`).getUTCDay(), 2);
  assert.equal(data.calendar, 'Roman general calendar, Rubrics 1960 - 1960');
  assert.deepEqual(data.psalmody, [11, 12, 15]);
  assert.equal(data.mode, 'private-non-cleric');
  assert.deepEqual(data.commemorations, []);
  assert.deepEqual(compose().texts.map(text => text.id.replace('roman1960-2026-07-07-', '')), expectedOrder);
  assert.deepEqual(data.parts.filter(part => part.kind === 'psalm').map(part => part.title), [
    'Salmo 11 · Antífona inicial', 'Salmo 12', 'Salmo 15 · Repetición de la antífona',
  ]);
});

test('antiphons bracket the weekday psalms and the Nunc dimittis', () => {
  const psalm11 = textOf(data.parts[4]);
  const psalm15 = textOf(data.parts[6]);
  assert.ok(psalm11.startsWith('Ant. Tu, Dómine, * servábis nos: et custódies nos in ætérnum.'));
  assert.ok(psalm15.endsWith('Ant. Tu, Dómine, servábis nos: et custódies nos in ætérnum.'));
  const canticle = textOf(data.parts[9]);
  assert.ok(canticle.startsWith('Ant. Salva nos, * Dómine, vigilántes'));
  assert.ok(canticle.indexOf('Nunc dimíttis') > canticle.indexOf('Ant. Salva nos'));
  assert.ok(canticle.lastIndexOf('Ant. Salva nos') > canticle.indexOf('Nunc dimíttis'));
});

test('chapter, responsory, versicle, collect and seasonal final antiphon remain intact', () => {
  const chapter = textOf(data.parts[8]);
  assert.ok(chapter.indexOf('Tu autem in nobis es') < chapter.indexOf('In manus tuas'));
  assert.ok(chapter.lastIndexOf('In manus tuas') < chapter.indexOf('Custódi nos'));
  assert.match(textOf(data.parts[7]), /Te lucis ante términum/);
  assert.match(textOf(data.parts[10]), /Vísita, quǽsumus, Dómine/);
  assert.equal(data.marianAntiphon, 'Salve Regina');
  const final = textOf(data.parts[12]);
  assert.ok(final.startsWith('Salve, Regína'));
  assert.ok(final.indexOf('Ora pro nobis') > final.indexOf('O clemens'));
  assert.ok(final.indexOf('Omnípotens sempitérne Deus') > final.indexOf('Ora pro nobis'));
  assert.ok(final.endsWith('℟. Amen.'));
  assert.match(final, /Divínum auxílium/);
  assert.doesNotMatch(data.parts.map(textOf).join('\n'), /Regína cæli|Alma Redemptóris|Dóminus vobíscum|Kýrie, eléison/);
});

test('the complete imported text matches every original rendered cell', () => {
  const reference = readFileSync(new URL('./fixtures/compline-1960-2026-07-07.html', import.meta.url));
  assert.equal(createHash('sha256').update(reference).digest('hex'), data.provenance.referenceSha256);
  const cells = [...reference.toString().matchAll(/<TD\b[^>]*ID='(Completorium\d+)'[^>]*>([\s\S]*?)<\/TD>/g)];
  assert.equal(cells.length, 13);
  const headings: Record<number, string> = {
    0: 'Incipit', 1: 'Lectio brevis', 4: 'Psalmi {ex Psalterio secundum diem}',
    7: 'Hymnus', 8: 'Capitulum Responsorium Versus', 9: 'Canticum: Nunc dimittis',
    10: 'Oratio', 11: 'Conclusio', 12: 'Antiphona finalis B.M.V.',
  };
  cells.forEach(([_, id, html], index) => {
    let plain = normalize(html.replace(/<[^>]*>/g, '').replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) => String.fromCodePoint(code[0] === 'x' ? parseInt(code.slice(1), 16) : Number(code))));
    if (headings[index]) {
      assert.ok(plain.startsWith(headings[index]));
      plain = plain.slice(headings[index].length).trim();
    }
    assert.equal(data.parts[index].sourceCell, id);
    assert.equal(normalize(textOf(data.parts[index])), plain, id);
  });
});

test('every part has provenance, rubric markup and no unreviewed Spanish', () => {
  assert.equal(data.provenance.commit, '08edec53cc13f9bd109d2ebcae93529b504003bd');
  const manifestPaths = new Set(data.provenance.files.map(file => file.path));
  assert.equal(new Set(data.parts.map(part => part.id)).size, 13);
  for (const part of data.parts) {
    assert.equal(part.verified, true);
    assert.match(part.source, new RegExp(data.provenance.commit));
    assert.ok(part.latinLines.length > 0);
    assert.equal('es' in part, false);
    for (const source of part.sourceRefs) {
      assert.ok(manifestPaths.has(source.file));
      assert.ok(source.section);
    }
  }
  assert.ok(data.parts[2].latinLines.some(line => line.some(run => run.rubric && run.text.includes('Examen conscientiæ'))));
});

test('reader supports Latin and bilingual output without substituting Spanish or injecting HTML', () => {
  const latin = renderToStaticMarkup(createElement(Reader, { composition: compose(), language: 'la' }));
  assert.match(latin, /Te lucis ante términum/);
  assert.match(latin, /liturgical-rubric/);
  assert.match(latin, /pendiente de revisión litúrgica independiente/);
  assert.match(latin, /\/Septies\/licenses\/divinum-officium-MIT.txt/);
  const bilingual = renderToStaticMarkup(createElement(Reader, { composition: compose(), language: 'bilingual' }));
  assert.match(bilingual, /Traducción española aún no disponible/);
  assert.match(bilingual, /lang="la"/);
  const spanish = renderToStaticMarkup(createElement(Reader, { composition: compose(), language: 'es' }));
  assert.match(spanish, /No hay textos españoles autorizados/);
  assert.doesNotMatch(spanish, /lang="la"/);
});

test('composing twice does not leak mutations into the retained office', () => {
  const result = compose();
  result.texts.reverse();
  result.texts[0].latinLines![0][0].text = 'mutated';
  assert.equal(compose().texts[0].id, 'roman1960-2026-07-07-incipit');
  assert.match(compose().texts.at(-1)!.latinLines![0][0].text, /Salve/);
});
