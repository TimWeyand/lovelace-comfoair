import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, fireEvent } from 'custom-card-helpers';
import { ComfoairCardConfig, DetectHass } from './types';
import { EDITOR_TYPE, ENTITY_FIELDS } from './const';
import { autodetectEntities } from './helpers';
import { localize } from './localize';

type FormSchema = Record<string, unknown>;

const ADVANCED_SCHEMA: FormSchema[] = [
  { name: 'name', selector: { text: {} } },
  { name: 'tempSensor1', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
  { name: 'tempSensor2', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
  { name: 'tempSensor3', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
  { name: 'tempSensor4', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
  { name: 'filterstatus', selector: { entity: { domain: 'binary_sensor' } } },
  { name: 'bypass_valve', selector: { entity: { domain: 'binary_sensor' } } },
  { name: 'summer_mode', selector: { entity: { domain: 'binary_sensor' } } },
  { name: 'preheat', selector: { entity: { domain: 'binary_sensor' } } },
  { name: 'fan_speed_supply', selector: { entity: { domain: 'sensor' } } },
  { name: 'fan_speed_exhaust', selector: { entity: { domain: 'sensor' } } },
  { name: 'return_air_level', selector: { entity: { domain: 'sensor' } } },
  { name: 'supply_air_level', selector: { entity: { domain: 'sensor' } } },
];

const LABELS: Record<string, string> = {
  entity: 'climate_entity', animation: 'animation', animation_speed_source: 'speed_source', animation_speed: 'fixed_speed',
  color_scale: 'color_scale', temp_min: 'fixed_min', temp_max: 'fixed_max', show_legend: 'show_scale', name: 'optional_name',
  tempSensor1: 'outside_temperature', tempSensor2: 'exhaust_temperature', tempSensor3: 'return_temperature', tempSensor4: 'supply_temperature',
  filterstatus: 'filter_status', bypass_valve: 'bypass_valve', summer_mode: 'summer_mode', preheat: 'preheat_register',
  fan_speed_supply: 'supply_fan_speed', fan_speed_exhaust: 'exhaust_fan_speed', return_air_level: 'return_level', supply_air_level: 'supply_level',
};

@customElement(EDITOR_TYPE)
export class MqttComfoairCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: ComfoairCardConfig;
  @state() private _detectedCount = 0;

  public setConfig(config: ComfoairCardConfig): void {
    this._config = config;
  }

  /** Haupt-Schema; blendet Felder aus, die im aktuellen Modus keine Wirkung haben. */
  private _mainSchema(): FormSchema[] {
    const cfg = this._config;
    const schema: FormSchema[] = [
      { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
      { name: 'animation', selector: { select: { options: [
        { value: 'animated', label: localize('animated', this.hass.language) },
        { value: 'static', label: localize('static', this.hass.language) },
      ] } } },
    ];
    if (cfg.animation === 'animated') {
      schema.push({ name: 'animation_speed_source', selector: { select: { options: [
        { value: 'fixed', label: localize('fixed_speed', this.hass.language) },
        { value: 'level', label: localize('air_level', this.hass.language) },
      ] } } });
      if (cfg.animation_speed_source !== 'level') {
        schema.push({ name: 'animation_speed', selector: { number: { min: 10, max: 200, step: 10, unit_of_measurement: '%', mode: 'slider' } } });
      }
    }
    schema.push({ name: 'color_scale', selector: { select: { options: [
      { value: 'auto', label: localize('auto_current', this.hass.language) },
      { value: 'fixed', label: localize('fixed_manual', this.hass.language) },
    ] } } });
    if (cfg.color_scale === 'fixed') {
      schema.push(
        { name: 'temp_min', selector: { number: { min: -30, max: 20, step: 1, unit_of_measurement: '°C', mode: 'box' } } },
        { name: 'temp_max', selector: { number: { min: 0, max: 50, step: 1, unit_of_measurement: '°C', mode: 'box' } } },
      );
    }
    schema.push({ name: 'show_legend', selector: { boolean: {} } });
    return schema;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._mainSchema()}
          .computeLabel=${this._label}
          @value-changed=${this._mainChanged}
        ></ha-form>
        ${this._detectedCount > 0
          ? html`<div class="hint">✓ ${this._detectedCount} ${localize('detected', this.hass.language)}</div>`
          : ''}
        <ha-expansion-panel outlined>
          <span slot="header">${localize('advanced', this.hass.language)}</span>
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${ADVANCED_SCHEMA}
            .computeLabel=${this._label}
            @value-changed=${this._advancedChanged}
          ></ha-form>
        </ha-expansion-panel>
      </div>
    `;
  }

  private _label = (schemaItem: { name: string }): string =>
    localize(LABELS[schemaItem.name] ?? schemaItem.name, this.hass?.language);

  private _mainChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as Partial<ComfoairCardConfig>;
    const newEntity = value.entity ?? '';
    const entityChanged = !!newEntity && newEntity !== this._config.entity;
    let next: ComfoairCardConfig = { ...this._config, ...value };
    if (entityChanged) {
      // alte auto-erkannte Felder verwerfen, dann für die neue Entity frisch erkennen,
      // damit keine Sensoren des vorherigen Geräts stehen bleiben
      const cleared = next as unknown as Record<string, unknown>;
      for (const f of ENTITY_FIELDS) {
        if (f !== 'entity') delete cleared[f];
      }
      const detected = autodetectEntities(this.hass as unknown as DetectHass, newEntity);
      next = { ...next, ...detected };
      this._detectedCount = Object.keys(detected).length;
    }
    this._emit(next);
  }

  private _advancedChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._emit({ ...this._config, ...(ev.detail.value as Partial<ComfoairCardConfig>) });
  }

  private _emit(config: ComfoairCardConfig): void {
    this._config = config;
    fireEvent(this, 'config-changed', { config });
  }

  static get styles(): CSSResultGroup {
    return css`
      .hint { color: var(--success-color, #43a047); padding: 4px 0 8px; font-size: 0.9em; }
      ha-form { display: block; }
      ha-expansion-panel { margin-top: 8px; }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mqttcomfoair-card-editor': MqttComfoairCardEditor;
  }
}
