import type { IconName } from '../components/atoms/Icon';

export type Section = 'projects' | 'circuits' | 'reports' | 'settings';

export interface NavigationItem {
  id: Section;
  label: string;
  icon: IconName;
}

export const navigationItems: NavigationItem[] = [
  { id: 'projects', label: 'Proyectos', icon: 'home' },
  { id: 'circuits', label: 'Circuitos', icon: 'circuits' },
  { id: 'reports', label: 'Informes', icon: 'document' },
  { id: 'settings', label: 'Ajustes', icon: 'settings' },
];

export const sectionCopy: Record<
  Exclude<Section, 'projects'>,
  { title: string; description: string }
> = {
  circuits: {
    title: 'Circuitos',
    description: 'Editor local por proyecto para organizar cargas y parámetros básicos.',
  },
  reports: {
    title: 'Informes',
    description:
      'Los informes usarán snapshots versionados para conservar el contexto de cada proyecto.',
  },
  settings: {
    title: 'Ajustes',
    description: 'Preferencias locales y comportamiento visible del prototipo.',
  },
};
