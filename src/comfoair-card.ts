import { LitElement, html, svg, css, PropertyValues, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard, LovelaceCardEditor, fireEvent } from 'custom-card-helpers';
import './comfoair-card-editor';
import { ComfoairCardConfig, DetectHass } from './types';
import { CARD_TYPE, EDITOR_TYPE, CARD_VERSION, FAN_BUTTONS, FAN_MODE_LABELS, ENTITY_FIELDS } from './const';
import {
  getState, displayState, numState, isFanModeActive, clampTemperature, autodetectEntities,
  tempDomain, tempColor, rampColor, recoveryPct, statusChip, animSpeedFactor,
} from './helpers';
import { localize, localizeFormat } from './localize';

console.info(
  `%c MQTT-COMFOAIR-CARD %c ${CARD_VERSION} `,
  'color:orange;font-weight:bold;background:black',
  'color:white;font-weight:bold;background:dimgray',
);

(window as unknown as { customCards: unknown[] }).customCards =
  (window as unknown as { customCards: unknown[] }).customCards || [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: CARD_TYPE,
  name: 'MQTT Comfoair Card',
  preview: false,
  description: 'Control a CA350/550 ventilation unit (hacomfoairmqtt) via MQTT.',
});

// Strömungspfade (SVG-userSpace 0 0 440 132) — als Konstanten, damit das sichtbare <path>
// und die SMIL-Animation denselben Pfad nutzen (animateMotion path=, ohne Fragment-Referenz).
const SUPPLY_PATH = 'M6,19 H120 L320,113 H434';
const EXHAUST_PATH = 'M434,19 H320 L120,113 H6';
const FLOW_BASE = 3.0;
const SPIN_BASE = 1.6;

