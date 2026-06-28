import { describe, it, expect } from 'vitest';
import {
  getState, displayState, numState, isFanModeActive,
  clampTemperature, derivePrefix, rampColor, tempDomain, tempColor,
  recoveryPct, statusChip, autodetectEntities, animSpeedFactor,
} from '../src/helpers';
import { DetectHass, HassEntityLike } from '../src/types';

const hass: DetectHass = {
  states: {
    'sensor.t': { entity_id: 'sensor.t', state: '23.0', attributes: {} },
    'sensor.u': { entity_id: 'sensor.u', state: 'unavailable', attributes: {} },
  },
};

describe('getState/displayState/numState', () => {
  it('returns the state object or undefined, never throws', () => {
    expect(getState(hass, 'sensor.t')?.state).toBe('23.0');
    expect(getState(hass, 'sensor.missing')).toBeUndefined();
    expect(getState(undefined, 'sensor.t')).toBeUndefined();
  });
  it('falls back to em-dash for missing/unavailable', () => {
    expect(displayState(hass, 'sensor.t')).toBe('23.0');
    expect(displayState(hass, 'sensor.u')).toBe('—');
    expect(displayState(hass, 'sensor.missing')).toBe('—');
  });
  it('parses numbers, undefined when not parseable', () => {
    expect(numState(hass, 'sensor.t')).toBe(23);
    expect(numState(hass, 'sensor.u')).toBeUndefined();
    expect(numState(hass, 'sensor.missing')).toBeUndefined();
  });
});

describe('fan helpers', () => {
  it('maps mode names case-insensitively', () => {
    expect(isFanModeActive('low', 'low')).toBe(true);
    expect(isFanModeActive('LOW', 'low')).toBe(true);
    expect(isFanModeActive('off', 'low')).toBe(false);
    expect(isFanModeActive(undefined, 'off')).toBe(false);
  });
});

describe('clampTemperature', () => {
  it('steps and clamps within min/max', () => {
    expect(clampTemperature(17, 1, 15, 27, 1)).toBe(18);
    expect(clampTemperature(27, 1, 15, 27, 1)).toBe(27);
    expect(clampTemperature(15, 0.5, 15, 27, -1)).toBe(15);
    expect(clampTemperature(20.25, 0.5, 15, 27, 1)).toBe(20.8);
  });
});

describe('derivePrefix', () => {
  it('strips _climate suffix', () => {
    expect(derivePrefix('climate.ca350_climate')).toBe('ca350');
    expect(derivePrefix('climate.comfoair_climate')).toBe('comfoair');
  });
});

