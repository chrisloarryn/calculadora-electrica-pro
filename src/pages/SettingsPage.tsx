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
