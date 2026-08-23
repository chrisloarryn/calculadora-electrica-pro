import type { ComponentProps } from 'react';
import MuiIconButton from '@mui/material/IconButton';
import { Icon, type IconName } from './Icon';

interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children' | 'color'> {
  icon: IconName;
  iconSize?: number;
  tone?: 'default' | 'soft';
}

export function IconButton({
  className = '',
  icon,
  iconSize = 21,
  tone = 'default',
  type = 'button',
  ...props
}: IconButtonProps) {
  const classes = ['icon-button', tone === 'soft' ? 'icon-button--soft' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <MuiIconButton className={classes} type={type} {...props}>
      <Icon name={icon} size={iconSize} />
    </MuiIconButton>
  );
}
