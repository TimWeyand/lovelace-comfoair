import { describe, expect, it } from 'vitest';
import { localize, resolveLanguage, STRINGS } from '../src/localize';
import { statusChip } from '../src/helpers';

describe('language selection', () => {
  it('uses Home Assistant language in automatic mode', () => {
    expect(resolveLanguage(undefined, 'pl-PL')).toBe('pl');
    expect(resolveLanguage('auto', 'en-US')).toBe('en');
    expect(resolveLanguage('auto', 'de-DE')).toBe('de');
  });
  it('allows an explicit override and normalizes regional codes', () => {
    expect(resolveLanguage('en', 'pl')).toBe('en');
    expect(resolveLanguage('PL_pl')).toBe('pl');
    expect(resolveLanguage('"pl-PL"')).toBe('pl');
  });
  it('falls back to English for unsupported languages and missing keys', () => {
    expect(resolveLanguage('fr-FR')).toBe('en');
    expect(localize('recovery', 'fr')).toBe('Heat recovery');
    expect(localize('unknown_key', 'pl')).toBe('unknown_key');
  });
});

describe('complete translations', () => {
  for (const language of ['pl', 'de']) {
    it(`${language} covers every English key`, () => {
      expect(Object.keys(STRINGS[language]).sort()).toEqual(Object.keys(STRINGS.en).sort());
      expect(Object.values(STRINGS[language]).every(value => value.trim().length > 0)).toBe(true);
    });
  }
  it('translates status labels without changing fan service values', () => {
    expect(statusChip('fan', undefined, 'high', 'pl')).toMatchObject({label: 'Wentylator', sub: 'Bieg 3', active: true});
    expect(statusChip('fan', undefined, 'low', 'en').sub).toBe('Speed 1');
    expect(statusChip('bypass', 'off', undefined, 'pl').sub).toBe('Zamknięty');
    expect(statusChip('filter', 'on', undefined, 'en').sub).toBe('Replace');
    expect(statusChip('season', 'on', undefined, 'pl').label).toBe('Lato');
  });
});
