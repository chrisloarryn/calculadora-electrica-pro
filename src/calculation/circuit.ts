import type { CircuitSummary } from '../lib/circuits';

export interface PreliminaryCircuitResult {
  status: 'blocked' | 'warning';
  installedPowerW: number;
  demandedPowerW: number;
  designCurrentA: number;
  suggestedBreakerA: number | null;
  suggestedConductorMm2: number | null;
  estimatedVoltageDropPercent: number | null;
  warnings: string[];
}

const BREAKERS_A = [6, 10, 16, 20, 25, 32, 40, 50, 63];
const CONDUCTORS_MM2 = [1.5, 2.5, 4, 6, 10, 16];

function selectAtLeast(values: number[], target: number): number | null {
  return values.find((value) => value >= target) ?? null;
}

export function calculatePreliminaryCircuit(circuit: CircuitSummary): PreliminaryCircuitResult {
  const warnings = [
    'Resultado preliminar: requiere validación profesional y perfil normativo aprobado.',
  ];
  const loads = circuit.loads.filter(
    (load) => load.name.trim() && load.powerW > 0 && load.quantity > 0,
  );
  const installedPowerW = loads.reduce((total, load) => total + load.powerW * load.quantity, 0);

  if (!circuit.voltageV || installedPowerW === 0) {
    return {
      status: 'blocked',
      installedPowerW,
      demandedPowerW: 0,
      designCurrentA: 0,
      suggestedBreakerA: null,
      suggestedConductorMm2: null,
      estimatedVoltageDropPercent: null,
      warnings: [...warnings, 'Ingresa tensión y al menos una carga con potencia para calcular.'],
    };
  }

  const averagePowerFactor =
    loads.reduce((total, load) => total + load.powerFactor, 0) / loads.length;
  const averageEfficiency =
    loads.reduce((total, load) => total + load.efficiency, 0) / loads.length;
  const demandedPowerW = installedPowerW * circuit.demandFactor;
  const denominator =
    circuit.system === 'three-phase'
      ? Math.sqrt(3) * circuit.voltageV * averagePowerFactor * averageEfficiency
      : circuit.voltageV * averagePowerFactor * averageEfficiency;
  const designCurrentA = (demandedPowerW / denominator) * circuit.safetyFactor;
  const suggestedBreakerA = selectAtLeast(BREAKERS_A, designCurrentA);
  const suggestedConductorMm2 = selectAtLeast(CONDUCTORS_MM2, designCurrentA / 7);
  const estimatedVoltageDropPercent = suggestedConductorMm2
    ? (2 * circuit.lengthM * designCurrentA * 0.0175 * 100) /
      (suggestedConductorMm2 * circuit.voltageV)
    : null;

  warnings.push(
    'La curva, capacidad de corte, conductor, diferencial y caída de tensión deben verificarse contra la instalación real.',
  );

  return {
    status: 'warning',
    installedPowerW,
    demandedPowerW,
    designCurrentA,
    suggestedBreakerA,
    suggestedConductorMm2,
    estimatedVoltageDropPercent,
    warnings,
  };
}
