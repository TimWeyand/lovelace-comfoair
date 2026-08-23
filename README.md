# Home Assistant Lovelace MQTT Comfoair Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=TimWeyand&repository=lovelace-comfoair&category=plugin)

Lovelace card for visualizing and controlling a **ComfoAir CA350/550** ventilation system,
connected through **[hacomfoairmqtt](https://github.com/adorobis/hacomfoairmqtt)** (adorobis) or the
related **comfoair2mqtt** add-on (MQTT autodiscovery).

<img src="https://raw.githubusercontent.com/TimWeyand/lovelace-comfoair/master/images/static-dark.png" alt="MQTT Comfoair Card" width="440">

## Features

- **One-click configuration:** select only the climate entity; all sensors are detected automatically.
- Crossed airflows (outside/exhaust/return/supply) with a **temperature-based color scale** (OKLCH, blue to dark red).
- **Heat recovery percentage** calculated live from the temperatures.
- Setpoint control (− / +) and fan levels (off / 1 / 2 / 3) with the active level highlighted.
- Status bar (fan, filter, bypass, preheating, summer/winter), labeled and color-coded by state.
- **Static or animated** (airflows + rotating fans), with a fixed speed **or** speed linked to the airflow level.
- Optional **temperature legend**.
- Click a value (temperature / speed / airflow) to open its **history** in the Home Assistant More Info dialog.

## Gallery

| | Static (default) | Animated (`animation: animated`) |
|---|---|---|
| **Light** | <img src="https://raw.githubusercontent.com/TimWeyand/lovelace-comfoair/master/images/static-light.png" width="320" alt="Static light"> | <img src="https://raw.githubusercontent.com/TimWeyand/lovelace-comfoair/master/images/animated-light.gif" width="320" alt="Animated light"> |
| **Dark** | <img src="https://raw.githubusercontent.com/TimWeyand/lovelace-comfoair/master/images/static-dark.png" width="320" alt="Static dark"> | <img src="https://raw.githubusercontent.com/TimWeyand/lovelace-comfoair/master/images/animated-dark.gif" width="320" alt="Animated dark"> |

## Installation

### HACS
**Fastest option:** click the **“Open in HACS” button** above. It opens the repository in HACS;
choose **Download** there.

If HACS does not find the repository directly, add it once as a custom repository:
1. HACS → top right **⋮** → **Custom repositories**
2. Repository `https://github.com/TimWeyand/lovelace-comfoair`, category **Dashboard** → **Add**
3. **MQTT Comfoair Card** → **Download**

### Manual
Download `comfoair-card.js` from the **[latest release](../../releases/latest)** (or from the repository),
copy it to `config/www/lovelace-comfoair/comfoair-card.js`, and register it as a resource:
```yaml
url: /local/lovelace-comfoair/comfoair-card.js
type: module
```

## Configuration

1. Dashboard → Add card → **MQTT Comfoair Card**.
2. **Select only the climate entity** (for example, `climate.ca350_climate`); the remaining entities
   are detected automatically. They can be overridden under **Advanced / manual mapping**.

<img src="https://raw.githubusercontent.com/TimWeyand/lovelace-comfoair/master/images/settings.png" alt="Card editor with all options" width="460">

### Options

| Option | Values | Default | Description |
|--------|-------|---------|--------------|
| `entity` | climate entity | – | **Required.** The ComfoAir climate entity. |
| `name` | Text | “Residential ventilation” | Title in the card header. |
| `animation` | `static` / `animated` | `static` | Animated airflows + rotating fans. |
| `animation_speed_source` | `fixed` / `level` | `fixed` | Fixed speed (%) or proportional to the airflow level (supply/return air level). |
| `animation_speed` | `10`–`200` (%) | `50` | Fixed speed (only with `fixed`). 100% = base speed. |
| `color_scale` | `auto` / `fixed` | `auto` | `auto` spans the current four temperatures; `fixed` uses `temp_min`/`temp_max`. |
| `temp_min` | °C | `-10` | Lower limit of the fixed scale. |
| `temp_max` | °C | `30` | Upper limit of the fixed scale. |
| `show_legend` | bool | `false` | Show a small temperature color scale at the bottom. |
| `tempSensor1..4`, `filterstatus`, `bypass_valve`, `summer_mode`, `preheat`, `fan_speed_supply`, `fan_speed_exhaust`, `return_air_level`, `supply_air_level` | Entity | auto-detected | Can be overridden individually. |

### Performance
By default (`static`), **no** animation runs: no SMIL and no CSS rotation. The card only
re-renders when one of the configured entities changes.

## Backward compatibility
Configurations from earlier versions continue to work **unchanged**; the configuration keys remain the same.
New options are optional. To stay on the previous card, install version (`v0.15.0`) through HACS.

## Development & Release

```bash
npm install
npm run typecheck   # TypeScript (strict)
npm test            # Unit tests (Vitest)
npm run build       # generates comfoair-card.js (built and committed by CI)
```

Releases run automatically: on every push to `master`, the GitHub Action builds and tests the project,
**commits the freshly built `comfoair-card.js` to the repository** (for HACS resolution), and creates
a release with the bundle attached. The release version comes from `version` in `package.json` (tag
`vX.Y.Z`). If the tag already exists, the **patch** version is incremented automatically. To make a
minor or major version change, update `version` in `package.json`. The bundle does not need to be built
or committed manually.

## Notes
- Expects the entities published by hacomfoairmqtt (`…_outside/supply/return/exhaust_temperature`,
  `…_supply/return_air_level`, `…_supply/exhaust_fan_speed`, `binary_sensor.…_filter_status`/`_bypass_valve`/
  `_summer_mode`/`_preheating_status`). The device prefix (`ca350`, …) does not matter; detection primarily
  uses the Home Assistant device.
- **Requirement:** the `climate` entity must be published by the bridge. Enable `HAEnableAutoDiscoveryClimate`
  in the bridge configuration (`config.ini`). It provides the fan levels (off/low/medium/high) and setpoint
  (15–27 °C).
- Also applies to compatible devices using the same bridge (StorkAir WHR930, Wernig G90-380, Paul Santos 370 DC).
