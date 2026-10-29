import type { ComposedHour, Hour } from '../types';
// No date-to-text assignment until calendar and office rules are implemented.
export function pendingHour(hour: Hour): ComposedHour {
  return { hour, texts: [], status: 'pending' };
}
