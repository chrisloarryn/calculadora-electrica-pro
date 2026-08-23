import { useEffect, useId, useRef, type SyntheticEvent } from 'react';
import { Button } from '../atoms/Button';
import { Eyebrow } from '../atoms/Eyebrow';
import { IconButton } from '../atoms/IconButton';

export interface ProjectDraft {
  name: string;
  location: string;
}

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (draft: ProjectDraft) => void;
}

export function CreateProjectDialog({ isOpen, onClose, onCreate }: CreateProjectDialogProps) {
  const projectNameId = useId();
  const projectLocationId = useId();
  const projectNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    projectNameRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nameEntry = data.get('name');
    const locationEntry = data.get('location');
    const name = typeof nameEntry === 'string' ? nameEntry.trim() : '';
    const location = typeof locationEntry === 'string' ? locationEntry.trim() : '';

    if (!name) return;
    onCreate({ name, location });
  }

  return (
    <div className="dialog-backdrop" onMouseDown={onClose} role="presentation">
      <section
        aria-labelledby="create-project-title"
        aria-modal="true"
        className="dialog-sheet"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div aria-hidden="true" className="dialog-sheet__handle" />
        <div className="dialog-sheet__header">
          <div>
            <Eyebrow>Nuevo espacio de trabajo</Eyebrow>
            <h2 id="create-project-title">Crear proyecto</h2>
          </div>
          <IconButton aria-label="Cerrar" icon="close" onClick={onClose} />
        </div>

        <form className="project-form" onSubmit={submit}>
          <label htmlFor={projectNameId}>Nombre del proyecto</label>
          <input
            id={projectNameId}
            name="name"
            placeholder="Ej. Remodelación oficina"
            ref={projectNameRef}
            required
          />

          <label htmlFor={projectLocationId}>
            Ubicación <span>(opcional)</span>
          </label>
          <input id={projectLocationId} name="location" placeholder="Comuna o referencia" />

          <p className="form-help">
            Este primer paso solo crea el borrador. No se emitirán recomendaciones eléctricas hasta
            validar los datos y el perfil normativo.
          </p>

          <Button fullWidth icon="arrow-right" iconPosition="end" type="submit">
            Crear borrador
          </Button>
        </form>
      </section>
    </div>
  );
}
