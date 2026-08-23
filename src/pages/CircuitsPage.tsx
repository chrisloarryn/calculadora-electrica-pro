import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DeleteOutlined as DeleteOutlineIcon } from '@mui/icons-material';
import { calculatePreliminaryCircuit } from '../calculation/circuit';
import { chileLoadCatalog } from '../domain/loadCatalog';
import { clSecRicProfile } from '../standards/clSecRic';
import { countryProfiles } from '../standards/countryProfiles';
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
  type LoadType,
} from '../lib/circuits';
import { loadActiveProjectId, loadUiPreferences, saveActiveProjectId } from '../lib/preferences';
import { saveSnapshot } from '../lib/snapshots';
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
    const preferences = loadUiPreferences();
    const circuit = createCircuit({
      standardProfile: countryProfiles[preferences.country].id,
      voltageV: preferences.defaultVoltageV,
      installationMethod: preferences.defaultInstallationMethod,
      insulationType: preferences.defaultInsulationType,
      ambientTemperatureC: preferences.defaultAmbientTemperatureC,
      groupedCircuits: preferences.defaultGroupedCircuits,
      maximumVoltageDropPercent: preferences.defaultMaximumVoltageDropPercent,
      loadDuty: preferences.defaultLoadDuty,
    });
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

  function applyCatalogItem(loadId: string, catalogName: string) {
    const item = chileLoadCatalog.find((candidate) => candidate.name === catalogName);
    if (!item || !activeCircuit) return;
    updateCircuit({
      loads: activeCircuit.loads.map((load) => (load.id === loadId ? { ...load, ...item } : load)),
      ...(item.nominalVoltageV ? { voltageV: item.nominalVoltageV } : {}),
      ...(item.phases === 3 ? { system: 'three-phase' } : {}),
    });
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

  function createSnapshot() {
    if (!activeCircuit || !activeProjectId || !result || result.status === 'blocked') return;
    saveSnapshot({
      id: `snapshot-${String(Date.now())}`,
      projectId: activeProjectId,
      circuitId: activeCircuit.id,
      createdAt: new Date().toISOString(),
      circuit: activeCircuit,
      result,
    });
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
        <TextField
          fullWidth
          label="Proyecto activo"
          select
          size="small"
          value={activeProjectId ?? ''}
          onChange={(event) => selectProject(event.target.value)}
        >
          <MenuItem value="">Selecciona un proyecto</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </TextField>
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
            <Paper component="section" className="circuits-panel" elevation={1}>
              <div className="circuits-panel__header">
                <h2>Parámetros del circuito</h2>
                <div>
                  <button
                    className="text-button"
                    onClick={() => updateCircuit({ advanced: !activeCircuit.advanced })}
                    type="button"
                  >
                    {activeCircuit.advanced ? 'Modo básico' : 'Modo avanzado'}
                  </button>
                  <button className="text-button danger" onClick={deleteCircuit} type="button">
                    Eliminar
                  </button>
                </div>
              </div>
              {activeCircuit.advanced ? (
                <div className="circuits-form circuits-form--advanced">
                  <TextField
                    label="Material"
                    select
                    size="small"
                    value={activeCircuit.conductorMaterial}
                    onChange={(event) =>
                      updateCircuit({
                        conductorMaterial: event.target
                          .value as CircuitSummary['conductorMaterial'],
                      })
                    }
                  >
                    <MenuItem value="copper">Cobre</MenuItem>
                    <MenuItem value="aluminium">Aluminio</MenuItem>
                  </TextField>
                  <TextField
                    label="Método de instalación"
                    select
                    size="small"
                    value={activeCircuit.installationMethod}
                    onChange={(event) =>
                      updateCircuit({
                        installationMethod: event.target
                          .value as CircuitSummary['installationMethod'],
                      })
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
                    value={activeCircuit.insulationType}
                    onChange={(event) =>
                      updateCircuit({
                        insulationType: event.target.value as CircuitSummary['insulationType'],
                      })
                    }
                  >
                    <MenuItem value="PVC">PVC</MenuItem>
                    <MenuItem value="XLPE">XLPE</MenuItem>
                  </TextField>
                  <TextField
                    label="Temperatura (°C)"
                    size="small"
                    type="number"
                    value={activeCircuit.ambientTemperatureC}
                    onChange={(event) =>
                      updateCircuit({ ambientTemperatureC: Number(event.target.value) })
                    }
                    slotProps={{ htmlInput: { min: -10 } }}
                  />
                  <TextField
                    label="Circuitos agrupados"
                    size="small"
                    type="number"
                    value={activeCircuit.groupedCircuits}
                    onChange={(event) =>
                      updateCircuit({ groupedCircuits: Number(event.target.value) })
                    }
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                  <TextField
                    label="Límite caída (%)"
                    size="small"
                    type="number"
                    value={activeCircuit.maximumVoltageDropPercent}
                    onChange={(event) =>
                      updateCircuit({ maximumVoltageDropPercent: Number(event.target.value) })
                    }
                    slotProps={{ htmlInput: { min: 0.1, step: 0.1 } }}
                  />
                </div>
              ) : null}
              <div className="circuits-form">
                <TextField
                  label="Nombre"
                  placeholder="Ej. iluminación planta baja"
                  size="small"
                  value={activeCircuit.name}
                  onChange={(event) => updateCircuit({ name: event.target.value })}
                />
                <TextField
                  disabled
                  label="Perfil"
                  size="small"
                  value={activeCircuit.standardProfile}
                />
                <TextField
                  label="Sistema"
                  select
                  size="small"
                  value={activeCircuit.system}
                  onChange={(event) =>
                    updateCircuit({ system: event.target.value as CircuitSummary['system'] })
                  }
                >
                  <MenuItem value="single-phase">Monofásico</MenuItem>
                  <MenuItem value="three-phase">Trifásico</MenuItem>
                </TextField>
                <TextField
                  label="Voltaje (V)"
                  size="small"
                  type="number"
                  value={activeCircuit.voltageV}
                  onChange={(event) => updateCircuit({ voltageV: Number(event.target.value) })}
                  slotProps={{ htmlInput: { min: 1 } }}
                />
                <TextField
                  disabled={activeCircuit.demandRule === 'profile-rule'}
                  label="Factor de demanda"
                  size="small"
                  type="number"
                  value={activeCircuit.demandFactor}
                  onChange={(event) => updateCircuit({ demandFactor: Number(event.target.value) })}
                  slotProps={{ htmlInput: { min: 0.1, max: 1, step: 0.05 } }}
                />
                <TextField
                  label="Regla de demanda"
                  select
                  size="small"
                  value={activeCircuit.demandRule}
                  onChange={(event) =>
                    updateCircuit({
                      demandRule: event.target.value as CircuitSummary['demandRule'],
                    })
                  }
                >
                  <MenuItem value="manual">Manual</MenuItem>
                  <MenuItem value="profile-rule">Perfil Chile (provisional)</MenuItem>
                </TextField>
                <TextField
                  label="Distancia (m)"
                  size="small"
                  type="number"
                  value={activeCircuit.lengthM}
                  onChange={(event) => updateCircuit({ lengthM: Number(event.target.value) })}
                  slotProps={{ htmlInput: { min: 0 } }}
                />
                <TextField
                  label="Curva breaker"
                  select
                  size="small"
                  value={activeCircuit.breakerCurve}
                  onChange={(event) =>
                    updateCircuit({
                      breakerCurve: event.target.value as CircuitSummary['breakerCurve'],
                    })
                  }
                >
                  <MenuItem value="auto">Automática</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                </TextField>
              </div>
              <fieldset className="safety-selector">
                <legend>Régimen de carga</legend>
                {(['standard', 'continuous', 'high-starting-current'] as const).map((duty) => (
                  <button
                    className={activeCircuit.loadDuty === duty ? 'is-active' : ''}
                    key={duty}
                    onClick={() => updateCircuit({ loadDuty: duty })}
                    type="button"
                  >
                    {duty === 'standard'
                      ? 'Estándar'
                      : duty === 'continuous'
                        ? 'Continua'
                        : 'Alto arranque'}
                    <small>
                      {duty === 'continuous'
                        ? 'Regla del perfil x1.25'
                        : duty === 'high-starting-current'
                          ? 'Prioriza curva de arranque'
                          : 'Sin ajuste de corriente'}
                    </small>
                  </button>
                ))}
              </fieldset>
            </Paper>

            <Paper component="section" className="circuits-panel" elevation={1}>
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
                      <TextField
                        placeholder="Artefacto"
                        size="small"
                        value={load.name}
                        onChange={(event) => updateLoad(load.id, { name: event.target.value })}
                        slotProps={{ htmlInput: { 'aria-label': 'Artefacto' } }}
                      />
                      <TextField
                        select
                        size="small"
                        value=""
                        onChange={(event) => applyCatalogItem(load.id, event.target.value)}
                        slotProps={{
                          select: { inputProps: { 'aria-label': 'Catálogo de cargas' } },
                        }}
                      >
                        <MenuItem value="">Catálogo</MenuItem>
                        {chileLoadCatalog.map((item) => (
                          <MenuItem key={item.name} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        size="small"
                        value={load.type}
                        onChange={(event) =>
                          updateLoad(load.id, { type: event.target.value as LoadType })
                        }
                        slotProps={{
                          select: { inputProps: { 'aria-label': 'Tipo de carga' } },
                        }}
                      >
                        <MenuItem value="lighting">Iluminación</MenuItem>
                        <MenuItem value="outlet">Enchufe</MenuItem>
                        <MenuItem value="resistive">Resistiva</MenuItem>
                        <MenuItem value="motor">Motor</MenuItem>
                        <MenuItem value="electronic">Electrónica</MenuItem>
                        <MenuItem value="custom">Otra</MenuItem>
                      </TextField>
                      <TextField
                        size="small"
                        type="number"
                        value={load.powerW}
                        onChange={(event) =>
                          updateLoad(load.id, { powerW: Number(event.target.value) })
                        }
                        slotProps={{ htmlInput: { min: 0, 'aria-label': 'Potencia W' } }}
                      />
                      {activeCircuit.advanced ? (
                        <>
                          <TextField
                            size="small"
                            type="number"
                            value={load.powerFactor}
                            onChange={(event) =>
                              updateLoad(load.id, { powerFactor: Number(event.target.value) })
                            }
                            slotProps={{
                              htmlInput: {
                                min: 0.1,
                                max: 1,
                                step: 0.01,
                                'aria-label': 'Factor de potencia',
                              },
                            }}
                          />
                          <TextField
                            size="small"
                            type="number"
                            value={load.efficiency}
                            onChange={(event) =>
                              updateLoad(load.id, { efficiency: Number(event.target.value) })
                            }
                            slotProps={{
                              htmlInput: {
                                min: 0.1,
                                max: 1,
                                step: 0.01,
                                'aria-label': 'Rendimiento',
                              },
                            }}
                          />
                        </>
                      ) : null}
                      <TextField
                        size="small"
                        type="number"
                        value={load.quantity}
                        onChange={(event) =>
                          updateLoad(load.id, { quantity: Number(event.target.value) })
                        }
                        slotProps={{ htmlInput: { min: 1, 'aria-label': 'Cantidad' } }}
                      />
                      <span>{(load.powerW * load.quantity).toLocaleString('es-CL')} W</span>
                      <button
                        aria-label="Eliminar carga"
                        className="text-button danger"
                        onClick={() => removeLoad(load.id)}
                        type="button"
                      >
                        <DeleteOutlineIcon fontSize="small" /> Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="circuits-empty">
                  Agrega al menos una carga para habilitar el cálculo preliminar.
                </p>
              )}
            </Paper>

            <Paper
              component="section"
              className="calculation-result"
              elevation={1}
              aria-live="polite"
            >
              <div className="circuits-panel__header">
                <h2>Resultados preliminares</h2>
                <Button
                  disabled={!result || result.status === 'blocked'}
                  icon="document"
                  onClick={createSnapshot}
                >
                  Guardar snapshot
                </Button>
              </div>
              {result?.status === 'blocked' ? (
                <Alert severity="error">{result.warnings.at(-1)}</Alert>
              ) : result ? (
                <>
                  <Grid container className="result-grid" spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Potencia instalada
                        <strong>{result.installedPowerW.toLocaleString('es-CL')} W</strong>
                      </span>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Potencia demandada
                        <strong>{result.demandedPowerW.toLocaleString('es-CL')} W</strong>
                      </span>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Corriente de diseño<strong>{result.designCurrentA.toFixed(2)} A</strong>
                      </span>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Breaker sugerido
                        <strong>{result.suggestedBreakerA ?? 'Sin calibre'} A</strong>
                      </span>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Conductor automático
                        <strong>{result.suggestedConductorMm2 ?? 'Sin sección'} mm²</strong>
                      </span>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Stack spacing={0.5}>
                        <TextField
                          label="Conductor a evaluar"
                          select
                          size="small"
                          value={String(activeCircuit.selectedConductorMm2 ?? '')}
                          onChange={(event) =>
                            updateCircuit({
                              selectedConductorMm2: event.target.value
                                ? Number(event.target.value)
                                : undefined,
                            })
                          }
                        >
                          <MenuItem value="">Automático</MenuItem>
                          {clSecRicProfile.calibres?.map((calibre) => (
                            <MenuItem key={String(calibre.mm2)} value={String(calibre.mm2)}>
                              {String(calibre.mm2)} mm² · máx. perfil {String(calibre.i_max)} A
                              {calibre.mm2 === result.suggestedConductorMm2 ? ' · Recomendada' : ''}
                            </MenuItem>
                          ))}
                        </TextField>
                        <strong>
                          {result.evaluatedConductorMm2
                            ? `${String(result.evaluatedConductorMm2)} mm²`
                            : 'Sin sección'}
                        </strong>
                        <small>
                          Capacidad de perfil: {result.evaluatedConductorCapacityA ?? 'sin dato'} A
                        </small>
                        {result.conductorReference ? (
                          <small>
                            Ref.: {result.conductorReference.nearestAwg} (
                            {result.conductorReference.awgAreaMm2} mm²)
                          </small>
                        ) : null}
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Caída estimada
                        <strong>
                          {result.estimatedVoltageDropPercent?.toFixed(2) ?? 'Sin dato'} %
                        </strong>
                        <small>
                          Límite RIC circuito terminal: {String(result.maximumVoltageDropPercent)} %
                        </small>
                        <small>
                          {result.isVoltageDropCompliant
                            ? 'Cumple el límite preliminar'
                            : 'No cumple el límite preliminar'}
                        </small>
                      </span>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Límite normativo RIC
                        <strong>3 % circuito terminal · 5 % total</strong>
                        <small>
                          El 5 % corresponde al trayecto completo de la instalación, no solo este
                          circuito.
                        </small>
                      </span>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Curva sugerida
                        <strong>
                          {activeCircuit.breakerCurve === 'auto'
                            ? result.suggestedCurve
                            : activeCircuit.breakerCurve}
                        </strong>
                      </span>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <span>
                        Diferencial sugerido
                        <strong>
                          {result.suggestedRcd
                            ? `${String(result.suggestedRcd.sensitivityMa)} mA · ${result.suggestedRcd.class} · ${String(result.suggestedRcd.nominalCurrentA)} A`
                            : 'Requiere evaluar uso'}
                        </strong>
                      </span>
                    </Grid>
                  </Grid>
                  {result.warnings.length > 0 ? (
                    <Stack spacing={1}>
                      {result.warnings.map((warning) => (
                        <Alert key={warning} severity="warning">
                          {warning}
                        </Alert>
                      ))}
                    </Stack>
                  ) : null}
                  <details>
                    <summary>Reglas y fuentes aplicadas</summary>
                    <ul>
                      {result.appliedRules.map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                  </details>
                  {result.conductorReference ? (
                    <p>
                      La referencia AWG es informativa. La selección y capacidad admisible se
                      mantienen en mm² según el perfil del país y condiciones de instalación.
                    </p>
                  ) : null}
                </>
              ) : (
                <p>Selecciona un circuito para calcular.</p>
              )}
            </Paper>
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
