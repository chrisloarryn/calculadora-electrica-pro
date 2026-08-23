import { useEffect, useRef, useState } from 'react';
import { deleteProject, exportAll, getAllProjects, importAll, saveProject } from '../lib/storage';
import {
  CreateProjectDialog,
  type ProjectDraft,
} from '../components/organisms/CreateProjectDialog';
import { MetricsSummary } from '../components/organisms/MetricsSummary';
import { ProjectsHero } from '../components/organisms/ProjectsHero';
import { RecentProjects } from '../components/organisms/RecentProjects';
import { PrototypeNotice } from '../components/molecules/PrototypeNotice';
import { Toast } from '../components/molecules/Toast';
import type { ProjectSummary } from '../components/molecules/ProjectCard';

const initialProjects: ProjectSummary[] = [
  {
    id: 'demo-casa-piloto',
    name: 'Casa piloto',
    location: 'Ejemplo residencial · Santiago',
    updatedLabel: 'hoy',
    circuits: 4,
    progress: 48,
    isDemo: true,
  },
];

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>(initialProjects);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [openedProject, setOpenedProject] = useState<ProjectSummary | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(initialProjects[0]?.id ?? null);
  const circuitCount = projects.reduce((total, project) => total + project.circuits, 0);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    getAllProjects()
      .then((stored) => {
        if (!mounted) return;
        if (stored.length > 0) {
          setProjects(stored);
          setActiveProjectId((current) => current ?? stored[0]?.id ?? null);
        } else {
          // seed initial demo project into storage
          for (const p of initialProjects) {
            void saveProject(p).catch(() => undefined);
          }
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // debounce saves: persist each project
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      projects.forEach((project) => {
        void saveProject(project).catch(() => undefined);
      });
    }, 500);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [projects]);

  function createProject(draft: ProjectDraft) {
    const newProj: ProjectSummary = {
      id: `local-${String(Date.now())}`,
      name: draft.name,
      location: draft.location || 'Ubicación por definir',
      updatedLabel: 'ahora',
      circuits: 0,
      progress: 8,
    };
    setProjects((current) => [newProj, ...current]);
    void saveProject(newProj).catch(() => undefined);
    setIsCreateOpen(false);
  }

  function deleteLocalProject(id: string) {
    setProjects((current) => current.filter((p) => p.id !== id));
    setActiveProjectId((current) => (current === id ? null : current));
    setOpenedProject((current) => (current?.id === id ? null : current));
    void deleteProject(id).catch(() => undefined);
  }

  function duplicateProject(project: ProjectSummary) {
    const copy: ProjectSummary = {
      ...project,
      id: `local-${String(Date.now())}`,
      name: `${project.name} (copia)`,
      updatedLabel: 'ahora',
    };
    setProjects((current) => [copy, ...current]);
    void saveProject(copy).catch(() => undefined);
  }

  async function handleExport() {
    try {
      const text = await exportAll();
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calculadora-projects-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Export failed');
    }
  }

  async function handleImport(file: File | null) {
    if (!file) return;
    try {
      const text = await file.text();
      await importAll(text);
      const stored = await getAllProjects();
      setProjects(stored);
      alert('Import successful');
    } catch (e) {
      console.error(e);
      alert('Import failed');
    }
  }

  return (
    <div className="dashboard">
      <ProjectsHero onCreate={() => setIsCreateOpen(true)} />
      {activeProjectId ? (
        <div className="editor-banner" role="status">
          <strong>Editor activo</strong>
          <span>{projects.find((project) => project.id === activeProjectId)?.name ?? 'Proyecto activo'}</span>
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="text-button" onClick={handleExport} type="button">
          Exportar proyectos
        </button>
        <label className="text-button" style={{ cursor: 'pointer' }}>
          Importar
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => handleImport(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <PrototypeNotice />
      <MetricsSummary circuitCount={circuitCount} projectCount={projects.length} />
      <RecentProjects
        onCreate={() => setIsCreateOpen(true)}
        onOpen={(project) => {
          setOpenedProject(project);
          setActiveProjectId(project.id);
        }}
        projects={projects}
        onDelete={deleteLocalProject}
        onDuplicate={duplicateProject}
        activeProjectId={activeProjectId}
      />

      <CreateProjectDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createProject}
      />

      {openedProject ? (
        <Toast onClose={() => setOpenedProject(null)} projectName={openedProject.name} />
      ) : null}
    </div>
  );
}
