import type { OfficeEngine } from '../types';
import { pendingHour } from '../composition';
export const modern: OfficeEngine = {
  hours: [
    { id: 'invitatory', label: 'Invitatorio', latin: 'Invitatorium' },
    { id: 'readings', label: 'Oficio de Lecturas', latin: 'Officium lectionis' },
    { id: 'lauds', label: 'Laudes', latin: 'Laudes' },
    { id: 'terce', label: 'Tercia', latin: 'Tertia' },
    { id: 'sext', label: 'Sexta', latin: 'Sexta' },
    { id: 'none', label: 'Nona', latin: 'Nona' },
    { id: 'vespers', label: 'Vísperas', latin: 'Vesperae' },
    { id: 'compline', label: 'Completas', latin: 'Completorium' },
  ],
  compose(_date, id) {
    const hour = this.hours.find(hour => hour.id === id);
    if (!hour) throw new Error('Hora no disponible en la Liturgia de las Horas');
    return pendingHour(hour);
  },
};
