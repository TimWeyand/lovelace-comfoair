import { describe, expect, it } from 'vitest';
import { fanModeLabel, localize, resolveLanguage, STRINGS } from '../src/localize';
import { statusChip } from '../src/helpers';

describe('language selection', () => {
  it('selects Dutch and translates the card and editor', () => {
    expect(resolveLanguage('auto', 'nl-NL')).toBe('nl');
    expect(localize('outdoor', 'nl')).toBe('Buitenlucht');
    expect(localize('animation', 'nl')).toBe('Animatie');
  });
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
  it('uses the same translated fan labels for the card and status chips', () => {
    expect(fanModeLabel('HIGH', 'nl')).toBe('Stand 3');
    expect(statusChip('fan', undefined, 'HIGH', 'nl').sub).toBe('Stand 3');
    expect(fanModeLabel('off', 'pl')).toBe('Wyłączony');
    expect(fanModeLabel('custom_mode', 'en')).toBe('custom_mode');
  });
  it('preserves Norwegian messages and falls back to English for new keys', () => {
    expect(localize('advanced', 'nb-NO')).toBe('Avansert / manuell tilordning');
    expect(localize('recovery', 'nb-NO')).toBe('Heat recovery');
  });
  for (const language of ['pl', 'de', 'nl']) {
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
