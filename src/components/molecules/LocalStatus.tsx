import { Icon } from '../atoms/Icon';

export function LocalStatus() {
  return (
    <span className="local-status" title="Este prototipo no envía datos a un servidor">
      <Icon name="check" size={15} />
      <span className="local-status__wide">Trabajo local</span>
      <span className="local-status__short">Local</span>
    </span>
  );
}
