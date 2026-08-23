import { useState } from 'react';
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
  const [projects, setProjects] = useState(initialProjects);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [openedProject, setOpenedProject] = useState<ProjectSummary | null>(null);
  const circuitCount = projects.reduce((total, project) => total + project.circuits, 0);

  function createProject(draft: ProjectDraft) {
    setProjects((current) => [
      {
        id: `local-${String(Date.now())}`,
        name: draft.name,
        location: draft.location || 'Ubicación por definir',
        updatedLabel: 'ahora',
        circuits: 0,
        progress: 8,
      },
      ...current,
    ]);
    setIsCreateOpen(false);
  }

  return (
    <div className="dashboard">
      <ProjectsHero onCreate={() => setIsCreateOpen(true)} />
      <PrototypeNotice />
      <MetricsSummary circuitCount={circuitCount} projectCount={projects.length} />
      <RecentProjects
        onCreate={() => setIsCreateOpen(true)}
        onOpen={setOpenedProject}
        projects={projects}
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
