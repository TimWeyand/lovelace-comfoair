import { LovelaceCardConfig } from 'custom-card-helpers';

export interface ComfoairCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  language?: 'auto' | 'en' | 'pl' | 'de';
  entity: string;
  tempSensor1?: string; // Außentemperatur
  tempSensor2?: string; // Fortlufttemperatur
  tempSensor3?: string; // Rücklufttemperatur
  tempSensor4?: string; // Zulufttemperatur
  filterstatus?: string;
  bypass_valve?: string;
  summer_mode?: string;
  preheat?: string;
  fan_speed_supply?: string;
  fan_speed_exhaust?: string;
  return_air_level?: string;
  supply_air_level?: string;
  animation?: 'animated' | 'static';
  animation_speed_source?: 'fixed' | 'level'; // festes Tempo oder nach Luftmengen-%
  animation_speed?: number; // Prozent (10–200), nur bei animation_speed_source = 'fixed'
  color_scale?: 'auto' | 'fixed';
  temp_min?: number; // °C, untere Grenze der festen Farbskala (Default -10)
  temp_max?: number; // °C, obere Grenze der festen Farbskala (Default 30)
  show_legend?: boolean; // kleine Temperatur-Farbskala unten einblenden
}

/** Schlank typisiertes hass-Objekt, ausreichend für reine Helper (testbar). */
export interface HassEntityLike {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface DetectHass {
  states: Record<string, HassEntityLike>;
  entities?: Record<string, { device_id?: string | null }>;
}
