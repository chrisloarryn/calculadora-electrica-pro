import Box from '@mui/material/Box';
import { MetricCard } from '../molecules/MetricCard';

interface MetricsSummaryProps {
  projectCount: number;
  circuitCount: number;
}

export function MetricsSummary({ projectCount, circuitCount }: MetricsSummaryProps) {
  return (
    <Box aria-label="Resumen" className="metrics-grid" component="section">
      <MetricCard
        detail="Borradores en esta sesión"
        label="Proyectos"
        value={projectCount.toString().padStart(2, '0')}
      />
      <MetricCard
        detail="Sin resultados validados"
        label="Circuitos demo"
        tone="accent"
        value={circuitCount.toString().padStart(2, '0')}
      />
      <MetricCard
        detail="Tras la primera carga de la PWA"
        label="Listo sin conexión"
        tone="ready"
      />
    </Box>
  );
}
