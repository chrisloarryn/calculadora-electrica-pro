import type { ComponentProps } from 'react';
import { Icon, type IconName } from './Icon';

interface ButtonProps extends ComponentProps<'button'> {
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
    <button className={classes} type={type} {...props}>
      {icon && iconPosition === 'start' ? <Icon name={icon} size={19} /> : null}
      {children}
      {icon && iconPosition === 'end' ? <Icon name={icon} size={19} /> : null}
    </button>
  );
}
