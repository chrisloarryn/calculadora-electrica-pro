import { useState } from 'react';
import type { Section } from './navigation';
import { AppShell } from '../components/templates/AppShell';
import { CircuitsPage } from '../pages/CircuitsPage';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { loadUiPreferences } from '../lib/preferences';

export function App() {
  const [activeSection, setActiveSection] = useState<Section>(() =>
    loadUiPreferences().rememberActiveProject ? 'circuits' : 'projects',
  );

  let content;

  switch (activeSection) {
    case 'projects':
      content = <ProjectsPage />;
      break;
    case 'reports':
      content = <ReportsPage />;
      break;
    case 'circuits':
      content = <CircuitsPage />;
      break;
    case 'settings':
      content = <SettingsPage />;
      break;
    default:
      content = <ComingSoonPage section={activeSection} />;
      break;
  }

  return (
    <AppShell activeSection={activeSection} onSectionChange={setActiveSection}>
      {content}
    </AppShell>
  );
}
