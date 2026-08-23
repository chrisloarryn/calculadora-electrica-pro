import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/atoms/Button';
import { Eyebrow } from '../components/atoms/Eyebrow';
import { Icon } from '../components/atoms/Icon';
import { loadActiveProjectId, loadUiPreferences } from '../lib/preferences';
import { getAllProjects } from '../lib/storage';
import { loadCircuits, saveCircuits, type CircuitSummary } from '../lib/circuits';
import type { ProjectSummary } from '../components/molecules/ProjectCard';

const defaultCircuit = {
  name: '',
  loadType: 'Iluminación',
  powerW: 1000,
  lengthM: 12,
};

export function CircuitsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [circuits, setCircuits] = useState<CircuitSummary[]>([]);
  const [draft, setDraft] = useState(defaultCircuit);

  useEffect(() => {
    getAllProjects()
      .then((stored) => {
        setProjects(stored);
        const preferences = loadUiPreferences();
        const storedActiveId = preferences.rememberActiveProject ? loadActiveProjectId() : null;
        const nextActiveId =
          stored.find((project) => project.id === storedActiveId)?.id ?? stored[0]?.id ?? null;
        setActiveProjectId(nextActiveId);
        setCircuits(nextActiveId ? loadCircuits(nextActiveId) : []);
      })
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    if (!activeProjectId) {
      return;
    }

    saveCircuits(activeProjectId, circuits);
  }, [activeProjectId, circuits]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId, projects],
  );

  function addCircuit() {
    if (!activeProjectId || !draft.name.trim()) {
      return;
    }

    const nextCircuit: CircuitSummary = {
      id: `circuit-${String(Date.now())}`,
      name: draft.name.trim(),
      loadType: draft.loadType,
      powerW: draft.powerW,
      lengthM: draft.lengthM,
      status: 'borrador',
    };

    setCircuits((current) => [nextCircuit, ...current]);
    setDraft(defaultCircuit);
  }

  function updateCircuit(id: string, patch: Partial<CircuitSummary>) {
    setCircuits((current) =>
      current.map((circuit) => (circuit.id === id ? { ...circuit, ...patch } : circuit)),
    );
  }

  function deleteCircuit(id: string) {
    setCircuits((current) => current.filter((circuit) => circuit.id !== id));
  }

  const totalPower = circuits.reduce((total, circuit) => total + circuit.powerW, 0);

  return (
    <section className="circuits-page" aria-labelledby="circuits-title">
      <div className="circuits-page__hero">
        <span className="circuits-page__icon">
          <Icon name="circuits" size={28} />
        </span>
        <Eyebrow>Editor por proyecto</Eyebrow>
        <h1 id="circuits-title">Circuitos</h1>
        <p>
          Agrega y ajusta circuitos locales para el proyecto activo, sin salir de la sesión actual.
        </p>
      </div>

      <div className="circuits-summary">
        <article className="reports-card">
          <strong>{circuits.length}</strong>
          <span>Circuitos cargados</span>
        </article>
        <article className="reports-card">
          <strong>{totalPower.toLocaleString('es-CL')}</strong>
          <span>Potencia instalada W</span>
        </article>
      </div>

      <div className="circuits-panel">
        <div>
          <h2>{activeProject?.name ?? 'Sin proyecto activo'}</h2>
          <p>
            {activeProject
              ? `Proyecto seleccionado: ${activeProject.location}`
              : 'Abre un proyecto desde la pestaña Proyectos.'}
          </p>
        </div>

        <div className="circuits-form">
          <label>
            Nombre
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Circuito iluminación planta baja"
            />
          </label>
          <label>
            Tipo de carga
            <input
              value={draft.loadType}
              onChange={(event) =>
                setDraft((current) => ({ ...current, loadType: event.target.value }))
              }
              placeholder="Iluminación, enchufes, motor..."
            />
          </label>
          <label>
            Potencia W
            <input
              min={0}
              type="number"
              value={draft.powerW}
              onChange={(event) =>
                setDraft((current) => ({ ...current, powerW: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            Longitud m
            <input
              min={0}
              type="number"
              value={draft.lengthM}
              onChange={(event) =>
                setDraft((current) => ({ ...current, lengthM: Number(event.target.value) }))
              }
            />
          </label>
          <Button icon="plus" onClick={addCircuit} type="button" fullWidth>
            Agregar circuito
          </Button>
        </div>
      </div>

      <div className="circuits-list">
        {circuits.length > 0 ? (
          circuits.map((circuit) => (
            <article className="circuit-card" key={circuit.id}>
              <div className="circuit-card__header">
                <input
                  aria-label="Nombre del circuito"
                  value={circuit.name}
                  onChange={(event) => updateCircuit(circuit.id, { name: event.target.value })}
                />
                <span className={`circuit-pill circuit-pill--${circuit.status}`}>
                  {circuit.status === 'listo' ? 'Listo' : 'Borrador'}
                </span>
              </div>
              <div className="circuit-card__grid">
                <label>
                  Tipo
                  <input
                    value={circuit.loadType}
                    onChange={(event) =>
                      updateCircuit(circuit.id, { loadType: event.target.value })
                    }
                  />
                </label>
                <label>
                  W
                  <input
                    min={0}
                    type="number"
                    value={circuit.powerW}
                    onChange={(event) =>
                      updateCircuit(circuit.id, { powerW: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  m
                  <input
                    min={0}
                    type="number"
                    value={circuit.lengthM}
                    onChange={(event) =>
                      updateCircuit(circuit.id, { lengthM: Number(event.target.value) })
                    }
                  />
                </label>
              </div>
              <div className="circuit-card__actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={() =>
                    updateCircuit(circuit.id, {
                      status: circuit.status === 'listo' ? 'borrador' : 'listo',
                    })
                  }
                >
                  {circuit.status === 'listo' ? 'Marcar borrador' : 'Marcar listo'}
                </button>
                <button
                  className="text-button danger"
                  type="button"
                  onClick={() => deleteCircuit(circuit.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="circuits-empty">
            <Icon name="circuits" size={24} />
            <strong>Sin circuitos</strong>
            <p>Agrega el primer circuito para este proyecto activo.</p>
          </div>
        )}
      </div>
    </section>
  );
}
