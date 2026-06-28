import { ComfoairCardConfig, DetectHass, HassEntityLike } from './types';
import { localize, fanModeLabel } from './localize';

export function getState(
  hass: DetectHass | undefined,
  entityId?: string,
): HassEntityLike | undefined {
  if (!hass || !entityId) return undefined;
  return hass.states ? hass.states[entityId] : undefined;
}

export function displayState(
  hass: DetectHass | undefined,
  entityId?: string,
): string {
  const st = getState(hass, entityId);
  if (!st || st.state === 'unavailable' || st.state === 'unknown' || st.state === '') {
    return '—';
  }
  return st.state;
}

/** Zahl aus einem State; undefined falls nicht parsebar. */
export function numState(hass: DetectHass | undefined, entityId?: string): number | undefined {
  const st = getState(hass, entityId);
  if (!st) return undefined;
  const n = parseFloat(st.state);
  return Number.isNaN(n) ? undefined : n;
}

export function isFanModeActive(fanMode: string | undefined, mode: string): boolean {
  return !!fanMode && fanMode.toLowerCase() === mode.toLowerCase();
}

export function clampTemperature(
  current: number, step: number, min: number, max: number, direction: 1 | -1,
): number {
  const next = Math.round((current + direction * step) * 10) / 10;
  return Math.min(max, Math.max(min, next));
}

export function derivePrefix(climateEntityId: string): string {
  const objectId = climateEntityId.split('.')[1] ?? '';
  return objectId.replace(/_climate$/, '') || objectId;
}

/* ===== Farbskala: perzeptueller Heatmap-Verlauf in OKLCH ===== */

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// [L, C, H] Stops von kalt (blau) nach warm (rot)
const RAMP_STOPS: ReadonlyArray<readonly [number, number, number]> = [
  [0.60, 0.16, 252], // Blau (kalt)
  [0.72, 0.13, 215], // Cyan-Blau
  [0.80, 0.14, 155], // Grün
  [0.82, 0.16, 95],  // Gelb
  [0.66, 0.19, 45],  // Orange
  [0.50, 0.205, 28], // Dunkelrot (heiß)
];

