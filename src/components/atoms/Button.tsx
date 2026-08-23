import type { ComponentProps } from 'react';
import MuiButton from '@mui/material/Button';
import { Icon, type IconName } from './Icon';

interface ButtonProps extends Omit<ComponentProps<'button'>, 'color'> {
  fullWidth?: boolean;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
}

export function Button({
  children,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'start',
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = ['button', 'button--primary', fullWidth ? 'button--full' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <MuiButton
      className={classes}
      endIcon={icon && iconPosition === 'end' ? <Icon name={icon} size={19} /> : undefined}
      fullWidth={fullWidth}
      startIcon={icon && iconPosition === 'start' ? <Icon name={icon} size={19} /> : undefined}
      type={type}
      variant="contained"
      {...props}
    >
      {children}
    </MuiButton>
  );
}
