export const CARD_VERSION = '0.16.3';
export const CARD_TYPE = 'mqttcomfoair-card';
export const EDITOR_TYPE = 'mqttcomfoair-card-editor';

export type FanMode = 'off' | 'low' | 'medium' | 'high';

export interface FanButton {
  mode: FanMode;
  icon: string;
}

export const FAN_BUTTONS: FanButton[] = [
  { mode: 'off', icon: 'mdi:fan-off' },
  { mode: 'low', icon: 'mdi:fan-speed-1' },
  { mode: 'medium', icon: 'mdi:fan-speed-2' },
  { mode: 'high', icon: 'mdi:fan-speed-3' },
];

/** Config-Schlüssel, die auf HA-Entities zeigen (eine Quelle für shouldUpdate + Editor-Reset). */
export const ENTITY_FIELDS: readonly string[] = [
  'entity', 'tempSensor1', 'tempSensor2', 'tempSensor3', 'tempSensor4',
  'filterstatus', 'bypass_valve', 'summer_mode', 'preheat',
  'fan_speed_supply', 'fan_speed_exhaust', 'return_air_level', 'supply_air_level',
];
