import { useEffect, useState } from 'react';
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
        <div className="settings-card settings-card--form">
          <span>
            <strong>Perfil normativo inicial</strong>
            <small>
              Chile usa el perfil RIC de desarrollo. Argentina es una base de compatibilidad sin
              reglas normativas activas.
            </small>
          </span>
          <label>
            País
            <select
              value={preferences.country}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  country: event.target.value as UiPreferences['country'],
                }))
              }
            >
              <option value="CL">Chile · CL-SEC-RIC</option>
              <option value="AR">Argentina · perfil base</option>
            </select>
          </label>
        </div>

        <div className="settings-card settings-card--form">
          <span>
            <strong>Valores iniciales de circuitos</strong>
            <small>
              Se aplican al crear circuitos nuevos; no sobrescriben circuitos guardados.
            </small>
          </span>
          <label>
            Tensión (V)
            <input
              min={1}
              type="number"
              value={preferences.defaultVoltageV}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultVoltageV: Number(event.target.value),
                }))
              }
            />
          </label>
          <label>
            Método
            <select
              value={preferences.defaultInstallationMethod}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultInstallationMethod: event.target
                    .value as UiPreferences['defaultInstallationMethod'],
                }))
              }
            >
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C">C</option>
              <option value="E">E</option>
            </select>
          </label>
          <label>
            Aislación
            <select
              value={preferences.defaultInsulationType}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultInsulationType: event.target
                    .value as UiPreferences['defaultInsulationType'],
                }))
              }
            >
              <option value="PVC">PVC</option>
              <option value="XLPE">XLPE</option>
            </select>
          </label>
          <label>
            Temperatura (°C)
            <input
              type="number"
              value={preferences.defaultAmbientTemperatureC}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultAmbientTemperatureC: Number(event.target.value),
                }))
              }
            />
          </label>
          <label>
            Agrupamiento
            <input
              min={1}
              type="number"
              value={preferences.defaultGroupedCircuits}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultGroupedCircuits: Number(event.target.value),
                }))
              }
            />
          </label>
          <label>
            Caída máxima (%)
            <input
              min={0.1}
              step="0.1"
              type="number"
              value={preferences.defaultMaximumVoltageDropPercent}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultMaximumVoltageDropPercent: Number(event.target.value),
                }))
              }
            />
          </label>
          <label>
            Régimen
            <select
              value={preferences.defaultLoadDuty}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultLoadDuty: event.target.value as UiPreferences['defaultLoadDuty'],
                }))
              }
            >
              <option value="standard">Estándar</option>
              <option value="continuous">Continua</option>
              <option value="high-starting-current">Alto arranque</option>
            </select>
          </label>
        </div>

        <label className="settings-card">
          <input
            checked={preferences.showPrototypeNotice}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                showPrototypeNotice: event.target.checked,
              }))
            }
            type="checkbox"
          />
          <span>
            <strong>Mostrar aviso de prototipo</strong>
            <small>Ayuda a recordar que el motor normativo aún no está habilitado.</small>
          </span>
        </label>

        <label className="settings-card">
          <input
            checked={preferences.rememberActiveProject}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                rememberActiveProject: event.target.checked,
              }))
            }
            type="checkbox"
          />
          <span>
            <strong>Recordar proyecto activo</strong>
            <small>Vuelve al último proyecto abierto cuando reingresas a la app.</small>
          </span>
        </label>
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
