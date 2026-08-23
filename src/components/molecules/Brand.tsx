interface BrandProps {
  onHome: () => void;
}

export function Brand({ onHome }: BrandProps) {
  return (
    <a
      aria-label="Calculadora Eléctrica Pro, inicio"
      className="brand"
      href="#main-content"
      onClick={onHome}
    >
      <img alt="" height="38" src="/brand-mark.svg" width="38" />
      <span>
        <strong>Calculadora</strong>
        <small>Eléctrica Pro</small>
      </span>
    </a>
  );
}
