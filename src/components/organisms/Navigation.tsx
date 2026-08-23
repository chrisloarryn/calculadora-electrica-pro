import { navigationItems, type Section } from '../../app/navigation';
import { Icon } from '../atoms/Icon';

interface NavigationProps {
  active: Section;
  onChange: (section: Section) => void;
  variant: 'bottom' | 'sidebar';
}

export function Navigation({ active, onChange, variant }: NavigationProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className={`primary-navigation primary-navigation--${variant}`}
      data-testid={variant === 'bottom' ? 'mobile-navigation' : undefined}
    >
      {navigationItems.map((item) => (
        <button
          aria-current={active === item.id ? 'page' : undefined}
          className={active === item.id ? 'is-active' : ''}
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
        >
          <span className="primary-navigation__icon">
            <Icon name={item.icon} size={21} />
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
