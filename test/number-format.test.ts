import { describe, it, expect, vi, afterEach } from 'vitest';
import { decimalSeparator, formatDecimal, LEGACY_DECIMAL_SEPARATOR } from '../src/helpers';

describe('decimalSeparator', () => {
  it('follows hass.locale.language for "language" (and when number_format is unset)', () => {
    expect(decimalSeparator({ language: 'de', number_format: 'language' })).toBe(',');
    expect(decimalSeparator({ language: 'en', number_format: 'language' })).toBe('.');
    expect(decimalSeparator({ language: 'nl' })).toBe(',');
    expect(decimalSeparator({ language: 'fr' })).toBe(',');
    expect(decimalSeparator({ language: 'pt-BR' })).toBe(',');
    expect(decimalSeparator({ language: 'de-CH' })).toBe('.');
    expect(decimalSeparator({ language: 'en-IN' })).toBe('.');
  });
  it('prefers hass.locale.language over hass.language when they disagree', () => {
    expect(decimalSeparator({ language: 'en' }, 'de')).toBe('.');
    expect(decimalSeparator({ language: 'de' }, 'en')).toBe(',');
    expect(decimalSeparator(undefined, 'en-GB')).toBe('.');
    expect(decimalSeparator(undefined, 'de')).toBe(',');
  });
  it('maps the fixed formats like the HA frontend, regardless of language', () => {
    expect(decimalSeparator({ language: 'de', number_format: 'comma_decimal' })).toBe('.');
    expect(decimalSeparator({ language: 'en', number_format: 'decimal_comma' })).toBe(',');
    expect(decimalSeparator({ language: 'en', number_format: 'space_comma' })).toBe(',');
    expect(decimalSeparator({ language: 'de', number_format: 'quote_decimal' })).toBe('.');
    expect(decimalSeparator({ language: 'de', number_format: 'none' })).toBe('.');
  });
  // Scoped spies (restored after every test) instead of reassigning the global.
  const fakeNumberFormat = (dec: string) =>
    function () {
      return { formatToParts: () => [{ type: 'integer', value: '1' }, { type: 'decimal', value: dec }, { type: 'fraction', value: '5' }] };
    } as unknown as typeof Intl.NumberFormat;
  afterEach(() => { vi.restoreAllMocks(); });

  it('uses the runtime locale for "system" (no locale passed to Intl)', () => {
    const spy = vi.spyOn(Intl, 'NumberFormat').mockImplementation(fakeNumberFormat('.'));
    expect(decimalSeparator({ language: 'de', number_format: 'system' })).toBe('.');
    expect(spy).toHaveBeenCalledWith(undefined);
    spy.mockImplementation(fakeNumberFormat(','));
    expect(decimalSeparator({ language: 'en', number_format: 'system' })).toBe(',');
  });
  it('passes the HA locale tag to Intl for fixed formats', () => {
    const spy = vi.spyOn(Intl, 'NumberFormat');
    decimalSeparator({ language: 'en', number_format: 'quote_decimal' });
    expect(spy).toHaveBeenCalledWith('de-CH');
  });
  it('keeps the previous comma without any locale info, with a bad tag, or if Intl throws', () => {
    expect(LEGACY_DECIMAL_SEPARATOR).toBe(',');
    expect(decimalSeparator()).toBe(',');
    expect(decimalSeparator({ language: 'not a tag!' })).toBe(',');
    vi.spyOn(Intl, 'NumberFormat').mockImplementation(function () { throw new Error('no Intl'); } as unknown as typeof Intl.NumberFormat);
    expect(decimalSeparator({ language: 'en' })).toBe(',');
  });
});

describe('formatDecimal', () => {
  it('swaps only the decimal point of decimals', () => {
    expect(formatDecimal('19.5', ',')).toBe('19,5');
    expect(formatDecimal('-3.5', ',')).toBe('-3,5');
    expect(formatDecimal('+0.5', ',')).toBe('+0,5');
    expect(formatDecimal('.5', ',')).toBe(',5');
    expect(formatDecimal('19.5', '.')).toBe('19.5');
  });
  it('leaves integers, placeholders, exponents and text alone', () => {
    expect(formatDecimal('23', ',')).toBe('23');
    expect(formatDecimal('1291', ',')).toBe('1291');
    expect(formatDecimal('—', ',')).toBe('—');
    expect(formatDecimal('on', ',')).toBe('on');
    expect(formatDecimal('1e-5', ',')).toBe('1e-5');
  });
});
