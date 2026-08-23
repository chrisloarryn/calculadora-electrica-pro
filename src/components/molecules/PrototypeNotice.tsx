import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import Paper from '@mui/material/Paper';

export function PrototypeNotice() {
  return (
    <Paper
      aria-label="Estado del producto"
      className="prototype-notice"
      component="aside"
      elevation={0}
    >
      <span className="prototype-notice__icon">
        <ElectricBoltIcon aria-hidden="true" sx={{ fontSize: 20 }} />
      </span>
      <div>
        <strong>Prototipo técnico</strong>
        <p>
          El perfil normativo está en revisión. Por ahora, usa los proyectos para explorar el flujo;
          no como recomendación profesional.
        </p>
      </div>
    </Paper>
  );
}
