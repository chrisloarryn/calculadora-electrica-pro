import { useState } from 'react';
import type { Section } from './navigation';
import { AppShell } from '../components/templates/AppShell';
import { ComingSoonPage } from '../pages/ComingSoonPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ReportsPage } from '../pages/ReportsPage';

export function App() {
  const [activeSection, setActiveSection] = useState<Section>('projects');

  return (
    <AppShell activeSection={activeSection} onSectionChange={setActiveSection}>
      {activeSection === 'projects' ? (
        <ProjectsPage />
      ) : activeSection === 'reports' ? (
        <ReportsPage />
      ) : activeSection === 'settings' ? (
        <SettingsPage />
      ) : (
        <ComingSoonPage section={activeSection} />
      )}
    </AppShell>
  );
}
