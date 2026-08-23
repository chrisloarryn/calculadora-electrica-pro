import type { PropsWithChildren } from 'react';
import type { Section } from '../../app/navigation';
import { AppHeader } from '../organisms/AppHeader';
import { Navigation } from '../organisms/Navigation';

interface AppShellProps extends PropsWithChildren {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export function AppShell({ activeSection, children, onSectionChange }: AppShellProps) {
  return (
    <div className="app-shell" data-testid="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>

      <AppHeader onHome={() => onSectionChange('projects')} />

      <div className="app-layout">
        <Navigation active={activeSection} onChange={onSectionChange} variant="sidebar" />
        <main className="main-content" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>

      <Navigation active={activeSection} onChange={onSectionChange} variant="bottom" />
    </div>
  );
}
