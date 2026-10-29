import type { OfficeEngine } from '../types';
import { pendingHour } from '../composition';
export const roman1960: OfficeEngine = {
  hours: [
    { id: 'invitatory', label: 'Invitatorio', latin: 'Invitatorium' },
    { id: 'readings', label: 'Maitines', latin: 'Matutinum' },
    { id: 'lauds', label: 'Laudes', latin: 'Laudes' },
    { id: 'prime', label: 'Prima', latin: 'Prima' },
    { id: 'terce', label: 'Tercia', latin: 'Tertia' },
    { id: 'sext', label: 'Sexta', latin: 'Sexta' },
    { id: 'none', label: 'Nona', latin: 'Nona' },
    { id: 'vespers', label: 'Vísperas', latin: 'Vesperae' },
    { id: 'compline', label: 'Completas', latin: 'Completorium' },
  ],
  compose(_date, id) {
    const hour = this.hours.find(hour => hour.id === id);
    if (!hour) throw new Error('Hora no disponible en el Breviario de 1960');
    return pendingHour(hour);
  },
};
