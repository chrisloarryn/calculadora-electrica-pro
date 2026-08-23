import CheckIcon from '@mui/icons-material/Check';
import Chip from '@mui/material/Chip';

export function LocalStatus() {
  return (
    <Chip
      className="local-status"
      icon={<CheckIcon aria-hidden="true" sx={{ fontSize: 15 }} />}
      label={
        <>
          <span className="local-status__wide">Trabajo local</span>
          <span className="local-status__short">Local</span>
        </>
      }
      size="small"
      title="Este prototipo no envía datos a un servidor"
      variant="outlined"
    />
  );
}
