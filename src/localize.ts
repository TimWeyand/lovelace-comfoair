type Dict = Record<string, string>;

const STRINGS: Record<string, Dict> = {
  en: {
    invalid_config: 'Invalid configuration',
    no_entity: 'No climate entity defined',
    detected: 'entities detected',
    advanced: 'Advanced / manual mapping',
    default_name: 'Residential ventilation', history: 'Show history', colder: 'Colder', warmer: 'Warmer', recovery: 'Recovery',
    outside_air: 'Outside air', exhaust_air: 'Exhaust air', return_air: 'Return air', supply_air: 'Supply air',
    fan: 'Fan', fan_off: 'Off', fan_level: 'Level {level}', filter: 'Filter', filter_change: 'Change', ok: 'OK',
    bypass: 'Bypass', open: 'Open', closed: 'Closed', preheating: 'Preheating', active: 'Active', summer: 'Summer', winter: 'Winter',
    climate_entity: 'CA350/550 climate entity (required)', animation: 'Animation', animated: 'Animated (airflow + fans)', static: 'Static',
    speed_source: 'Speed source', fixed_speed: 'Fixed speed (%)', air_level: 'By air level (supply/return %)', color_scale: 'Color scale',
    auto_current: 'Auto (current values)', fixed_manual: 'Fixed (manual range)', fixed_min: 'Fixed scale - min (°C)', fixed_max: 'Fixed scale - max (°C)',
    show_scale: 'Show temperature scale', optional_name: 'Name (optional)', outside_temperature: 'Outside temperature',
    exhaust_temperature: 'Exhaust temperature', return_temperature: 'Return temperature', supply_temperature: 'Supply temperature',
    filter_status: 'Filter status', bypass_valve: 'Bypass valve', summer_mode: 'Summer mode', preheat_register: 'Preheating coil',
    supply_fan_speed: 'Supply fan speed', exhaust_fan_speed: 'Exhaust fan speed', return_level: 'Return air level', supply_level: 'Supply air level',
  },
  nl: {
    invalid_config: 'Ongeldige configuratie', no_entity: 'Geen climate-entiteit ingesteld', detected: 'entiteiten gevonden', advanced: 'Geavanceerd / handmatig toewijzen',
    default_name: 'Woonhuisventilatie', history: 'Geschiedenis tonen', colder: 'Kouder', warmer: 'Warmer', recovery: 'Terugwinning',
    outside_air: 'Buitenlucht', exhaust_air: 'Afvoerlucht', return_air: 'Retourlucht', supply_air: 'Toevoerlucht', fan: 'Ventilator', fan_off: 'Uit', fan_level: 'Stand {level}',
    filter: 'Filter', filter_change: 'Vervangen', ok: 'OK', bypass: 'Bypass', open: 'Open', closed: 'Dicht', preheating: 'Voorverwarming', active: 'Actief', summer: 'Zomer', winter: 'Winter',
    climate_entity: 'CA350/550 climate-entiteit (verplicht)', animation: 'Animatie', animated: 'Geanimeerd (luchtstromen + ventilatoren)', static: 'Statisch',
    speed_source: 'Snelheidsbron', fixed_speed: 'Vaste snelheid (%)', air_level: 'Op basis van luchtdebiet (toevoer/retour %)', color_scale: 'Kleurenschaal',
    auto_current: 'Auto (huidige waarden)', fixed_manual: 'Vast (handmatig bereik)', fixed_min: 'Vaste schaal - min (°C)', fixed_max: 'Vaste schaal - max (°C)', show_scale: 'Temperatuurschaal tonen', optional_name: 'Naam (optioneel)',
    outside_temperature: 'Buitentemperatuur', exhaust_temperature: 'Afvoertemperatuur', return_temperature: 'Retourtemperatuur', supply_temperature: 'Toevoertemperatuur', filter_status: 'Filterstatus', bypass_valve: 'Bypassklep', summer_mode: 'Zomermodus', preheat_register: 'Voorverwarmingsregister', supply_fan_speed: 'Toevoerventilatorsnelheid', exhaust_fan_speed: 'Afvoerventilatorsnelheid', return_level: 'Retourluchtstand', supply_level: 'Toevoerluchtstand',
  },
  de: {
    invalid_config: 'Ungültige Konfiguration',
    no_entity: 'Keine climate-Entity ausgewählt',
    detected: 'Entities erkannt',
    advanced: 'Erweitert / manuelle Zuordnung',
    default_name: 'Wohnraumlüftung', history: 'Verlauf anzeigen', colder: 'Kälter', warmer: 'Wärmer', recovery: 'Rückgewinnung',
    outside_air: 'Außenluft', exhaust_air: 'Fortluft', return_air: 'Abluft', supply_air: 'Zuluft', fan: 'Lüfter', fan_off: 'Aus', fan_level: 'Stufe {level}',
    filter: 'Filter', filter_change: 'Wechseln', ok: 'OK', bypass: 'Bypass', open: 'Offen', closed: 'Zu', preheating: 'Vorheizen', active: 'Aktiv', summer: 'Sommer', winter: 'Winter',
    climate_entity: 'CA350/550 Climate-Entity (Pflicht)', animation: 'Animation', animated: 'Animiert (Luftströme + Lüfter)', static: 'Statisch', speed_source: 'Tempo-Quelle', fixed_speed: 'Festes Tempo (%)', air_level: 'Nach Luftmenge (Supply/Return %)',
    color_scale: 'Farbskala', auto_current: 'Auto (aktuelle Werte)', fixed_manual: 'Fest (manueller Bereich)', fixed_min: 'Feste Skala - Min (°C)', fixed_max: 'Feste Skala - Max (°C)', show_scale: 'Temperaturskala einblenden', optional_name: 'Name (optional)',
    outside_temperature: 'Außentemperatur', exhaust_temperature: 'Fortlufttemperatur', return_temperature: 'Rücklufttemperatur', supply_temperature: 'Zulufttemperatur', filter_status: 'Filterstatus', bypass_valve: 'Bypass-Ventil', summer_mode: 'Sommermodus', preheat_register: 'Vorheizregister', supply_fan_speed: 'Lüfterdrehzahl Zuluft', exhaust_fan_speed: 'Lüfterdrehzahl Fortluft', return_level: 'Rückluft-Stufe', supply_level: 'Zuluft-Stufe',
  },
  nb: {
    invalid_config: 'Ikke gyldig konfigurasjon',
    no_entity: 'Ingen climate-enhet valgt',
    detected: 'enheter funnet',
    advanced: 'Avansert / manuell tilordning',
  },
};

export function localize(key: string, lang?: string): string {
  let code = (lang || 'en').replace(/['"]+/g, '').split('-')[0].toLowerCase();
  if (!STRINGS[code]) code = 'en';
  return STRINGS[code][key] ?? STRINGS.en[key] ?? key;
}

export function localizeFormat(key: string, lang: string | undefined, values: Record<string, string>): string {
  return Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, value), localize(key, lang));
}
