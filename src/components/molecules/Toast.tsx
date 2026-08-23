import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface ToastProps {
  projectName: string;
  onClose: () => void;
}

export function Toast({ projectName, onClose }: ToastProps) {
  return (
    <Snackbar anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} className="toast" open>
      <Alert
        closeText="Cerrar aviso"
        icon={<CheckCircleIcon fontSize="small" />}
        onClose={onClose}
        role="status"
        severity="success"
        variant="filled"
      >
        <strong>{projectName}</strong>
        Editor activo para este proyecto.
      </Alert>
    </Snackbar>
  );
}
