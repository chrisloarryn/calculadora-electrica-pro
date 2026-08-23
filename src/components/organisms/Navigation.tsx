import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { navigationItems, type Section } from '../../app/navigation';
import { Icon } from '../atoms/Icon';

interface NavigationProps {
  active: Section;
  onChange: (section: Section) => void;
  variant: 'bottom' | 'sidebar';
}

export function Navigation({ active, onChange, variant }: NavigationProps) {
  return (
    <BottomNavigation
      aria-label="Navegación principal"
      className={`primary-navigation primary-navigation--${variant}`}
      component="nav"
      data-testid={variant === 'bottom' ? 'mobile-navigation' : undefined}
      onChange={(_event, section: Section) => onChange(section)}
      showLabels
      sx={
        variant === 'sidebar'
          ? { alignItems: 'stretch', flexDirection: 'column', height: 'auto' }
          : undefined
      }
      value={active}
    >
      {navigationItems.map((item) => (
        <BottomNavigationAction
          aria-current={active === item.id ? 'page' : undefined}
          className={active === item.id ? 'is-active' : ''}
          icon={
            <span className="primary-navigation__icon">
              <Icon name={item.icon} size={21} />
            </span>
          }
          key={item.id}
          label={item.label}
          showLabel
          value={item.id}
        />
      ))}
    </BottomNavigation>
  );
}
