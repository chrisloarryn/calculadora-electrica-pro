import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button } from '../components/atoms/Button';
import { Eyebrow } from '../components/atoms/Eyebrow';
import { Icon } from '../components/atoms/Icon';
import { exportAll, getAllProjects } from '../lib/storage';
import { loadSnapshots, type CircuitSnapshot } from '../lib/snapshots';
import type { ProjectSummary } from '../components/molecules/ProjectCard';

export function ReportsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [snapshots, setSnapshots] = useState<CircuitSnapshot[]>([]);

  useEffect(() => {
    getAllProjects()
      .then((stored) => {
        setProjects(stored);
        setSnapshots(loadSnapshots());
      })
      .catch(() => {
        setProjects([]);
      });
  }, []);

  async function handleExport() {
    setIsExporting(true);
    try {
      const text = await exportAll();
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calculadora-reports-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  const activeProjects = projects.filter((project) => project.progress > 0).length;

  return (
    <section className="reports-page" aria-labelledby="reports-title">
      <div className="reports-page__hero">
        <span className="reports-page__icon">
          <Icon name="document" size={28} />
        </span>
        <Eyebrow>Salida profesional</Eyebrow>
        <h1 id="reports-title">Informes</h1>
        <p>Resumen local de tus proyectos y exportación de datos para futuras vistas de informe.</p>
      </div>

      <div className="reports-grid">
        <Paper component="article" className="reports-card" elevation={1}>
          <strong>{projects.length}</strong>
          <span>Proyectos guardados</span>
        </Paper>
        <Paper component="article" className="reports-card" elevation={1}>
          <strong>{activeProjects}</strong>
          <span>Proyectos con avance</span>
        </Paper>
        <Paper component="article" className="reports-card" elevation={1}>
          <strong>{snapshots.length}</strong>
          <span>Snapshots de circuitos</span>
        </Paper>
      </div>

      <Paper className="reports-panel" elevation={1}>
        <Typography component="h2" variant="h6">
          Snapshots guardados
        </Typography>
        {snapshots.length > 0 ? (
          <div className="reports-snapshots">
            {snapshots.map((snapshot) => (
              <Paper component="article" elevation={0} key={snapshot.id} variant="outlined">
                <strong>{snapshot.circuit.name || 'Circuito sin nombre'}</strong>
                <span>
                  {new Date(snapshot.createdAt).toLocaleString('es-CL')} ·{' '}
                  {snapshot.result.designCurrentA.toFixed(2)} A · Estado{' '}
                  {snapshot.result.status === 'warning' ? 'preliminar' : 'bloqueado'}
                </span>
              </Paper>
            ))}
          </div>
        ) : (
          <p>Guarda un snapshot desde Circuitos para congelar sus entradas y resultados.</p>
        )}
      </Paper>

      <Paper className="reports-panel" elevation={1}>
        <Typography component="h2" variant="h6">
          Exportación
        </Typography>
        <p>
          Descarga un respaldo JSON con los proyectos locales mientras el PDF formal queda en la
          ruta de implementación.
        </p>
        <Button icon="document" onClick={handleExport} type="button" disabled={isExporting}>
          {isExporting ? 'Exportando...' : 'Exportar datos'}
        </Button>
      </Paper>
    </section>
  );
}
