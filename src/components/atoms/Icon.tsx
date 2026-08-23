import type { SvgIconComponent } from '@mui/icons-material';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

export type IconName =
  | 'arrow-right'
  | 'bolt'
  | 'check'
  | 'circuits'
  | 'close'
  | 'document'
  | 'home'
  | 'plus'
  | 'settings';

interface IconProps extends Omit<SvgIconProps, 'fontSize' | 'color'> {
  name: IconName;
  size?: number;
}

const icons: Record<IconName, SvgIconComponent> = {
  'arrow-right': ArrowForwardIcon,
  bolt: BoltIcon,
  check: CheckIcon,
  circuits: AccountTreeIcon,
  close: CloseIcon,
  document: DescriptionIcon,
  home: HomeIcon,
  plus: AddIcon,
  settings: SettingsIcon,
};

export function Icon({ name, size = 24, ...props }: IconProps) {
  const MuiIcon = icons[name];

  return <MuiIcon aria-hidden="true" sx={{ fontSize: size }} viewBox="0 0 24 24" {...props} />;
}
