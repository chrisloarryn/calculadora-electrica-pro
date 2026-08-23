import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { navigationItems, type Section } from '../../app/navigation';
import { Icon } from '../atoms/Icon';

interface NavigationProps {
  active: Section;
  onChange: (section: Section) => void;
  variant: 'bottom' | 'sidebar';
}

export function Navigation({ active, onChange, variant }: NavigationProps) {
  if (variant === 'sidebar') {
    return (
      <Box
        aria-label="Navegación principal"
        className="primary-navigation primary-navigation--sidebar"
        component="nav"
        sx={{
          alignItems: 'stretch',
          background: 'rgba(250, 252, 255, 0.8)',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          height: 'calc(100vh - 78px)',
          position: 'sticky',
          top: 78,
        }}
      >
        <List disablePadding sx={{ display: 'grid', gap: 0.75, width: '100%' }}>
          {navigationItems.map((item) => (
            <ListItemButton
              aria-current={active === item.id ? 'page' : undefined}
              className={active === item.id ? 'is-active' : ''}
              key={item.id}
              onClick={() => onChange(item.id)}
              selected={active === item.id}
              sx={{ borderRadius: 3, gap: 1, minHeight: 48, px: 1.75 }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 28 }}>
                <Icon name={item.icon} size={21} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 700 } } }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    );
  }

  return (
    <BottomNavigation
      aria-label="Navegación principal"
      className="primary-navigation primary-navigation--bottom"
      component="nav"
      data-testid="mobile-navigation"
      onChange={(_event, section: Section) => onChange(section)}
      showLabels
      sx={{ display: { xs: 'grid', md: 'none' } }}
      value={active}
    >
      {navigationItems.map((item) => (
        <BottomNavigationAction
          aria-current={active === item.id ? 'page' : undefined}
          className={active === item.id ? 'is-active' : ''}
          icon={<Icon name={item.icon} size={21} />}
          key={item.id}
          label={item.label}
          showLabel
          value={item.id}
        />
      ))}
    </BottomNavigation>
  );
}
