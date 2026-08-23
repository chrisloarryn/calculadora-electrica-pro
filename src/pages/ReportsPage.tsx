import { useEffect, useState } from 'react';
import { Button } from '../components/atoms/Button';
import { Eyebrow } from '../components/atoms/Eyebrow';
import { Icon } from '../components/atoms/Icon';
import { exportAll, getAllProjects } from '../lib/storage';
import type { ProjectSummary } from '../components/molecules/ProjectCard';

export function ReportsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    getAllProjects()
      .then((stored) => {
        setProjects(stored);
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
        <article className="reports-card">
          <strong>{projects.length}</strong>
          <span>Proyectos guardados</span>
        </article>
        <article className="reports-card">
          <strong>{activeProjects}</strong>
          <span>Proyectos con avance</span>
        </article>
      </div>

      <div className="reports-panel">
        <h2>Exportación</h2>
        <p>
          Descarga un respaldo JSON con los proyectos locales mientras el PDF formal queda en la
          ruta de implementación.
        </p>
        <Button icon="document" onClick={handleExport} type="button" disabled={isExporting}>
          {isExporting ? 'Exportando...' : 'Exportar datos'}
        </Button>
      </div>
    </section>
  );
}
