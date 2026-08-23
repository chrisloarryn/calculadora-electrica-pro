import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import MuiIconButton from '@mui/material/IconButton';
import { Brand } from '../molecules/Brand';
import { LocalStatus } from '../molecules/LocalStatus';

interface AppHeaderProps {
  onHome: () => void;
}

export function AppHeader({ onHome }: AppHeaderProps) {
  return (
    <AppBar className="app-header" color="transparent" component="header" position="static">
      <Toolbar disableGutters sx={{ width: '100%', justifyContent: 'space-between' }}>
        <Brand onHome={onHome} />
        <div className="header-actions">
          <LocalStatus />
          <MuiIconButton aria-label="Abrir perfil" className="avatar" type="button">
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem' }}>CL</Avatar>
          </MuiIconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