export function rampColor(f: number): string {
  const st = RAMP_STOPS;
  const c = clamp01(f);
  const s = c * (st.length - 1);
  const i = Math.min(st.length - 2, Math.floor(s));
  const t = s - i;
  const L = lerp(st[i][0], st[i + 1][0], t);
  const C = lerp(st[i][1], st[i + 1][1], t);
  const H = lerp(st[i][2], st[i + 1][2], t);
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

/**
 * Liefert den Farb-Wertebereich. `auto` streckt über die aktuellen Werte (kleine
 * Unterschiede werden sichtbar), `fixed` nutzt einen festen Bereich.
 */
export function tempDomain(
  values: Array<number | undefined>,
  mode: 'auto' | 'fixed' = 'auto',
  min = -10,
  max = 30,
): [number, number] {
  if (mode === 'fixed') return [min, max];
  const v = values.filter((x): x is number => x != null && !Number.isNaN(x));
  if (v.length === 0) return [min, max];
  let mn = Math.min(...v);
  let mx = Math.max(...v);
  const SPREAD = 4;
  if (mx - mn < SPREAD) {
    const center = (mx + mn) / 2;
    mn = center - SPREAD / 2;
    mx = center + SPREAD / 2;
  }
  const pad = (mx - mn) * 0.12;
  return [mn - pad, mx + pad];
}

export function tempColor(value: number | undefined, domain: [number, number]): string {
  if (value == null || Number.isNaN(value)) return 'var(--disabled-text-color, #888)';
  const [mn, mx] = domain;
  return rampColor((value - mn) / (mx - mn || 1));
}

/** Wärmerückgewinnungs-Wirkungsgrad in %; null wenn nicht sinnvoll berechenbar. */
export function recoveryPct(
  outside: number | undefined,
  extract: number | undefined,
  supply: number | undefined,
): number | null {
  if (outside == null || extract == null || supply == null) return null;
  const denom = extract - outside;
  if (denom <= 0.5) return null;
  const ratio = (supply - outside) / denom;
  if (ratio <= 0) return null; // negative/keine Rückgewinnung (z. B. Kühlbetrieb) → ausblenden
  return Math.round(Math.min(1, ratio) * 100);
}

/**
 * Tempo-Faktor für die Animation (1 = Basistempo, >1 schneller, <1 langsamer).
 * `fixed`: aus dem Prozent-Regler. `level`: aus der Luftmengen-% (50 % → Faktor 1).
 */
export function animSpeedFactor(
  source: 'fixed' | 'level',
  fixedPct: number | undefined,
  levelPct: number | undefined,
): number {
  if (source === 'level') {
    const lv = levelPct == null || Number.isNaN(levelPct) ? 50 : levelPct;
    return Math.min(2.5, Math.max(0.2, lv / 50));
  }
  const p = fixedPct == null || Number.isNaN(fixedPct) ? 50 : fixedPct;
  return Math.min(2, Math.max(0.1, p / 100));
}

/* ===== Status-Chips ===== */

export type StatusKind = 'fan' | 'filter' | 'bypass' | 'preheat' | 'season';
export interface StatusChip {
  icon: string;
  label: string;
  sub: string;
  active: boolean;
  color: string;
}

export function statusChip(
  kind: StatusKind, raw: string | undefined, fanMode?: string, lang?: string,
): StatusChip {
  const on = raw === 'on';
  switch (kind) {
    case 'fan': {
      const fm = (fanMode ?? 'off').toLowerCase();
      return { icon: 'mdi:fan', label: localize('chip_fan', lang), sub: fanModeLabel(fm, lang), active: fm !== 'off', color: '#03a9f4' };
    }
    case 'filter':
      return { icon: 'mdi:air-filter', label: localize('chip_filter', lang), sub: localize(on ? 'filter_replace' : 'filter_ok', lang), active: on, color: '#f5a623' };
    case 'bypass':
      return { icon: 'mdi:valve', label: localize('chip_bypass', lang), sub: localize(on ? 'bypass_open' : 'bypass_closed', lang), active: on, color: '#36c46b' };
    case 'preheat':
      return { icon: 'mdi:radiator', label: localize('chip_preheating', lang), sub: localize(on ? 'state_active' : 'state_off', lang), active: on, color: '#ff7043' };
    case 'season':
      return on
        ? { icon: 'mdi:weather-sunny', label: localize('chip_summer', lang), sub: '', active: true, color: '#ffb300' }
        : { icon: 'mdi:snowflake', label: localize('chip_winter', lang), sub: '', active: true, color: '#4fc3f7' };
  }
}

/* ===== Auto-Erkennung der Entities ===== */

type Predicate = (st: HassEntityLike) => boolean;

interface DetectRule {
  field: keyof ComfoairCardConfig;
  domain: 'sensor' | 'binary_sensor';
  predicate: Predicate;
  keywords: string[];
}

const isTemp: Predicate = (st) => st.attributes?.device_class === 'temperature';
const isRpm: Predicate = (st) => st.attributes?.unit_of_measurement === 'rpm';
const isPct: Predicate = (st) => st.attributes?.unit_of_measurement === '%';
const anyState: Predicate = () => true;

const DETECT_RULES: DetectRule[] = [
  { field: 'tempSensor1', domain: 'sensor', predicate: isTemp, keywords: ['outside', 'outdoor', 'außen', 'aussen'] },
  { field: 'tempSensor2', domain: 'sensor', predicate: isTemp, keywords: ['exhaust', 'fortluft', 'abluft'] },
  { field: 'tempSensor3', domain: 'sensor', predicate: isTemp, keywords: ['return', 'extract', 'rückluft', 'rueckluft'] },
  { field: 'tempSensor4', domain: 'sensor', predicate: isTemp, keywords: ['supply', 'zuluft'] },
  { field: 'filterstatus', domain: 'binary_sensor', predicate: anyState, keywords: ['filter'] },
  { field: 'bypass_valve', domain: 'binary_sensor', predicate: anyState, keywords: ['bypass'] },
  { field: 'summer_mode', domain: 'binary_sensor', predicate: anyState, keywords: ['summer', 'sommer'] },
  { field: 'preheat', domain: 'binary_sensor', predicate: anyState, keywords: ['preheat', 'preheating', 'vorheiz'] },
  { field: 'fan_speed_supply', domain: 'sensor', predicate: isRpm, keywords: ['supply', 'zuluft'] },
  { field: 'fan_speed_exhaust', domain: 'sensor', predicate: isRpm, keywords: ['exhaust', 'fortluft', 'abluft'] },
  { field: 'return_air_level', domain: 'sensor', predicate: isPct, keywords: ['return', 'extract', 'rückluft', 'rueckluft'] },
  { field: 'supply_air_level', domain: 'sensor', predicate: isPct, keywords: ['supply', 'zuluft'] },
];

export function autodetectEntities(
  hass: DetectHass,
  climateEntityId: string,
): Partial<ComfoairCardConfig> {
  if (!hass || !climateEntityId) return {};

  let candidateIds: string[] = [];
  const deviceId = hass.entities?.[climateEntityId]?.device_id ?? undefined;
  if (deviceId && hass.entities) {
    candidateIds = Object.keys(hass.entities).filter(
      (id) => hass.entities![id].device_id === deviceId,
    );
  }
  if (candidateIds.length === 0) {
    const prefix = derivePrefix(climateEntityId);
    candidateIds = Object.keys(hass.states).filter(
      (id) => id.startsWith(`sensor.${prefix}_`) || id.startsWith(`binary_sensor.${prefix}_`),
    );
  }

  const result: Partial<ComfoairCardConfig> = {};
  for (const rule of DETECT_RULES) {
    const matches = candidateIds.filter((id) => {
      if (!id.startsWith(`${rule.domain}.`)) return false;
      const st = hass.states[id];
      if (!st || !rule.predicate(st)) return false;
      const hay = `${id} ${String(st.attributes?.friendly_name ?? '')}`.toLowerCase();
      return rule.keywords.some((k) => hay.includes(k));
    });
    if (matches.length) {
      // bei mehreren Treffern den kürzesten (kanonischen) Namen wählen,
      // damit z. B. "supply_temperature" gegen "supply_after_ewt_temperature" gewinnt
      const best = matches.reduce((a, b) => (b.length < a.length ? b : a));
      (result as Record<string, string>)[rule.field as string] = best;
    }
  }
  return result;
}
