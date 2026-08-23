import { useEffect, useMemo, useState } from 'react';
import { calculatePreliminaryCircuit } from '../calculation/circuit';
import { Button } from '../components/atoms/Button';
import { Eyebrow } from '../components/atoms/Eyebrow';
import { Icon } from '../components/atoms/Icon';
import {
  createCircuit,
  createCircuitLoad,
  loadCircuits,
  saveCircuits,
  type CircuitLoad,
  type CircuitSummary,
} from '../lib/circuits';
import { loadActiveProjectId, loadUiPreferences, saveActiveProjectId } from '../lib/preferences';
import { getAllProjects } from '../lib/storage';
import type { ProjectSummary } from '../components/molecules/ProjectCard';

export function CircuitsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [circuits, setCircuits] = useState<CircuitSummary[]>([]);
  const [activeCircuitId, setActiveCircuitId] = useState<string | null>(null);

  useEffect(() => {
    getAllProjects()
      .then((stored) => {
        setProjects(stored);
        const savedId = loadUiPreferences().rememberActiveProject ? loadActiveProjectId() : null;
        const projectId =
          stored.find((project) => project.id === savedId)?.id ?? stored[0]?.id ?? null;
        const storedCircuits = projectId ? loadCircuits(projectId) : [];
        setActiveProjectId(projectId);
        setCircuits(storedCircuits);
        setActiveCircuitId(storedCircuits[0]?.id ?? null);
      })
      .catch(() => setProjects([]));
  }, []);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId, projects],
  );
  const activeCircuit = useMemo(
    () => circuits.find((circuit) => circuit.id === activeCircuitId) ?? null,
    [activeCircuitId, circuits],
  );
  const result = activeCircuit ? calculatePreliminaryCircuit(activeCircuit) : null;

  function persist(nextCircuits: CircuitSummary[]) {
    setCircuits(nextCircuits);
    if (activeProjectId) saveCircuits(activeProjectId, nextCircuits);
  }

  function selectProject(projectId: string) {
    const nextProjectId = projectId || null;
    const nextCircuits = nextProjectId ? loadCircuits(nextProjectId) : [];
    setActiveProjectId(nextProjectId);
    setCircuits(nextCircuits);
    setActiveCircuitId(nextCircuits[0]?.id ?? null);
    if (loadUiPreferences().rememberActiveProject) saveActiveProjectId(nextProjectId);
  }

  function createNewCircuit() {
    if (!activeProjectId) return;
    const circuit = createCircuit();
    const next = [circuit, ...circuits];
    persist(next);
    setActiveCircuitId(circuit.id);
  }

  function updateCircuit(patch: Partial<CircuitSummary>) {
    if (!activeCircuit) return;
    persist(
      circuits.map((circuit) =>
        circuit.id === activeCircuit.id ? { ...circuit, ...patch } : circuit,
      ),
    );
  }

  function updateLoad(loadId: string, patch: Partial<CircuitLoad>) {
    if (!activeCircuit) return;
    updateCircuit({
      loads: activeCircuit.loads.map((load) => (load.id === loadId ? { ...load, ...patch } : load)),
    });
  }

  function addLoad() {
    if (!activeCircuit) return;
    updateCircuit({ loads: [...activeCircuit.loads, createCircuitLoad()] });
  }

  function removeLoad(loadId: string) {
    if (!activeCircuit) return;
    updateCircuit({ loads: activeCircuit.loads.filter((load) => load.id !== loadId) });
  }

  function deleteCircuit() {
    if (!activeCircuit) return;
    const next = circuits.filter((circuit) => circuit.id !== activeCircuit.id);
    persist(next);
    setActiveCircuitId(next[0]?.id ?? null);
  }

  return (
    <section className="circuits-page" aria-labelledby="circuits-title">
      <div className="circuits-page__hero">
        <span className="circuits-page__icon">
          <Icon name="circuits" size={28} />
        </span>
        <Eyebrow>Editor local por proyecto</Eyebrow>
        <h1 id="circuits-title">Circuitos</h1>
        <p>
          Configura las cargas y condiciones del circuito. Los resultados son preliminares hasta
          validar el perfil normativo y la instalación.
        </p>
      </div>

      <div className="circuits-toolbar">
        <label className="circuits-project-selector">
          Proyecto activo
          <select
            aria-label="Proyecto activo"
            value={activeProjectId ?? ''}
            onChange={(event) => selectProject(event.target.value)}
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <Button disabled={!activeProject} icon="plus" onClick={createNewCircuit}>
          Nuevo circuito
        </Button>
      </div>

      {activeProject ? (
        <p className="circuits-project-caption">
          Editando: <strong>{activeProject.name}</strong> · {activeProject.location}
        </p>
      ) : null}

      <div className="circuits-workspace">
        <aside className="circuits-sidebar" aria-label="Circuitos del proyecto">
          <strong>Circuitos ({circuits.length})</strong>
          {circuits.map((circuit) => (
            <button
              className={circuit.id === activeCircuitId ? 'is-active' : ''}
              key={circuit.id}
              onClick={() => setActiveCircuitId(circuit.id)}
              type="button"
            >
              <span>{circuit.name || 'Circuito sin nombre'}</span>
              <small>{circuit.loads.length} cargas</small>
            </button>
          ))}
          {circuits.length === 0 ? <p>Agrega un circuito para comenzar.</p> : null}
        </aside>

        {activeCircuit ? (
          <div className="circuits-editor">
            <section className="circuits-panel">
              <div className="circuits-panel__header">
                <h2>Parámetros del circuito</h2>
                <button className="text-button danger" onClick={deleteCircuit} type="button">
                  Eliminar
                </button>
              </div>
              <div className="circuits-form">
                <label>
                  Nombre
                  <input
                    value={activeCircuit.name}
                    onChange={(event) => updateCircuit({ name: event.target.value })}
                    placeholder="Ej. iluminación planta baja"
                  />
                </label>
                <label>
                  Sistema
                  <select
                    value={activeCircuit.system}
                    onChange={(event) =>
                      updateCircuit({ system: event.target.value as CircuitSummary['system'] })
                    }
                  >
                    <option value="single-phase">Monofásico</option>
                    <option value="three-phase">Trifásico</option>
                  </select>
                </label>
                <label>
                  Voltaje (V)
                  <input
                    min={1}
                    type="number"
                    value={activeCircuit.voltageV}
                    onChange={(event) => updateCircuit({ voltageV: Number(event.target.value) })}
                  />
                </label>
                <label>
                  Demanda
                  <input
                    max={1}
                    min={0.1}
                    step="0.05"
                    type="number"
                    value={activeCircuit.demandFactor}
                    onChange={(event) =>
                      updateCircuit({ demandFactor: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  Distancia (m)
                  <input
                    min={0}
                    type="number"
                    value={activeCircuit.lengthM}
                    onChange={(event) => updateCircuit({ lengthM: Number(event.target.value) })}
                  />
                </label>
                <label>
                  Curva breaker
                  <select
                    value={activeCircuit.breakerCurve}
                    onChange={(event) =>
                      updateCircuit({
                        breakerCurve: event.target.value as CircuitSummary['breakerCurve'],
                      })
                    }
                  >
                    <option value="auto">Automática</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </label>
              </div>
              <fieldset className="safety-selector">
                <legend>Factor de seguridad</legend>
                {([1, 1.25, 1.6] as const).map((factor) => (
                  <button
                    className={activeCircuit.safetyFactor === factor ? 'is-active' : ''}
                    key={factor}
                    onClick={() => updateCircuit({ safetyFactor: factor })}
                    type="button"
                  >
                    {factor.toFixed(2)}
                    <small>
                      {factor === 1 ? 'Estándar' : factor === 1.25 ? 'Continua' : 'Alto pico'}
                    </small>
                  </button>
                ))}
              </fieldset>
            </section>

            <section className="circuits-panel">
              <div className="circuits-panel__header">
                <h2>Cargas del circuito</h2>
                <Button icon="plus" onClick={addLoad}>
                  Agregar carga
                </Button>
              </div>
              {activeCircuit.loads.length > 0 ? (
                <div className="loads-list">
                  {activeCircuit.loads.map((load) => (
                    <div className="load-row" key={load.id}>
                      <input
                        aria-label="Artefacto"
                        value={load.name}
                        onChange={(event) => updateLoad(load.id, { name: event.target.value })}
                        placeholder="Artefacto"
                      />
                      <input
                        aria-label="Potencia W"
                        min={0}
                        type="number"
                        value={load.powerW}
                        onChange={(event) =>
                          updateLoad(load.id, { powerW: Number(event.target.value) })
                        }
                      />
                      <input
                        aria-label="Cantidad"
                        min={1}
                        type="number"
                        value={load.quantity}
                        onChange={(event) =>
                          updateLoad(load.id, { quantity: Number(event.target.value) })
                        }
                      />
                      <span>{(load.powerW * load.quantity).toLocaleString('es-CL')} W</span>
                      <button
                        aria-label="Eliminar carga"
                        className="text-button danger"
                        onClick={() => removeLoad(load.id)}
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="circuits-empty">
                  Agrega al menos una carga para habilitar el cálculo preliminar.
                </p>
              )}
            </section>

            <section className="calculation-result" aria-live="polite">
              <h2>Resultados preliminares</h2>
              {result?.status === 'blocked' ? (
                <p>{result.warnings.at(-1)}</p>
              ) : result ? (
                <>
                  <div className="result-grid">
                    <span>
                      Potencia instalada
                      <strong>{result.installedPowerW.toLocaleString('es-CL')} W</strong>
                    </span>
                    <span>
                      Potencia demandada
                      <strong>{result.demandedPowerW.toLocaleString('es-CL')} W</strong>
                    </span>
                    <span>
                      Corriente de diseño<strong>{result.designCurrentA.toFixed(2)} A</strong>
                    </span>
                    <span>
                      Breaker sugerido<strong>{result.suggestedBreakerA ?? 'Sin calibre'} A</strong>
                    </span>
                    <span>
                      Conductor sugerido
                      <strong>{result.suggestedConductorMm2 ?? 'Sin sección'} mm²</strong>
                    </span>
                    <span>
                      Caída estimada
                      <strong>
                        {result.estimatedVoltageDropPercent?.toFixed(2) ?? 'Sin dato'} %
                      </strong>
                    </span>
                  </div>
                  <ul>
                    {result.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Selecciona un circuito para calcular.</p>
              )}
            </section>
          </div>
        ) : (
          <div className="circuits-empty">
            <Icon name="circuits" size={24} />
            <strong>Sin circuito activo</strong>
            <p>Selecciona o crea un circuito para configurar sus parámetros y cargas.</p>
          </div>
        )}
      </div>
    </section>
  );
}
