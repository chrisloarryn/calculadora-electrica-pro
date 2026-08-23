import { Icon } from '../atoms/Icon';

interface ToastProps {
  projectName: string;
  onClose: () => void;
}

export function Toast({ projectName, onClose }: ToastProps) {
  return (
    <div className="toast" role="status">
      <Icon name="check" size={18} />
      <span>
        <strong>{projectName}</strong>
        El editor se habilitará en el próximo hito.
      </span>
      <button aria-label="Cerrar aviso" onClick={onClose} type="button">
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}
