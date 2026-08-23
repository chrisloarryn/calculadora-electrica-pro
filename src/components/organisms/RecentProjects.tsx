import { Icon } from '../atoms/Icon';
import { Eyebrow } from '../atoms/Eyebrow';
import { ProjectCard, type ProjectSummary } from '../molecules/ProjectCard';

interface RecentProjectsProps {
  projects: ProjectSummary[];
  onCreate: () => void;
  onOpen: (project: ProjectSummary) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (project: ProjectSummary) => void;
}

export function RecentProjects({
  projects,
  onCreate,
  onOpen,
  onDelete,
  onDuplicate,
}: RecentProjectsProps) {
  return (
    <section aria-labelledby="recent-projects-title" className="projects-section">
      <div className="section-heading">
        <div>
          <Eyebrow>Continúa donde quedaste</Eyebrow>
          <h2 id="recent-projects-title">Proyectos recientes</h2>
        </div>
        <button className="text-button" onClick={onCreate} type="button">
          Nuevo <Icon name="plus" size={17} />
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            onOpen={onOpen}
            project={project}
            onDelete={onDelete as any}
            onDuplicate={onDuplicate as any}
          />
        ))}
      </div>
    </section>
  );
}
