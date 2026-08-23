import Chip from '@mui/material/Chip';

export function StatusBadge({ label }: { label: string }) {
  return (
    <Chip
      className="status-badge status-badge--draft"
      label={
        <>
          <span aria-hidden="true" className="status-badge__dot" />
          {label}
        </>
      }
      size="small"
      variant="outlined"
    />
  );
}
