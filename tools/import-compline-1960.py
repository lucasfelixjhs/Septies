#!/usr/bin/env python3
"""Import ONE pinned Latin office from the unmodified upstream generator.
Requires Perl CGI/URI modules; never downloads files or imports translations.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from html.parser import HTMLParser

PIN = '08edec53cc13f9bd109d2ebcae93529b504003bd'
ROOT = Path(__file__).resolve().parents[1]
LATIN = 'web/www/horas/Latin/Psalterium/'
PRAYERS = LATIN + 'Common/Prayers.txt'
MINOR = LATIN + 'Special/Minor Special.txt'
PSALMS = LATIN + 'Psalmi/Psalmi minor.txt'
URL = 'https://github.com/DivinumOfficium/divinum-officium'
QUERY = 'command=prayCompletorium&date1=07-07-2026&version=Rubrics%201960%20-%201960&lang1=Latin&lang2=Latin'
# Preserve the 13 rendered cells; do not rearrange or reassemble their contents.
PARTS = [
 ('incipit', 'prayer', 'Inicio', 'Incipit', [(PRAYERS, 'Jube domne; benedictio Completorium; Amen')]),
 ('short-reading', 'reading', 'Lectura breve', 'Lectio brevis', [(MINOR, 'Lectio Completorium'), (PRAYERS, 'Tu autem; Deo gratias')]),
 ('examination', 'prayer', 'Examen y confesión', None, [(PRAYERS, 'Adjutorium nostrum; rubrica examen; Pater noster; Confiteor; Misereatur; Indulgentiam; Converte nos')]),
 ('opening', 'prayer', 'Invocación inicial', None, [(PRAYERS, 'Deus in adjutorium; Gloria; Alleluia')]),
 ('psalm-11', 'psalm', 'Salmo 11 · Antífona inicial', 'Psalmi', [(PSALMS, 'Completorium / Feria III'), (LATIN + 'Psalmorum/Psalm11.txt', 'entire file'), (PRAYERS, 'Gloria')]),
 ('psalm-12', 'psalm', 'Salmo 12', None, [(LATIN + 'Psalmorum/Psalm12.txt', 'entire file'), (PRAYERS, 'Gloria')]),
 ('psalm-15', 'psalm', 'Salmo 15 · Repetición de la antífona', None, [(LATIN + 'Psalmorum/Psalm15.txt', 'entire file'), (PRAYERS, 'Gloria'), (PSALMS, 'Completorium / Feria III')]),
 ('hymn', 'hymn', 'Himno · Te lucis ante terminum', 'Hymnus', [(MINOR, 'Hymnus Completorium')]),
 ('chapter-responsory', 'reading', 'Capítulo, responsorio y versículo', 'Capitulum Responsorium Versus', [(MINOR, 'Completorium; Responsory Completorium; Versum 4'), (PRAYERS, 'Deo gratias; Gloria1')]),
 ('canticle', 'canticle', 'Cántico de Simeón · Nunc dimittis', 'Canticum: Nunc dimittis', [(MINOR, 'Ant 4'), (LATIN + 'Psalmorum/Psalm233.txt', 'entire file'), (PRAYERS, 'Gloria')]),
 ('collect', 'prayer', 'Oración · Visita, quaesumus', 'Oratio', [(PRAYERS, 'Domine exaudi; Oremus; oratio_Visita; Per Dominum; Amen')]),
 ('conclusion', 'prayer', 'Conclusión y bendición', 'Conclusio', [(PRAYERS, 'Domine exaudi; Benedicamus Domino; benedictio Completorium Final; Amen')]),
 ('marian-antiphon', 'antiphon', 'Antífona final · Salve Regina', 'Antiphona finalis B.M.V.', [(PRAYERS, 'ant Salve Regina; Divinum auxilium'), (LATIN + 'Mariaant.txt', 'Postpentecost')]),
]

class OfficeParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.cells = []
        self.lines = []
        self.runs = []
        self.stack = []
        self.active = False
        self.cell_id = ''

    def flush(self):
        # Strip only boundary whitespace. Preserve internal text and rubric spans.
        while self.runs and not self.runs[0]['text'].strip(): self.runs.pop(0)
        while self.runs and not self.runs[-1]['text'].strip(): self.runs.pop()
        if self.runs:
            self.runs[0]['text'] = self.runs[0]['text'].lstrip()
            self.runs[-1]['text'] = self.runs[-1]['text'].rstrip()
        self.lines.append(self.runs)
        self.runs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'td' and re.fullmatch(r'Completorium\d+', attrs.get('id', '')):
            if self.active: raise ValueError('Nested office cell')
            self.active = True
            self.cell_id = attrs['id']
            self.lines, self.runs, self.stack = [], [], []
        if not self.active: return
        if tag == 'br': self.flush()
        elif tag not in ('td', 'p'):
            self.stack.append((tag, bool(set(attrs.get('class', '').split()) & {'ri', 'rd', 'w'})))

    def handle_endtag(self, tag):
        if not self.active: return
        if tag == 'td':
            self.flush()
            while self.lines and not self.lines[0]: self.lines.pop(0)
            while self.lines and not self.lines[-1]: self.lines.pop()
            self.cells.append((self.cell_id, self.lines))
            self.active = False
        elif self.stack and self.stack[-1][0] == tag:
            self.stack.pop()

    def handle_data(self, text):
        if not self.active: return
        text = re.sub(r'\s+', ' ', text)
        if not text: return
        rubric = any(r for _, r in self.stack)
        if self.runs and self.runs[-1]['rubric'] == rubric:
            self.runs[-1]['text'] += text
        else:
            self.runs.append({'text': text, 'rubric': rubric})


def sha(data): return hashlib.sha256(data).hexdigest()

def save(path, data, check):
    if check:
        if not path.exists() or path.read_bytes() != data:
            raise ValueError(f'Outdated generated file: {path.relative_to(ROOT)}')
    else:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--upstream', type=Path, required=True)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    upstream = args.upstream.resolve()
    head = subprocess.check_output(['git', '-C', str(upstream), 'rev-parse', 'HEAD'], text=True).strip()
    if head != PIN: raise ValueError(f'Expected upstream commit {PIN}, found {head}')
    if subprocess.check_output(['git', '-C', str(upstream), 'status', '--porcelain', '--untracked-files=no']):
        raise ValueError('Upstream tracked files must be unmodified')
    env = dict(os.environ)
    env['PERL5LIB'] = str(upstream / 'web/cgi-bin') + os.pathsep + env.get('PERL5LIB', '')
    output = subprocess.check_output(['perl', 'EofficiumXhtml.pl', QUERY], cwd=upstream / 'standalone/tools/epubgen2', env=env)
    text = output.decode('utf-8')
    if 'Ss. Cyrilli et Methodii Pont. et Conf. ~ III. classis' not in text:
        raise ValueError('Unexpected celebration')
    office = OfficeParser()
    office.feed(text)
    if [cell for cell, _ in office.cells] != [f'Completorium{i}' for i in range(1, 14)]:
        raise ValueError('Expected 13 consecutive office cells')
    parts = []
    for (cell_id, lines), (part_id, kind, title, heading, refs) in zip(office.cells, PARTS):
        if heading:
            actual = ''.join(run['text'] for run in lines.pop(0)).strip()
            expected = heading + (' {ex Psalterio secundum diem}' if part_id == 'psalm-11' else '')
            if actual != expected: raise ValueError(f'Unexpected heading: {actual!r}')
            while lines and not lines[0]: lines.pop(0)
        parts.append({
            'id': 'roman1960-2026-07-07-' + part_id, 'kind': kind, 'title': title,
            'latinLines': lines, 'sourceCell': cell_id,
            'sourceRefs': [{'file': file, 'section': section} for file, section in refs],
            'source': f'{URL}/blob/{PIN}/{refs[0][0]}',
            'rights': 'Datos MIT · textos latinos tradicionales; véase el informe de fuentes.',
            'verified': True,
        })
    evidence_files = sorted({file for *_, refs in PARTS for file, _ in refs} | {
        'LICENSE', 'web/www/horas/Help/credits.html',
        'web/www/horas/Ordinarium/Completorium.txt',
        'web/www/horas/Latin/Sancti/07-07.txt',
        'web/www/Tabulae/data.txt', 'web/www/Tabulae/Kalendaria/1960.txt',
        'web/cgi-bin/horas/horascommon.pl', 'web/cgi-bin/horas/specials.pl',
        'web/cgi-bin/horas/specials/psalmi.pl', 'web/cgi-bin/horas/specials/hymni.pl',
        'web/cgi-bin/horas/specials/capitulis.pl', 'web/cgi-bin/horas/horasscripts.pl',
        'standalone/tools/epubgen2/EofficiumXhtml.pl', 'standalone/tools/epubgen2/Ehoras.setup',
        'standalone/tools/epubgen2/Ewebdia.pl',
    })
    data = {
        'schemaVersion': 1, 'office': 'roman1960', 'hour': 'compline', 'date': '2026-07-07',
        'locale': 'la', 'calendar': 'Roman general calendar, Rubrics 1960 - 1960',
        'celebration': 'Ss. Cyrilli et Methodii Pont. et Conf. · III classis',
        'mode': 'private-non-cleric', 'psalmody': [11, 12, 15],
        'marianAntiphon': 'Salve Regina', 'commemorations': [],
        'provenance': {'repository': URL, 'commit': PIN, 'query': QUERY,
            'generator': 'standalone/tools/epubgen2/EofficiumXhtml.pl',
            'referenceSha256': sha(output),
            'files': [{'path': path, 'sha256': sha((upstream / path).read_bytes())} for path in evidence_files]},
        'parts': parts,
    }
    save(ROOT / 'tests/fixtures/compline-1960-2026-07-07.html', output, args.check)
    save(ROOT / 'src/texts/roman1960/compline-2026-07-07.la.json', (json.dumps(data, ensure_ascii=False, indent=2) + '\n').encode(), args.check)
    save(ROOT / 'public/licenses/divinum-officium-MIT.txt', (upstream / 'LICENSE').read_bytes(), args.check)
    print(f'{"Verified" if args.check else "Imported"} {len(parts)} parts for 2026-07-07; no other dates or languages imported.')

if __name__ == '__main__': main()
