import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Paper from '@mui/material/Paper';

interface MetricCardProps {
  label?: string;
  value?: string;
  detail: string;
  tone?: 'default' | 'accent' | 'ready';
}

export function MetricCard({ label, value, detail, tone = 'default' }: MetricCardProps) {
  if (tone === 'ready') {
    return (
      <Paper className="metric-card metric-card--compact" component="article" elevation={0}>
        <span className="metric-card__check">
          <CheckCircleIcon aria-hidden="true" sx={{ fontSize: 18 }} />
        </span>
        <div>
          <strong>{label}</strong>
          <small>{detail}</small>
        </div>
      </Paper>
    );
  }

  return (
    <Paper
      className={`metric-card${tone === 'accent' ? ' metric-card--accent' : ''}`}
      component="article"
      elevation={0}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </Paper>
  );
}
