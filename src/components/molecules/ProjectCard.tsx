import BoltIcon from '@mui/icons-material/Bolt';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
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

export function ProjectCard({
  project,
  onOpen,
  onDelete,
  onDuplicate,
  isActive,
}: ProjectCardProps) {
  const progressLabel = `${String(project.progress)}% de la configuración de ejemplo completada`;

  return (
    <Card
      className={`project-card${isActive ? ' project-card--active' : ''}`}
      component="article"
      data-active={isActive ? 'true' : undefined}
    >
      <div className="project-card__topline">
        <StatusBadge label="Borrador" />
        {isActive ? <span className="project-card__active">Activo</span> : null}
        {project.isDemo ? <span className="project-card__demo">Proyecto demo</span> : null}
      </div>

      <div className="project-card__body">
        <div>
          <Typography component="h3" variant="subtitle1">
            {project.name}
          </Typography>
          <Typography component="p" variant="body2">
            {project.location}
          </Typography>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            aria-label={`Duplicar ${project.name}`}
            className="text-button"
            onClick={() => onDuplicate?.(project)}
            size="small"
            variant="text"
          >
            Duplicar
          </Button>
          <IconButton
            aria-label={`Abrir ${project.name}`}
            onClick={() => onOpen(project)}
            size="small"
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
          <Button
            aria-label={`Eliminar ${project.name}`}
            className="text-button danger"
            color="error"
            onClick={() => onDelete?.(project.id)}
            size="small"
            variant="text"
          >
            Eliminar
          </Button>
        </div>
      </div>

      <div className="project-card__meta">
        <span>
          <ElectricBoltIcon aria-hidden="true" sx={{ fontSize: 17 }} />
          {project.circuits} {project.circuits === 1 ? 'circuito' : 'circuitos'}
        </span>
        <span>Actualizado {project.updatedLabel}</span>
      </div>

      <LinearProgress
        aria-label={progressLabel}
        className="progress"
        value={project.progress}
        variant="determinate"
      />

      <p className="project-card__notice">
        <BoltIcon aria-hidden="true" sx={{ fontSize: 16 }} />
        {'Perfil normativo pendiente de validación'}
      </p>
    </Card>
  );
}
