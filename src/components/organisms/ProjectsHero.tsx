import { Button } from '../atoms/Button';
import { Eyebrow } from '../atoms/Eyebrow';

interface ProjectsHeroProps {
  onCreate: () => void;
}

export function ProjectsHero({ onCreate }: ProjectsHeroProps) {
  return (
    <section aria-labelledby="dashboard-title" className="hero">
      <div className="hero__copy">
        <Eyebrow>Tu espacio de trabajo</Eyebrow>
        <h1 id="dashboard-title">Calculadora Eléctrica Pro</h1>
        <p>Tus proyectos eléctricos, claros y ordenados.</p>
      </div>
      <Button className="hero__button" data-testid="create-project" icon="plus" onClick={onCreate}>
        Crear proyecto
      </Button>
    </section>
  );
}
