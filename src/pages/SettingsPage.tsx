import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { Button } from '../components/atoms/Button';
import { Eyebrow } from '../components/atoms/Eyebrow';
import { Icon } from '../components/atoms/Icon';
import { loadUiPreferences, saveUiPreferences, type UiPreferences } from '../lib/preferences';

export function SettingsPage() {
  const [preferences, setPreferences] = useState<UiPreferences>(() => loadUiPreferences());

  useEffect(() => {
    saveUiPreferences(preferences);
  }, [preferences]);

  return (
    <section className="settings-page" aria-labelledby="settings-title">
      <div className="settings-page__hero">
        <span className="settings-page__icon">
          <Icon name="settings" size={28} />
        </span>
        <Eyebrow>Preferencias locales</Eyebrow>
        <h1 id="settings-title">Ajustes</h1>
        <p>Configura el comportamiento visible del prototipo sin enviar nada al servidor.</p>
      </div>

      <div className="settings-grid">
        <Paper className="settings-card settings-card--form" elevation={1}>
          <span>
            <strong>Perfil normativo inicial</strong>
            <small>
              Chile usa el perfil RIC de desarrollo. Argentina es una base de compatibilidad sin
              reglas normativas activas.
            </small>
          </span>
          <TextField
            label="País"
            select
            size="small"
            value={preferences.country}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                country: event.target.value as UiPreferences['country'],
              }))
            }
          >
            <MenuItem value="CL">Chile · CL-SEC-RIC</MenuItem>
            <MenuItem value="AR">Argentina · perfil base</MenuItem>
          </TextField>
        </Paper>

        <Paper className="settings-card settings-card--form" elevation={1}>
          <span>
            <strong>Valores iniciales de circuitos</strong>
            <small>
              Se aplican al crear circuitos nuevos; no sobrescriben circuitos guardados.
            </small>
          </span>
          <TextField
            label="Tensión (V)"
            size="small"
            type="number"
            value={preferences.defaultVoltageV}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                defaultVoltageV: Number(event.target.value),
              }))
            }
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TextField
            label="Método"
            select
            size="small"
            value={preferences.defaultInstallationMethod}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                defaultInstallationMethod: event.target
                  .value as UiPreferences['defaultInstallationMethod'],
              }))
            }
          >
            <MenuItem value="B1">B1</MenuItem>
            <MenuItem value="B2">B2</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="E">E</MenuItem>
          </TextField>
          <TextField
            label="Aislación"
            select
            size="small"
            value={preferences.defaultInsulationType}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                defaultInsulationType: event.target.value as UiPreferences['defaultInsulationType'],
              }))
            }
          >
            <MenuItem value="PVC">PVC</MenuItem>
            <MenuItem value="XLPE">XLPE</MenuItem>
          </TextField>
          <TextField
            label="Temperatura (°C)"
            size="small"
            type="number"
            value={preferences.defaultAmbientTemperatureC}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                defaultAmbientTemperatureC: Number(event.target.value),
              }))
            }
          />
          <TextField
            label="Agrupamiento"
            size="small"
            type="number"
            value={preferences.defaultGroupedCircuits}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                defaultGroupedCircuits: Number(event.target.value),
              }))
            }
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TextField
            label="Caída máxima (%)"
            size="small"
            type="number"
            value={preferences.defaultMaximumVoltageDropPercent}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                defaultMaximumVoltageDropPercent: Number(event.target.value),
              }))
            }
            slotProps={{ htmlInput: { min: 0.1, step: 0.1 } }}
          />
          <TextField
            label="Régimen"
            select
            size="small"
            value={preferences.defaultLoadDuty}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                defaultLoadDuty: event.target.value as UiPreferences['defaultLoadDuty'],
              }))
            }
          >
            <MenuItem value="standard">Estándar</MenuItem>
            <MenuItem value="continuous">Continua</MenuItem>
            <MenuItem value="high-starting-current">Alto arranque</MenuItem>
          </TextField>
        </Paper>

        <Paper className="settings-card" elevation={1}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.showPrototypeNotice}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    showPrototypeNotice: event.target.checked,
                  }))
                }
              />
            }
            label={
              <span>
                <strong>Mostrar aviso de prototipo</strong>
                <small>Ayuda a recordar que el motor normativo aún no está habilitado.</small>
              </span>
            }
          />
        </Paper>

        <Paper className="settings-card" elevation={1}>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.rememberActiveProject}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    rememberActiveProject: event.target.checked,
                  }))
                }
              />
            }
            label={
              <span>
                <strong>Recordar proyecto activo</strong>
                <small>Vuelve al último proyecto abierto cuando reingresas a la app.</small>
              </span>
            }
          />
        </Paper>
      </div>

      <div className="settings-actions">
        <Button
          icon="settings"
          onClick={() =>
            setPreferences({
              showPrototypeNotice: true,
              rememberActiveProject: true,
              country: 'CL',
              defaultVoltageV: 220,
              defaultInstallationMethod: 'C',
              defaultInsulationType: 'PVC',
              defaultAmbientTemperatureC: 30,
              defaultGroupedCircuits: 1,
              defaultMaximumVoltageDropPercent: 3,
              defaultLoadDuty: 'standard',
            })
          }
          type="button"
        >
          Restaurar valores
        </Button>
      </div>
    </section>
  );
}
