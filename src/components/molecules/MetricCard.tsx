import { Icon } from '../atoms/Icon';

interface MetricCardProps {
  label?: string;
  value?: string;
  detail: string;
  tone?: 'default' | 'accent' | 'ready';
}

export function MetricCard({ label, value, detail, tone = 'default' }: MetricCardProps) {
  if (tone === 'ready') {
    return (
      <article className="metric-card metric-card--compact">
        <span className="metric-card__check">
          <Icon name="check" size={18} />
        </span>
        <div>
          <strong>{label}</strong>
          <small>{detail}</small>
        </div>
      </article>
    );
  }

  return (
    <article className={`metric-card${tone === 'accent' ? ' metric-card--accent' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