@customElement(CARD_TYPE)
export class MqttComfoairCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: ComfoairCardConfig;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement(EDITOR_TYPE) as LovelaceCardEditor;
  }

  public static getStubConfig(hass?: HomeAssistant): Partial<ComfoairCardConfig> {
    if (!hass) return { entity: '' };
    const climate = Object.keys(hass.states).find(
      (id) => id.startsWith('climate.') && /comfo|ca\d{3}|wtw/i.test(id),
    );
    if (!climate) return { entity: '' };
    return {
      entity: climate,
      animation: 'static',
      animation_speed_source: 'fixed',
      animation_speed: 50,
      color_scale: 'auto',
      temp_min: -10,
      temp_max: 30,
      ...autodetectEntities(hass as unknown as DetectHass, climate),
    };
  }

  public setConfig(config: ComfoairCardConfig): void {
    if (!config) throw new Error(localize('invalid_config', this.hass?.language));
    this._config = config;
  }

  public getCardSize(): number {
    return 5;
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.has('_config')) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    if (!old || !this._config) return true;
    const cfg = this._config as unknown as Record<string, string | undefined>;
    const ids = ENTITY_FIELDS.map((f) => cfg[f]).filter((x): x is string => !!x);
    return ids.some((id) => old.states[id] !== this.hass.states[id]);
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    const cfg = this._config;
    const h = this.hass as unknown as DetectHass;
    const climate = getState(h, cfg.entity);
    if (!climate) {
      return html`<ha-card>
        <hui-warning>${localize('no_entity', this.hass.language)}: ${cfg.entity || '—'}</hui-warning>
      </ha-card>`;
    }

    const fanMode = climate.attributes.fan_mode as string | undefined;
    const fanModeLc = fanMode?.toLowerCase();
    const setpoint = climate.attributes.temperature as number | undefined;
    const animated = cfg.animation === 'animated';
    const scale: 'auto' | 'fixed' = cfg.color_scale === 'fixed' ? 'fixed' : 'auto';
    const running = !!fanModeLc && fanModeLc !== 'off';

    // Temperaturen + Farben einmal berechnen (TL=außen, BL=fortluft, TR=abluft, BR=zuluft)
    const t1 = numState(h, cfg.tempSensor1);
    const t2 = numState(h, cfg.tempSensor2);
    const t3 = numState(h, cfg.tempSensor3);
    const t4 = numState(h, cfg.tempSensor4);
    const tmin = Number.isFinite(Number(cfg.temp_min)) ? Number(cfg.temp_min) : -10;
    const tmax = Number.isFinite(Number(cfg.temp_max)) ? Number(cfg.temp_max) : 30;
    const dom = tempDomain([t1, t2, t3, t4], scale, tmin, tmax);
    const [c1, c2, c3, c4] = [t1, t2, t3, t4].map((v) => tempColor(v, dom));

    // Animationstempo nur im animierten Modus berechnen (static = keine Last)
    let facSup = 1;
    let facExh = 1;
    if (animated) {
      const src: 'fixed' | 'level' = cfg.animation_speed_source === 'level' ? 'level' : 'fixed';
      facSup = animSpeedFactorFor(h, cfg, src, cfg.supply_air_level);
      facExh = animSpeedFactorFor(h, cfg, src, cfg.return_air_level);
    }
    const durSup = (FLOW_BASE / facSup).toFixed(1);
    const durExh = (FLOW_BASE / facExh).toFixed(1);

    const bypassState = getState(h, cfg.bypass_valve)?.state;
    const recov = bypassState === 'on' ? null : recoveryPct(t1, t3, t4);

    const chips = [
      statusChip('fan', undefined, fanMode, this.hass.language),
      statusChip('filter', getState(h, cfg.filterstatus)?.state, undefined, this.hass.language),
      statusChip('bypass', bypassState, undefined, this.hass.language),
      statusChip('preheat', getState(h, cfg.preheat)?.state, undefined, this.hass.language),
      statusChip('season', getState(h, cfg.summer_mode)?.state, undefined, this.hass.language),
    ];

    const fmt = (s: string): string => s.replace('.', ',');
    const tempBadge = (color: string, entityId?: string): TemplateResult => {
      const stl = `--fg:${color};--bd:color-mix(in srgb, ${color} 45%, transparent);--bg:color-mix(in srgb, ${color} 14%, transparent)`;
      return html`<div class="tempbadge ${entityId ? 'clickable' : ''}" style=${stl} @click=${(): void => this._moreInfo(entityId)} title=${entityId ? localize('history', this.hass.language) : ''}><span class="v">${fmt(displayState(h, entityId))}</span><span class="u">°C</span></div>`;
    };
    const subRpm = (entityId: string | undefined, factor: number): TemplateResult => {
      const r = numState(h, entityId) ?? 0;
      const spin = animated && running && r > 0;
      const dur = SPIN_BASE / factor;
      return html`<div class="subt ${entityId ? 'clickable' : ''}" @click=${(): void => this._moreInfo(entityId)}>
        <ha-icon class=${spin ? 'spinico spin' : 'spinico'} style=${spin ? `animation-duration:${dur.toFixed(2)}s` : ''} icon="mdi:fan"></ha-icon>
        <span>${displayState(h, entityId)}</span>&nbsp;rpm
      </div>`;
    };
    const subPct = (entityId?: string): TemplateResult => html`<div class="subt ${entityId ? 'clickable' : ''}" @click=${(): void => this._moreInfo(entityId)}>
        <ha-icon icon="mdi:gauge"></ha-icon><span>${displayState(h, entityId)}</span>&nbsp;%
      </div>`;
    const lbl = (icon: string, text: string, rev = false): TemplateResult =>
      html`<div class="lbl ${rev ? 'rev' : ''}"><ha-icon icon=${icon}></ha-icon>${text}</div>`;

    const hub = html`
      <div class="hub corehub">
        <div class="setpc">
          <button @click=${(): void => this._stepTemp(-1)} aria-label=${localize('colder', this.hass.language)}>−</button>
          <div class="val">${setpoint != null ? fmt(String(setpoint)) : '—'}<small>°C</small></div>
          <button @click=${(): void => this._stepTemp(1)} aria-label=${localize('warmer', this.hass.language)}>+</button>
        </div>
        <div class="fanrow">
          ${FAN_BUTTONS.map(
            (b) => html`<button
              class=${isFanModeActive(fanMode, b.mode) ? 'on' : ''}
              title=${b.mode}
              @click=${(): void => this._setFan(b.mode)}
            ><ha-icon icon=${b.icon}></ha-icon></button>`,
          )}
        </div>
      </div>`;

    return html`
      <ha-card class=${animated ? 'animated' : ''}>
        <div class="hd">
          <div class="ic"><ha-icon icon="mdi:hvac"></ha-icon></div>
          <div>
            <div class="ttl">${cfg.name || localize('default_name', this.hass.language)}</div>
            <div class="st"><span class="dot ${running ? 'live' : ''}"></span><span>${fanModeLc ? (fanModeLc === 'off' ? localize('fan_off', this.hass.language) : localizeFormat('fan_level', this.hass.language, { level: FAN_MODE_LABELS[fanModeLc]?.replace('Stufe ', '') ?? fanMode })) : '—'}</span></div>
          </div>
          <div class="grow"></div>
          <div class="recov">
            ${recov != null ? html`<b>${recov}%</b><span>${localize('recovery', this.hass.language)}</span>` : ''}
          </div>
        </div>

        <div class="lanes">
          <div class="trow top">
            <div class="tcell l">${subRpm(cfg.fan_speed_supply, facSup)}${tempBadge(c1, cfg.tempSensor1)}${lbl('mdi:tree-outline', localize('outside_air', this.hass.language))}</div>
            <div></div>
            <div class="tcell r">${subPct(cfg.return_air_level)}${tempBadge(c3, cfg.tempSensor3)}${lbl('mdi:home-thermometer-outline', localize('return_air', this.hass.language), true)}</div>
          </div>

          <div class="flowband">
            <svg class="airsvg" viewBox="0 0 440 132" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <linearGradient id="gSupply" x1="6" y1="19" x2="434" y2="113" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color=${c1}></stop><stop offset="100%" stop-color=${c4}></stop>
                </linearGradient>
                <linearGradient id="gExhaust" x1="434" y1="19" x2="6" y2="113" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color=${c3}></stop><stop offset="100%" stop-color=${c2}></stop>
                </linearGradient>
                <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4.5"></feGaussianBlur></filter>
              </defs>
              <path class="airrib" d=${SUPPLY_PATH} stroke="url(#gSupply)"></path>
              <path class="airrib" d=${EXHAUST_PATH} stroke="url(#gExhaust)"></path>
              <polygon class="airarrow" points="86,11 86,27 102,19"></polygon>
              <polygon class="airarrow" points="354,11 354,27 338,19"></polygon>
              <polygon class="airarrow" points="102,105 102,121 86,113"></polygon>
              <polygon class="airarrow" points="338,105 338,121 354,113"></polygon>
              ${animated && running ? this._flowGroup(durSup, durExh) : ''}
            </svg>
            ${hub}
          </div>

          <div class="trow bot">
            <div class="tcell l">${lbl('mdi:export', localize('exhaust_air', this.hass.language))}${tempBadge(c2, cfg.tempSensor2)}${subRpm(cfg.fan_speed_exhaust, facExh)}</div>
            <div></div>
            <div class="tcell r">${lbl('mdi:import', localize('supply_air', this.hass.language), true)}${tempBadge(c4, cfg.tempSensor4)}${subPct(cfg.supply_air_level)}</div>
          </div>
        </div>

        ${cfg.show_legend ? html`<div class="legend">
          <span class="mn">${Math.round(dom[0])}°C</span>
          <div class="bar" style="background:linear-gradient(90deg, ${rampColor(0)}, ${rampColor(0.25)}, ${rampColor(0.5)}, ${rampColor(0.75)}, ${rampColor(1)})"></div>
          <span class="mx">${Math.round(dom[1])}°C</span>
        </div>` : ''}

        <div class="status">
          ${chips.map(
            (c) => html`<div class="chip ${c.active ? 'on' : ''}" style="--c:${c.color}">
              <ha-icon icon=${c.icon}></ha-icon>
              <span class="nm">${c.label}</span>
              ${c.sub ? html`<span class="vs">${c.sub}</span>` : ''}
            </div>`,
          )}
        </div>
      </ha-card>
    `;
  }

  private _flowGroup(durS: string, durE: string): TemplateResult {
    const halfS = (Number(durS) / 2).toFixed(1);
    const halfE = (Number(durE) / 2).toFixed(1);
    return svg`<g class="flow-hi" filter="url(#soft)">
      <circle r="11" fill="#fff"><animateMotion path=${SUPPLY_PATH} dur="${durS}s" begin="0s" repeatCount="indefinite"></animateMotion></circle>
      <circle r="11" fill="#fff"><animateMotion path=${SUPPLY_PATH} dur="${durS}s" begin="-${halfS}s" repeatCount="indefinite"></animateMotion></circle>
      <circle r="11" fill="#fff"><animateMotion path=${EXHAUST_PATH} dur="${durE}s" begin="0s" repeatCount="indefinite"></animateMotion></circle>
      <circle r="11" fill="#fff"><animateMotion path=${EXHAUST_PATH} dur="${durE}s" begin="-${halfE}s" repeatCount="indefinite"></animateMotion></circle>
    </g>`;
  }

  private _moreInfo(entityId?: string): void {
    if (entityId) fireEvent(this, 'hass-more-info', { entityId });
  }

  private _setFan(mode: string): void {
    if (!this._config.entity) return;
    this.hass.callService('climate', 'set_fan_mode', {
      entity_id: this._config.entity, fan_mode: mode,
    });
  }

  private _stepTemp(direction: 1 | -1): void {
    const climate = getState(this.hass as unknown as DetectHass, this._config.entity);
    const current = Number(climate?.attributes.temperature);
    if (!Number.isFinite(current)) return; // kein Setpoint / nicht-numerisch → kein Service-Call
    const stepRaw = Number(climate!.attributes.target_temp_step);
    const step = Number.isFinite(stepRaw) && stepRaw > 0 ? stepRaw : 0.5;
    const min = Number(climate!.attributes.min_temp);
    const max = Number(climate!.attributes.max_temp);
    const next = clampTemperature(
      current, step,
      Number.isFinite(min) ? min : -Infinity,
      Number.isFinite(max) ? max : Infinity,
      direction,
    );
    this.hass.callService('climate', 'set_temperature', {
      entity_id: this._config.entity, temperature: next,
    });
  }

  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        padding: 14px 16px 12px;
        --arrow: rgba(255, 255, 255, 0.92);
      }
      .hd { display: flex; align-items: center; gap: 11px; padding: 2px 2px 12px; }
      .hd .ic {
        width: 34px; height: 34px; border-radius: 10px; flex: none;
        display: flex; align-items: center; justify-content: center;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
        color: var(--primary-color);
      }
      .hd .ttl { font-size: 15.5px; font-weight: 600; letter-spacing: -0.01em; }
      .hd .st { font-size: 12px; color: var(--secondary-text-color); margin-top: 1px; display: flex; align-items: center; gap: 6px; }
      .hd .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--disabled-text-color, #777); }
      .hd .dot.live { background: #36c46b; }
      .hd .grow { flex: 1; }
      .hd .recov { text-align: right; line-height: 1.05; min-height: 30px; }
      .hd .recov b { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; }
      .hd .recov span { display: block; font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--secondary-text-color); margin-top: 1px; }

      .tempbadge {
        display: inline-flex; align-items: baseline; justify-content: center; gap: 1px;
        width: 88px; padding: 3px 4px; border-radius: 10px; line-height: 1;
        font-variant-numeric: tabular-nums;
        background: var(--bg); color: var(--fg); border: 1px solid var(--bd);
        box-shadow: 0 2px 10px -4px rgba(0, 0, 0, 0.5);
        transition: background 0.5s, color 0.5s, border-color 0.5s;
      }
      .tempbadge .v { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
      .tempbadge .u { font-size: 12px; font-weight: 600; opacity: 0.7; }
      .lbl { font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 600; display: flex; align-items: center; gap: 5px; }
      .lbl.rev { flex-direction: row-reverse; }
      .lbl ha-icon { --mdc-icon-size: 14px; }
      .subt { font-size: 11px; color: var(--secondary-text-color); display: flex; align-items: center; gap: 4px; font-variant-numeric: tabular-nums; }
      .subt ha-icon { --mdc-icon-size: 15px; opacity: 0.85; }
      .clickable { cursor: pointer; }
      .tempbadge.clickable:hover { filter: brightness(1.08); }
      .subt.clickable:hover { color: var(--primary-text-color); }

      .corehub {
        background: var(--card-background-color);
        border: 1px solid var(--divider-color); border-radius: 15px; padding: 6px 9px;
        box-shadow: 0 6px 22px -6px rgba(0, 0, 0, 0.55);
        display: flex; flex-direction: column; align-items: center; gap: 5px;
      }
      .setpc { display: flex; align-items: center; gap: 6px; }
      .setpc button {
        width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--divider-color);
        background: transparent; color: var(--primary-text-color); font-size: 15px; cursor: pointer;
        display: flex; align-items: center; justify-content: center; transition: 0.15s;
      }
      .setpc button:hover { border-color: var(--primary-color); color: var(--primary-color); }
      .setpc .val { min-width: 56px; text-align: center; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
      .setpc .val small { font-size: 11px; font-weight: 600; color: var(--secondary-text-color); }
      .fanrow { display: flex; gap: 2px; background: rgba(127, 127, 127, 0.14); border-radius: 11px; padding: 3px; }
      .fanrow button {
        width: 32px; height: 26px; border: 0; background: transparent; border-radius: 8px;
        color: var(--secondary-text-color); cursor: pointer; transition: 0.15s;
        display: flex; align-items: center; justify-content: center;
      }
      .fanrow button:hover { color: var(--primary-text-color); }
      .fanrow button.on { background: var(--primary-color); color: #fff; box-shadow: 0 2px 8px -2px var(--primary-color); }
      .fanrow ha-icon { --mdc-icon-size: 18px; }

      .lanes { display: flex; flex-direction: column; gap: 3px; --hub-w: 188px; }
      .trow { display: grid; grid-template-columns: 1fr var(--hub-w) 1fr; gap: 10px; padding: 0 6px; }
      .trow.top { align-items: end; }
      .trow.bot { align-items: start; }
      .tcell { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .tcell.l { align-items: flex-start; }
      .tcell.r { align-items: flex-end; text-align: right; }

      .flowband { position: relative; width: 100%; aspect-ratio: 440 / 132; }
      .airsvg { position: absolute; inset: 0; width: 100%; height: 100%; }
      .airrib { fill: none; stroke-width: 38; stroke-linejoin: round; stroke-linecap: round; }
      .airarrow { fill: var(--arrow); filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.28)); }
      .flow-hi { opacity: 0.5; }
      .hub { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 4; }

      .spinico.spin { animation-name: spin; animation-timing-function: linear; animation-iteration-count: infinite; transform-origin: center; }
      @keyframes spin { to { transform: rotate(360deg); } }

      .legend { display: flex; align-items: center; gap: 9px; padding: 8px 4px 2px; }
      .legend .bar { flex: 1; height: 7px; border-radius: 4px; }
      .legend .mn, .legend .mx { font-size: 11px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; font-weight: 600; min-width: 44px; }
      .legend .mx { text-align: right; }

      .status { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--divider-color); }
      .chip { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 7px 2px 4px; border-radius: 11px; color: var(--secondary-text-color); transition: 0.25s; }
      .chip ha-icon { --mdc-icon-size: 23px; transition: 0.25s; }
      .chip .nm { font-size: 10.5px; font-weight: 600; }
      .chip .vs { font-size: 9px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--secondary-text-color); opacity: 0.65; }
      .chip.on { color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); }
      .chip.on .vs { color: var(--c); opacity: 0.9; }
      .chip.on ha-icon { filter: drop-shadow(0 0 7px var(--c)); }
    `;
  }
}

/** Tempo-Faktor anhand der Config (fest %) oder der Luftmengen-% des gegebenen Entities. */
function animSpeedFactorFor(
  h: DetectHass, cfg: ComfoairCardConfig, src: 'fixed' | 'level', levelEntity?: string,
): number {
  return animSpeedFactor(src, cfg.animation_speed, numState(h, levelEntity));
}

declare global {
  interface HTMLElementTagNameMap {
    'mqttcomfoair-card': MqttComfoairCard;
  }
}
