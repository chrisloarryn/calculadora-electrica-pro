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
  onDelete?: (id: string) => void;
  onDuplicate?: (project: ProjectSummary) => void;
  isActive?: boolean;
}

export function ProjectCard({ project, onOpen, onDelete, onDuplicate, isActive }: ProjectCardProps) {
  const progressLabel = `${String(project.progress)}% de la configuración de ejemplo completada`;

  return (
    <article className={`project-card${isActive ? ' project-card--active' : ''}`} data-active={isActive ? 'true' : undefined}>
      <div className="project-card__topline">
        <StatusBadge label="Borrador" />
        {isActive ? <span className="project-card__active">Activo</span> : null}
        {project.isDemo ? <span className="project-card__demo">Proyecto demo</span> : null}
      </div>

      <div className="project-card__body">
        <div>
          <h3>{project.name}</h3>
          <p>{project.location}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="text-button"
            aria-label={`Duplicar ${project.name}`}
            onClick={() => onDuplicate?.(project)}
            type="button"
          >
            Duplicar
          </button>
          <IconButton
            aria-label={`Abrir ${project.name}`}
            icon="arrow-right"
            iconSize={20}
            onClick={() => onOpen(project)}
            tone="soft"
          />
          <button
            className="text-button danger"
            aria-label={`Eliminar ${project.name}`}
            onClick={() => onDelete?.(project.id)}
            type="button"
          >
            Eliminar
          </button>
        </div>
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
