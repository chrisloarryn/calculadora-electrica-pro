import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Eyebrow } from '../atoms/Eyebrow';
import { ProjectCard, type ProjectSummary } from '../molecules/ProjectCard';

interface RecentProjectsProps {
  projects: ProjectSummary[];
  onCreate: () => void;
  onOpen: (project: ProjectSummary) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (project: ProjectSummary) => void;
  activeProjectId?: string | null;
}

export function RecentProjects({
  projects,
  onCreate,
  onOpen,
  onDelete,
  onDuplicate,
  activeProjectId,
}: RecentProjectsProps) {
  return (
    <section aria-labelledby="recent-projects-title" className="projects-section">
      <div className="section-heading">
        <div>
          <Eyebrow>Continúa donde quedaste</Eyebrow>
          <Typography component="h2" id="recent-projects-title" variant="h5">
            Proyectos recientes
          </Typography>
        </div>
        <Button
          className="text-button"
          endIcon={<AddIcon fontSize="small" />}
          onClick={onCreate}
          variant="text"
        >
          Nuevo
        </Button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            onOpen={onOpen}
            project={project}
            {...(onDelete ? { onDelete } : {})}
            {...(onDuplicate ? { onDuplicate } : {})}
            isActive={activeProjectId === project.id}
          />
        ))}
      </div>
    </section>
  );
}
