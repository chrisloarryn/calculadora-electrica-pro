import { Icon } from '../atoms/Icon';

export function PrototypeNotice() {
  return (
    <aside aria-label="Estado del producto" className="prototype-notice">
      <span className="prototype-notice__icon">
        <Icon name="bolt" size={20} />
      </span>
      <div>
        <strong>Prototipo técnico</strong>
        <p>
          El perfil normativo está en revisión. Por ahora, usa los proyectos para explorar el flujo;
          no como recomendación profesional.
        </p>
      </div>
    </aside>
  );
}
