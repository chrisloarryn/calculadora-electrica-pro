import { type SyntheticEvent } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Eyebrow } from '../atoms/Eyebrow';

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
  function submit(event: SyntheticEvent) {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const nameEntry = data.get('name');
    const locationEntry = data.get('location');
    const name = typeof nameEntry === 'string' ? nameEntry.trim() : '';
    const location = typeof locationEntry === 'string' ? locationEntry.trim() : '';

    if (!name) return;
    onCreate({ name, location });
  }

  return (
    <Dialog
      aria-labelledby="create-project-title"
      className="dialog-sheet"
      onClose={onClose}
      open={isOpen}
      transitionDuration={0}
      slotProps={{
        paper: {
          className: 'dialog-sheet',
          component: 'form',
          onSubmit: submit,
        },
      }}
    >
      <div aria-hidden="true" className="dialog-sheet__handle" />
      <DialogTitle className="dialog-sheet__header" sx={{ alignItems: 'flex-start' }}>
        <div>
          <Eyebrow>Nuevo espacio de trabajo</Eyebrow>
          <Typography component="h2" id="create-project-title" variant="h6">
            Crear proyecto
          </Typography>
        </div>
        <IconButton aria-label="Cerrar" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="project-form" dividers>
        <TextField
          autoFocus
          fullWidth
          label="Nombre del proyecto"
          margin="dense"
          name="name"
          placeholder="Ej. Remodelación oficina"
          slotProps={{ htmlInput: { required: true } }}
        />

        <TextField
          fullWidth
          helperText="(opcional)"
          label="Ubicación"
          margin="dense"
          name="location"
          placeholder="Comuna o referencia"
        />

        <p className="form-help">
          Este primer paso solo crea el borrador. No se emitirán recomendaciones eléctricas hasta
          validar los datos y el perfil normativo.
        </p>
      </DialogContent>

      <DialogActions>
        <Button
          fullWidth
          size="large"
          endIcon={<ArrowForwardIcon />}
          type="submit"
          variant="contained"
        >
          Crear borrador
        </Button>
      </DialogActions>
    </Dialog>
  );
}
