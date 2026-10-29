export type Office = 'modern' | 'roman1960';
export type Language = 'la' | 'es' | 'bilingual';
export type HourId = 'invitatory' | 'readings' | 'lauds' | 'prime' | 'terce' | 'sext' | 'none' | 'vespers' | 'compline';
export interface Hour { id: HourId; label: string; latin: string }
export type TextKind = 'psalm' | 'antiphon' | 'hymn' | 'reading' | 'prayer' | 'canticle';
export interface TextRun { text: string; rubric: boolean }
export interface LiturgicalText {
  id: string; kind: TextKind; title: string; la?: string; es?: string;
  latinLines?: TextRun[][];
  source: string; rights: string; verified: boolean;
  sourceCell?: string;
  sourceRefs?: { file: string; section: string }[];
}
export interface ComposedHour {
  hour: Hour; texts: LiturgicalText[]; status: 'pending' | 'prototype';
  notice?: string; celebration?: string;
}
export interface OfficeEngine { hours: Hour[]; compose: (date: string, hour: HourId) => ComposedHour }
