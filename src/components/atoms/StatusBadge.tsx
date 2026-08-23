export function StatusBadge({ label }: { label: string }) {
  return (
    <span className="status-badge status-badge--draft">
      <span aria-hidden="true" className="status-badge__dot" />
      {label}
    </span>
  );
}
