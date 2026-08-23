import { Brand } from '../molecules/Brand';
import { LocalStatus } from '../molecules/LocalStatus';

interface AppHeaderProps {
  onHome: () => void;
}

export function AppHeader({ onHome }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Brand onHome={onHome} />
      <div className="header-actions">
        <LocalStatus />
        <button aria-label="Abrir perfil" className="avatar" type="button">
          CL
        </button>
      </div>
    </header>
  );
}
