import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Eyebrow } from '../atoms/Eyebrow';

interface ProjectsHeroProps {
  onCreate: () => void;
}

export function ProjectsHero({ onCreate }: ProjectsHeroProps) {
  return (
    <section aria-labelledby="dashboard-title" className="hero">
      <div className="hero__copy">
        <Eyebrow>Tu espacio de trabajo</Eyebrow>
        <Typography component="h1" id="dashboard-title" variant="h4">
          Calculadora Eléctrica Pro
        </Typography>
        <Typography component="p" variant="body1">
          Tus proyectos eléctricos, claros y ordenados.
        </Typography>
      </div>
      <Button
        className="hero__button"
        data-testid="create-project"
        onClick={onCreate}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Crear proyecto
      </Button>
    </section>
  );
}
