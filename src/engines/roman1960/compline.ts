import type { ComposedHour, Hour, LiturgicalText } from '../../types';
import data from '../../texts/roman1960/compline-2026-07-07.la.json';
import { pendingHour } from '../../composition';

export const COMPLINE_TEST_DATE = data.date;

// A dated, upstream-verified composition, not a general calendar algorithm.
// Never fall back to this fixture for another date, hour, office or calendar.
export function composeCompline1960(date: string, hour: Hour): ComposedHour {
  if (hour.id !== 'compline' || date !== COMPLINE_TEST_DATE) return pendingHour(hour);
  return {
    hour,
    // Return independent objects so callers cannot mutate the retained source data.
    texts: structuredClone(data.parts) as LiturgicalText[],
    status: 'prototype',
    celebration: 'Santos Cirilo y Metodio · III clase',
    notice: 'Prototipo latino para el 7 de julio de 2026, calendario romano general de 1960. '
      + 'Recitación privada no clerical, según Divinum Officium; pendiente de revisión litúrgica independiente. '
      + 'No contempla calendarios locales. La traducción española aún no se incorpora por derechos pendientes de verificación.',
  };
}
