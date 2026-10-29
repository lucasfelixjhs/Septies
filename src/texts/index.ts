import library from './library.json';
import type { LiturgicalText } from '../types';
export function getVerifiedTexts(): LiturgicalText[] {
  return (library.texts as LiturgicalText[]).filter(text => text.verified && text.source && text.rights);
}
