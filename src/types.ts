export type Office = 'modern' | 'roman1960';
export type Language = 'la' | 'es' | 'bilingual';
export type HourId = 'invitatory' | 'readings' | 'lauds' | 'prime' | 'terce' | 'sext' | 'none' | 'vespers' | 'compline';
export interface Hour { id: HourId; label: string; latin: string }
export type TextKind = 'psalm' | 'antiphon' | 'hymn' | 'reading' | 'prayer';
export interface LiturgicalText { id: string; kind: TextKind; title: string; la?: string; es?: string; source: string; rights: string; verified: boolean }
export interface ComposedHour { hour: Hour; texts: LiturgicalText[]; status: 'pending' }
export interface OfficeEngine { hours: Hour[]; compose: (date: string, hour: HourId) => ComposedHour }
