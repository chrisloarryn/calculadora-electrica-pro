import type { ComponentProps } from 'react';
import { Icon, type IconName } from './Icon';

interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
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
    <button className={classes} type={type} {...props}>
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
