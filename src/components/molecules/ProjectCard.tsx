import { Icon } from '../atoms/Icon';
import { IconButton } from '../atoms/IconButton';
import { StatusBadge } from '../atoms/StatusBadge';

export interface ProjectSummary {
  id: string;
  name: string;
  location: string;
  updatedLabel: string;
  circuits: number;
  progress: number;
  isDemo?: boolean;
}

interface ProjectCardProps {
  project: ProjectSummary;
  onOpen: (project: ProjectSummary) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const progressLabel = `${String(project.progress)}% de la configuración de ejemplo completada`;

  return (
    <article className="project-card">
      <div className="project-card__topline">
        <StatusBadge label="Borrador" />
        {project.isDemo ? <span className="project-card__demo">Proyecto demo</span> : null}
      </div>

      <div className="project-card__body">
        <div>
          <h3>{project.name}</h3>
          <p>{project.location}</p>
        </div>
        <IconButton
          aria-label={`Abrir ${project.name}`}
          icon="arrow-right"
          iconSize={20}
          onClick={() => onOpen(project)}
          tone="soft"
        />
      </div>

      <div className="project-card__meta">
        <span>
          <Icon name="circuits" size={17} />
          {project.circuits} {project.circuits === 1 ? 'circuito' : 'circuitos'}
        </span>
        <span>Actualizado {project.updatedLabel}</span>
      </div>

      <div
        aria-label={progressLabel}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={project.progress}
        className="progress"
        role="progressbar"
      >
        <span style={{ width: `${String(project.progress)}%` }} />
      </div>

      <p className="project-card__notice">
        <Icon name="bolt" size={16} />
        Perfil normativo pendiente de validación
      </p>
    </article>
  );
}
