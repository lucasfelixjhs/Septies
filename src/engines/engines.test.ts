import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modern } from './modern';
import { roman1960 } from './roman1960';
import { getVerifiedTexts } from '../texts';
test('office-specific navigation and naming', () => {
  assert.equal(modern.hours.length, 8);
  assert.equal(roman1960.hours.length, 9);
  assert.equal(modern.hours.some(h => h.id === 'prime'), false);
  assert.equal(roman1960.hours.some(h => h.id === 'prime'), true);
  assert.equal(modern.hours.find(h => h.id === 'readings')?.label, 'Oficio de Lecturas');
  assert.equal(roman1960.hours.find(h => h.id === 'readings')?.label, 'Maitines');
  assert.throws(() => modern.compose('2026-10-29', 'prime'));
});
test('all available hours explicitly await authentic composition', () => {
  for (const engine of [modern, roman1960]) for (const hour of engine.hours) {
    const result = engine.compose('2026-10-29', hour.id);
    assert.equal(result.hour.id, hour.id);
    assert.equal(result.status, 'pending');
    assert.deepEqual(result.texts, []);
  }
  assert.deepEqual(getVerifiedTexts(), []);
});