describe('rampColor / tempDomain / tempColor', () => {
  it('rampColor returns an oklch string across the range', () => {
    expect(rampColor(0)).toMatch(/^oklch\(/);
    expect(rampColor(1)).toMatch(/^oklch\(/);
    expect(rampColor(-5)).toBe(rampColor(0)); // clamped
    expect(rampColor(9)).toBe(rampColor(1));  // clamped
  });
  it('tempDomain fixed returns the fixed range (default -10..30, or explicit)', () => {
    expect(tempDomain([1, 2, 3], 'fixed')).toEqual([-10, 30]);
    expect(tempDomain([1, 2, 3], 'fixed', -15, 35)).toEqual([-15, 35]);
  });
  it('tempDomain auto stretches over current values with padding', () => {
    const [mn, mx] = tempDomain([8, 12, 22, 20], 'auto');
    expect(mn).toBeCloseTo(8 - (22 - 8) * 0.12, 5);
    expect(mx).toBeCloseTo(22 + (22 - 8) * 0.12, 5);
  });
  it('tempDomain auto widens a too-narrow range to >= 4°', () => {
    const [mn, mx] = tempDomain([20, 20.5, 21], 'auto');
    expect(mx - mn).toBeGreaterThanOrEqual(4);
  });
  it('tempDomain auto falls back when no values', () => {
    expect(tempDomain([undefined, NaN], 'auto', 12, 28)).toEqual([12, 28]);
  });
  it('tempColor maps a value and handles undefined', () => {
    expect(tempColor(20, [12, 28])).toMatch(/^oklch\(/);
    expect(tempColor(undefined, [12, 28])).toContain('var(');
  });
});

describe('recoveryPct', () => {
  it('computes efficiency from outside/extract/supply', () => {
    expect(recoveryPct(0, 20, 16)).toBe(80);
    expect(recoveryPct(10, 22, 22)).toBe(100);
  });
  it('returns null when not meaningfully computable', () => {
    expect(recoveryPct(20, 20.3, 21)).toBeNull(); // denominator too small
    expect(recoveryPct(undefined, 20, 16)).toBeNull();
    expect(recoveryPct(18, 22, 17)).toBeNull(); // negative ratio (cooling) → hidden
  });
});

describe('animSpeedFactor', () => {
  it('fixed mode maps percent to factor (clamped)', () => {
    expect(animSpeedFactor('fixed', 100, undefined)).toBe(1);
    expect(animSpeedFactor('fixed', 50, undefined)).toBe(0.5);
    expect(animSpeedFactor('fixed', 200, undefined)).toBe(2);
    expect(animSpeedFactor('fixed', undefined, undefined)).toBe(0.5); // default 50%
  });
  it('level mode maps air-level percent to factor (50% → 1)', () => {
    expect(animSpeedFactor('level', undefined, 50)).toBe(1);
    expect(animSpeedFactor('level', undefined, 100)).toBe(2);
    expect(animSpeedFactor('level', undefined, 25)).toBe(0.5);
    expect(animSpeedFactor('level', undefined, 0)).toBe(0.2); // clamped
    expect(animSpeedFactor('level', undefined, undefined)).toBe(1); // fallback 50%
  });
});

describe('statusChip', () => {
  it('fan reflects mode label and active state', () => {
    expect(statusChip('fan', undefined, 'medium', 'de')).toEqual(
      { icon: 'mdi:fan', label: 'Lüfter', sub: 'Stufe 2', active: true, color: '#03a9f4' },
    );
    expect(statusChip('fan', undefined, 'off', 'de').active).toBe(false);
    expect(statusChip('fan', undefined, 'off', 'de').sub).toBe('Aus');
    expect(statusChip('fan', undefined, 'HIGH', 'de').sub).toBe('Stufe 3'); // case-insensitiv
  });
  it('filter alerts when on', () => {
    expect(statusChip('filter', 'on', undefined, 'de')).toMatchObject({ sub: 'Wechseln', active: true });
    expect(statusChip('filter', 'off', undefined, 'de')).toMatchObject({ sub: 'OK', active: false });
  });
  it('bypass/preheat reflect on/off', () => {
    expect(statusChip('bypass', 'on', undefined, 'de')).toMatchObject({ icon: 'mdi:valve', sub: 'Offen', active: true });
    expect(statusChip('preheat', 'off', undefined, 'de')).toMatchObject({ sub: 'Aus', active: false });
  });
  it('season shows sun/Sommer or snowflake/Winter', () => {
    expect(statusChip('season', 'on', undefined, 'de')).toMatchObject({ icon: 'mdi:weather-sunny', label: 'Sommer' });
    expect(statusChip('season', 'off', undefined, 'de')).toMatchObject({ icon: 'mdi:snowflake', label: 'Winter' });
  });
});

// --- Auto-Erkennung gegen reale comfoair2mqtt-Entities (live aus HA, 2026-06-01) ---

function st(id: string, state: string, attrs: Record<string, unknown>): [string, HassEntityLike] {
  return [id, { entity_id: id, state, attributes: attrs }];
}

const realStates: Record<string, HassEntityLike> = Object.fromEntries([
  st('climate.ca350_climate', 'fan_only', { fan_mode: 'low', temperature: 17 }),
  st('sensor.ca350_outside_temperature', '23.0', { device_class: 'temperature', unit_of_measurement: '°C', friendly_name: 'CA350 Outside temperature' }),
  st('sensor.ca350_exhaust_temperature', '25.5', { device_class: 'temperature', unit_of_measurement: '°C', friendly_name: 'CA350 Exhaust temperature' }),
  st('sensor.ca350_return_temperature', '26.0', { device_class: 'temperature', unit_of_measurement: '°C', friendly_name: 'CA350 Return temperature' }),
  st('sensor.ca350_supply_temperature', '24.5', { device_class: 'temperature', unit_of_measurement: '°C', friendly_name: 'CA350 Supply temperature' }),
  st('sensor.ca350_supply_fan_speed', '1440', { unit_of_measurement: 'rpm', friendly_name: 'CA350 Supply fan speed' }),
  st('sensor.ca350_exhaust_fan_speed', '1291', { unit_of_measurement: 'rpm', friendly_name: 'CA350 Exhaust fan speed' }),
  st('sensor.ca350_return_air_level', '40', { unit_of_measurement: '%', friendly_name: 'CA350 Return air level' }),
  st('sensor.ca350_supply_air_level', '40', { unit_of_measurement: '%', friendly_name: 'CA350 Supply air level' }),
  st('sensor.ca350_bypass_valve', '100', { unit_of_measurement: '%', friendly_name: 'CA350 Bypass valve' }),
  st('binary_sensor.ca350_filter_status', 'off', { device_class: 'problem', friendly_name: 'CA350 Filter status' }),
  st('binary_sensor.ca350_bypass_valve', 'on', { device_class: 'opening', friendly_name: 'CA350 Bypass valve' }),
  st('binary_sensor.ca350_summer_mode', 'on', { friendly_name: 'CA350 Summer mode' }),
  st('binary_sensor.ca350_preheating_status', 'off', { device_class: 'heat', friendly_name: 'CA350 Preheating status' }),
  st('sensor.unrelated_power', '5', { unit_of_measurement: 'W', friendly_name: 'Fridge power' }),
]);

const deviceRegistry: Record<string, { device_id: string }> = Object.fromEntries(
  Object.keys(realStates)
    .filter((id) => id !== 'sensor.unrelated_power')
    .map((id) => [id, { device_id: 'dev_comfoair' }]),
);
deviceRegistry['sensor.unrelated_power'] = { device_id: 'dev_other' };

const EXPECTED = {
  tempSensor1: 'sensor.ca350_outside_temperature',
  tempSensor2: 'sensor.ca350_exhaust_temperature',
  tempSensor3: 'sensor.ca350_return_temperature',
  tempSensor4: 'sensor.ca350_supply_temperature',
  filterstatus: 'binary_sensor.ca350_filter_status',
  bypass_valve: 'binary_sensor.ca350_bypass_valve',
  summer_mode: 'binary_sensor.ca350_summer_mode',
  preheat: 'binary_sensor.ca350_preheating_status',
  fan_speed_supply: 'sensor.ca350_supply_fan_speed',
  fan_speed_exhaust: 'sensor.ca350_exhaust_fan_speed',
  return_air_level: 'sensor.ca350_return_air_level',
  supply_air_level: 'sensor.ca350_supply_air_level',
};

describe('autodetectEntities', () => {
  it('maps all fields via device registry (real comfoair2mqtt names)', () => {
    const result = autodetectEntities(
      { states: realStates, entities: deviceRegistry },
      'climate.ca350_climate',
    );
    expect(result).toEqual(EXPECTED);
  });

  it('does not match entities from a different device', () => {
    const result = autodetectEntities(
      { states: realStates, entities: deviceRegistry },
      'climate.ca350_climate',
    );
    expect(Object.values(result)).not.toContain('sensor.unrelated_power');
  });

  it('falls back to prefix scan when no entity registry is present', () => {
    const result = autodetectEntities({ states: realStates }, 'climate.ca350_climate');
    expect(result).toEqual(EXPECTED);
  });

  it('does not confuse temperature vs air-level for return/supply', () => {
    const result = autodetectEntities({ states: realStates }, 'climate.ca350_climate');
    expect(result.tempSensor3).toBe('sensor.ca350_return_temperature');
    expect(result.return_air_level).toBe('sensor.ca350_return_air_level');
    expect(result.tempSensor4).toBe('sensor.ca350_supply_temperature');
    expect(result.supply_air_level).toBe('sensor.ca350_supply_air_level');
  });

  it('returns empty object for missing input', () => {
    expect(autodetectEntities({ states: {} }, '')).toEqual({});
  });

  it('handles outdoor/extract naming variants (prefix fallback)', () => {
    const states: Record<string, HassEntityLike> = Object.fromEntries([
      st('climate.x_climate', 'fan_only', {}),
      st('sensor.x_outdoor_temperature', '5', { device_class: 'temperature' }),
      st('sensor.x_extract_temperature', '22', { device_class: 'temperature' }),
      st('sensor.x_extract_air_level', '40', { unit_of_measurement: '%' }),
    ]);
    const r = autodetectEntities({ states }, 'climate.x_climate');
    expect(r.tempSensor1).toBe('sensor.x_outdoor_temperature');
    expect(r.tempSensor3).toBe('sensor.x_extract_temperature');
    expect(r.return_air_level).toBe('sensor.x_extract_air_level');
  });

  it('prefers the canonical (shortest) sensor when several match a keyword', () => {
    const states: Record<string, HassEntityLike> = Object.fromEntries([
      st('climate.x_climate', 'fan_only', {}),
      st('sensor.x_supply_after_ewt_temperature', '19', { device_class: 'temperature' }),
      st('sensor.x_supply_temperature', '24', { device_class: 'temperature' }),
    ]);
    const r = autodetectEntities({ states }, 'climate.x_climate');
    expect(r.tempSensor4).toBe('sensor.x_supply_temperature');
  });
});
