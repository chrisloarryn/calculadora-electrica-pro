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
    description:
      'Aquí podrás organizar cargas y parámetros cuando el motor de cálculo esté validado.',
  },
  reports: {
    title: 'Informes',
    description:
      'Los informes usarán snapshots versionados para conservar el contexto de cada proyecto.',
  },
  settings: {
    title: 'Ajustes',
    description:
      'La configuración de unidades, accesibilidad y perfiles estará disponible en esta sección.',
  },
};
