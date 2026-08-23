import type { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

export function Eyebrow({ children }: PropsWithChildren) {
  return (
    <Typography className="eyebrow" component="span" variant="overline">
      {children}
    </Typography>
  );
}
